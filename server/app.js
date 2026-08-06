import express from 'express'
import cors from 'cors'
import { initDb } from './db.js'
import authRoutes from './routes/auth.js'
import dataRoutes from './routes/data.js'

const app = express()
app.use(cors())
app.use(express.json())

// Pastikan DB (tabel + seed) siap sebelum handle request — penting untuk
// serverless cold start. initDb() di-cache, jadi hanya berjalan sekali.
app.use(async (req, res, next) => {
  try { await initDb(); next() } catch (e) { next(e) }
})

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'coe-dashboard-api' }))

app.use('/api/auth', authRoutes)
app.use('/api', dataRoutes)

// 404 untuk route /api yang tak dikenal
app.use('/api', (req, res) => res.status(404).json({ error: 'Endpoint tidak ditemukan.' }))

// Error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err)
  res.status(500).json({ error: 'Terjadi kesalahan server.' })
})

export default app

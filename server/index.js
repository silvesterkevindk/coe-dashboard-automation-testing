// Entry point untuk DEV lokal — menjalankan Express sebagai server biasa.
// Di produksi (Vercel) yang dipakai adalah api/index.js (serverless).
import app from './app.js'

const PORT = process.env.API_PORT || 4000
app.listen(PORT, () => {
  console.log(`✅ COE Dashboard API berjalan di http://localhost:${PORT}`)
})

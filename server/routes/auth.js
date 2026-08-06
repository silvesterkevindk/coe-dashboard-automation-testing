import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { Users } from '../repo.js'
import { signToken, publicUser, requireAuth } from '../auth.js'

const router = Router()

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { name, username, password, role } = req.body || {}
    const uname = String(username || '').trim().toLowerCase()

    if (!name?.trim()) return res.status(400).json({ error: 'Nama wajib diisi.' })
    if (!uname) return res.status(400).json({ error: 'Username wajib diisi.' })
    if (uname.length < 3) return res.status(400).json({ error: 'Username minimal 3 karakter.' })
    if (!password || password.length < 6) return res.status(400).json({ error: 'Password minimal 6 karakter.' })
    if (await Users.findByUsername(uname)) return res.status(409).json({ error: 'Username sudah dipakai.' })

    const user = await Users.create({
      username: uname,
      password_hash: bcrypt.hashSync(password, 10),
      name: name.trim(),
      role: role?.trim() || 'QA Engineer',
    })
    res.status(201).json({ token: signToken(user), user: publicUser(user) })
  } catch (e) { next(e) }
})

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body || {}
    const user = await Users.findByUsername(String(username || '').trim())
    if (!user) return res.status(401).json({ error: 'Username tidak ditemukan.' })
    if (!bcrypt.compareSync(password || '', user.password_hash)) {
      return res.status(401).json({ error: 'Password salah.' })
    }
    res.json({ token: signToken(user), user: publicUser(user) })
  } catch (e) { next(e) }
})

// GET /api/auth/me — verifikasi sesi & ambil profil
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await Users.findById(req.user.id)
    if (!user) return res.status(401).json({ error: 'User tidak ditemukan.' })
    res.json({ user: publicUser(user) })
  } catch (e) { next(e) }
})

export default router

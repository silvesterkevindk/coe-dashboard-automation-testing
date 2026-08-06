import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'bni-qa-dashboard-dev-secret-change-in-prod'
const JWT_EXPIRES = '12h'

export function signToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES })
}

// Bentuk user yang aman dikirim ke frontend (tanpa password_hash)
export function publicUser(u) {
  return { id: u.id, username: u.username, name: u.name, role: u.role }
}

// Middleware — wajibkan token JWT valid di header Authorization
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Token tidak ada. Silakan login.' })
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ error: 'Sesi tidak valid atau kedaluwarsa. Login ulang.' })
  }
}

// Vercel Serverless Function — meng-handle semua request /api/*.
// vercel.json me-rewrite /api/(.*) ke sini; Express mencocokkan path penuh.
import app from '../server/app.js'

export default app

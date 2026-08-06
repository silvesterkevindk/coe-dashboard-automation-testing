import { Router } from 'express'
import { Projects, Resources, Assignments, Meta } from '../repo.js'
import { requireAuth } from '../auth.js'

const router = Router()
router.use(requireAuth) // semua endpoint data wajib login

// Bungkus handler async supaya error diteruskan ke error handler Express
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

// Bootstrap — sekali fetch untuk mengisi seluruh dashboard
router.get('/bootstrap', wrap(async (req, res) => {
  const [projects, resources, assignments, execution, heatmap] = await Promise.all([
    Projects.all(), Resources.all(), Assignments.all(), Meta.get('execution'), Meta.get('heatmap'),
  ])
  res.json({ projects, resources, assignments, execution, heatmap })
}))

// Helper: pasang rute CRUD standar untuk sebuah entity
function crud(path, Repo, label) {
  router.get(path, wrap(async (req, res) => res.json(await Repo.all())))

  router.get(`${path}/:id`, wrap(async (req, res) => {
    const item = await Repo.get(req.params.id)
    if (!item) return res.status(404).json({ error: `${label} tidak ditemukan.` })
    res.json(item)
  }))

  router.post(path, wrap(async (req, res) => {
    res.status(201).json(await Repo.create(req.body || {}))
  }))

  router.put(`${path}/:id`, wrap(async (req, res) => {
    if (!(await Repo.get(req.params.id))) return res.status(404).json({ error: `${label} tidak ditemukan.` })
    res.json(await Repo.update(req.params.id, req.body || {}))
  }))

  router.delete(`${path}/:id`, wrap(async (req, res) => {
    if (!(await Repo.remove(req.params.id))) return res.status(404).json({ error: `${label} tidak ditemukan.` })
    res.json({ ok: true })
  }))
}

crud('/projects', Projects, 'Project')
crud('/resources', Resources, 'Resource')
crud('/assignments', Assignments, 'Assignment')

export default router

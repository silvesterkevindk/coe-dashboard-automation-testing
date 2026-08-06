import { db } from './db.js'

const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`

// ---------------------------------------------------------------------------
// Mapper baris DB -> objek frontend (parse kolom JSON)
// ---------------------------------------------------------------------------
const parseProject = (r) => r && ({ ...r, dailyProgress: JSON.parse(r.dailyProgress || '[]') })
const parseResource = (r) => r && ({
  ...r,
  projects: JSON.parse(r.projects || '[]'),
  activities: JSON.parse(r.activities || '[]'),
  standup: JSON.parse(r.standup || '{}'),
})

// Kolom yang boleh ditulis per entity (whitelist)
const PROJECT_FIELDS = ['name', 'projectId', 'applicationId', 'phase', 'platform', 'progress', 'totalTC', 'executed', 'passed', 'failed', 'blocked', 'notRun', 'automation', 'automationCoverage', 'openDefect', 'closedDefect', 'critical', 'dailyProgress', 'urlGitlab', 'urlReport', 'urlTestcaseScenario']
const RESOURCE_FIELDS = ['name', 'npp', 'company', 'birthDate', 'joinDate', 'phone', 'role', 'jabatan', 'lead', 'projects', 'phase', 'todayTask', 'status', 'workload', 'utilization', 'progress', 'manualProgress', 'automationProgress', 'reviewProgress', 'activities', 'standup']
const ASSIGNMENT_FIELDS = ['resourceName', 'project', 'task', 'target', 'done', 'dueDate', 'status']

const JSON_FIELDS = new Set(['dailyProgress', 'projects', 'activities', 'standup'])
const encode = (field, val) => {
  if (JSON_FIELDS.has(field)) return JSON.stringify(val ?? (field === 'standup' ? {} : []))
  return val === undefined ? null : val
}

// Helper generik: SELECT satu baris / semua baris
async function one(sql, args) {
  const rs = await db.execute({ sql, args })
  return rs.rows[0]
}
async function many(sql) {
  const rs = await db.execute(sql)
  return rs.rows
}

// Bangun INSERT/UPDATE dinamis dari whitelist field
async function insertRow(table, idPrefix, fieldList, data, extraDefaults = {}) {
  const id = uid(idPrefix)
  const row = { ...extraDefaults, ...data }
  const cols = ['id', ...fieldList]
  const args = { id }
  for (const f of fieldList) args[f] = encode(f, row[f])
  await db.execute({
    sql: `INSERT INTO ${table} (${cols.join(',')}) VALUES (${cols.map((c) => ':' + c).join(',')})`,
    args,
  })
  return id
}

async function updateRow(table, id, fieldList, patch) {
  const fields = fieldList.filter((f) => f in patch)
  if (fields.length) {
    const args = { id }
    for (const f of fields) args[f] = encode(f, patch[f])
    await db.execute({
      sql: `UPDATE ${table} SET ${fields.map((f) => `${f}=:${f}`).join(',')} WHERE id=:id`,
      args,
    })
  }
}

// ---------------------------------------------------------------------------
// PROJECTS
// ---------------------------------------------------------------------------
export const Projects = {
  async all() { return (await many('SELECT * FROM projects ORDER BY rowid')).map(parseProject) },
  async get(id) { return parseProject(await one('SELECT * FROM projects WHERE id = :id', { id })) },
  async create(data) {
    const defaults = {
      dailyProgress: [0, 0, 0, 0, 0], critical: 0, passed: 0, failed: 0, blocked: 0,
      notRun: data.totalTC || 0, automation: 0, automationCoverage: 0, openDefect: 0,
      closedDefect: 0, executed: 0, progress: 0,
    }
    const id = await insertRow('projects', 'prj', PROJECT_FIELDS, data, defaults)
    return this.get(id)
  },
  async update(id, patch) { await updateRow('projects', id, PROJECT_FIELDS, patch); return this.get(id) },
  async remove(id) { return (await db.execute({ sql: 'DELETE FROM projects WHERE id = :id', args: { id } })).rowsAffected > 0 },
}

// ---------------------------------------------------------------------------
// RESOURCES
// ---------------------------------------------------------------------------
export const Resources = {
  async all() { return (await many('SELECT * FROM resources ORDER BY rowid')).map(parseResource) },
  async get(id) { return parseResource(await one('SELECT * FROM resources WHERE id = :id', { id })) },
  async create(data) {
    const defaults = {
      projects: [], activities: [], jabatan: 'B2B Automation',
      standup: { yesterday: '-', today: data.todayTask || '-', blocker: 'None' },
      manualProgress: 0, automationProgress: 0, reviewProgress: 0,
      workload: 0, utilization: 0, progress: 0, role: 'QA Engineer', status: 'Working',
    }
    const id = await insertRow('resources', 'res', RESOURCE_FIELDS, data, defaults)
    return this.get(id)
  },
  async update(id, patch) { await updateRow('resources', id, RESOURCE_FIELDS, patch); return this.get(id) },
  async remove(id) { return (await db.execute({ sql: 'DELETE FROM resources WHERE id = :id', args: { id } })).rowsAffected > 0 },
}

// ---------------------------------------------------------------------------
// ASSIGNMENTS
// ---------------------------------------------------------------------------
export const Assignments = {
  async all() { return await many('SELECT * FROM assignments ORDER BY rowid') },
  async get(id) { return await one('SELECT * FROM assignments WHERE id = :id', { id }) },
  async create(data) {
    const id = await insertRow('assignments', 'asg', ASSIGNMENT_FIELDS, data, { status: 'On Track', target: 0, done: 0 })
    return this.get(id)
  },
  async update(id, patch) { await updateRow('assignments', id, ASSIGNMENT_FIELDS, patch); return this.get(id) },
  async remove(id) { return (await db.execute({ sql: 'DELETE FROM assignments WHERE id = :id', args: { id } })).rowsAffected > 0 },
}

// ---------------------------------------------------------------------------
// META (execution, heatmap — read-only)
// ---------------------------------------------------------------------------
export const Meta = {
  async get(key) {
    const row = await one('SELECT value FROM meta WHERE key = :key', { key })
    return row ? JSON.parse(row.value) : null
  },
}

// ---------------------------------------------------------------------------
// USERS
// ---------------------------------------------------------------------------
export const Users = {
  async findByUsername(username) {
    return await one('SELECT * FROM users WHERE username = :u', { u: String(username).toLowerCase() })
  },
  async findById(id) { return await one('SELECT * FROM users WHERE id = :id', { id }) },
  async create({ username, password_hash, name, role }) {
    const rs = await db.execute({
      sql: 'INSERT INTO users (username,password_hash,name,role,created_at) VALUES (:username,:password_hash,:name,:role,:created_at)',
      args: { username: String(username).toLowerCase(), password_hash, name, role, created_at: new Date().toISOString() },
    })
    return this.findById(Number(rs.lastInsertRowid))
  },
}

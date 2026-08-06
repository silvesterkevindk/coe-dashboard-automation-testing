import { createClient } from '@libsql/client'
import bcrypt from 'bcryptjs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  seedProjects, seedResources, seedAssignments, seedExecution, seedHeatmap, seedUsers, seedOrgMembers,
} from './seed.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Lokal → file SQLite (dev). Produksi → Turso (set TURSO_DATABASE_URL + TURSO_AUTH_TOKEN).
const url = process.env.TURSO_DATABASE_URL || `file:${path.join(__dirname, 'coe.db')}`
const authToken = process.env.TURSO_AUTH_TOKEN

export const db = createClient({ url, authToken })

// ---------------------------------------------------------------------------
// Inisialisasi — dipanggil sekali (di-cache lewat promise). Aman untuk
// serverless cold start & idempoten (CREATE IF NOT EXISTS + INSERT OR IGNORE).
// ---------------------------------------------------------------------------
let initPromise
export function initDb() {
  if (!initPromise) initPromise = doInit()
  return initPromise
}

async function doInit() {
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS users (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      username      TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name          TEXT NOT NULL,
      role          TEXT,
      created_at    TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS projects (
      id                 TEXT PRIMARY KEY,
      name               TEXT NOT NULL,
      phase              TEXT,
      platform           TEXT,
      progress           INTEGER DEFAULT 0,
      totalTC            INTEGER DEFAULT 0,
      executed           INTEGER DEFAULT 0,
      passed             INTEGER DEFAULT 0,
      failed             INTEGER DEFAULT 0,
      blocked            INTEGER DEFAULT 0,
      notRun             INTEGER DEFAULT 0,
      automation         INTEGER DEFAULT 0,
      automationCoverage INTEGER DEFAULT 0,
      openDefect         INTEGER DEFAULT 0,
      closedDefect       INTEGER DEFAULT 0,
      critical           INTEGER DEFAULT 0,
      dailyProgress      TEXT DEFAULT '[]',
      projectId          TEXT DEFAULT '',
      applicationId      TEXT DEFAULT '',
      urlGitlab          TEXT DEFAULT '',
      urlReport          TEXT DEFAULT '',
      urlTestcaseScenario TEXT DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS resources (
      id                 TEXT PRIMARY KEY,
      name               TEXT NOT NULL,
      npp                TEXT,
      company            TEXT,
      birthDate          TEXT,
      joinDate           TEXT,
      phone              TEXT DEFAULT '',
      role               TEXT,
      jabatan            TEXT DEFAULT 'B2B Automation',
      lead               TEXT DEFAULT '',
      projects           TEXT DEFAULT '[]',
      phase              TEXT,
      todayTask          TEXT,
      status             TEXT,
      workload           INTEGER DEFAULT 0,
      utilization        INTEGER DEFAULT 0,
      progress           INTEGER DEFAULT 0,
      manualProgress     INTEGER DEFAULT 0,
      automationProgress INTEGER DEFAULT 0,
      reviewProgress     INTEGER DEFAULT 0,
      activities         TEXT DEFAULT '[]',
      standup            TEXT DEFAULT '{}'
    );
    CREATE TABLE IF NOT EXISTS assignments (
      id           TEXT PRIMARY KEY,
      resourceName TEXT,
      project      TEXT,
      task         TEXT,
      target       INTEGER DEFAULT 0,
      done         INTEGER DEFAULT 0,
      dueDate      TEXT,
      status       TEXT
    );
    CREATE TABLE IF NOT EXISTS meta (
      key   TEXT PRIMARY KEY,
      value TEXT
    );
  `)

  // Migrasi ringan untuk DB lama
  await ensureColumn('resources', 'jabatan', "TEXT DEFAULT 'B2B Automation'")
  await ensureColumn('resources', 'npp', 'TEXT')
  await ensureColumn('resources', 'company', 'TEXT')
  await ensureColumn('resources', 'birthDate', 'TEXT')
  await ensureColumn('resources', 'joinDate', 'TEXT')
  await ensureColumn('resources', 'phone', "TEXT DEFAULT ''")
  await ensureColumn('resources', 'lead', "TEXT DEFAULT ''")
  await ensureColumn('projects', 'projectId', "TEXT DEFAULT ''")
  await ensureColumn('projects', 'applicationId', "TEXT DEFAULT ''")
  await ensureColumn('projects', 'urlGitlab', "TEXT DEFAULT ''")
  await ensureColumn('projects', 'urlReport', "TEXT DEFAULT ''")
  await ensureColumn('projects', 'urlTestcaseScenario', "TEXT DEFAULT ''")

  await seedAll()
}

async function ensureColumn(table, column, definition) {
  const info = await db.execute(`PRAGMA table_info(${table})`)
  if (!info.rows.some((r) => r.name === column)) {
    await db.execute(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`)
  }
}

// ---------------------------------------------------------------------------
// Insert seed (INSERT OR IGNORE + id tetap → idempoten & aman dari race)
// ---------------------------------------------------------------------------
async function insertProject(p) {
  await db.execute({
    sql: `INSERT OR IGNORE INTO projects
      (id,name,phase,platform,progress,totalTC,executed,passed,failed,blocked,notRun,automation,automationCoverage,openDefect,closedDefect,critical,dailyProgress)
      VALUES (:id,:name,:phase,:platform,:progress,:totalTC,:executed,:passed,:failed,:blocked,:notRun,:automation,:automationCoverage,:openDefect,:closedDefect,:critical,:dailyProgress)`,
    args: { ...p, dailyProgress: JSON.stringify(p.dailyProgress || []) },
  })
}

async function insertResource(r) {
  await db.execute({
    sql: `INSERT OR IGNORE INTO resources
      (id,name,npp,company,birthDate,joinDate,role,jabatan,projects,phase,todayTask,status,workload,utilization,progress,manualProgress,automationProgress,reviewProgress,activities,standup)
      VALUES (:id,:name,:npp,:company,:birthDate,:joinDate,:role,:jabatan,:projects,:phase,:todayTask,:status,:workload,:utilization,:progress,:manualProgress,:automationProgress,:reviewProgress,:activities,:standup)`,
    args: {
      workload: 0, utilization: 0, progress: 0, manualProgress: 0, automationProgress: 0, reviewProgress: 0,
      phase: '-', todayTask: '-', status: 'Working', role: '', npp: '', company: '', birthDate: '', joinDate: '',
      ...r,
      jabatan: r.jabatan || 'B2B Automation',
      projects: JSON.stringify(r.projects || []),
      activities: JSON.stringify(r.activities || []),
      standup: JSON.stringify(r.standup || {}),
    },
  })
}

async function insertAssignment(a) {
  await db.execute({
    sql: `INSERT OR IGNORE INTO assignments
      (id,resourceName,project,task,target,done,dueDate,status)
      VALUES (:id,:resourceName,:project,:task,:target,:done,:dueDate,:status)`,
    args: a,
  })
}

async function seedAll() {
  const now = new Date().toISOString()
  for (const u of seedUsers) {
    await db.execute({
      sql: 'INSERT OR IGNORE INTO users (username,password_hash,name,role,created_at) VALUES (:username,:password_hash,:name,:role,:created_at)',
      args: { username: u.username.toLowerCase(), password_hash: bcrypt.hashSync(u.password, 10), name: u.name, role: u.role, created_at: now },
    })
  }
  for (const p of seedProjects) await insertProject(p)
  for (const r of [...seedResources, ...seedOrgMembers]) await insertResource(r)
  for (const a of seedAssignments) await insertAssignment(a)

  await db.execute({ sql: 'INSERT OR IGNORE INTO meta (key,value) VALUES (:k,:v)', args: { k: 'execution', v: JSON.stringify(seedExecution) } })
  await db.execute({ sql: 'INSERT OR IGNORE INTO meta (key,value) VALUES (:k,:v)', args: { k: 'heatmap', v: JSON.stringify(seedHeatmap) } })
}

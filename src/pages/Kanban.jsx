import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useData } from '../store/DataContext.jsx'

// Divisi aktif dari sub-menu Kanban
const DIVISION_BY_PATH = {
  '/kanban/automation': 'Automation',
  '/kanban/performance': 'Performance',
}

// Kolom alur kerja Kanban (urutan tetap) + warna titiknya
const STAGES = [
  { key: 'Initial Discussion', dot: 'bg-slate-400' },
  { key: 'Scripting & Preparation', dot: 'bg-sky-500' },
  { key: 'Execution', dot: 'bg-bni-teal' },
  { key: 'Reporting', dot: 'bg-violet-500' },
  { key: 'Done', dot: 'bg-emerald-500' },
  { key: 'On Hold', dot: 'bg-amber-500' },
  { key: 'Cancel', dot: 'bg-red-500' },
]
const STAGE_KEYS = new Set(STAGES.map((s) => s.key))

// Stage efektif sebuah project:
//  1) hasil drag tersimpan (p.stage), lalu
//  2) kolom "Progress" dari Excel (tersimpan di p.phase) untuk project Performance, lalu
//  3) diturunkan dari progress % (untuk project Automation lama)
function stageOf(p) {
  if (p.stage && STAGE_KEYS.has(p.stage)) return p.stage
  if (STAGE_KEYS.has(p.phase)) return p.phase
  const pr = p.progress || 0
  if (pr >= 100) return 'Done'
  if (pr >= 75) return 'Reporting'
  if (pr >= 50) return 'Execution'
  if (pr >= 25) return 'Scripting & Preparation'
  return 'Initial Discussion'
}

const platformBadge = 'bg-bni-teal/10 text-bni-teal'
const kontrakBadge = (k) => (k === 'Avatar' ? 'bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300')

export default function Kanban() {
  const { projects, updateProject } = useData()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const division = DIVISION_BY_PATH[pathname] || null

  const [dragId, setDragId] = useState(null)
  const [overStage, setOverStage] = useState(null)

  // Project papan: bila divisi -> project divisi tsb; default -> semua project
  const items = division ? projects.filter((p) => (p.division || 'Automation') === division) : projects
  const columns = STAGES.map((s) => ({ ...s, items: items.filter((p) => stageOf(p) === s.key) }))

  const handleDrop = (id, stage) => {
    const rid = id || dragId
    if (rid) {
      const p = projects.find((x) => x.id === rid)
      if (p && stageOf(p) !== stage) updateProject(rid, { stage }) // simpan ke DB
    }
    setDragId(null)
    setOverStage(null)
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-bni-navy dark:text-white">
          Kanban{division ? ` — ${division}` : ''}
        </h2>
        <p className="text-sm text-slate-400">
          Seret kartu antar kolom untuk mengubah tahap. Alur kerja project{division ? ` divisi ${division}` : ''} — {items.length} project.
        </p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {columns.map((col) => (
          <div
            key={col.key}
            className="w-64 shrink-0"
            onDragOver={(e) => { e.preventDefault(); setOverStage(col.key) }}
            onDrop={(e) => handleDrop(e.dataTransfer.getData('text/plain'), col.key)}
          >
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="inline-flex items-center gap-2 text-sm font-bold text-bni-navy dark:text-white">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${col.dot}`} />
                {col.key}
              </span>
              <span className="text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-700 rounded-full px-2 py-0.5">{col.items.length}</span>
            </div>
            <div className={`space-y-2 rounded-xl p-2 min-h-[120px] max-h-[calc(100vh-260px)] overflow-y-auto transition-colors ${overStage === col.key ? 'bg-bni-teal/10 ring-2 ring-inset ring-bni-teal/40' : 'bg-slate-100/60 dark:bg-slate-800/30'}`}>
              {col.items.length === 0
                ? <p className="text-xs text-slate-300 dark:text-slate-500 italic text-center py-6">Seret kartu ke sini</p>
                : col.items.map((p) => (
                  <div
                    key={p.id}
                    draggable
                    onDragStart={(e) => { setDragId(p.id); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', p.id) }}
                    onDragEnd={() => { setDragId(null); setOverStage(null) }}
                    onClick={() => navigate(`/projects/${p.id}`)}
                    className={`bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3 shadow-card hover:shadow-card-hover transition-all group cursor-grab active:cursor-grabbing ${dragId === p.id ? 'opacity-50' : ''}`}
                  >
                    <div className="text-sm font-bold text-bni-navy dark:text-white leading-tight group-hover:text-bni-orange line-clamp-2">{p.name}</div>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      {p.platform && <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${platformBadge}`}>{p.platform}</span>}
                      {p.kontrak && <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${kontrakBadge(p.kontrak)}`}>{p.kontrak}</span>}
                    </div>
                    {p.projectId && <div className="text-[10px] text-slate-400 mt-1 font-mono">{p.projectId}</div>}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

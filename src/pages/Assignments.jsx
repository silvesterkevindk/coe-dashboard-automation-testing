import { useState } from 'react'
import { useData } from '../store/DataContext.jsx'
import { Card, Badge, ProgressBar, Modal, EmptyState } from '../components/ui.jsx'
import { statusBadge, statusColor } from '../lib/format.js'
import { RESOURCE_STATUS as STATUSES } from '../data/seed.js'
import { downloadCSV, downloadPDF } from '../lib/export.js'

const COLS = [
  { label: 'No', value: (_, i) => i + 1 },
  { label: 'Pegawai', value: (r) => r.name },
  { label: 'Project', value: (r) => (r.projects || []).join(', ') || '-' },
  { label: 'Task Hari Ini', value: (r) => r.todayTask || '-' },
  { label: 'Status', value: (r) => r.status },
  { label: 'Utilisasi (%)', value: (r) => r.utilization },
  { label: 'Progress (%)', value: (r) => r.progress },
  { label: 'Manual (%)', value: (r) => r.manualProgress },
  { label: 'Automation (%)', value: (r) => r.automationProgress },
  { label: 'Standup Blocker', value: (r) => r.standup?.blocker || 'None' },
]

// Checklist multi-project
function ProjectChecklist({ allProjects, selected, onChange }) {
  const [q, setQ] = useState('') // pencarian project di dalam checklist
  const toggle = (name) => onChange(
    selected.includes(name) ? selected.filter((p) => p !== name) : [...selected, name]
  )
  const visible = allProjects.filter((p) => !q || p.name.toLowerCase().includes(q.toLowerCase()))
  return (
    <div>
      <div className="flex flex-wrap gap-1 min-h-[28px] mb-2">
        {selected.length === 0
          ? <span className="text-xs text-slate-400 italic">Belum ada project dipilih</span>
          : selected.map((p) => (
            <span key={p} className="inline-flex items-center gap-1 bg-bni-teal/10 text-bni-teal text-xs font-semibold px-2 py-0.5 rounded-full">
              {p}
              <button type="button" onClick={() => toggle(p)} className="hover:text-red-500 leading-none">×</button>
            </span>
          ))}
      </div>
      <input
        className="input mb-2"
        placeholder="🔍 Cari project..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="border border-slate-200 dark:border-slate-600 rounded-lg max-h-36 overflow-y-auto">
        {allProjects.length === 0
          ? <p className="text-xs text-slate-400 p-3">Belum ada project.</p>
          : visible.length === 0
            ? <p className="text-xs text-slate-400 p-3">Tidak ada project yang cocok.</p>
            : visible.map((p) => (
              <label key={p.id} className="flex items-center gap-2.5 px-3 py-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <input type="checkbox" checked={selected.includes(p.name)} onChange={() => toggle(p.name)} className="w-4 h-4 rounded accent-bni-teal cursor-pointer" />
                <span className="text-sm text-slate-700 dark:text-slate-200">{p.name}</span>
              </label>
            ))}
      </div>
    </div>
  )
}

// Badge project di tabel: pertama + "+N"
function ProjectBadges({ projects = [] }) {
  if (projects.length === 0) return <span className="text-xs text-slate-300 italic">-</span>
  return (
    <div className="flex flex-wrap gap-1">
      <span className="text-xs bg-bni-teal/10 text-bni-teal font-medium px-2 py-0.5 rounded-full truncate max-w-[140px]">{projects[0]}</span>
      {projects.length > 1 && (
        <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 font-medium px-2 py-0.5 rounded-full" title={projects.slice(1).join(', ')}>+{projects.length - 1}</span>
      )}
    </div>
  )
}

function AssignmentForm({ resource, projects, onSubmit, onClose }) {
  const [form, setForm] = useState(() => ({
    projects: resource.projects || [],
    todayTask: resource.todayTask || '',
    status: resource.status || 'Working',
    utilization: resource.utilization || 0,
    progress: resource.progress || 0,
    manualProgress: resource.manualProgress || 0,
    automationProgress: resource.automationProgress || 0,
    standup: { yesterday: '-', today: '-', blocker: 'None', ...(resource.standup || {}) },
  }))
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const setNum = (k) => (e) => setForm((f) => ({ ...f, [k]: Number(e.target.value) }))
  const setStandup = (k) => (e) => setForm((f) => ({ ...f, standup: { ...f.standup, [k]: e.target.value } }))

  return (
    <Modal open onClose={onClose} title={`Penugasan: ${resource.name}`}
      footer={<>
        <button className="btn-ghost" onClick={onClose}>Batal</button>
        <button className="btn-primary" onClick={() => { onSubmit(form); onClose() }}>Simpan Perubahan</button>
      </>}
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="label">Project <span className="text-slate-300 font-normal">(boleh lebih dari satu, boleh kosong)</span></label>
          <ProjectChecklist allProjects={projects} selected={form.projects} onChange={(val) => setForm((f) => ({ ...f, projects: val }))} />
        </div>
        <div><label className="label">Task hari ini</label><input className="input" value={form.todayTask} onChange={set('todayTask')} placeholder="mis. Automation Login" /></div>
        <div>
          <label className="label">Status</label>
          <select className="input" value={form.status} onChange={set('status')}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
        </div>
        <div><label className="label">Utilisasi (%)</label><input type="number" min="0" max="150" className="input" value={form.utilization} onChange={setNum('utilization')} /></div>
        <div><label className="label">Progress (%)</label><input type="number" min="0" max="100" className="input" value={form.progress} onChange={setNum('progress')} /></div>
        <div><label className="label">Manual Progress (%)</label><input type="number" min="0" max="100" className="input" value={form.manualProgress} onChange={setNum('manualProgress')} /></div>
        <div><label className="label">Automation Progress (%)</label><input type="number" min="0" max="100" className="input" value={form.automationProgress} onChange={setNum('automationProgress')} /></div>

        <div className="col-span-2 pt-2 border-t border-slate-100 dark:border-slate-700">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Standup Hari Ini</p>
        </div>
        <div className="col-span-2"><label className="label">Kemarin</label><input className="input" value={form.standup.yesterday} onChange={setStandup('yesterday')} /></div>
        <div className="col-span-2"><label className="label">Hari ini</label><input className="input" value={form.standup.today} onChange={setStandup('today')} /></div>
        <div className="col-span-2"><label className="label">Blocker</label><input className="input" value={form.standup.blocker} onChange={setStandup('blocker')} /></div>
      </div>
    </Modal>
  )
}

const PAGE_SIZE = 10

// Nilai default saat penugasan direset (pegawai tetap ada, penugasannya dikosongkan)
const RESET_ASSIGNMENT = {
  projects: [], todayTask: '', status: 'Working',
  utilization: 0, progress: 0, manualProgress: 0, automationProgress: 0,
  standup: { yesterday: '-', today: '-', blocker: 'None' },
}

// Kolom yang bisa diurutkan (klik header). `get` mengembalikan nilai pembanding.
const SORT_COLS = [
  { key: 'name', label: 'Pegawai', get: (r) => (r.name || '').toLowerCase() },
  { key: 'projects', label: 'Project', get: (r) => (r.projects || []).join(', ').toLowerCase() },
  { key: 'todayTask', label: 'Task Hari Ini', get: (r) => (r.todayTask || '').toLowerCase() },
  { key: 'status', label: 'Status', get: (r) => (r.status || '').toLowerCase() },
  { key: 'utilization', label: 'Utilisasi', get: (r) => r.utilization || 0 },
  { key: 'progress', label: 'Progress', get: (r) => r.progress || 0, thClass: 'w-40' },
  { key: 'blocker', label: 'Blocker', get: (r) => (r.standup?.blocker && r.standup.blocker !== 'None') ? r.standup.blocker.toLowerCase() : '' },
]

// Header kolom yang bisa diklik untuk sort naik/turun
function SortableTh({ col, sort, onSort }) {
  const active = sort.key === col.key
  return (
    <th
      onClick={() => onSort(col.key)}
      className={`text-left px-4 py-3 font-semibold cursor-pointer select-none hover:text-slate-700 dark:hover:text-slate-200 ${col.thClass || ''}`}
      title={`Urutkan berdasarkan ${col.label}`}
    >
      <span className="inline-flex items-center gap-1">
        {col.label}
        <span className={active ? 'text-bni-orange' : 'text-slate-300 dark:text-slate-600'}>
          {active ? (sort.dir === 'asc' ? '▲' : '▼') : '↕'}
        </span>
      </span>
    </th>
  )
}

export default function Assignments() {
  const { resources, projects, updateResource } = useData()
  const [modal, setModal] = useState(null) // null | resource
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState({ key: null, dir: 'asc' }) // kolom aktif + arah urut

  const handleReset = (r) => {
    if (confirm(`Reset penugasan ${r.name}? Project, task, status, dan progress akan dikosongkan. Data pegawai tetap ada.`)) {
      updateResource(r.id, RESET_ASSIGNMENT)
    }
  }

  const filtered = resources.filter((r) => !q || r.name.toLowerCase().includes(q.toLowerCase()))

  // Urutkan hasil filter sesuai kolom aktif (salin dulu agar tidak memutasi state)
  const col = SORT_COLS.find((c) => c.key === sort.key)
  const sorted = col
    ? [...filtered].sort((a, b) => {
        const av = col.get(a)
        const bv = col.get(b)
        if (av < bv) return sort.dir === 'asc' ? -1 : 1
        if (av > bv) return sort.dir === 'asc' ? 1 : -1
        return 0
      })
    : filtered

  // Klik header: kolom sama -> toggle naik/turun; kolom lain -> mulai ascending
  const toggleSort = (key) => {
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }))
    setPage(1)
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const pageRows = sorted.slice(start, start + PAGE_SIZE)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input className="input max-w-xs" placeholder="🔍 Cari pegawai..." value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} />
        <div className="flex-1" />
        <div className="flex gap-2">
          <button className="btn-ghost" onClick={() => downloadCSV('Assignment', COLS, filtered)}>⬇ CSV</button>
          <button className="btn-ghost" onClick={() => downloadPDF('Penugasan Pegawai', `Total ${filtered.length} pegawai`, COLS, filtered)}>⬇ PDF</button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                <th className="text-left px-4 py-3 font-semibold">No</th>
                {SORT_COLS.map((c) => (
                  <SortableTh key={c.key} col={c} sort={sort} onSort={toggleSort} />
                ))}
                <th className="px-4 py-3 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pageRows.map((r, i) => {
                const hasBlocker = r.standup?.blocker && r.standup.blocker !== 'None'
                return (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap tabular-nums">{start + i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 font-medium text-slate-700">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${statusColor(r.status)}`} />
                        {r.name}
                      </div>
                      <div className="text-xs text-slate-400 ml-4">{r.jabatan}</div>
                    </td>
                    <td className="px-4 py-3"><ProjectBadges projects={r.projects} /></td>
                    <td className="px-4 py-3 text-slate-600">{r.todayTask || '-'}</td>
                    <td className="px-4 py-3"><Badge className={statusBadge(r.status)}>{r.status}</Badge></td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{r.utilization || 0}%</td>
                    <td className="px-4 py-3"><ProgressBar value={r.progress} showLabel /></td>
                    <td className="px-4 py-3 text-xs">{hasBlocker ? <span className="text-red-600 font-medium">{r.standup.blocker}</span> : <span className="text-slate-400">-</span>}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button onClick={() => setModal(r)} className="text-slate-400 hover:text-bni-teal text-base mr-2" title="Atur penugasan">✏️</button>
                      <button onClick={() => handleReset(r)} className="text-slate-300 hover:text-red-500 text-lg" title="Reset penugasan">🗑</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <EmptyState>Tidak ada pegawai yang cocok.</EmptyState>}
      </Card>

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <span className="text-slate-500 dark:text-slate-400">
            Menampilkan <b className="text-slate-700 dark:text-slate-200">{start + 1}–{Math.min(start + PAGE_SIZE, filtered.length)}</b> dari <b className="text-slate-700 dark:text-slate-200">{filtered.length}</b> pegawai
          </span>
          <div className="flex items-center gap-1">
            <button className="btn-ghost px-3 py-1.5 disabled:opacity-40 disabled:cursor-not-allowed" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage <= 1}>← Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                  n === currentPage ? 'bg-bni-orange text-white' : 'text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >{n}</button>
            ))}
            <button className="btn-ghost px-3 py-1.5 disabled:opacity-40 disabled:cursor-not-allowed" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}>Next →</button>
          </div>
        </div>
      )}

      {modal && (
        <AssignmentForm
          resource={modal}
          projects={projects}
          onSubmit={(form) => updateResource(modal.id, form)}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}

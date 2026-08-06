import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../store/DataContext.jsx'
import { useFilter } from '../store/FilterContext.jsx'
import { Card, Badge, ProgressBar, Modal, EmptyState } from '../components/ui.jsx'
import { projectRisk } from '../lib/kpi.js'
import { num } from '../lib/format.js'
import { PLATFORMS } from '../data/seed.js'
import { downloadCSV, downloadPDF } from '../lib/export.js'

const riskBadge = { red: 'bg-red-50 text-red-700', amber: 'bg-amber-50 text-amber-700', green: 'bg-emerald-50 text-emerald-700' }
const riskLabel = { red: 'High Risk', amber: 'Medium', green: 'Healthy' }

const COLS = [
  { label: 'No', value: (_, i) => i + 1 },
  { label: 'Nama Project', value: (p) => p.name },
  { label: 'Phase', value: (p) => p.phase },
  { label: 'Platform', value: (p) => p.platform },
  { label: 'Progress (%)', value: (p) => p.progress },
  { label: 'Total TC', value: (p) => p.totalTC },
  { label: 'Executed', value: (p) => p.executed },
  { label: 'Passed', value: (p) => p.passed },
  { label: 'Failed', value: (p) => p.failed },
  { label: 'Auto Coverage (%)', value: (p) => p.automationCoverage },
  { label: 'Open Defect', value: (p) => p.openDefect },
]

const EMPTY_FORM = {
  name: '', phase: 'Phase 1', platform: PLATFORMS[0], progress: 0,
  totalTC: 100, executed: 0, passed: 0, failed: 0, blocked: 0, notRun: 100,
  automation: 0, automationCoverage: 0, openDefect: 0, closedDefect: 0, critical: 0,
  projectId: '', applicationId: '',
  urlGitlab: '', urlReport: '', urlTestcaseScenario: '',
}

// Field URL dengan tombol salin (copy ke clipboard) + feedback singkat
function CopyableUrlField({ label, value, onChange, placeholder }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    if (!value) return
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value)
      } else {
        const ta = document.createElement('textarea')
        ta.value = value; ta.style.position = 'fixed'; ta.style.opacity = '0'
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove()
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch { /* clipboard tidak tersedia */ }
  }
  return (
    <div className="col-span-2">
      <label className="label">{label}</label>
      <div className="relative">
        <input type="text" className="input pr-10" value={value} onChange={onChange} placeholder={placeholder} />
        <button
          type="button"
          onClick={copy}
          disabled={!value}
          title={copied ? 'Tersalin!' : 'Salin URL'}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-base leading-none text-slate-400 hover:text-bni-teal disabled:opacity-30 disabled:cursor-not-allowed"
        >{copied ? '✅' : '📋'}</button>
      </div>
    </div>
  )
}

function ProjectForm({ initial, onSubmit, onClose }) {
  const [form, setForm] = useState(() => initial ? { ...EMPTY_FORM, ...initial } : { ...EMPTY_FORM })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const setNum = (k) => (e) => setForm((f) => ({ ...f, [k]: Number(e.target.value) }))
  const isEdit = Boolean(initial)

  return (
    <Modal open onClose={onClose} title={isEdit ? `Edit: ${initial.name}` : 'Tambah Project'}
      footer={<>
        <button className="btn-ghost" onClick={onClose}>Batal</button>
        <button className="btn-primary" onClick={() => { if (form.name) { onSubmit(form); onClose() } }}>
          {isEdit ? 'Simpan Perubahan' : 'Tambah'}
        </button>
      </>}
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="label">Nama Project</label>
          <input className="input" value={form.name} onChange={set('name')} placeholder="mis. BNI Direct Revamp" />
        </div>
        <div><label className="label">Project ID</label><input type="text" className="input" value={form.projectId} onChange={set('projectId')} placeholder="mis. PRJ-001" /></div>
        <div><label className="label">Application ID</label><input type="text" className="input" value={form.applicationId} onChange={set('applicationId')} placeholder="mis. APP-001" /></div>
        <div><label className="label">Phase</label><input className="input" value={form.phase} onChange={set('phase')} /></div>
        <div>
          <label className="label">Platform</label>
          <select className="input" value={form.platform} onChange={set('platform')}>{PLATFORMS.map((p) => <option key={p}>{p}</option>)}</select>
        </div>
        <div><label className="label">Progress (%)</label><input type="number" min="0" max="100" className="input" value={form.progress} onChange={setNum('progress')} /></div>
        <div><label className="label">Total TC</label><input type="number" min="0" className="input" value={form.totalTC} onChange={setNum('totalTC')} /></div>

        <div className="col-span-2 pt-2 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Execution</p>
        </div>
        <div><label className="label">Executed</label><input type="number" min="0" className="input" value={form.executed} onChange={setNum('executed')} /></div>
        <div><label className="label">Passed</label><input type="number" min="0" className="input" value={form.passed} onChange={setNum('passed')} /></div>
        <div><label className="label">Failed</label><input type="number" min="0" className="input" value={form.failed} onChange={setNum('failed')} /></div>
        <div><label className="label">Blocked</label><input type="number" min="0" className="input" value={form.blocked} onChange={setNum('blocked')} /></div>

        <div className="col-span-2 pt-2 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Automation & Defect</p>
        </div>
        <div><label className="label">Automation TC</label><input type="number" min="0" className="input" value={form.automation} onChange={setNum('automation')} /></div>
        <div><label className="label">Auto Coverage (%)</label><input type="number" min="0" max="100" className="input" value={form.automationCoverage} onChange={setNum('automationCoverage')} /></div>
        <div><label className="label">Open Defect</label><input type="number" min="0" className="input" value={form.openDefect} onChange={setNum('openDefect')} /></div>
        <div><label className="label">Closed Defect</label><input type="number" min="0" className="input" value={form.closedDefect} onChange={setNum('closedDefect')} /></div>
        <div><label className="label">Critical Defect</label><input type="number" min="0" className="input" value={form.critical} onChange={setNum('critical')} /></div>

        <div className="col-span-2 pt-2 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Link / Referensi</p>
        </div>
        <CopyableUrlField label="Url Gitlab" value={form.urlGitlab} onChange={set('urlGitlab')} placeholder="https://gitlab.bni.co.id/..." />
        <CopyableUrlField label="Url Report" value={form.urlReport} onChange={set('urlReport')} placeholder="https://..." />
        <CopyableUrlField label="Url Testcase Scenario" value={form.urlTestcaseScenario} onChange={set('urlTestcaseScenario')} placeholder="https://..." />
      </div>
    </Modal>
  )
}

export default function Projects() {
  const { projects, addProject, updateProject, deleteProject } = useData()
  const { filters } = useFilter()
  const [modal, setModal] = useState(null) // null | { mode: 'add' } | { mode: 'edit', project }
  const [q, setQ] = useState('') // pencarian nama project

  const filtered = projects.filter((p) =>
    (!q || p.name.toLowerCase().includes(q.toLowerCase())) &&
    (!filters.project || p.name === filters.project) &&
    (!filters.phase || p.phase === filters.phase) &&
    (!filters.platform || p.platform === filters.platform)
  )

  const handleSubmit = (form) => {
    if (modal?.mode === 'edit') {
      updateProject(modal.project.id, form)
    } else {
      addProject(form)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input className="input max-w-xs" placeholder="🔍 Cari project..." value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="flex-1" />
        <div className="flex gap-2">
          <button className="btn-ghost" onClick={() => downloadCSV('Project', COLS, filtered)}>⬇ CSV</button>
          <button className="btn-ghost" onClick={() => downloadPDF('Laporan Project', `Total ${filtered.length} project`, COLS, filtered)}>⬇ PDF</button>
          <button className="btn-primary" onClick={() => setModal({ mode: 'add' })}>+ Tambah Project</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => {
          const risk = projectRisk(p)
          return (
            <Card key={p.id} className="hover:shadow-card-hover transition-shadow">
              <div className="flex items-start justify-between">
                <Link to={`/projects/${p.id}`} className="font-bold text-bni-navy hover:text-bni-orange">{p.name}</Link>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setModal({ mode: 'edit', project: p })}
                    className="text-slate-400 hover:text-bni-teal text-sm"
                    title="Edit"
                  >✏️</button>
                  <button
                    onClick={() => { if (confirm(`Hapus project ${p.name}?`)) deleteProject(p.id) }}
                    className="text-slate-300 hover:text-red-500"
                    title="Hapus"
                  >🗑</button>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge className="bg-slate-100 text-slate-500">{p.phase}</Badge>
                <Badge className="bg-bni-teal/10 text-bni-teal">{p.platform}</Badge>
                <Badge className={riskBadge[risk]}>{riskLabel[risk]}</Badge>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1"><span className="text-slate-500">Progress</span><span className="font-semibold">{p.progress}%</span></div>
                <ProgressBar value={p.progress} />
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div><div className="text-lg font-bold text-slate-700">{num(p.executed)}</div><div className="text-[11px] text-slate-400">Executed</div></div>
                <div><div className="text-lg font-bold text-bni-teal">{p.automationCoverage}%</div><div className="text-[11px] text-slate-400">Auto Cov</div></div>
                <div><div className="text-lg font-bold text-red-500">{p.openDefect}</div><div className="text-[11px] text-slate-400">Open Defect</div></div>
              </div>
              <Link to={`/projects/${p.id}`} className="block text-center text-xs font-semibold text-bni-teal hover:underline mt-3">Lihat detail →</Link>
            </Card>
          )
        })}
      </div>
      {filtered.length === 0 && <EmptyState>Tidak ada project yang cocok dengan filter.</EmptyState>}

      {modal && (
        <ProjectForm
          initial={modal.mode === 'edit' ? modal.project : null}
          onSubmit={handleSubmit}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}

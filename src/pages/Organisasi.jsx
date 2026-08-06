import { Link } from 'react-router-dom'
import { useData } from '../store/DataContext.jsx'
import { useAuth } from '../store/AuthContext.jsx'
import { Card } from '../components/ui.jsx'

const initials = (name = '') => name.split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase()

// Tiga tier teratas (Team Leader COE → Manager → Lead)
const TOP_TIERS = [
  { key: 'Team Leader COE', label: 'Team Leader COE', avatar: 'bg-bni-navy', chip: 'bg-bni-navy/10 text-bni-navy dark:text-slate-200' },
  { key: 'Test Automation Manager', label: 'Test Automation Manager', avatar: 'bg-bni-orange', chip: 'bg-bni-orange/10 text-bni-orange' },
  { key: 'Test Automation Lead', label: 'Test Automation Lead', avatar: 'bg-bni-teal', chip: 'bg-bni-teal/10 text-bni-teal' },
]

function PersonCard({ r, avatar }) {
  const projectCount = (r.projects || []).length
  return (
    <Link
      to={`/resources/${r.id}`}
      className="group flex flex-col items-center w-40 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-4 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all"
    >
      <div className={`w-12 h-12 rounded-full ${avatar} text-white flex items-center justify-center text-sm font-bold`}>{initials(r.name)}</div>
      <div className="mt-2 text-sm font-bold text-bni-navy dark:text-white text-center leading-tight group-hover:text-bni-orange">{r.name}</div>
      <div className="text-[11px] text-slate-400 text-center mt-0.5">{r.role || '-'}</div>
      <div className="text-[10px] text-slate-400 mt-1">{projectCount === 0 ? 'Tanpa project' : `${projectCount} project`}</div>
    </Link>
  )
}

function VacantCard({ label }) {
  return (
    <div className="flex flex-col items-center w-40 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 px-3 py-4">
      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 flex items-center justify-center text-lg">?</div>
      <div className="mt-2 text-sm font-semibold text-slate-400 text-center leading-tight">Belum ditetapkan</div>
      <div className="text-[11px] text-slate-300 dark:text-slate-500 text-center mt-0.5">{label}</div>
    </div>
  )
}

const Connector = () => <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-auto" />

function Tier({ tier, members }) {
  return (
    <div className="flex flex-col items-center">
      <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full mb-3 ${tier.chip}`}>
        {tier.label}
        <span className="opacity-70 font-semibold">· {members.length}</span>
      </span>
      <div className="flex flex-wrap justify-center gap-3">
        {members.length === 0
          ? <VacantCard label={tier.label} />
          : members.map((r) => <PersonCard key={r.id} r={r} avatar={tier.avatar} />)}
      </div>
    </div>
  )
}

// Kartu anggota B2B (kompak) + dropdown PIC (hanya untuk silvester)
function B2BCard({ r, leads, canEdit, onSetLead }) {
  return (
    <div className="w-52 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 shadow-card">
      <Link to={`/resources/${r.id}`} className="group flex items-center gap-2">
        <div className="w-9 h-9 shrink-0 rounded-full bg-slate-500 text-white flex items-center justify-center text-xs font-bold">{initials(r.name)}</div>
        <div className="min-w-0">
          <div className="text-xs font-bold text-bni-navy dark:text-white truncate group-hover:text-bni-orange">{r.name}</div>
          <div className="text-[10px] text-slate-400 truncate">{r.company || '-'}</div>
        </div>
      </Link>
      {canEdit && (
        <select
          value={r.lead || ''}
          onChange={(e) => onSetLead(r.id, e.target.value)}
          className="input mt-2 text-xs py-1"
          title="Tetapkan Lead (PIC)"
        >
          <option value="">— PIC belum di-set —</option>
          {leads.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      )}
    </div>
  )
}

// Kolom per Lead berisi anggota B2B di bawahnya
function LeadColumn({ title, count, dashed, children }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`px-3 py-1 rounded-full text-xs font-bold ${dashed ? 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 border border-dashed border-slate-300 dark:border-slate-600' : 'bg-bni-teal/10 text-bni-teal'}`}>
        {title} <span className="opacity-70">· {count}</span>
      </div>
      <div className="w-px h-4 bg-slate-200 dark:bg-slate-700" />
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  )
}

export default function Organisasi() {
  const { resources, updateResource } = useData()
  const { user } = useAuth()
  const canEdit = user?.username === 'silvester'

  const byTier = (key) => resources.filter((r) => (r.jabatan || 'B2B Automation') === key)
  const total = resources.length

  const leads = byTier('Test Automation Lead')
  const b2b = byTier('B2B Automation')
  const groups = leads.map((l) => ({ lead: l, members: b2b.filter((r) => r.lead === l.id) }))
  const unassigned = b2b.filter((r) => !r.lead || !leads.some((l) => l.id === r.lead))

  const setLead = (id, leadId) => updateResource(id, { lead: leadId })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-bold text-bni-navy dark:text-white">Struktur Organisasi COE Automation Testing</h2>
          <p className="text-sm text-slate-400">Hierarki tim — total {total} anggota.</p>
        </div>
      </div>

      {canEdit && (
        <div className="text-xs text-bni-teal bg-bni-teal/10 rounded-lg px-3 py-2">
          🛠️ Sebagai <b>silvester</b>, Anda dapat mengatur PIC tiap anggota B2B Automation lewat dropdown <b>Lead</b> di masing-masing kartu.
        </div>
      )}

      <Card className="overflow-x-auto">
        <div className="min-w-[760px] py-4 flex flex-col items-center">
          {/* 3 tier teratas */}
          {TOP_TIERS.map((tier, i) => (
            <div key={tier.key} className="flex flex-col items-center">
              {i > 0 && <Connector />}
              <Tier tier={tier} members={byTier(tier.key)} />
            </div>
          ))}

          <Connector />

          {/* B2B Automation dikelompokkan per Lead */}
          <div className="w-full">
            <div className="text-center mb-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300">
                B2B Automation <span className="opacity-70">· {b2b.length}</span>
              </span>
            </div>
            <div className="flex gap-5 justify-center flex-wrap items-start">
              {groups.map((g) => (
                <LeadColumn key={g.lead.id} title={g.lead.name} count={g.members.length}>
                  {g.members.length === 0
                    ? <span className="text-[11px] text-slate-300 dark:text-slate-500 italic mt-1">Belum ada anggota</span>
                    : g.members.map((r) => <B2BCard key={r.id} r={r} leads={leads} canEdit={canEdit} onSetLead={setLead} />)}
                </LeadColumn>
              ))}
              {(unassigned.length > 0 || canEdit) && (
                <LeadColumn title="Belum ditentukan" count={unassigned.length} dashed>
                  {unassigned.length === 0
                    ? <span className="text-[11px] text-slate-300 dark:text-slate-500 italic mt-1">—</span>
                    : unassigned.map((r) => <B2BCard key={r.id} r={r} leads={leads} canEdit={canEdit} onSetLead={setLead} />)}
                </LeadColumn>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { useData } from '../store/DataContext.jsx'
import { useAuth } from '../store/AuthContext.jsx'
import { Card } from '../components/ui.jsx'
import { roleLabel } from '../lib/format.js'
import { divisionOf } from '../lib/division.js'

const initials = (name = '') => name.split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase()

// Tier manajemen di atas Test Lead. `key` = nilai jabatan di data (untuk filter),
// `label` = teks yang ditampilkan.
const MGMT_TIERS = [
  { key: 'Team Leader COE', label: 'Team Leader COE', avatar: 'bg-bni-navy', chip: 'bg-bni-navy/10 text-bni-navy dark:text-slate-200' },
  { key: 'Test Automation Manager', label: 'Test Manager', avatar: 'bg-bni-orange', chip: 'bg-bni-orange/10 text-bni-orange' },
]

// Divisi di bawah Test Lead (Automation & Performance)
const DIVISIONS = [
  { key: 'Automation', label: 'Automation', avatar: 'bg-bni-teal', chip: 'bg-bni-teal/10 text-bni-teal', ring: 'border-bni-teal/30' },
  { key: 'Performance', label: 'Performance', avatar: 'bg-violet-500', chip: 'bg-violet-500/10 text-violet-600 dark:text-violet-300', ring: 'border-violet-400/40' },
]


function PersonCard({ r, avatar }) {
  const projectCount = (r.projects || []).length
  return (
    <Link
      to={`/resources/${r.id}`}
      className="group flex flex-col items-center w-36 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-4 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all"
    >
      <div className={`w-12 h-12 rounded-full ${avatar} text-white flex items-center justify-center text-sm font-bold`}>{initials(r.name)}</div>
      <div className="mt-2 text-sm font-bold text-bni-navy dark:text-white text-center leading-tight group-hover:text-bni-orange">{r.name}</div>
      <div className="text-[11px] text-slate-400 text-center mt-0.5">{roleLabel(r.role)}</div>
      <div className="text-[10px] text-slate-400 mt-1">{projectCount === 0 ? 'Tanpa project' : `${projectCount} project`}</div>
    </Link>
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
        {members.map((r) => <PersonCard key={r.id} r={r} avatar={tier.avatar} />)}
      </div>
    </div>
  )
}

// Kartu anggota B2B (kompak) + dropdown PIC
function B2BCard({ r, leads, canEdit, onSetLead }) {
  return (
    <div className="w-48 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 shadow-card">
      <Link to={`/resources/${r.id}`} className="group flex items-center gap-2">
        <div className="w-9 h-9 shrink-0 rounded-full bg-slate-500 text-white flex items-center justify-center text-xs font-bold">{initials(r.name)}</div>
        <div className="min-w-0">
          <div className="text-xs font-bold text-bni-navy dark:text-white truncate group-hover:text-bni-orange">{r.name}</div>
          <div className="text-[10px] text-slate-400 truncate">{r.company || '-'}{r.kontrak ? ` | ${r.kontrak}` : ''}</div>
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

// Kolom per Lead berisi anggota B2B di bawahnya (lebar seragam)
function LeadColumn({ title, count, dashed, children }) {
  return (
    <div className="flex flex-col items-center gap-2 w-48">
      <div className={`w-full flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold ${dashed ? 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 border border-dashed border-slate-300 dark:border-slate-600' : 'bg-bni-teal/10 text-bni-teal'}`}>
        <span className="truncate" title={title}>{title}</span>
        <span className="opacity-70 shrink-0">· {count}</span>
      </div>
      <div className="w-px h-4 bg-slate-200 dark:bg-slate-700" />
      <div className="flex flex-col gap-2 w-full">{children}</div>
    </div>
  )
}

// Satu kolom divisi: header divisi, kartu Lead, lalu B2B divisi tsb tepat di bawahnya
function DivisionColumn({ div, leads, allLeads, canEdit, onSetLead, b2b }) {
  const groups = leads.map((l) => ({ lead: l, members: b2b.filter((r) => r.lead === l.id) }))
  const b2bCount = groups.reduce((s, g) => s + g.members.length, 0)
  return (
    <div className={`shrink-0 rounded-2xl border ${div.ring} bg-slate-50/60 dark:bg-slate-800/30 overflow-hidden`}>
      {/* Header divisi */}
      <div className={`px-4 py-2.5 text-center border-b ${div.ring} ${div.chip}`}>
        <span className="text-xs font-bold uppercase tracking-wide">
          {div.label} <span className="opacity-70">· {leads.length}</span>
        </span>
      </div>

      <div className="flex flex-col items-center gap-4 px-5 py-5">
        {/* Kartu Lead */}
        <div className="flex flex-wrap justify-center gap-3">
          {leads.length === 0
            ? <span className="text-[11px] text-slate-300 dark:text-slate-500 italic px-8 py-6">Belum ada lead</span>
            : leads.map((r) => <PersonCard key={r.id} r={r} avatar={div.avatar} />)}
        </div>

        {/* Pemisah lalu B2B divisi ini */}
        <div className="w-full border-t border-dashed border-slate-200 dark:border-slate-700 pt-4 flex flex-col items-center gap-4">
          <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full ${div.chip}`}>
            B2B {div.label} <span className="opacity-70">· {b2bCount}</span>
          </span>
          <div className="flex gap-4 justify-center flex-wrap items-start">
            {groups.map((g) => (
              <LeadColumn key={g.lead.id} title={g.lead.name} count={g.members.length}>
                {g.members.length === 0
                  ? <span className="text-[11px] text-slate-300 dark:text-slate-500 italic mt-1">Belum ada anggota</span>
                  : g.members.map((r) => <B2BCard key={r.id} r={r} leads={allLeads} canEdit={canEdit} onSetLead={onSetLead} />)}
              </LeadColumn>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Organisasi() {
  const { resources, updateResource } = useData()
  const { user } = useAuth()
  // Role kepemimpinan yang boleh mengatur PIC anggota B2B (Lead & di atasnya)
  const EDIT_ROLES = ['QA Automation Lead', 'Team Leader COE', 'Test Automation Manager', 'Test Automation Lead']
  const canEdit = EDIT_ROLES.includes(user?.role)

  const byTier = (key) => resources.filter((r) => (r.jabatan || 'B2B Automation') === key)
  const total = resources.length

  const leads = byTier('Test Automation Lead')
  // Semua anggota B2B (Automation & Performance) — pengelompokan kolom ikut divisi lead-nya
  const b2b = resources.filter((r) => (r.jabatan || 'B2B Automation').startsWith('B2B'))
  const leadsIn = (divKey) => leads.filter((l) => divisionOf(l) === divKey)
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
          🛠️ Sebagai <b>{roleLabel(user?.role)}</b>, Anda dapat mengatur PIC tiap anggota B2B lewat dropdown <b>Lead</b> di masing-masing kartu.
        </div>
      )}

      <Card className="overflow-x-auto">
        <div className="min-w-[760px] py-6 flex flex-col items-center">
          {/* Tier manajemen */}
          {MGMT_TIERS.map((tier, i) => (
            <div key={tier.key} className="flex flex-col items-center">
              {i > 0 && <Connector />}
              <Tier tier={tier} members={byTier(tier.key)} />
            </div>
          ))}

          <Connector />

          {/* Test Lead — dua divisi BERSEBELAHAN; tiap kolom: Lead + B2B-nya di bawahnya */}
          <div className="flex flex-col items-center w-full">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full mb-4 bg-bni-teal/10 text-bni-teal">
              Test Lead <span className="opacity-70 font-semibold">· {leads.length}</span>
            </span>
            <div className="flex flex-nowrap justify-center gap-6 items-start">
              {DIVISIONS.map((div) => (
                <DivisionColumn
                  key={div.key}
                  div={div}
                  leads={leadsIn(div.key)}
                  allLeads={leads}
                  b2b={b2b}
                  canEdit={canEdit}
                  onSetLead={setLead}
                />
              ))}
            </div>
          </div>

          {/* Anggota B2B yang belum punya Lead (lintas divisi) */}
          {unassigned.length > 0 && (
            <>
              <Connector />
              <div className="flex gap-5 justify-center flex-wrap items-start">
                <LeadColumn title="Belum ditentukan" count={unassigned.length} dashed>
                  {unassigned.map((r) => <B2BCard key={r.id} r={r} leads={leads} canEdit={canEdit} onSetLead={setLead} />)}
                </LeadColumn>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  )
}

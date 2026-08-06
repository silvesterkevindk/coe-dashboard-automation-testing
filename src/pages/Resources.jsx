import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../store/DataContext.jsx'
import { Card, Badge, Modal, EmptyState } from '../components/ui.jsx'
import { statusColor, fmtDate, lamaBergabung } from '../lib/format.js'
import { JABATAN } from '../data/seed.js'
import { downloadCSV, downloadPDF } from '../lib/export.js'

// Kolom master pegawai (untuk export)
const COLS = [
  { label: 'No', value: (_, i) => i + 1 },
  { label: 'NPP', value: (r) => r.npp || '-' },
  { label: 'Nama Pegawai', value: (r) => r.name },
  { label: 'Perusahaan', value: (r) => r.company || '-' },
  { label: 'Tanggal Lahir', value: (r) => fmtDate(r.birthDate) },
  { label: 'Tanggal Bergabung', value: (r) => fmtDate(r.joinDate) },
  { label: 'Lama Bergabung', value: (r) => lamaBergabung(r.joinDate) },
  { label: 'No Telepon', value: (r) => r.phone || '-' },
  { label: 'Role', value: (r) => r.jabatan || 'B2B Automation' },
]

// Form hanya data master — data operasional (project, task, status, progress,
// standup) dikelola di menu Assignment.
const EMPTY_FORM = {
  name: '', npp: '', company: '', birthDate: '', joinDate: '', phone: '',
  jabatan: 'B2B Automation',
}

function ResourceForm({ initial, onSubmit, onClose }) {
  const [form, setForm] = useState(() => (initial ? { ...EMPTY_FORM, ...initial } : { ...EMPTY_FORM }))
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const isEdit = Boolean(initial)

  return (
    <Modal open onClose={onClose} title={isEdit ? `Edit: ${initial.name}` : 'Tambah Resource'}
      footer={<>
        <button className="btn-ghost" onClick={onClose}>Batal</button>
        <button className="btn-primary" onClick={() => { if (form.name) { onSubmit(form); onClose() } }}>
          {isEdit ? 'Simpan Perubahan' : 'Tambah'}
        </button>
      </>}
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="label">Nama Pegawai</label>
          <input className="input" value={form.name} onChange={set('name')} placeholder="Nama lengkap" />
        </div>
        <div>
          <label className="label">NPP</label>
          <input className="input" value={form.npp} onChange={set('npp')} placeholder="mis. P057874" />
        </div>
        <div>
          <label className="label">Perusahaan</label>
          <input className="input" value={form.company} onChange={set('company')} placeholder="mis. BNI" />
        </div>
        <div>
          <label className="label">Tanggal Lahir</label>
          <input type="date" className="input" value={form.birthDate || ''} onChange={set('birthDate')} />
        </div>
        <div>
          <label className="label">Tanggal Bergabung</label>
          <input type="date" className="input" value={form.joinDate || ''} onChange={set('joinDate')} />
        </div>
        <div className="col-span-2">
          <label className="label">No Telepon <span className="text-slate-300 font-normal">(untuk WhatsApp)</span></label>
          <input className="input" value={form.phone || ''} onChange={set('phone')} placeholder="mis. 081234567890" />
        </div>
        <div className="col-span-2">
          <label className="label">Role <span className="text-slate-300 font-normal">(struktur organisasi)</span></label>
          <select className="input" value={form.jabatan} onChange={set('jabatan')}>
            {JABATAN.map((j) => <option key={j}>{j}</option>)}
          </select>
        </div>
      </div>
    </Modal>
  )
}

// Warna badge per tier jabatan
function jabatanBadge(jabatan) {
  switch (jabatan) {
    case 'Team Leader COE': return 'bg-bni-navy/10 text-bni-navy dark:text-slate-200'
    case 'Test Automation Manager': return 'bg-bni-orange/10 text-bni-orange'
    case 'Test Automation Lead': return 'bg-bni-teal/10 text-bni-teal'
    default: return 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
  }
}

const PAGE_SIZE = 10

// Ubah tanggal ISO -> angka (timestamp) untuk pembanding sort; kosong dianggap 0
const dateVal = (s) => (s ? new Date(s).getTime() : 0)

// Definisi kolom yang bisa diurutkan. `get` mengembalikan nilai pembanding.
// Lama Bergabung memakai -joinDate: makin baru join = makin singkat = nilai makin kecil.
const SORT_COLS = [
  { key: 'npp', label: 'NPP', get: (r) => (r.npp || '').toLowerCase() },
  { key: 'name', label: 'Nama Pegawai', get: (r) => (r.name || '').toLowerCase() },
  { key: 'company', label: 'Perusahaan', get: (r) => (r.company || '').toLowerCase() },
  { key: 'birthDate', label: 'Tgl Lahir', get: (r) => dateVal(r.birthDate) },
  { key: 'joinDate', label: 'Tanggal Bergabung', get: (r) => dateVal(r.joinDate) },
  { key: 'lama', label: 'Lama Bergabung', get: (r) => -dateVal(r.joinDate) },
  { key: 'role', label: 'Role', get: (r) => (r.jabatan || 'B2B Automation').toLowerCase() },
]

// Header kolom yang bisa diklik untuk sort naik/turun
function SortableTh({ col, sort, onSort }) {
  const active = sort.key === col.key
  return (
    <th
      onClick={() => onSort(col.key)}
      className="text-left px-4 py-3 font-semibold cursor-pointer select-none hover:text-slate-700 dark:hover:text-slate-200"
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

export default function Resources() {
  const { resources, addResource, updateResource, deleteResource } = useData()
  const [modal, setModal] = useState(null)
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState({ key: null, dir: 'asc' }) // kolom aktif + arah urut

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

  // Klik header: kolom sama -> toggle naik/turun; kolom lain -> mulai dari ascending
  const toggleSort = (key) => {
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }))
    setPage(1)
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const pageRows = sorted.slice(start, start + PAGE_SIZE)

  const handleSubmit = (form) => {
    if (modal?.mode === 'edit') updateResource(modal.resource.id, form)
    else addResource(form)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input className="input max-w-xs" placeholder="🔍 Cari nama..." value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} />
        <div className="flex-1" />
        <div className="flex gap-2">
          <button className="btn-ghost" onClick={() => downloadCSV('Resource', COLS, sorted)}>⬇ CSV</button>
          <button className="btn-ghost" onClick={() => downloadPDF('Data Pegawai', `Total ${sorted.length} pegawai`, COLS, sorted)}>⬇ PDF</button>
          <button className="btn-primary" onClick={() => setModal({ mode: 'add' })}>+ Tambah Resource</button>
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
              {pageRows.map((r, i) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-400 whitespace-nowrap tabular-nums">{start + i + 1}</td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap font-mono text-xs">{r.npp || '-'}</td>
                  <td className="px-4 py-3">
                    <Link to={`/resources/${r.id}`} className="flex items-center gap-2 font-medium text-slate-700 hover:text-bni-orange">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${statusColor(r.status)}`} />
                      {r.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{r.company || '-'}</td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{fmtDate(r.birthDate)}</td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{fmtDate(r.joinDate)}</td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{lamaBergabung(r.joinDate)}</td>
                  <td className="px-4 py-3"><Badge className={jabatanBadge(r.jabatan)}>{r.jabatan || 'B2B Automation'}</Badge></td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button onClick={() => setModal({ mode: 'edit', resource: r })} className="text-slate-400 hover:text-bni-teal text-base mr-2" title="Edit">✏️</button>
                    <button onClick={() => { if (confirm(`Hapus ${r.name}?`)) deleteResource(r.id) }} className="text-slate-300 hover:text-red-500 text-lg" title="Hapus">🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <EmptyState>Tidak ada resource yang cocok.</EmptyState>}
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
        <ResourceForm
          initial={modal.mode === 'edit' ? modal.resource : null}
          onSubmit={handleSubmit}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}

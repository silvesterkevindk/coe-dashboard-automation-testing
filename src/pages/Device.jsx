import { useState } from 'react'
import { useData } from '../store/DataContext.jsx'
import { Card, Badge, StatCard, Modal, EmptyState } from '../components/ui.jsx'
import { downloadCSV, downloadPDF } from '../lib/export.js'

const TYPES = ['Android', 'iOS']
const STATUSES = ['Available', 'Dipinjam', 'Maintenance']

const typeBadge = {
  Android: 'bg-emerald-50 text-emerald-700',
  iOS: 'bg-slate-100 text-slate-700',
}
const statusBadge = {
  Available: 'bg-emerald-50 text-emerald-700',
  Dipinjam: 'bg-amber-50 text-amber-700',
  Maintenance: 'bg-red-50 text-red-700',
}

const yesNo = (v) => (Number(v) ? 'Ada' : 'Tidak')

const fmtDate = (iso) => {
  if (!iso) return '-'
  try {
    return new Date(iso).toLocaleString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    })
  } catch { return '-' }
}

const COLS = [
  { label: 'No', value: (_, i) => i + 1 },
  { label: 'Nama Device', value: (d) => d.name },
  { label: 'Jenis', value: (d) => d.type },
  { label: 'OS Version', value: (d) => d.osVersion || '-' },
  { label: 'Pemegang', value: (d) => d.holder || '-' },
  { label: 'Lokasi', value: (d) => d.location || '-' },
  { label: 'Kabel', value: (d) => yesNo(d.hasCable) },
  { label: 'Charger', value: (d) => yesNo(d.hasCharger) },
  { label: 'Status', value: (d) => d.status },
  { label: 'Catatan', value: (d) => d.notes || '-' },
  { label: 'Update Terakhir', value: (d) => fmtDate(d.updatedAt) },
]

const EMPTY_FORM = {
  name: '', type: 'Android', osVersion: '', holder: '', location: '',
  hasCable: 1, hasCharger: 1, status: 'Available', notes: '',
}

function DeviceForm({ initial, onSubmit, onClose }) {
  const [form, setForm] = useState(() => (initial ? { ...EMPTY_FORM, ...initial } : { ...EMPTY_FORM }))
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const setNum = (k) => (e) => setForm((f) => ({ ...f, [k]: Number(e.target.value) }))
  const isEdit = Boolean(initial)

  return (
    <Modal
      open
      onClose={onClose}
      title={isEdit ? `Edit: ${initial.name}` : 'Tambah Device'}
      footer={<>
        <button className="btn-ghost" onClick={onClose}>Batal</button>
        <button
          className="btn-primary"
          onClick={() => { if (form.name.trim()) { onSubmit({ ...form, name: form.name.trim() }); onClose() } }}
        >
          {isEdit ? 'Simpan Perubahan' : 'Tambah'}
        </button>
      </>}
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="label">Nama Device</label>
          <input className="input" value={form.name} onChange={set('name')} placeholder="mis. Samsung Galaxy A54" />
        </div>
        <div>
          <label className="label">Jenis</label>
          <select className="input" value={form.type} onChange={set('type')}>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="label">OS Version</label>
          <input className="input" value={form.osVersion} onChange={set('osVersion')} placeholder="mis. Android 12 / iOS 17" />
        </div>
        <div>
          <label className="label">Status</label>
          <select className="input" value={form.status} onChange={set('status')}>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Pemegang Saat Ini</label>
          <input className="input" value={form.holder} onChange={set('holder')} placeholder="mis. Marinda" />
        </div>
        <div>
          <label className="label">Lokasi / Posisi</label>
          <input className="input" value={form.location} onChange={set('location')} placeholder="mis. Lab QA Lt.3 / WFH" />
        </div>
        <div>
          <label className="label">Kabel</label>
          <select className="input" value={form.hasCable} onChange={setNum('hasCable')}>
            <option value={1}>Ada</option>
            <option value={0}>Tidak</option>
          </select>
        </div>
        <div>
          <label className="label">Charger</label>
          <select className="input" value={form.hasCharger} onChange={setNum('hasCharger')}>
            <option value={1}>Ada</option>
            <option value={0}>Tidak</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="label">Catatan</label>
          <textarea className="input" rows={2} value={form.notes} onChange={set('notes')} placeholder="mis. layar retak di pojok kanan atas" />
        </div>
      </div>
    </Modal>
  )
}

export default function Device() {
  const { devices, addDevice, updateDevice, deleteDevice } = useData()
  const [modal, setModal] = useState(null) // null | { mode:'add' } | { mode:'edit', device }
  const [q, setQ] = useState('')
  const [fType, setFType] = useState('')
  const [fStatus, setFStatus] = useState('')

  const filtered = devices.filter((d) =>
    (!q || `${d.name} ${d.holder} ${d.location}`.toLowerCase().includes(q.toLowerCase())) &&
    (!fType || d.type === fType) &&
    (!fStatus || d.status === fStatus)
  )

  const total = devices.length
  const android = devices.filter((d) => d.type === 'Android').length
  const ios = devices.filter((d) => d.type === 'iOS').length
  const dipinjam = devices.filter((d) => d.status === 'Dipinjam').length

  const handleSubmit = (form) => {
    if (modal?.mode === 'edit') updateDevice(modal.device.id, form)
    else addDevice(form)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Device" value={total} accent="text-bni-navy" icon="📱" />
        <StatCard label="Android" value={android} accent="text-emerald-600" icon="🤖" />
        <StatCard label="iOS" value={ios} accent="text-slate-600" icon="🍎" />
        <StatCard label="Sedang Dipinjam" value={dipinjam} accent="text-amber-600" icon="📤" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input className="input max-w-xs" placeholder="🔍 Cari nama / pemegang / lokasi..." value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input max-w-[140px]" value={fType} onChange={(e) => setFType(e.target.value)}>
          <option value="">Semua Jenis</option>
          {TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
        <select className="input max-w-[160px]" value={fStatus} onChange={(e) => setFStatus(e.target.value)}>
          <option value="">Semua Status</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <div className="flex-1" />
        <div className="flex gap-2">
          <button className="btn-ghost" onClick={() => downloadCSV('Device', COLS, filtered)}>⬇ CSV</button>
          <button className="btn-ghost" onClick={() => downloadPDF('Inventaris Device', `Total ${filtered.length} device`, COLS, filtered)}>⬇ PDF</button>
          <button className="btn-primary" onClick={() => setModal({ mode: 'add' })}>+ Tambah Device</button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3">Device</th>
                <th className="px-4 py-3">Jenis</th>
                <th className="px-4 py-3">OS</th>
                <th className="px-4 py-3">Pemegang</th>
                <th className="px-4 py-3">Lokasi</th>
                <th className="px-4 py-3 text-center">Kabel</th>
                <th className="px-4 py-3 text-center">Charger</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Update Terakhir</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-bni-navy">{d.name}</div>
                    {d.notes && <div className="text-xs text-slate-400 mt-0.5">{d.notes}</div>}
                  </td>
                  <td className="px-4 py-3"><Badge className={typeBadge[d.type] || 'bg-slate-100 text-slate-600'}>{d.type}</Badge></td>
                  <td className="px-4 py-3 text-slate-600">{d.osVersion || <span className="text-slate-300">—</span>}</td>
                  <td className="px-4 py-3 text-slate-600">{d.holder || <span className="text-slate-300">—</span>}</td>
                  <td className="px-4 py-3 text-slate-600">{d.location || <span className="text-slate-300">—</span>}</td>
                  <td className="px-4 py-3 text-center">{Number(d.hasCable) ? '✅' : <span className="text-slate-300">✕</span>}</td>
                  <td className="px-4 py-3 text-center">{Number(d.hasCharger) ? '✅' : <span className="text-slate-300">✕</span>}</td>
                  <td className="px-4 py-3"><Badge className={statusBadge[d.status] || 'bg-slate-100 text-slate-600'}>{d.status}</Badge></td>
                  <td className="px-4 py-3 text-xs text-slate-400">{fmtDate(d.updatedAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setModal({ mode: 'edit', device: d })} className="text-slate-400 hover:text-bni-teal" title="Edit">✏️</button>
                      <button onClick={() => { if (confirm(`Hapus device ${d.name}?`)) deleteDevice(d.id) }} className="text-slate-300 hover:text-red-500" title="Hapus">🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <EmptyState>{devices.length === 0 ? 'Belum ada device. Klik “+ Tambah Device” untuk mulai mencatat.' : 'Tidak ada device yang cocok dengan filter.'}</EmptyState>
        )}
      </Card>

      {modal && (
        <DeviceForm
          initial={modal.mode === 'edit' ? modal.device : null}
          onSubmit={handleSubmit}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}

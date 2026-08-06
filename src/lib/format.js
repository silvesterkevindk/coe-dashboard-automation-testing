// Helper format & warna status

export const num = (n) => (n ?? 0).toLocaleString('id-ID')

export const statusColor = (status) => ({
  Working: 'bg-emerald-500',
  Review: 'bg-amber-500',
  Blocked: 'bg-red-500',
  Leave: 'bg-slate-400',
  Meeting: 'bg-sky-500',
  Idle: 'bg-slate-300',
}[status] || 'bg-slate-300')

export const statusBadge = (status) => ({
  Working: 'bg-emerald-50 text-emerald-700',
  Review: 'bg-amber-50 text-amber-700',
  Blocked: 'bg-red-50 text-red-700',
  Leave: 'bg-slate-100 text-slate-600',
  Meeting: 'bg-sky-50 text-sky-700',
  Idle: 'bg-slate-100 text-slate-500',
}[status] || 'bg-slate-100 text-slate-600')

export const assignmentBadge = (status) => ({
  'On Track': 'bg-emerald-50 text-emerald-700',
  'At Risk': 'bg-amber-50 text-amber-700',
  Delayed: 'bg-red-50 text-red-700',
  Done: 'bg-sky-50 text-sky-700',
}[status] || 'bg-slate-100 text-slate-600')

// Warna bar progress berdasarkan persen
export const progressColor = (pct) => {
  if (pct >= 70) return 'bg-emerald-500'
  if (pct >= 45) return 'bg-amber-500'
  return 'bg-red-500'
}

// Warna utilisasi: overload (>100), sehat, idle
export const utilColor = (pct) => {
  if (pct > 100) return 'bg-red-500'
  if (pct >= 50) return 'bg-emerald-500'
  return 'bg-slate-400'
}

export const heatColor = (code) => ({
  ok: 'bg-emerald-500',
  warn: 'bg-amber-400',
  bad: 'bg-red-500',
  off: 'bg-slate-200',
}[code] || 'bg-slate-200')

// Parse tanggal ISO 'YYYY-MM-DD' sebagai tanggal lokal (hindari geser timezone)
export const parseISO = (d) => {
  if (!d) return null
  const [y, m, dd] = String(d).split('-').map(Number)
  if (!y || !m || !dd) return null
  const dt = new Date(y, m - 1, dd)
  return isNaN(dt) ? null : dt
}

// Tampilkan tanggal ISO → 'DD Mmm YYYY' (id-ID); '-' jika kosong/invalid
export const fmtDate = (d) => {
  const dt = parseISO(d)
  return dt ? dt.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'
}

// Link WhatsApp dari nomor telepon (normalisasi ke format internasional 62)
export const waLink = (phone) => {
  if (!phone) return null
  let d = String(phone).replace(/\D/g, '') // ambil digit saja
  if (!d) return null
  if (d.startsWith('0')) d = '62' + d.slice(1) // 08xx -> 628xx
  return `https://wa.me/${d}`
}

// Lama bergabung dari joinDate (ISO) sampai hari ini (hari sistem)
// → 'xx tahun yy bulan zz hari'
export const lamaBergabung = (joinDate) => {
  const join = parseISO(joinDate)
  if (!join) return '-'
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  if (join > today) return '-'

  let years = today.getFullYear() - join.getFullYear()
  let months = today.getMonth() - join.getMonth()
  let days = today.getDate() - join.getDate()

  if (days < 0) {
    months -= 1
    // jumlah hari di bulan sebelum "today"
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate()
  }
  if (months < 0) {
    years -= 1
    months += 12
  }
  return `${years} tahun ${months} bulan ${days} hari`
}

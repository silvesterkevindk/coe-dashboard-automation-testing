import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/AuthContext.jsx'
import { useData } from '../store/DataContext.jsx'
import { Card, Badge, SectionTitle } from '../components/ui.jsx'
import { fmtDate, lamaBergabung } from '../lib/format.js'

const initials = (name = '') => name.split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase()

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-3 py-1.5 text-sm border-b border-slate-100 dark:border-slate-700 last:border-0">
      <dt className="text-slate-400 shrink-0">{label}</dt>
      <dd className="font-medium text-slate-700 dark:text-slate-200 text-right">{value || '-'}</dd>
    </div>
  )
}

export default function Profile() {
  const { user, logout } = useAuth()
  const { resources } = useData()
  const nav = useNavigate()

  // Cocokkan akun login dengan data pegawai (nama saling memuat)
  const uname = (user?.name || '').toLowerCase().trim()
  const match = resources.find((r) => {
    const rn = (r.name || '').toLowerCase().trim()
    return rn && uname && (rn === uname || rn.includes(uname) || uname.includes(rn))
  })

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/" className="text-sm text-bni-teal hover:underline">← Kembali ke Dashboard</Link>

      {/* Kartu profil */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-bni-teal text-white flex items-center justify-center text-2xl font-bold">
            {initials(user?.name) || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-bni-navy dark:text-white">{user?.name || 'Pengguna'}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-bni-orange/10 text-bni-orange">{match?.jabatan || user?.role || '-'}</Badge>
              <span className="text-xs text-slate-400">@{user?.username}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Data pegawai */}
      <Card>
        <SectionTitle>Data Pegawai</SectionTitle>
        <dl>
          <Row label="Username" value={user?.username} />
          {match && <>
            <Row label="NPP" value={match.npp} />
            <Row label="Nama" value={match.name} />
            <Row label="Perusahaan" value={match.company} />
            <Row label="Jabatan" value={match.jabatan} />
            <Row label="Tanggal Lahir" value={fmtDate(match.birthDate)} />
            <Row label="Join Date" value={fmtDate(match.joinDate)} />
            <Row label="Lama Bergabung" value={lamaBergabung(match.joinDate)} />
          </>}
        </dl>
        {match
          ? <Link to={`/resources/${match.id}`} className="inline-block mt-4 text-sm text-bni-teal hover:underline">Lihat data lengkap →</Link>
          : <p className="text-sm text-slate-400 mt-3">Akun ini belum tertaut dengan data pegawai di menu Resource.</p>}
      </Card>

      {/* Logout */}
      <button
        onClick={() => { if (confirm('Keluar dari akun?')) { logout(); nav('/') } }}
        className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
      >
        ⏻ Logout
      </button>
    </div>
  )
}

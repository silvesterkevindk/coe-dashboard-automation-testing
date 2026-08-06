import { useParams, Link } from 'react-router-dom'
import { useData } from '../store/DataContext.jsx'
import { Card, Badge, ProgressBar, SectionTitle, EmptyState } from '../components/ui.jsx'
import { statusBadge, utilColor, fmtDate, lamaBergabung, waLink } from '../lib/format.js'

export default function ResourceDetail() {
  const { id } = useParams()
  const { resources } = useData()
  const r = resources.find((x) => x.id === id)

  if (!r) return <EmptyState>Resource tidak ditemukan. <Link className="text-bni-teal underline" to="/resources">Kembali</Link></EmptyState>

  return (
    <div className="space-y-6">
      <div>
        <Link to="/resources" className="text-sm text-bni-teal hover:underline">← Kembali ke daftar</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profil */}
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-bni-teal text-white flex items-center justify-center text-xl font-bold">
              {r.name.split(' ').map((s) => s[0]).slice(0, 2).join('')}
            </div>
            <div>
              <h2 className="text-lg font-bold text-bni-navy">{r.name}</h2>
              <p className="text-sm text-slate-400">{r.role}</p>
              <Badge className={`${statusBadge(r.status)} mt-1`}>{r.status}</Badge>
            </div>
          </div>
          <dl className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-slate-400">NPP</dt><dd className="font-medium text-slate-700 font-mono text-xs">{r.npp || '-'}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">Perusahaan</dt><dd className="font-medium text-slate-700">{r.company || '-'}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">Tanggal Lahir</dt><dd className="font-medium text-slate-700">{fmtDate(r.birthDate)}</dd></div>
            <div className="flex justify-between gap-2"><dt className="text-slate-400 shrink-0">Join Date</dt><dd className="font-medium text-slate-700 text-right">{fmtDate(r.joinDate)}</dd></div>
            <div className="flex justify-between gap-2"><dt className="text-slate-400 shrink-0">Lama Bergabung</dt><dd className="font-medium text-slate-700 text-right">{lamaBergabung(r.joinDate)}</dd></div>
            <div className="flex justify-between gap-2">
              <dt className="text-slate-400 shrink-0">No Telepon</dt>
              <dd className="font-medium text-right">
                {r.phone
                  ? <a href={waLink(r.phone)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-emerald-600 hover:underline">💬 {r.phone}</a>
                  : <span className="text-slate-400">-</span>}
              </dd>
            </div>
            <div className="flex justify-between items-center gap-2">
              <dt className="text-slate-400 shrink-0">Jabatan</dt>
              <dd><span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold px-2 py-0.5 rounded-full">{r.jabatan || 'B2B Automation'}</span></dd>
            </div>
            <div className="flex justify-between items-start gap-2">
                <dt className="text-slate-400 shrink-0">Project</dt>
                <dd className="flex flex-wrap gap-1 justify-end">
                  {(r.projects || []).length === 0
                    ? <span className="text-slate-400 italic text-sm">Belum ada</span>
                    : (r.projects || []).map((p) => (
                      <span key={p} className="text-xs bg-bni-teal/10 text-bni-teal font-semibold px-2 py-0.5 rounded-full">{p}</span>
                    ))
                  }
                </dd>
              </div>
            <div className="flex justify-between"><dt className="text-slate-400">Phase</dt><dd className="font-medium text-slate-700">{r.phase}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">Hari ini</dt><dd className="font-medium text-slate-700">{r.todayTask || '-'}</dd></div>
          </dl>
          <div className="mt-4">
            <div className="label">Utilisasi</div>
            <ProgressBar value={r.utilization} color={utilColor(r.utilization)} showLabel />
          </div>
        </Card>

        {/* Today's activity */}
        <Card>
          <SectionTitle>Today's Activity</SectionTitle>
          <ol className="relative border-l-2 border-slate-100 ml-2 space-y-4">
            {(r.activities || []).map((a, i) => (
              <li key={i} className="ml-4">
                <span className="absolute -left-[7px] w-3 h-3 rounded-full bg-bni-orange" />
                <div className="text-xs font-semibold text-slate-400">{a.time}</div>
                <div className="text-sm text-slate-700">{a.text}</div>
              </li>
            ))}
            {(!r.activities || r.activities.length === 0) && <p className="ml-4 text-sm text-slate-400">Belum ada aktivitas.</p>}
          </ol>
        </Card>

        {/* Task progress */}
        <Card>
          <SectionTitle>Task Progress</SectionTitle>
          <div className="space-y-4">
            {[
              ['Manual Execution', r.manualProgress],
              ['Automation', r.automationProgress],
              ['Review', r.reviewProgress],
            ].map(([label, val]) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">{label}</span>
                  <span className="font-semibold text-slate-700">{val || 0}%</span>
                </div>
                <ProgressBar value={val || 0} />
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <SectionTitle>Standup Hari Ini</SectionTitle>
            <dl className="space-y-1.5 text-sm">
              <div><dt className="text-xs text-slate-400">Kemarin</dt><dd className="text-slate-700">{r.standup?.yesterday || '-'}</dd></div>
              <div><dt className="text-xs text-slate-400">Hari ini</dt><dd className="text-slate-700">{r.standup?.today || '-'}</dd></div>
              <div><dt className="text-xs text-slate-400">Blocker</dt><dd className={r.standup?.blocker && r.standup.blocker !== 'None' ? 'text-red-600 font-medium' : 'text-slate-700'}>{r.standup?.blocker || 'None'}</dd></div>
            </dl>
          </div>
        </Card>
      </div>
    </div>
  )
}

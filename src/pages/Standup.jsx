import { useData } from '../store/DataContext.jsx'
import { Card, Badge, EmptyState } from '../components/ui.jsx'
import { statusBadge } from '../lib/format.js'

export default function Standup() {
  const { resources } = useData()

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">Daily Standup Board — ringkasan kemarin, hari ini, dan blocker tiap anggota.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((r) => {
          const hasBlocker = r.standup?.blocker && r.standup.blocker !== 'None'
          return (
            <Card key={r.id} className={hasBlocker ? 'border-l-4 border-l-red-400' : 'border-l-4 border-l-emerald-400'}>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-9 h-9 shrink-0 rounded-full bg-bni-teal text-white flex items-center justify-center text-xs font-bold">
                    {r.name.split(' ').map((s) => s[0]).slice(0, 2).join('')}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-bni-navy text-sm truncate">{r.name}</div>
                    <div className="text-[11px] text-slate-400 truncate" title={(r.projects || []).join(', ')}>
                      {(r.projects || []).length === 0 ? 'Belum ada project' : (r.projects || []).join(', ')}
                    </div>
                  </div>
                </div>
                <Badge className={`${statusBadge(r.status)} shrink-0`}>{r.status}</Badge>
              </div>
              <dl className="space-y-2 text-sm">
                <div className="flex gap-2">
                  <dt className="text-slate-400 w-16 shrink-0">✔ Kemarin</dt>
                  <dd className="text-slate-700">{r.standup?.yesterday || '-'}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-slate-400 w-16 shrink-0">▶ Hari ini</dt>
                  <dd className="text-slate-700">{r.standup?.today || '-'}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-slate-400 w-16 shrink-0">⚠ Blocker</dt>
                  <dd className={hasBlocker ? 'text-red-600 font-medium' : 'text-emerald-600'}>{r.standup?.blocker || 'None'}</dd>
                </div>
              </dl>
            </Card>
          )
        })}
      </div>
      {resources.length === 0 && <EmptyState>Belum ada resource.</EmptyState>}
    </div>
  )
}

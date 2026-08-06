import { Link } from 'react-router-dom'
import { useData } from '../store/DataContext.jsx'
import { computeKpis, computeAlerts } from '../lib/kpi.js'
import { Card, StatCard, ProgressBar, SectionTitle } from '../components/ui.jsx'
import { num, utilColor } from '../lib/format.js'

const alertDot = { red: '🔴', orange: '🟠', green: '🟢' }

export default function Dashboard() {
  const data = useData()
  const { projects, resources } = data
  const kpi = computeKpis(data)
  const alerts = computeAlerts(data)

  return (
    <div className="space-y-6">
      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Resource" value={kpi.resourceCount} icon="👥" />
        <StatCard label="Project" value={kpi.projectCount} icon="📁" />
        <StatCard label="TC Executed" value={num(kpi.tcExecuted)} icon="✅" />
        <StatCard label="Automation" value={`${kpi.automationCoverage}%`} accent="text-bni-teal" icon="🤖" />
        <StatCard label="Defect Open" value={kpi.openDefect} accent="text-red-500" icon="🐞" />
        <StatCard label="Avg Progress" value={`${kpi.avgProgress}%`} accent="text-bni-orange" icon="📈" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active projects */}
        <Card className="lg:col-span-2">
          <SectionTitle action={<Link to="/projects" className="text-xs font-semibold text-bni-teal hover:underline">Lihat semua →</Link>}>
            Active Project
          </SectionTitle>
          <div className="space-y-3">
            {projects.map((p) => (
              <Link key={p.id} to={`/projects/${p.id}`} className="block group">
                <div className="flex items-center gap-3">
                  <div className="w-44 shrink-0 text-sm font-medium text-slate-700 group-hover:text-bni-orange truncate">{p.name}</div>
                  <ProgressBar value={p.progress} className="flex-1" showLabel />
                </div>
              </Link>
            ))}
            {projects.length === 0 && <p className="text-sm text-slate-400">Belum ada project.</p>}
          </div>
        </Card>

        {/* Today's alert */}
        <Card>
          <SectionTitle>Today's Alert</SectionTitle>
          <div className="space-y-2.5">
            {alerts.length === 0 && <p className="text-sm text-emerald-600">🟢 Semua aman, tidak ada alert.</p>}
            {alerts.map((a, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span>{alertDot[a.level]}</span>
                <span className="text-slate-600">{a.text}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Team workload */}
      <Card>
        <SectionTitle action={<Link to="/resources" className="text-xs font-semibold text-bni-teal hover:underline">Kelola resource →</Link>}>
          Team Workload
        </SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
          {resources.map((r) => (
            <Link key={r.id} to={`/resources/${r.id}`} className="flex items-center gap-3 group">
              <div className="w-32 shrink-0 text-sm font-medium text-slate-700 group-hover:text-bni-orange truncate">{r.name}</div>
              <ProgressBar value={r.utilization} color={utilColor(r.utilization)} className="flex-1" />
              <span className="text-xs font-semibold text-slate-500 w-12 text-right">{r.utilization}%</span>
            </Link>
          ))}
          {resources.length === 0 && <p className="text-sm text-slate-400">Belum ada resource.</p>}
        </div>
        <div className="flex gap-4 mt-4 text-[11px] text-slate-400">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Sehat</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Overload &gt;100%</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" /> Idle &lt;50%</span>
        </div>
      </Card>
    </div>
  )
}

import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts'
import { useData } from '../store/DataContext.jsx'
import { Card, StatCard, SectionTitle } from '../components/ui.jsx'
import { computeKpis, projectRisk } from '../lib/kpi.js'
import { num } from '../lib/format.js'

const riskColor = { red: '#ef4444', amber: '#f59e0b', green: '#10b981' }

export default function Executive() {
  const data = useData()
  const { projects } = data
  const kpi = computeKpis(data)

  // Delivery health agregat
  const highRisk = projects.filter((p) => projectRisk(p) === 'red').length
  const health = kpi.critical > 2 || highRisk > 2 ? 'AT RISK' : kpi.critical > 0 || highRisk > 0 ? 'WATCH' : 'GOOD'
  const healthColor = health === 'GOOD' ? 'text-emerald-600' : health === 'WATCH' ? 'text-amber-600' : 'text-red-600'
  const healthDot = health === 'GOOD' ? '🟢' : health === 'WATCH' ? '🟡' : '🔴'

  const gauge = [{ name: 'Coverage', value: kpi.automationCoverage, fill: '#00857C' }]
  const projChart = projects.map((p) => ({ name: p.name, progress: p.progress, risk: projectRisk(p) }))

  return (
    <div className="space-y-6">
      <div className="bg-bni-navy rounded-2xl p-6 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">Executive Delivery Overview</h2>
          <p className="text-sm text-slate-300">Ringkasan eksekutif lintas project & resource</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-300 uppercase tracking-wide">Delivery Health</div>
          <div className={`text-2xl font-extrabold ${healthColor.replace('text-', 'text-')} bg-white rounded-lg px-4 py-1 mt-1`}>{healthDot} {health}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Projects" value={kpi.projectCount} icon="📁" />
        <StatCard label="Resource" value={kpi.resourceCount} icon="👥" />
        <StatCard label="Automation" value={`${kpi.automationCoverage}%`} accent="text-bni-teal" />
        <StatCard label="Pass Rate" value={`${kpi.passRate}%`} accent="text-emerald-600" />
        <StatCard label="Open Defect" value={kpi.openDefect} accent="text-red-500" />
        <StatCard label="Critical" value={kpi.critical} accent="text-red-600" icon="🚨" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <SectionTitle>Automation Coverage</SectionTitle>
          <ResponsiveContainer width="100%" height={240}>
            <RadialBarChart innerRadius="70%" outerRadius="100%" data={gauge} startAngle={90} endAngle={-270}>
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar background dataKey="value" cornerRadius={20} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="text-center -mt-32 mb-16">
            <div className="text-4xl font-extrabold text-bni-teal">{kpi.automationCoverage}%</div>
            <div className="text-xs text-slate-400">overall coverage</div>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <SectionTitle>Progress per Project (warna = risk)</SectionTitle>
          <ResponsiveContainer width="100%" height={Math.max(320, projChart.length * 56)}>
            <BarChart data={projChart} layout="vertical" margin={{ left: 20, top: 8, bottom: 8 }} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eef2f7" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 13, fill: '#475569' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="progress" radius={[0, 6, 6, 0]} barSize={26}>
                {projChart.map((c, i) => <Cell key={i} fill={riskColor[c.risk]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 text-[11px] text-slate-400">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Healthy</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Medium</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> High Risk</span>
          </div>
        </Card>
      </div>
    </div>
  )
}

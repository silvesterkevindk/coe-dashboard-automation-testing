import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts'
import { useData } from '../store/DataContext.jsx'
import { Card, StatCard, ProgressBar, SectionTitle } from '../components/ui.jsx'
import { computeKpis } from '../lib/kpi.js'
import { num } from '../lib/format.js'

const barColor = (v) => (v >= 70 ? '#10b981' : v >= 50 ? '#f59e0b' : '#ef4444')

export default function Automation() {
  const data = useData()
  const { projects } = data
  const kpi = computeKpis(data)

  const chart = projects.map((p) => ({ name: p.name, coverage: p.automationCoverage }))

  // Status automation agregat dari TC automation per project (estimasi dummy)
  const ready = projects.reduce((a, p) => a + Math.round((p.automation || 0) * 0.76), 0)
  const inProgress = projects.reduce((a, p) => a + Math.round((p.automation || 0) * 0.15), 0)
  const pending = projects.reduce((a, p) => a + Math.round((p.automation || 0) * 0.06), 0)
  const needReview = projects.reduce((a, p) => a + Math.round((p.automation || 0) * 0.03), 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Overall Coverage" value={`${kpi.automationCoverage}%`} accent="text-bni-teal" icon="🤖" />
        <StatCard label="Ready" value={num(ready)} accent="text-emerald-600" />
        <StatCard label="In Progress" value={num(inProgress)} accent="text-amber-600" />
        <StatCard label="Need Review" value={num(needReview)} accent="text-bni-orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <SectionTitle>Automation Coverage per Project</SectionTitle>
          <ResponsiveContainer width="100%" height={Math.max(460, chart.length * 56)}>
            <BarChart data={chart} layout="vertical" margin={{ left: 20, top: 8, bottom: 8 }} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eef2f7" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 13, fill: '#475569' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="coverage" radius={[0, 6, 6, 0]} barSize={30}>
                {chart.map((c, i) => <Cell key={i} fill={barColor(c.coverage)} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <SectionTitle>Automation Status</SectionTitle>
          <div className="space-y-4">
            {[
              ['Ready', ready, 'bg-emerald-500'],
              ['In Progress', inProgress, 'bg-amber-500'],
              ['Pending', pending, 'bg-slate-400'],
              ['Need Review', needReview, 'bg-bni-orange'],
            ].map(([label, val, color]) => (
              <div key={label} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-slate-600">
                  <span className={`w-2.5 h-2.5 rounded-full ${color}`} /> {label}
                </span>
                <span className="font-bold text-slate-700">{num(val)} TC</span>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <SectionTitle>Coverage Detail</SectionTitle>
            <div className="space-y-3">
              {projects.map((p) => (
                <div key={p.id}>
                  <div className="flex justify-between text-xs mb-1"><span className="text-slate-600 truncate">{p.name}</span><span className="font-semibold">{p.automationCoverage}%</span></div>
                  <ProgressBar value={p.automationCoverage} color={barColor(p.automationCoverage)} />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

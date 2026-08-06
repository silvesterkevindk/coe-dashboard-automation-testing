import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { useData } from '../store/DataContext.jsx'
import { Card, StatCard, ProgressBar, SectionTitle, EmptyState, Badge } from '../components/ui.jsx'
import { num } from '../lib/format.js'
import { projectRisk } from '../lib/kpi.js'

const COLORS = { passed: '#10b981', failed: '#ef4444', blocked: '#f59e0b', notRun: '#cbd5e1' }
const riskBadge = { red: 'bg-red-50 text-red-700', amber: 'bg-amber-50 text-amber-700', green: 'bg-emerald-50 text-emerald-700' }

export default function ProjectDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const { projects, deleteProject } = useData()
  const p = projects.find((x) => x.id === id)
  if (!p) return <EmptyState>Project tidak ditemukan. <Link className="text-bni-teal underline" to="/projects">Kembali</Link></EmptyState>

  const trend = (p.dailyProgress || []).map((v, i) => ({ day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][i], progress: v }))
  const pie = [
    { name: 'Passed', value: p.passed, key: 'passed' },
    { name: 'Failed', value: p.failed, key: 'failed' },
    { name: 'Blocked', value: p.blocked, key: 'blocked' },
    { name: 'Not Run', value: p.notRun, key: 'notRun' },
  ]
  const risk = projectRisk(p)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/projects" className="text-sm text-bni-teal hover:underline">← Kembali ke project</Link>
        <button className="btn-danger" onClick={() => { if (confirm(`Hapus ${p.name}?`)) { deleteProject(p.id); nav('/projects') } }}>🗑 Hapus</button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-xl font-bold text-bni-navy">{p.name}</h2>
        <Badge className="bg-slate-100 text-slate-500">{p.phase}</Badge>
        <Badge className="bg-bni-teal/10 text-bni-teal">{p.platform}</Badge>
        <Badge className={riskBadge[risk]}>{risk === 'red' ? 'High Risk' : risk === 'amber' ? 'Medium Risk' : 'Healthy'}</Badge>
      </div>

      <Card>
        <div className="flex justify-between text-sm mb-1"><span className="font-semibold text-slate-600">Overall Progress</span><span className="font-bold text-bni-orange">{p.progress}%</span></div>
        <ProgressBar value={p.progress} />
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <StatCard label="Total TC" value={num(p.totalTC)} />
        <StatCard label="Executed" value={num(p.executed)} />
        <StatCard label="Passed" value={num(p.passed)} accent="text-emerald-600" />
        <StatCard label="Failed" value={num(p.failed)} accent="text-red-500" />
        <StatCard label="Blocked" value={num(p.blocked)} accent="text-amber-600" />
        <StatCard label="Not Run" value={num(p.notRun)} accent="text-slate-500" />
        <StatCard label="Automation" value={num(p.automation)} accent="text-bni-teal" />
        <StatCard label="Auto Coverage" value={`${p.automationCoverage}%`} accent="text-bni-teal" />
        <StatCard label="Open Defect" value={p.openDefect} accent="text-red-500" />
        <StatCard label="Closed Defect" value={p.closedDefect} accent="text-emerald-600" />
        <StatCard label="Critical" value={p.critical || 0} accent="text-red-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <SectionTitle>Daily Progress Trend</SectionTitle>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="progress" fill="#ED6B23" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <SectionTitle>Execution Breakdown</SectionTitle>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pie} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2}>
                {pie.map((s) => <Cell key={s.key} fill={COLORS[s.key]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}

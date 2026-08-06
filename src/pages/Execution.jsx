import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts'
import { useData } from '../store/DataContext.jsx'
import { Card, StatCard, SectionTitle } from '../components/ui.jsx'
import { num } from '../lib/format.js'
import { downloadCSV, downloadPDF } from '../lib/export.js'

const TREND_COLS = [
  { label: 'Hari', value: (d) => d.day },
  { label: 'Pass Rate (%)', value: (d) => d.rate },
]

export default function Execution() {
  const { execution } = useData()
  const t = execution.today
  const passRate = t.executed ? ((t.passed / t.executed) * 100).toFixed(1) : '0.0'

  const summaryRows = [{
    label: 'Executed', value: t.executed, passed: t.passed,
    failed: t.failed, blocked: t.blocked, notComplete: t.notComplete,
  }]
  const SUMMARY_COLS = [
    { label: 'Executed', value: () => t.executed },
    { label: 'Passed', value: () => t.passed },
    { label: 'Failed', value: () => t.failed },
    { label: 'Blocked', value: () => t.blocked },
    { label: 'Not Complete', value: () => t.notComplete },
    { label: 'Pass Rate (%)', value: () => passRate },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionTitle>Today's Execution</SectionTitle>
        <div className="flex gap-2 mb-4">
          <button className="btn-ghost text-sm" onClick={() => downloadCSV('Execution_Trend', TREND_COLS, execution.passRateTrend)}>⬇ CSV Trend</button>
          <button className="btn-ghost text-sm" onClick={() => downloadPDF('Laporan Execution', `Pass Rate: ${passRate}%`, SUMMARY_COLS, summaryRows)}>⬇ PDF</button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Executed" value={num(t.executed)} icon="▶️" />
        <StatCard label="Passed" value={num(t.passed)} accent="text-emerald-600" />
        <StatCard label="Failed" value={num(t.failed)} accent="text-red-500" />
        <StatCard label="Blocked" value={num(t.blocked)} accent="text-amber-600" />
        <StatCard label="Not Complete" value={num(t.notComplete)} accent="text-slate-500" />
        <StatCard label="Pass Rate" value={`${passRate}%`} accent="text-bni-teal" icon="🎯" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <SectionTitle>Pass Rate Trend (5 hari)</SectionTitle>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={execution.passRateTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[80, 100]} tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Line type="monotone" dataKey="rate" stroke="#00857C" strokeWidth={3} dot={{ r: 5, fill: '#00857C' }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <SectionTitle>Execution Volume Trend</SectionTitle>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={execution.passRateTrend.map((d, i) => ({ day: d.day, executed: [320, 360, 410, 390, 420][i] }))}>
              <defs>
                <linearGradient id="execGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ED6B23" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#ED6B23" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="executed" stroke="#ED6B23" strokeWidth={2} fill="url(#execGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}

import { useData } from '../store/DataContext.jsx'
import { Card, SectionTitle } from '../components/ui.jsx'
import { heatColor } from '../lib/format.js'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const LEGEND = [
  ['ok', 'On track'],
  ['warn', 'Perlu perhatian'],
  ['bad', 'Bermasalah'],
  ['off', 'Cuti / libur'],
]

export default function Heatmap() {
  const { heatmap } = useData()

  return (
    <div className="space-y-6">
      <Card>
        <SectionTitle>Manager Heatmap — Status Mingguan</SectionTitle>
        <p className="text-xs text-slate-400 mb-4">Dalam 5 detik tahu siapa yang bermasalah. Hijau = aman, kuning = perhatian, merah = bermasalah.</p>
        <div className="overflow-x-auto">
          <table className="border-separate" style={{ borderSpacing: '8px' }}>
            <thead>
              <tr>
                <th className="text-left text-xs font-semibold text-slate-400 pr-4">Resource</th>
                {DAYS.map((d) => <th key={d} className="text-xs font-semibold text-slate-400 w-12">{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {heatmap.map((row) => (
                <tr key={row.name}>
                  <td className="text-sm font-medium text-slate-700 pr-4 whitespace-nowrap">{row.name}</td>
                  {row.days.map((code, i) => (
                    <td key={i}>
                      <div className={`w-12 h-12 rounded-lg ${heatColor(code)} mx-auto`} title={`${DAYS[i]}: ${code}`} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap gap-4 mt-6">
          {LEGEND.map(([code, label]) => (
            <span key={code} className="flex items-center gap-2 text-xs text-slate-500">
              <span className={`w-4 h-4 rounded ${heatColor(code)} inline-block`} /> {label}
            </span>
          ))}
        </div>
      </Card>
    </div>
  )
}

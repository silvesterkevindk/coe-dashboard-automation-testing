import { progressColor } from '../lib/format.js'

export function Card({ children, className = '' }) {
  return <div className={`card p-5 ${className}`}>{children}</div>
}

export function SectionTitle({ children, action }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">{children}</h2>
      {action}
    </div>
  )
}

export function ProgressBar({ value = 0, color, className = '', showLabel = false }) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full rounded-full ${color || progressColor(v)} transition-all`}
          style={{ width: `${v}%` }}
        />
      </div>
      {showLabel && <span className="text-xs font-semibold text-slate-600 w-10 text-right">{v}%</span>}
    </div>
  )
}

export function StatCard({ label, value, sub, accent = 'text-bni-navy', icon }) {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</div>
          <div className={`text-2xl font-extrabold mt-1 ${accent}`}>{value}</div>
          {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
        </div>
        {icon && <div className="text-2xl opacity-80">{icon}</div>}
      </div>
    </div>
  )
}

export function Badge({ children, className = '' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}>
      {children}
    </span>
  )
}

export function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-bni-navy/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl">
          <h3 className="text-lg font-bold text-bni-navy">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2 sticky bottom-0 bg-white rounded-b-2xl">{footer}</div>}
      </div>
    </div>
  )
}

export function EmptyState({ children }) {
  return (
    <div className="text-center py-12 text-slate-400 text-sm">{children}</div>
  )
}

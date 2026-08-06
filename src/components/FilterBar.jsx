import { useData } from '../store/DataContext.jsx'
import { useFilter } from '../store/FilterContext.jsx'
import { PLATFORMS, RESOURCE_STATUS } from '../data/seed.js'

export default function FilterBar() {
  const { projects, resources } = useData()
  const { filters, setFilter, clearFilters, isActive } = useFilter()

  // Kumpulkan phase unik dari semua project
  const phases = [...new Set(projects.map((p) => p.phase).filter(Boolean))].sort()
  const projectNames = projects.map((p) => p.name)
  const resourceNames = resources.map((r) => r.name)

  return (
    <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex flex-wrap items-center gap-2">
      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mr-1">Filter:</span>

      <Select
        value={filters.project}
        onChange={(v) => setFilter('project', v)}
        placeholder="Project"
        options={projectNames}
      />
      <Select
        value={filters.phase}
        onChange={(v) => setFilter('phase', v)}
        placeholder="Phase"
        options={phases}
      />
      <Select
        value={filters.resource}
        onChange={(v) => setFilter('resource', v)}
        placeholder="Resource"
        options={resourceNames}
      />
      <Select
        value={filters.status}
        onChange={(v) => setFilter('status', v)}
        placeholder="Status"
        options={RESOURCE_STATUS}
      />
      <Select
        value={filters.platform}
        onChange={(v) => setFilter('platform', v)}
        placeholder="Platform"
        options={PLATFORMS}
      />

      {isActive && (
        <button
          onClick={clearFilters}
          className="ml-1 text-[11px] font-semibold text-bni-orange hover:underline flex items-center gap-1"
        >
          ✕ Reset filter
        </button>
      )}
    </div>
  )
}

function Select({ value, onChange, placeholder, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`text-xs rounded-lg border px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-bni-teal/30 focus:border-bni-teal transition-colors ${
        value
          ? 'border-bni-teal bg-bni-teal/5 text-bni-teal font-semibold'
          : 'border-slate-200 bg-white text-slate-600'
      }`}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  )
}

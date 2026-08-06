import { createContext, useContext, useMemo, useState } from 'react'

const FilterContext = createContext(null)

const EMPTY = {
  project: '',
  phase: '',
  resource: '',
  status: '',
  platform: '',
}

export function FilterProvider({ children }) {
  const [filters, setFilters] = useState(EMPTY)

  const api = useMemo(() => ({
    filters,
    setFilter: (key, value) => setFilters((f) => ({ ...f, [key]: value })),
    clearFilters: () => setFilters(EMPTY),
    isActive: Object.values(filters).some(Boolean),
  }), [filters])

  return <FilterContext.Provider value={api}>{children}</FilterContext.Provider>
}

export function useFilter() {
  const ctx = useContext(FilterContext)
  if (!ctx) throw new Error('useFilter harus dipakai di dalam FilterProvider')
  return ctx
}

// Helper: filter array data berdasarkan filter aktif
export function applyFilters(items, filters, map) {
  return items.filter((item) =>
    Object.entries(filters).every(([key, val]) => {
      if (!val) return true
      const field = map[key]
      if (!field) return true
      return String(item[field] || '').toLowerCase().includes(val.toLowerCase())
    })
  )
}

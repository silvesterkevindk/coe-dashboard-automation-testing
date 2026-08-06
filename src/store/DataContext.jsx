import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { api } from '../lib/api.js'
import { useAuth } from './AuthContext.jsx'

const DataContext = createContext(null)

const EMPTY = { projects: [], resources: [], assignments: [], execution: null, heatmap: [] }

export function DataProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [state, setState] = useState(EMPTY)
  // `ready` hanya true setelah data benar-benar termuat dari server —
  // mencegah halaman render sebelum data siap (race saat transisi login).
  const [ready, setReady] = useState(false)
  const [error, setError] = useState('')

  // Ambil seluruh data saat sudah login; kosongkan saat logout
  const reload = useCallback(async () => {
    if (!isAuthenticated) { setState(EMPTY); setReady(false); setError(''); return }
    setReady(false)
    setError('')
    try {
      const data = await api.get('/bootstrap')
      setState({
        projects: data.projects || [],
        resources: data.resources || [],
        assignments: data.assignments || [],
        execution: data.execution || null,
        heatmap: data.heatmap || [],
      })
      setReady(true)
    } catch (e) {
      setError(e.message || 'Gagal memuat data.')
    }
  }, [isAuthenticated])

  useEffect(() => { reload() }, [reload])

  const value = useMemo(() => ({
    ...state,
    ready,
    error,
    reload,

    // ----- Resources -----
    async addResource(data) {
      const created = await api.post('/resources', data)
      setState((s) => ({ ...s, resources: [...s.resources, created] }))
      return created
    },
    async updateResource(id, patch) {
      const updated = await api.put(`/resources/${id}`, patch)
      setState((s) => ({ ...s, resources: s.resources.map((r) => (r.id === id ? updated : r)) }))
      return updated
    },
    async deleteResource(id) {
      await api.del(`/resources/${id}`)
      setState((s) => ({ ...s, resources: s.resources.filter((r) => r.id !== id) }))
    },

    // ----- Projects -----
    async addProject(data) {
      const created = await api.post('/projects', data)
      setState((s) => ({ ...s, projects: [...s.projects, created] }))
      return created
    },
    async updateProject(id, patch) {
      const updated = await api.put(`/projects/${id}`, patch)
      setState((s) => ({ ...s, projects: s.projects.map((p) => (p.id === id ? updated : p)) }))
      return updated
    },
    async deleteProject(id) {
      await api.del(`/projects/${id}`)
      setState((s) => ({ ...s, projects: s.projects.filter((p) => p.id !== id) }))
    },

    // ----- Assignments -----
    async addAssignment(data) {
      const created = await api.post('/assignments', data)
      setState((s) => ({ ...s, assignments: [...s.assignments, created] }))
      return created
    },
    async updateAssignment(id, patch) {
      const updated = await api.put(`/assignments/${id}`, patch)
      setState((s) => ({ ...s, assignments: s.assignments.map((a) => (a.id === id ? updated : a)) }))
      return updated
    },
    async deleteAssignment(id) {
      await api.del(`/assignments/${id}`)
      setState((s) => ({ ...s, assignments: s.assignments.filter((a) => a.id !== id) }))
    },

    // Muat ulang dari server
    resetAll: reload,
  }), [state, ready, error, reload])

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData harus dipakai di dalam DataProvider')
  return ctx
}

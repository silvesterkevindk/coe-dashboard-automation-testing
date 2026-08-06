import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api, setToken, getToken } from '../lib/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // cek sesi awal

  // Saat mount: kalau ada token, verifikasi ke /auth/me
  useEffect(() => {
    let alive = true
    async function restore() {
      if (!getToken()) { setLoading(false); return }
      try {
        const { user } = await api.get('/auth/me')
        if (alive) setUser(user)
      } catch {
        setToken(null) // token invalid/kedaluwarsa
      } finally {
        if (alive) setLoading(false)
      }
    }
    restore()
    return () => { alive = false }
  }, [])

  const api2 = useMemo(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user),

    async login(username, password) {
      try {
        const { token, user } = await api.post('/auth/login', { username, password })
        setToken(token)
        setUser(user)
        return { ok: true }
      } catch (e) {
        return { ok: false, error: e.message }
      }
    },

    async register({ name, username, password, role }) {
      try {
        const { token, user } = await api.post('/auth/register', { name, username, password, role })
        setToken(token)
        setUser(user)
        return { ok: true }
      } catch (e) {
        return { ok: false, error: e.message }
      }
    },

    logout() {
      setToken(null)
      setUser(null)
    },
  }), [user, loading])

  return <AuthContext.Provider value={api2}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider')
  return ctx
}

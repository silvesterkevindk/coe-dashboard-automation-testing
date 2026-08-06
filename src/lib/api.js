// Client API terpusat — semua request ke backend lewat sini.
// Base '/api' di-proxy Vite (dev) / Nginx (produksi) ke server Express.

const BASE = '/api'
const TOKEN_KEY = 'qa-dashboard-token'

export const getToken = () => {
  try { return localStorage.getItem(TOKEN_KEY) } catch { return null }
}
export const setToken = (t) => {
  try { t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY) } catch { /* ignore */ }
}

export async function apiFetch(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  })

  let data = null
  try { data = await res.json() } catch { /* body kosong */ }

  if (!res.ok) {
    const err = new Error(data?.error || `Request gagal (${res.status})`)
    err.status = res.status
    throw err
  }
  return data
}

// Shortcut CRUD
export const api = {
  get: (p) => apiFetch(p),
  post: (p, body) => apiFetch(p, { method: 'POST', body }),
  put: (p, body) => apiFetch(p, { method: 'PUT', body }),
  del: (p) => apiFetch(p, { method: 'DELETE' }),
}

import { useState } from 'react'
import { useAuth } from '../store/AuthContext.jsx'

export default function Login() {
  const { login, register } = useAuth()
  const [mode, setMode] = useState('signin') // 'signin' | 'register'
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState({ name: '', username: '', password: '', role: '' })

  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setError('') }

  const switchMode = (m) => { setMode(m); setError(''); setForm({ name: '', username: '', password: '', role: '' }) }

  const submit = async (e) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    const res = mode === 'signin'
      ? await login(form.username, form.password)
      : await register(form)
    if (!res.ok) { setError(res.error); setBusy(false) }
    // Jika ok, AuthProvider akan set user → App otomatis pindah ke dashboard
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100 dark:bg-[#0b1220]">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-bni-orange flex items-center justify-center font-extrabold text-white text-lg">Q</div>
          <div>
            <div className="font-bold text-bni-navy dark:text-white text-lg leading-tight">COE Automation</div>
            <div className="text-xs text-slate-400">Testing Dashboard · BNI</div>
          </div>
        </div>

        <div className="card p-6 sm:p-8">
          <h1 className="text-xl font-bold text-bni-navy dark:text-white mb-1">
            {mode === 'signin' ? 'Masuk ke akun Anda' : 'Buat akun baru'}
          </h1>
          <p className="text-sm text-slate-400 mb-6">
            {mode === 'signin' ? 'Silakan sign in untuk membuka dashboard.' : 'Lengkapi data untuk mendaftar.'}
          </p>

          {/* Tab Sign In / Register */}
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-700/50 rounded-lg p-1 mb-6">
            {[
              { key: 'signin', label: 'Sign In' },
              { key: 'register', label: 'Register' },
            ].map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => switchMode(t.key)}
                className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${
                  mode === t.key
                    ? 'bg-white dark:bg-slate-800 text-bni-orange shadow-sm'
                    : 'text-slate-500 dark:text-slate-300 hover:text-bni-navy dark:hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="label">Nama Lengkap</label>
                <input className="input" value={form.name} onChange={set('name')} placeholder="misal Silvester Kevin" autoComplete="name" />
              </div>
            )}

            <div>
              <label className="label">Username</label>
              <input className="input" value={form.username} onChange={set('username')} placeholder="username" autoComplete="username" />
            </div>

            {mode === 'register' && (
              <div>
                <label className="label">Role <span className="text-slate-300 font-normal">(opsional)</span></label>
                <input className="input" value={form.role} onChange={set('role')} placeholder="mis. QA Engineer" />
              </div>
            )}

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  className="input pr-16"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="••••••••"
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-bni-teal"
                >
                  {showPass ? 'Sembunyi' : 'Lihat'}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button type="submit" disabled={busy} className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed">
              {busy ? 'Memproses…' : (mode === 'signin' ? 'Masuk' : 'Daftar & Masuk')}
            </button>
          </form>

        </div>

      </div>
    </div>
  )
}

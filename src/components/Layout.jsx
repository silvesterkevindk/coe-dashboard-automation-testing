import { NavLink, Link, useLocation } from 'react-router-dom'
import { useData } from '../store/DataContext.jsx'
import { useTheme } from '../store/ThemeContext.jsx'
import { useAuth } from '../store/AuthContext.jsx'

const initials = (name = '') => name.split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase()

const NAV = [
  { to: '/', label: 'Dashboard', icon: '📊', end: true },
  { to: '/resources', label: 'Resource', icon: '👥' },
  { to: '/organisasi', label: 'Organisasi', icon: '🏢' },
  { to: '/projects', label: 'Project', icon: '📁' },
  { to: '/assignments', label: 'Assignment', icon: '📋' },
  { to: '/automation', label: 'Automation', icon: '🤖' },
  { to: '/execution', label: 'Execution', icon: '✅' },
  { to: '/heatmap', label: 'Heatmap', icon: '🔥' },
  { to: '/standup', label: 'Daily Standup', icon: '🗒️' },
  { to: '/executive', label: 'Executive', icon: '🏛️' },
  { to: '/panduan', label: 'Panduan', icon: '📖' },
]

const todayStr = new Date().toLocaleDateString('id-ID', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
})

export default function Layout({ children }) {
  const { resetAll } = useData()
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()
  const loc = useLocation()
  const current = NAV.find((n) => (n.end ? loc.pathname === n.to : loc.pathname.startsWith(n.to) && n.to !== '/'))

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-white dark:!bg-bni-navy border-r border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-200 flex flex-col fixed h-screen">
        <div className="px-5 py-5 flex items-center gap-3 border-b border-slate-200 dark:border-white/10">
          <div className="w-9 h-9 rounded-lg bg-bni-orange flex items-center justify-center font-extrabold text-white">Q</div>
          <div>
            <div className="font-bold text-bni-navy dark:text-white text-sm leading-tight">COE Automation</div>
            <div className="text-[11px] text-slate-400">Testing Dashboard</div>
          </div>
        </div>
        <nav className="flex-1 py-3 overflow-y-auto">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-bni-orange/10 dark:bg-bni-orange/15 text-bni-orange dark:text-white border-r-2 border-bni-orange'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-bni-navy dark:hover:text-white'
                }`
              }
            >
              <span className="text-base">{n.icon}</span>
              {n.label}
            </NavLink>
          ))}
        </nav>

        {/* Theme switcher — Light / Dark */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-white/10">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Tampilan</div>
          <div className="flex gap-1 bg-slate-100 dark:bg-black/20 rounded-lg p-1">
            {[
              { key: 'light', label: 'Light', icon: '☀️' },
              { key: 'dark', label: 'Dark', icon: '🌙' },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => setTheme(opt.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  theme === opt.key
                    ? 'bg-bni-orange text-white shadow'
                    : 'text-slate-500 dark:text-slate-300 hover:text-bni-navy dark:hover:text-white'
                }`}
              >
                <span>{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 py-4 border-t border-slate-200 dark:border-white/10">
          <button
            onClick={() => resetAll()}
            className="text-xs text-slate-400 hover:text-bni-navy dark:hover:text-white"
          >
            ↻ Muat ulang data
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-lg font-bold text-bni-navy">{current?.label || (loc.pathname === '/profile' ? 'Profil' : 'Dashboard')}</h1>
            <p className="text-xs text-slate-400">{todayStr}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/profile" title="Lihat profil" className="flex items-center gap-3 rounded-lg px-1 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <div className="text-sm font-semibold text-slate-700 hidden sm:block">{user?.name || 'Pengguna'}</div>
              <div className="w-9 h-9 rounded-full bg-bni-teal text-white flex items-center justify-center font-bold text-sm">{initials(user?.name) || 'U'}</div>
            </Link>
            <button
              onClick={() => { if (confirm('Keluar dari akun?')) logout() }}
              title="Logout"
              className="ml-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-white hover:bg-red-500 border border-slate-200 dark:border-slate-600 transition-colors"
            >
              ⏻ Logout
            </button>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
        <footer className="px-6 py-3 text-center text-[11px] text-slate-400 border-t border-slate-100">
          COE Automation Testing Dashboard · BNI · @SKDK
        </footer>
      </div>
    </div>
  )
}

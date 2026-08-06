import { Routes, Route } from 'react-router-dom'
import { useAuth } from './store/AuthContext.jsx'
import { useData } from './store/DataContext.jsx'
import Login from './pages/Login.jsx'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Resources from './pages/Resources.jsx'
import ResourceDetail from './pages/ResourceDetail.jsx'
import Organisasi from './pages/Organisasi.jsx'
import Profile from './pages/Profile.jsx'
import Panduan from './pages/Panduan.jsx'
import Projects from './pages/Projects.jsx'
import ProjectDetail from './pages/ProjectDetail.jsx'
import Assignments from './pages/Assignments.jsx'
import Automation from './pages/Automation.jsx'
import Execution from './pages/Execution.jsx'
import Heatmap from './pages/Heatmap.jsx'
import Standup from './pages/Standup.jsx'
import Executive from './pages/Executive.jsx'

function Loader({ label = 'Memuat…' }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-slate-100 dark:bg-[#0b1220]">
      <div className="w-9 h-9 rounded-full border-2 border-slate-300 border-t-bni-orange animate-spin" />
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  )
}

// Konten ter-route — hanya render setelah data dari server siap
function AppRoutes() {
  const { ready, error, reload } = useData()

  if (error) {
    return <div className="text-center py-24">
      <p className="text-red-500 font-semibold mb-1">Gagal memuat data</p>
      <p className="text-sm text-slate-400 mb-4">{error}</p>
      <button className="btn-primary" onClick={reload}>Coba lagi</button>
    </div>
  }
  if (!ready) {
    return <div className="flex items-center justify-center py-32">
      <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-bni-orange animate-spin" />
    </div>
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/resources/:id" element={<ResourceDetail />} />
      <Route path="/organisasi" element={<Organisasi />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/panduan" element={<Panduan />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:id" element={<ProjectDetail />} />
      <Route path="/assignments" element={<Assignments />} />
      <Route path="/automation" element={<Automation />} />
      <Route path="/execution" element={<Execution />} />
      <Route path="/heatmap" element={<Heatmap />} />
      <Route path="/standup" element={<Standup />} />
      <Route path="/executive" element={<Executive />} />
    </Routes>
  )
}

export default function App() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <Loader label="Memeriksa sesi…" />
  if (!isAuthenticated) return <Login />

  return (
    <Layout>
      <AppRoutes />
    </Layout>
  )
}

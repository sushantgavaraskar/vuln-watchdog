import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import ReportViewer from '../../components/ReportViewer'
import { useAuth } from '../../components/AuthContext'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { ProjectAPI, ScanAPI } from '../../lib/api'

export default function Reports() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState([])
  const [selected, setSelected] = useState('')
  const [scan, setScan] = useState(null)

  useEffect(() => { if (!loading && !isAuthenticated) router.replace('/login') }, [loading, isAuthenticated, router])

  useEffect(() => {
    if (!isAuthenticated) return
    ProjectAPI.list().then(({ data }) => setProjects(data || [])).catch(() => setProjects([]))
  }, [isAuthenticated])

  useEffect(() => {
    if (!selected) return setScan(null)
    ScanAPI.results(selected).then(({ data }) => setScan(data)).catch(() => setScan(null))
  }, [selected])

  const payload = useMemo(() => scan || {}, [scan])

  if (!isAuthenticated) return null
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header title="Reports" />
        <main className="p-4 grid gap-4">
          <div className="card grid gap-2">
            <div className="text-sm text-gray-700">Select Project</div>
            <select className="input" value={selected} onChange={(e) => setSelected(e.target.value)}>
              <option value="">-- Choose a project --</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          {selected && <ReportViewer data={payload} />}
        </main>
      </div>
    </div>
  )
}



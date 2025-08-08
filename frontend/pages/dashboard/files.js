import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import FileUpload from '../../components/FileUpload'
import { useAuth } from '../../components/AuthContext'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { ProjectAPI, ScanAPI } from '../../lib/api'

export default function Files() {
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

  const dependencies = useMemo(() => (Array.isArray(scan) ? scan : scan?.dependencies) || [], [scan])

  if (!isAuthenticated) return null
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header title="Dependency Files" />
        <main className="p-4 grid gap-4">
          <div className="card grid gap-2">
            <div className="text-sm text-gray-700">Select Project</div>
            <select className="input" value={selected} onChange={(e) => setSelected(e.target.value)}>
              <option value="">-- Choose a project --</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            {selected && <FileUpload projectId={selected} onUploaded={() => ScanAPI.results(selected).then(({ data }) => setScan(data))} />}
          </div>

          <div className="grid gap-2">
            <div className="font-semibold">Last Scan</div>
            {dependencies.length === 0 ? (
              <div className="card">No scan results yet.</div>
            ) : (
              <div className="grid gap-2">
                {dependencies.map((d) => (
                  <div key={d.id} className="card">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">{d.name} {d.version}</div>
                      <span className="text-xs border rounded px-2 py-0.5">{d.risk}</span>
                    </div>
                    <div className="text-sm text-gray-600">Issues: {d.issues?.length || 0}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}



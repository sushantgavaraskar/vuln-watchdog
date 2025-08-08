import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import VulnerabilityCard from '../../components/VulnerabilityCard'
import { useAuth } from '../../components/AuthContext'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { ProjectAPI, ScanAPI } from '../../lib/api'

export default function Vulnerabilities() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState([])
  const [selected, setSelected] = useState('')
  const [scan, setScan] = useState(null)
  const [severity, setSeverity] = useState('')

  useEffect(() => { if (!loading && !isAuthenticated) router.replace('/login') }, [loading, isAuthenticated, router])

  useEffect(() => {
    if (!isAuthenticated) return
    ProjectAPI.list().then(({ data }) => setProjects(data || [])).catch(() => setProjects([]))
  }, [isAuthenticated])

  useEffect(() => {
    if (!selected) return setScan(null)
    ScanAPI.results(selected).then(({ data }) => setScan(data)).catch(() => setScan(null))
  }, [selected])

  const issues = useMemo(() => {
    const deps = (Array.isArray(scan) ? scan : scan?.dependencies) || []
    const collected = deps.flatMap(d => d.issues || [])
    return severity ? collected.filter(i => i.severity === severity) : collected
  }, [scan, severity])

  if (!isAuthenticated) return null
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header title="Vulnerabilities" />
        <main className="p-4 grid gap-4">
          <div className="card grid gap-2">
            <div className="text-sm text-gray-700">Filters</div>
            <div className="grid grid-cols-2 gap-2">
              <select className="input" value={selected} onChange={(e) => setSelected(e.target.value)}>
                <option value="">-- Choose a project --</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <select className="input" value={severity} onChange={(e) => setSeverity(e.target.value)}>
                <option value="">All severities</option>
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>
          </div>

          <div className="grid gap-2">
            {issues.length === 0 ? (
              <div className="card">No issues found.</div>
            ) : (
              <div className="grid gap-2">
                {issues.map((i) => <VulnerabilityCard key={i.id || i.cveId || Math.random()} issue={i} />)}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}



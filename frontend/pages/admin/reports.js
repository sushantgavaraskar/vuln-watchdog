import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import { useAuth } from '../../components/AuthContext'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { AdminAPI } from '../../lib/api'

export default function AdminReports() {
  const { role, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState([])

  useEffect(() => { if (!loading && (!isAuthenticated || role !== 'admin')) router.replace('/login') }, [loading, isAuthenticated, role, router])
  useEffect(() => {
    if (!isAuthenticated || role !== 'admin') return
    AdminAPI.projects().then(({ data }) => setProjects(data || [])).catch(() => setProjects([]))
  }, [isAuthenticated, role])

  if (!isAuthenticated || role !== 'admin') return null
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header title="All Reports" />
        <main className="p-4 grid gap-3">
          <div className="card">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left"><th>ID</th><th>Name</th><th>Owner</th><th>Deps</th><th>Vulns</th></tr>
              </thead>
              <tbody>
                {projects.map(p => (
                  <tr key={p.id} className="border-t">
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.user?.email || p.userId}</td>
                    <td>{p.totalDependencies ?? '-'}</td>
                    <td>{p.totalVulnerabilities ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  )
}



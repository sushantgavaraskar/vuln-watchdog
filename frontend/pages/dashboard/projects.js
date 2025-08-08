import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import { useAuth } from '../../components/AuthContext'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { ProjectAPI } from '../../lib/api'
import { useState } from 'react'

export default function ProjectsPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState([])
  const [form, setForm] = useState({ name: '', description: '' })
  const [error, setError] = useState(null)

  useEffect(() => { if (!loading && !isAuthenticated) router.replace('/login') }, [loading, isAuthenticated, router])

  useEffect(() => {
    if (!isAuthenticated) return
    ProjectAPI.list().then(({ data }) => setProjects(data || [])).catch(() => setProjects([]))
  }, [isAuthenticated])

  const createProject = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await ProjectAPI.create(form)
      setForm({ name: '', description: '' })
      const { data } = await ProjectAPI.list()
      setProjects(data || [])
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to create project')
    }
  }

  if (!isAuthenticated) return null
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header title="Projects" />
        <main className="p-4 grid gap-4">
          <form onSubmit={createProject} className="card grid gap-2 max-w-lg">
            <div className="text-sm text-gray-700">Create New Project</div>
            <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input className="input" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            {error && <div className="text-sm text-red-600">{error}</div>}
            <button className="btn">Create</button>
          </form>

          <ProjectsList projects={projects} refresh={async () => {
            const { data } = await ProjectAPI.list(); setProjects(data || [])
          }} />
        </main>
      </div>
    </div>
  )
}

function ProjectsList({ projects, refresh }) {
  const [collabOpenIdx, setCollabOpenIdx] = useState(null)
  const [email, setEmail] = useState('')
  const onAdd = async (id) => { await ProjectAPI.addCollaborator(id, { email }); setEmail(''); setCollabOpenIdx(null); await refresh() }
  const onExport = async (id, format) => {
    const res = await ProjectAPI.export(id, format)
    const blob = new Blob([res.data], { type: format === 'pdf' ? 'application/pdf' : 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `project-${id}.${format}`
    a.click()
    URL.revokeObjectURL(url)
  }
  return (
    <div className="grid gap-2">
      {projects.map((p, idx) => (
        <div key={p.id} className="card">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">{p.name}</div>
              <div className="text-sm text-gray-600">{p.description}</div>
            </div>
            <div className="flex gap-2">
              <button className="btn" onClick={() => setCollabOpenIdx(idx === collabOpenIdx ? null : idx)}>Add collaborator</button>
              <button className="btn" onClick={() => onExport(p.id, 'pdf')}>Export PDF</button>
              <button className="btn" onClick={() => onExport(p.id, 'csv')}>Export CSV</button>
            </div>
          </div>
          {idx === collabOpenIdx && (
            <div className="mt-2 flex gap-2">
              <input className="input" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button className="btn" onClick={() => onAdd(p.id)}>Invite</button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}



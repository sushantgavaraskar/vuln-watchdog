import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import { useAuth } from '../../components/AuthContext'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { AdminAPI } from '../../lib/api'

export default function AdminUsers() {
  const { role, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState([])

  useEffect(() => { if (!loading && (!isAuthenticated || role !== 'admin')) router.replace('/login') }, [loading, isAuthenticated, role, router])
  useEffect(() => {
    if (!isAuthenticated || role !== 'admin') return
    AdminAPI.users().then(({ data }) => setUsers(data || [])).catch(() => setUsers([]))
  }, [isAuthenticated, role])

  if (!isAuthenticated || role !== 'admin') return null
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header title="Users" />
        <main className="p-4 grid gap-3">
          <div className="card">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left"><th>ID</th><th>Name</th><th>Email</th><th>Role</th></tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-t">
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
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



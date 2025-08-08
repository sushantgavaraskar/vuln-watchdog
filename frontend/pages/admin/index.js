import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import { useAuth } from '../../components/AuthContext'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function AdminHome() {
  const { role, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  useEffect(() => { if (!loading && (!isAuthenticated || role !== 'admin')) router.replace('/login') }, [loading, isAuthenticated, role, router])
  if (!isAuthenticated || role !== 'admin') return null
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header title="Admin Overview" />
        <main className="p-4 grid gap-3">
          <div className="card">Admin overview</div>
        </main>
      </div>
    </div>
  )
}



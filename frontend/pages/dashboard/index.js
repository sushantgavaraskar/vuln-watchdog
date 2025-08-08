import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import { useAuth } from '../../components/AuthContext'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Dashboard() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  useEffect(() => { if (!loading && !isAuthenticated) router.replace('/login') }, [loading, isAuthenticated, router])
  if (!isAuthenticated) return null
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header title="Dashboard" />
        <main className="p-4 grid gap-3">
          <div className="card">Welcome to VulnWatchdog. Use the sidebar to navigate.</div>
        </main>
      </div>
    </div>
  )
}



import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import { useAuth } from '../../components/AuthContext'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import useSSE from '../../hooks/useSSE'

export default function AdminActivity() {
  const { role, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const events = useSSE('/api/notifications/stream')

  useEffect(() => { if (!loading && (!isAuthenticated || role !== 'admin')) router.replace('/login') }, [loading, isAuthenticated, role, router])
  if (!isAuthenticated || role !== 'admin') return null
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header title="Activity (SSE)" />
        <main className="p-4 grid gap-2">
          <div className="card">
            <div className="text-sm text-gray-700">Real-time events</div>
            <div className="text-xs max-h-[500px] overflow-auto mt-2 space-y-1">
              {events.map((e, idx) => (
                <div key={idx} className="font-mono">{JSON.stringify(e)}</div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}



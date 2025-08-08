import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import { useAuth } from '../../components/AuthContext'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { NotificationsAPI } from '../../lib/api'

export default function NotificationsPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [type, setType] = useState('')
  const [unread, setUnread] = useState(0)
  const [error, setError] = useState(null)
  const [loadingList, setLoadingList] = useState(false)

  useEffect(() => { if (!loading && !isAuthenticated) router.replace('/login') }, [loading, isAuthenticated, router])

  const load = async () => {
    setLoadingList(true)
    setError(null)
    try {
      const { data } = await NotificationsAPI.list({ page, limit, type: type || undefined })
      const arr = Array.isArray(data) ? data : (data?.notifications || [])
      setItems(arr)
      const c = await NotificationsAPI.unreadCount()
      setUnread(c?.data?.unreadCount ?? c?.data?.count ?? 0)
    } catch (e) {
      setError(e?.response?.data?.error || `Failed to load notifications (HTTP ${e?.response?.status || 'ERR'})`)
      setItems([])
      setUnread(0)
    } finally {
      setLoadingList(false)
    }
  }

  useEffect(() => { if (isAuthenticated) load() }, [isAuthenticated, page, limit, type])

  const markAll = async () => { await NotificationsAPI.readAll(); load() }
  const markOne = async (id) => { await NotificationsAPI.read({ notificationId: id }); load() }
  const createTest = async () => { await NotificationsAPI.test({ message: 'Test notification from UI', type: 'system' }); load() }

  const types = useMemo(() => [
    { value: '', label: 'All' },
    { value: 'system', label: 'System' },
    { value: 'security', label: 'Security' },
    { value: 'scan', label: 'Scan' },
    { value: 'collaboration', label: 'Collaboration' },
  ], [])

  if (!isAuthenticated) return null
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header title={`Notifications (${unread} unread)`} />
        <main className="p-4 grid gap-4">
          <div className="card grid md:grid-cols-4 gap-2 items-end">
            <label className="grid gap-1">
              <div className="text-sm">Type</div>
              <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
                {types.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </label>
            <label className="grid gap-1">
              <div className="text-sm">Page</div>
              <input className="input" type="number" value={page} onChange={(e) => setPage(Number(e.target.value) || 1)} />
            </label>
            <label className="grid gap-1">
              <div className="text-sm">Limit</div>
              <input className="input" type="number" value={limit} onChange={(e) => setLimit(Number(e.target.value) || 20)} />
            </label>
            <div className="flex gap-2">
              <button className="btn" onClick={load} disabled={loadingList}>Refresh</button>
              <button className="btn" onClick={markAll}>Mark all read</button>
              <button className="btn" onClick={createTest}>Create test</button>
            </div>
          </div>
          {error && (
            <div className="border border-red-200 bg-red-50 text-red-700 rounded p-2 text-sm">{error}</div>
          )}

          <div className="grid gap-2">
            {items.length === 0 ? (
              <div className="card">No notifications.</div>
            ) : (
              <ul className="grid gap-2">
                {items.map(n => (
                  <li key={n.id} className={`card ${n.read ? '' : 'border-blue-200 bg-blue-50'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm text-gray-500">{n.type}</div>
                        <div className="font-medium">{n.message}</div>
                        {n.metadata && <div className="text-xs text-gray-500 mt-1">{typeof n.metadata === 'string' ? n.metadata : JSON.stringify(n.metadata)}</div>}
                      </div>
                      {!n.read && <button className="btn" onClick={() => markOne(n.id)}>Mark read</button>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}



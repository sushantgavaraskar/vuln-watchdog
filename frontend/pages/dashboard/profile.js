import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import { useAuth } from '../../components/AuthContext'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { UserAPI, AlertsAPI } from '../../lib/api'

export default function Profile() {
  const { isAuthenticated, loading, user, setUser } = useAuth()
  const router = useRouter()
  const [form, setForm] = useState({ name: '', emailNotifications: true, dailyDigest: false, securityAlerts: true, alertFrequency: 'daily' })
  const [msg, setMsg] = useState(null)

  useEffect(() => { if (!loading && !isAuthenticated) router.replace('/login') }, [loading, isAuthenticated, router])

  useEffect(() => {
    if (!isAuthenticated) return
    UserAPI.profile().then(({ data }) => {
      setUser(data)
      setForm({
        name: data.name || '',
        emailNotifications: data.emailNotifications ?? true,
        dailyDigest: data.dailyDigest ?? false,
        securityAlerts: data.securityAlerts ?? true,
        alertFrequency: data.alertFrequency || 'daily',
      })
    })
  }, [isAuthenticated, setUser])

  const save = async () => {
    await UserAPI.updateProfile(form)
    setMsg('Saved')
    setTimeout(() => setMsg(null), 2000)
  }
  const sendTest = async () => {
    await AlertsAPI.test()
    setMsg('Test alert sent')
    setTimeout(() => setMsg(null), 2000)
  }

  if (!isAuthenticated) return null
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header title="Profile" />
        <main className="p-4 grid gap-4 max-w-xl">
          {msg && <div className="text-sm text-green-700">{msg}</div>}
          <label className="grid gap-1">
            <div className="text-sm">Name</div>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.emailNotifications} onChange={(e) => setForm({ ...form, emailNotifications: e.target.checked })} /> Email notifications</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.dailyDigest} onChange={(e) => setForm({ ...form, dailyDigest: e.target.checked })} /> Daily digest</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.securityAlerts} onChange={(e) => setForm({ ...form, securityAlerts: e.target.checked })} /> Security alerts</label>
          <label className="grid gap-1">
            <div className="text-sm">Alert Frequency</div>
            <select className="input" value={form.alertFrequency} onChange={(e) => setForm({ ...form, alertFrequency: e.target.value })}>
              <option value="realtime">realtime</option>
              <option value="daily">daily</option>
              <option value="weekly">weekly</option>
            </select>
          </label>
          <div className="flex gap-2">
            <button className="btn" onClick={save}>Save</button>
            <button className="btn" onClick={sendTest}>Send Test Alert</button>
          </div>
        </main>
      </div>
    </div>
  )
}



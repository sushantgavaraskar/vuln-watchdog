import Link from 'next/link'
import { useAuth } from './AuthContext'

export default function Sidebar() {
  const { role } = useAuth()
  return (
    <aside className="w-56 p-4 border-r min-h-screen">
      <div className="font-semibold mb-4">VulnWatchdog</div>
      <nav className="grid gap-2">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/dashboard/files">Files</Link>
        <Link href="/dashboard/vulnerabilities">Vulnerabilities</Link>
        <Link href="/dashboard/reports">Reports</Link>
        <Link href="/dashboard/notifications">Notifications</Link>
        <Link href="/dashboard/profile">Profile</Link>
        {role === 'admin' && (
          <>
            <div className="mt-4 text-xs text-gray-500">Admin</div>
            <Link href="/admin">Overview</Link>
            <Link href="/admin/users">Users</Link>
            <Link href="/admin/activity">Activity</Link>
            <Link href="/admin/reports">Reports</Link>
          </>
        )}
      </nav>
    </aside>
  )
}



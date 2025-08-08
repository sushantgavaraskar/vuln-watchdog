import { useRouter } from 'next/router'
import { useAuth } from './AuthContext'

export default function Header({ title }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-700">{user?.name || user?.email}</span>
        <button className="btn" onClick={() => { logout(); router.push('/login') }}>Logout</button>
      </div>
    </header>
  )
}



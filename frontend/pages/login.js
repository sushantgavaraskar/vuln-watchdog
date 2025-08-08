import { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../components/AuthContext'

export default function Login() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await login(email, password)
      router.push('/dashboard')
    } catch (e) {
      setError(e.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <form onSubmit={submit} className="card w-full max-w-sm grid gap-3">
        <h2 className="text-xl font-semibold">Sign in</h2>
        <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="btn" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
      </form>
    </div>
  )
}



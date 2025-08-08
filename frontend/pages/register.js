import { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../components/AuthContext'

export default function Register() {
  const router = useRouter()
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await register({ name, email, password })
      router.push('/dashboard')
    } catch (e) {
      setError(e.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <form onSubmit={submit} className="card w-full max-w-sm grid gap-3">
        <h2 className="text-xl font-semibold">Create account</h2>
        <input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="btn" disabled={loading}>{loading ? 'Creating...' : 'Register'}</button>
      </form>
    </div>
  )
}



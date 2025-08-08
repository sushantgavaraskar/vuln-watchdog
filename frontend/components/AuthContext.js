import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import Cookies from 'js-cookie'
import { AuthAPI, UserAPI } from '../lib/api'
import { getRoleFromToken, isTokenValid } from '../utils/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = Cookies.get('token') || (typeof window !== 'undefined' ? localStorage.getItem('token') : null)
    if (t && isTokenValid(t)) {
      setToken(t)
      UserAPI.profile()
        .then(({ data }) => setUser(data))
        .catch(() => {})
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const { data } = await AuthAPI.login({ email, password })
    const t = data.token
    Cookies.set('token', t)
    if (typeof window !== 'undefined') localStorage.setItem('token', t)
    setToken(t)
    try {
      const profile = await UserAPI.profile()
      setUser(profile.data)
    } catch {}
  }

  const register = async (payload) => {
    const { data } = await AuthAPI.register(payload)
    const t = data.token
    Cookies.set('token', t)
    if (typeof window !== 'undefined') localStorage.setItem('token', t)
    setToken(t)
    try {
      const profile = await UserAPI.profile()
      setUser(profile.data)
    } catch {}
  }

  const logout = async () => {
    try { await AuthAPI.logout() } catch {}
    Cookies.remove('token')
    if (typeof window !== 'undefined') localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const value = useMemo(() => ({
    token,
    user,
    role: token ? getRoleFromToken(token) : 'guest',
    isAuthenticated: !!token,
    loading,
    login,
    register,
    logout,
    setUser,
  }), [token, user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)



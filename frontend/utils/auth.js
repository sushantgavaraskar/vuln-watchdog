import jwtDecode from 'jwt-decode'

export function getRoleFromToken(token) {
  try {
    const decoded = jwtDecode(token)
    return decoded.role || 'user'
  } catch {
    return 'user'
  }
}

export function isTokenValid(token) {
  try {
    const decoded = jwtDecode(token)
    if (!decoded.exp) return true
    const now = Math.floor(Date.now() / 1000)
    return decoded.exp > now
  } catch {
    return false
  }
}



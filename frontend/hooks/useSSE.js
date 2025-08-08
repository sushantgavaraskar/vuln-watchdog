import { useEffect, useRef, useState } from 'react'
import Cookies from 'js-cookie'

// We proxy SSE via Next API to attach Authorization header
export default function useSSE(path = '/api/notifications/stream') {
  const [events, setEvents] = useState([])
  const esRef = useRef(null)

  useEffect(() => {
    const token = Cookies.get('token') || (typeof window !== 'undefined' ? localStorage.getItem('token') : null)
    if (!token) return
    const url = `/api/sse?path=${encodeURIComponent(path)}`
    const es = new EventSource(url)
    esRef.current = es
    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        setEvents((prev) => [...prev, data])
      } catch {}
    }
    es.onerror = () => {}
    return () => { es.close() }
  }, [path])

  return events
}



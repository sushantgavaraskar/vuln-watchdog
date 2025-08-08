import Cookies from 'cookies'

export default async function handler(req, res) {
  const { path = '/api/notifications/stream' } = req.query
  const cookies = new Cookies(req, res)
  const token = cookies.get('token')

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Transfer-Encoding': 'chunked',
  })

  const controller = new AbortController()
  const backendUrl = `https://vuln-watchdog-1.onrender.com${path}`

  try {
    const backendRes = await fetch(backendUrl, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      signal: controller.signal,
    })
    if (!backendRes.ok) {
      res.write(`data: ${JSON.stringify({ type: 'error', status: backendRes.status })}\n\n`)
      res.end()
      return
    }
    for await (const chunk of backendRes.body) {
      res.write(chunk)
    }
  } catch (e) {
    res.write(`data: ${JSON.stringify({ type: 'error', message: e.message })}\n\n`)
  } finally {
    res.end()
  }
}



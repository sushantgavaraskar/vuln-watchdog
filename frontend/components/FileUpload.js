import { useState } from 'react'
import { ScanAPI } from '../lib/api'

export default function FileUpload({ projectId, onUploaded }) {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    if (!file || !projectId) return
    setLoading(true)
    setError(null)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('projectId', String(projectId))
      await ScanAPI.upload(form)
      onUploaded?.()
    } catch (e) {
      setError(e.response?.data?.error || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="input" />
      <button className="btn" disabled={loading || !projectId}>{loading ? 'Uploading...' : 'Upload'}</button>
      {error && <div className="text-red-600 text-sm">{error}</div>}
    </form>
  )
}



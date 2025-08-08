export default function ReportViewer({ data }) {
  const json = JSON.stringify(data, null, 2)
  const download = () => {
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'report.json'
    a.click()
    URL.revokeObjectURL(url)
  }
  return (
    <div className="card">
      <pre className="text-xs overflow-auto max-h-[400px]">{json}</pre>
      <button className="btn mt-2" onClick={download}>Download JSON</button>
    </div>
  )
}



export default function Toast({ message, type = 'info' }) {
  const color = type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'
  return (
    <div className={`border rounded p-2 text-sm ${color}`}>{message}</div>
  )
}



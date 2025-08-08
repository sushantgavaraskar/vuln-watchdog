export default function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded p-4 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold">{title}</div>
          <button className="btn" onClick={onClose}>Close</button>
        </div>
        {children}
      </div>
    </div>
  )
}



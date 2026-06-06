// src/components/ui/Modal.jsx
import { useEffect, useRef } from 'react'

export default function Modal({ isOpen, onClose, title, children, width = 'max-w-lg' }) {
  const modalRef = useRef(null)

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className={`
          ${width} w-full bg-card border border-border
          rounded-lg p-8 max-h-[90vh] overflow-y-auto
        `}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 id="modal-title" className="text-text-primary font-bold text-xl">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-text-muted hover:text-text-primary transition-hover min-h-[48px] min-w-[48px] flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  )
}

import { useEffect, useRef } from 'react'

export default function Modal({ isOpen, onClose, title, children, width = 'max-w-lg' }) {
  const modalRef = useRef(null)

  useEffect(() => {
    const handleKey = (e) => { 
      if (e.key === 'Escape') onClose() 
    }
    if (isOpen) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  // Focus trap
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusableElements || focusableElements.length === 0) return

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className={`
          ${width} w-[calc(100%-2rem)] bg-card border border-border
          rounded-lg p-6 sm:p-8 max-h-[90vh] overflow-y-auto animate-slideInUp
        `}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 id="modal-title" className="text-text-primary font-bold text-xl">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-text-muted hover:text-text-primary transition-hover min-h-[48px] min-w-[48px] flex items-center justify-center -mr-2"
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  )
}

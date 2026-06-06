// src/components/ui/ContextMenu.jsx
import { useEffect, useRef } from 'react'

export default function ContextMenu({ isOpen, position, onClose, options }) {
  const menuRef = useRef(null)

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose()
    }
    const handleEscape = (e) => { if (e.key === 'Escape') onClose() }

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
      document.addEventListener('keydown', handleEscape)
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-card border border-border rounded-sm py-2 shadow-card-hover min-w-[180px]"
      style={{ top: position.y, left: position.x }}
      role="menu"
    >
      {options.map((option, i) => (
        <button
          key={i}
          onClick={() => { option.action(); onClose() }}
          role="menuitem"
          className={`
            w-full text-left px-4 py-3 text-sm font-mono transition-hover
            hover:bg-inner focus:outline-none focus:bg-inner
            ${option.danger ? 'text-red-400 hover:text-red-300' : 'text-text-secondary hover:text-accent-cyan'}
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

import React from 'react';
import Spinner from './Spinner';

export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  ...props
}) {
  const base = `
    inline-flex items-center justify-center min-h-[48px] px-5 py-2
    text-sm font-bold rounded-sm transition-hover
    focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan
    disabled:opacity-50 disabled:cursor-not-allowed
  `

  const variants = {
    primary: 'bg-accent-cyan text-black hover:brightness-110 hover:scale-[1.02] hover:shadow-glow-cyan active:scale-[0.98]',
    secondary: 'bg-transparent border border-accent-cyan text-accent-cyan hover:bg-accent-cyan hover:text-black active:scale-[0.98]',
    danger: 'bg-transparent border border-red-400 text-red-400 hover:bg-red-400 hover:text-white active:scale-[0.98]',
    ghost: 'bg-transparent text-text-muted hover:text-text-secondary active:scale-[0.98]',
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {loading && <Spinner size="sm" className="mr-2" />}
      {children}
    </button>
  )
}

import { useState } from 'react'

export default function Input({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  required = false,
  className = '',
  validate,
  ...props
}) {
  const [touched, setTouched] = useState(false)
  const [internalError, setInternalError] = useState('')

  const handleChange = (e) => {
    onChange?.(e)
    if (validate && touched) {
      setInternalError(validate(e.target.value) || '')
    }
  }

  const handleBlur = (e) => {
    setTouched(true)
    onBlur?.(e)
    if (validate) {
      setInternalError(validate(e.target.value) || '')
    }
  }

  const displayError = error || (touched ? internalError : '')

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-text-secondary font-mono text-xs tracking-widest uppercase"
        >
          {label}{required && <span className="text-accent-cyan ml-1">*</span>}
        </label>
      )}

      <input
        id={id}
        type={type}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        aria-describedby={displayError ? `${id}-error` : undefined}
        aria-invalid={!!displayError}
        className={`
          bg-inner border rounded-sm px-4 py-3
          text-text-primary placeholder-text-muted text-sm
          transition-hover focus:outline-none min-h-[48px]
          ${displayError
            ? 'border-red-400 focus:border-red-400 focus:shadow-[0_0_12px_rgba(255,68,68,0.4)]'
            : 'border-border focus:border-accent-cyan focus:shadow-focus-cyan'
          }
        `}
        {...props}
      />

      {displayError && (
        <p id={`${id}-error`} className="text-red-400 text-xs font-mono animate-fade" role="alert">
          {displayError}
        </p>
      )}
    </div>
  )
}

// src/components/ui/Input.jsx
export default function Input({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  className = '',
  ...props
}) {
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
        onChange={onChange}
        placeholder={placeholder}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={!!error}
        className={`
          bg-inner border rounded-sm px-4 py-3
          text-text-primary placeholder-text-muted text-sm
          transition-hover focus:outline-none
          ${error
            ? 'border-red-400 focus:border-red-400'
            : 'border-border focus:border-accent-cyan focus:shadow-focus-cyan'
          }
        `}
        {...props}
      />

      {error && (
        <p id={`${id}-error`} className="text-red-400 text-xs font-mono" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

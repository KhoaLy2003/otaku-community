import { Colors } from '../../constants/colors'
import { cn } from '../../lib/utils'
import type { InputHTMLAttributes, ReactNode } from 'react'

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  pill?: boolean
  label?: string
  error?: string
}

export function TextInput({ className, leadingIcon, trailingIcon, pill = true, label, error, ...props }: TextInputProps) {
  const inputContainer = (
    <div
      className={cn(
        'flex items-center gap-2 px-3 transition-all duration-200 w-full',
        pill ? 'rounded-full' : 'rounded-xl',
        error ? 'border-red-500 ring-2 ring-red-200' : 'focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200',
        !label && !error && className
      )}
      style={{
        backgroundColor: Colors.Grey[10],
        border: error ? '1px solid #ef4444' : `1px solid ${Colors.Grey[20]}`
      }}
    >
      {leadingIcon}
      <input
        className="h-10 flex-1 bg-transparent text-sm text-[#1a1a1b] outline-none placeholder:text-[#7c7c7c]"
        {...props}
      />
      {trailingIcon}
    </div>
  );

  if (!label && !error) {
    return inputContainer;
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label className="text-sm font-semibold text-gray-700 ml-1">
          {label}
        </label>
      )}
      {inputContainer}
      {error && <span className="text-xs text-red-500 ml-1 mt-1">{error}</span>}
    </div>
  )
}
import { Colors } from '../../constants/colors'
import { cn } from '../../lib/utils'
import type { InputHTMLAttributes, ReactNode } from 'react'

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  pill?: boolean
}

export function TextInput({ className, leadingIcon, trailingIcon, pill = true, ...props }: TextInputProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3',
        pill ? 'rounded-full' : 'rounded-md',
        className
      )}
      style={{ backgroundColor: Colors.Grey[10], border: `1px solid ${Colors.Grey[20]}` }}
    >
      {leadingIcon}
      <input
        className="h-10 flex-1 bg-transparent text-sm text-[#1a1a1b] outline-none placeholder:text-[#7c7c7c]"
        {...props}
      />
      {trailingIcon}
    </div>
  )
}
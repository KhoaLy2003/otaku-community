import { Colors } from '../../constants/colors'
import { cn } from '../../lib/utils'
import type { ButtonHTMLAttributes } from 'react'

type IconButtonVariant = 'ghost' | 'outline' | 'filled'

const palette: Record<
  IconButtonVariant,
  { background: string; border: string; color: string; hover?: string }
> = {
  ghost: {
    background: 'transparent',
    border: 'transparent',
    color: Colors.Grey[70],
    hover: Colors.Grey[10],
  },
  outline: {
    background: Colors.Grey.White,
    border: Colors.Grey[20],
    color: Colors.Grey[80],
    hover: Colors.Grey[10],
  },
  filled: {
    background: Colors.Grey[10],
    border: Colors.Grey[10],
    color: Colors.Grey[80],
  },
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant
}

export function IconButton({ className, variant = 'outline', children, ...props }: IconButtonProps) {
  const colors = palette[variant]
  return (
    <button
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-full transition-colors',
        className
      )}
      style={{ backgroundColor: colors.background, border: `1px solid ${colors.border}`, color: colors.color }}
      onMouseEnter={e => {
        if (colors.hover) (e.currentTarget.style.backgroundColor = colors.hover)
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = colors.background
      }}
      {...props}
    >
      {children}
    </button>
  )
}
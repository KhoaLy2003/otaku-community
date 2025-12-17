import { Colors } from '@/constants/colors'
import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

type CardVariant = 'primary' | 'secondary'

const variantStyles: Record<CardVariant, { backgroundColor: string; borderColor: string; shadow?: string }> = {
  primary: {
    backgroundColor: Colors.Grey.White,
    borderColor: Colors.Grey[20],
    shadow: '0 1px 2px rgba(0,0,0,0.08)',
  },
  secondary: {
    backgroundColor: Colors.Grey[10],
    borderColor: Colors.Grey[20],
  },
}

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
}

export function Card({ className, variant = 'primary', style, ...props }: CardProps) {
  const palette = variantStyles[variant]
  return (
    <div
      className={cn('rounded-lg border p-4', className)}
      style={{ backgroundColor: palette.backgroundColor, borderColor: palette.borderColor, boxShadow: palette.shadow, ...style }}
      {...props}
    />
  )
}


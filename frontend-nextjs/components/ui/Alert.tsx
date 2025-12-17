import { Colors } from '@/constants/colors'
import { cn } from '@/lib/utils'
import type { HTMLAttributes, ReactNode } from 'react'

type AlertVariant = 'info' | 'success' | 'warning' | 'error'

const variantPalette: Record<
  AlertVariant,
  {
    background: string
    border: string
    text: string
    iconColor: string
  }
> = {
  info: {
    background: Colors.Blue[10],
    border: Colors.Blue[20],
    text: Colors.Blue[60],
    iconColor: Colors.Blue[40],
  },
  success: {
    background: '#E6F5EC',
    border: Colors.Green,
    text: Colors.Green,
    iconColor: Colors.Green,
  },
  warning: {
    background: '#FFF4E5',
    border: Colors.Orange[20],
    text: Colors.Orange[20],
    iconColor: Colors.Orange[30],
  },
  error: {
    background: '#FDEAEA',
    border: '#FB5A5A',
    text: '#C92A2A',
    iconColor: '#FB5A5A',
  },
}

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  icon?: ReactNode
  variant?: AlertVariant
  action?: ReactNode
}

export function Alert({
  className,
  children,
  title,
  icon,
  variant = 'info',
  action,
  ...props
}: AlertProps) {
  const palette = variantPalette[variant]

  return (
    <div
      className={cn('flex items-start gap-3 rounded-lg border px-4 py-3', className)}
      style={{ backgroundColor: palette.background, borderColor: palette.border, color: palette.text }}
      {...props}
    >
      {icon && <span className="mt-0.5 text-lg" style={{ color: palette.iconColor }}>{icon}</span>}
      <div className="flex-1 space-y-1">
        {title && <p className="text-sm font-semibold">{title}</p>}
        {children && <div className="text-sm">{children}</div>}
      </div>
      {action && <div className="text-sm font-medium">{action}</div>}
    </div>
  )
}


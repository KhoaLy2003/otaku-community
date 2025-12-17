import { Colors } from '../../constants/colors'
import { cn } from '../../lib/utils'
import type { ReactNode } from 'react'

export interface TabItem {
  id: string
  label: string
  icon?: ReactNode
}

interface TabsProps {
  tabs: TabItem[]
  activeTab: string
  onChange: (id: string) => void
  className?: string
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-0 border-b",
        className
      )}
      style={{ borderColor: Colors.Grey[20] }}
    >
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
              "hover:bg-[#F6F7F8]",
              index !== tabs.length - 1 && "border-r",
              isActive && "text-[#1A1A1B]"
            )}
            style={{
              color: isActive ? Colors.Grey[90] : Colors.Grey[70],
              borderColor: Colors.Grey[20],
              backgroundColor: isActive ? Colors.Grey.White : 'transparent',
            }}
          >
            {tab.icon && <span className="text-base">{tab.icon}</span>}
            {tab.label}
            {isActive && (
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: Colors.Orange[30] }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
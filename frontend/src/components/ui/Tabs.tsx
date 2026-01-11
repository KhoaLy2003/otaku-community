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
  variant?: 'folder' | 'underline' | 'pill'
  className?: string
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'folder',
  className
}: TabsProps) {
  if (variant === 'pill') {
    return (
      <div className={cn("flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit", className)}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-1.5 text-sm font-semibold transition-all duration-200 rounded-lg",
                isActive
                  ? "bg-white dark:bg-gray-700 text-orange-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50"
              )}
            >
              {tab.icon && <span className="text-sm">{tab.icon}</span>}
              {tab.label}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex items-center gap-0",
        variant === 'folder' ? "border-b" : "gap-6",
        className
      )}
      style={{ borderColor: variant === 'folder' ? Colors.Grey[20] : 'transparent' }}
    >
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTab

        if (variant === 'underline') {
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "relative flex items-center gap-2 py-3 text-sm font-semibold transition-colors",
                isActive ? "text-[#1A1A1B] dark:text-white" : "text-[#7c7c7c] hover:text-[#1A1A1B]"
              )}
            >
              {tab.icon && <span className="text-base">{tab.icon}</span>}
              {tab.label}
              {isActive && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ backgroundColor: Colors.Orange[30] }}
                />
              )}
            </button>
          )
        }

        // Default Folder style
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
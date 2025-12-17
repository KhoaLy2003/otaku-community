"use client"

import { useState } from 'react'
import { Flame, Sparkles, TrendingUp } from 'lucide-react'
import { Tabs, type TabItem } from '@/components/ui/Tabs'
import { Button } from '@/components/ui/Button'

const tabItems: TabItem[] = [
  { id: 'best', label: 'Best', icon: <Sparkles className="h-4 w-4" /> },
  { id: 'hot', label: 'Hot', icon: <Flame className="h-4 w-4" /> },
  { id: 'new', label: 'New', icon: <PlusIcon className="h-4 w-4" /> },
  { id: 'top', label: 'Top', icon: <TrendingUp className="h-4 w-4" /> },
]

function PlusIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function FeedTabs() {
  const [activeTab, setActiveTab] = useState('best')

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded border bg-white p-3 shadow-sm">
      <Tabs tabs={tabItems} activeTab={activeTab} onChange={setActiveTab} />
      <Button variant="outline" color="grey" size="sm">
        More
      </Button>
    </div>
  )
}


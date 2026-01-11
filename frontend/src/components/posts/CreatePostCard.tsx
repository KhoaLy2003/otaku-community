import { Image as ImageIcon, Link2, MessageSquare, PenSquare } from 'lucide-react'
import { Card } from '../ui/Card'
import { TextInput } from '../ui/TextInput'
import { Colors } from '../../constants/colors'

const quickActions = [
  { label: 'Post', icon: PenSquare },
  { label: 'Images', icon: ImageIcon },
  { label: 'Link', icon: Link2 },
  { label: 'Discuss', icon: MessageSquare },
]

export function CreatePostCard() {
  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-3">
        <img
          src="/logo.svg"
          alt="App logo"
          className="h-10 w-10 rounded-full object-cover"
        />
        <TextInput className="flex-1" placeholder="Create Post" />
      </div>
      <div className="grid gap-2 text-sm text-[#7c7c7c] sm:grid-cols-4">
        {quickActions.map(action => (
          <button
            key={action.label}
            className="flex items-center justify-center gap-2 rounded px-3 py-2 font-medium transition"
            style={{ border: `1px solid ${Colors.Grey[20]}` }}
          >
            <action.icon className="h-4 w-4" />
            {action.label}
          </button>
        ))}
      </div>
    </Card>
  )
}
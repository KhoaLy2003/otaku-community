import { Image as ImageIcon, Link2, MessageSquare, PenSquare } from 'lucide-react'
import { Card } from '../ui/Card'
import { TextInput } from '../ui/TextInput'
import { Colors } from '../../constants/colors'
import { useAuth } from '@/hooks/useAuth'

const quickActions = [
  { label: 'Post', icon: PenSquare },
  { label: 'Images', icon: ImageIcon },
  { label: 'Link', icon: Link2 },
  { label: 'Discuss', icon: MessageSquare },
]

export function CreatePostCard() {
  const { user, auth0User } = useAuth();
  const avatarUrl = user?.avatarUrl || auth0User?.picture;

  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-3">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="User avatar"
            className="h-10 w-10 rounded-full object-cover shrink-0"
          />
        ) : (
          <div
            className="h-10 w-10 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: Colors.Orange[30] }}
          >
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}
        <TextInput className="flex-1" placeholder="Create Post" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-[#7c7c7c]">
        {quickActions.map(action => (
          <button
            key={action.label}
            className="flex items-center justify-center gap-2 rounded px-3 py-2 font-medium transition hover:bg-gray-50 active:bg-gray-100"
            style={{ border: `1px solid ${Colors.Grey[20]}` }}
          >
            <action.icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{action.label}</span>
          </button>
        ))}
      </div>
    </Card>
  )
}
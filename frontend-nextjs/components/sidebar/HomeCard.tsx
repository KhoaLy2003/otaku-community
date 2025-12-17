import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Colors } from '@/constants/colors'

export function HomeCard() {
  return (
    <Card className="p-0 overflow-hidden">
      <div
        className="p-4 text-white"
        style={{ background: `linear-gradient(90deg, ${Colors.Orange[10]}, ${Colors.Orange[30]})` }}
      >
        <p className="text-lg font-semibold">Home</p>
        <p className="text-sm opacity-90">
          Your personal gateway to anime, manga, JLPT study and everything Japan.
        </p>
      </div>
      <div className="space-y-3 p-4 text-sm text-[#1a1a1b]">
        <p className="leading-relaxed text-[#4a4a4a]">
          Check in with favorite topics, follow creators, and share travel plans with the community.
        </p>
        <div className="flex flex-col gap-2">
          <Button color="blue">Create Post</Button>
          <Button variant="outline" color="blue">
            Create Community
          </Button>
        </div>
      </div>
    </Card>
  )
}


import { Card } from '../ui/Card'
import { Colors } from '../../constants/colors'

export function RecentPostsCard() {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-[#1a1a1b]">Recent posts</h3>

      <div
        className="mt-4 rounded border p-4 text-sm text-[#7c7c7c]"
        style={{ borderColor: Colors.Grey[20] }}
      >
        <p className="font-medium text-[#1a1a1b] mb-1">
          Feature in development
        </p>
        <p>
          Recent posts will appear here once the community feed is fully
          implemented.
        </p>
      </div>
    </Card>
  )
}
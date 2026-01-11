import { Link } from 'react-router-dom'
import { Card } from '../ui/Card'
import { Colors } from '../../constants/colors'

const recentPosts = [
  { id: '1', title: 'Best cozy anime cafes in Tokyo?', points: 214, comments: 87 },
  { id: '2', title: 'JLPT N4 listening playlist that helped me pass', points: 132, comments: 54 },
  { id: '3', title: 'Osaka food crawl itinerary (printable)', points: 98, comments: 31 },
  { id: '4', title: 'Manga panel redraw challenge results!', points: 75, comments: 42 },
]

export function RecentPostsCard() {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-[#1a1a1b]">Recent posts</h3>
      <div className="mt-4 space-y-3">
        {recentPosts.map(post => (
          <Link
            key={post.id}
            to={`/posts/${post.id}`}
            className="block rounded border border-transparent p-2 transition hover:bg-[#F6F7F8] cursor-pointer"
            style={{ borderColor: Colors.Grey[20] }}
          >
            <p className="text-sm font-semibold text-[#1a1a1b]">{post.title}</p>
            <p className="mt-1 text-xs text-[#7c7c7c]">
              {post.points} points · {post.comments} comments
            </p>
          </Link>
        ))}
      </div>
    </Card>
  )
}
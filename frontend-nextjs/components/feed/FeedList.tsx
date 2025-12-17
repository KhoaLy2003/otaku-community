import Link from 'next/link'
import { PostCard, type BasePost } from '@/components/posts/PostCard'

const posts: BasePost[] = [
  {
    id: '1',
    title: 'Teacher accused me of using ChatGPT. I need advice.',
    body: `My teacher accused me of using AI on two essays. I didn’t. She has “proof”
from a detector and wants to meet tomorrow. Boarding school, zero tolerance.
How do I defend myself?`,
    community: 'r/ChatGPT',
    author: 'u/gunnarloaf',
    time: '22 hours ago',
    votes: 803,
    comments: 312,
  },
  {
    id: '2',
    title: 'Sakura season in Kyoto is unreal 🌸',
    body: 'Spent sunrise at Philosopher’s Path and it looked like a studio Ghibli frame.',
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    community: 'r/JapanTravel',
    author: 'u/fitshadow',
    time: '4 days ago',
    votes: 3200,
    comments: 982,
  },
  {
    id: '3',
    title: 'JLPT N3 grammar deck that finally clicked for me',
    body: 'Sharing my spaced-repetition cards for tricky grammar like 〜ようにしている and 〜たびに.',
    community: 'r/JLPT',
    author: 'u/kanjikat',
    time: '3 hours ago',
    votes: 512,
    comments: 89,
  },
]

export function FeedList() {
  return (
    <div className="space-y-4">
      {posts.map(post => (
        <Link key={post.id} href={`/posts/${post.id}`} className="block">
          <PostCard post={post} />
        </Link>
      ))}
    </div>
  )
}


import PostCard from '../components/PostCard'
import { posts } from '../data/mockData'
export default function Trending() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Trending Discussions</h1>
      <div className="space-y-4">
        {posts.filter(p => p.trending).map(p => <PostCard key={p.id} post={p} />)}
      </div>
    </div>
  )
}
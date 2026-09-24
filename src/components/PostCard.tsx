import { Link } from 'react-router-dom'
import { Heart, MessageCircle, Share2, Bookmark, TrendingUp } from 'lucide-react'

interface Post {
  id: string
  title: string
  content: string
  author: { username: string; displayName: string; avatar: string; badge: string }
  category: string
  country: string
  community: string
  timestamp: string
  views: number
  likes: number
  replies: number
  shares: number
  trending?: boolean
  tags: string[]
}

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link to={`/post/${post.id}`} className="block bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all p-5 animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-lg">
          {post.author.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-gray-900">{post.author.displayName}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              post.author.badge === 'Creator' ? 'bg-blue-100 text-blue-700' : 
              post.author.badge === 'Verified' ? 'bg-green-100 text-green-700' : 
              'bg-gray-100 text-gray-600'
            }`}>
              {post.author.badge}
            </span>
            <span className="text-xs text-gray-500">· {post.timestamp}</span>
            {post.trending && (
              <span className="flex items-center gap-1 text-xs text-orange-600 font-medium">
                <TrendingUp className="w-3 h-3" /> Trending
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-gray-500">{post.category}</span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-500">{post.community}</span>
          </div>
        </div>
      </div>

      <h3 className="mt-3 font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
        {post.title}
      </h3>
      <p className="mt-2 text-sm text-gray-600 line-clamp-2">{post.content}</p>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {post.tags.map(t => (
          <span key={t} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md">#{t}</span>
        ))}
      </div>

      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
        <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 text-sm">
          <Heart className="w-4 h-4" /> {post.likes}
        </button>
        <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 text-sm">
          <MessageCircle className="w-4 h-4" /> {post.replies}
        </button>
        <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 text-sm">
          <Share2 className="w-4 h-4" /> {post.shares}
        </button>
        <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 text-sm ml-auto">
          <Bookmark className="w-4 h-4" />
        </button>
      </div>
    </Link>
  )
}
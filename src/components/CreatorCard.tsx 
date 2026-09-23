import { Link } from 'react-router-dom'
import { BadgeCheck, Users } from 'lucide-react'

interface Creator {
  id: string
  username: string
  displayName: string
  avatar: string
  country: string
  followers: number
  posts: number
  verified: boolean
  creator: boolean
  bio: string
}

export default function CreatorCard({ creator }: { creator: Creator }) {
  return (
    <Link to={`/creator/${creator.username}`} className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all p-5">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-700 rounded-full flex items-center justify-center text-2xl shadow-md">
          {creator.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold text-gray-900 truncate">{creator.displayName}</h3>
            {creator.verified && <BadgeCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />}
          </div>
          <p className="text-sm text-gray-500">@{creator.username}</p>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{creator.bio}</p>
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {(creator.followers / 1000).toFixed(1)}k followers</span>
            <span>{creator.posts} posts</span>
          </div>
        </div>
      </div>
      <button className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
        Follow
      </button>
    </Link>
  )
}
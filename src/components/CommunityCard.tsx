import { Link } from 'react-router-dom'
import { Users } from 'lucide-react'

interface Community {
  id: string
  name: string
  slug: string
  country: string
  members: number
  posts: number
  icon: string
  color: string
  description: string
}

export default function CommunityCard({ community }: { community: Community }) {
  return (
    <Link to={`/community/${community.slug}`} className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all p-5">
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-12 h-12 ${community.color} rounded-xl flex items-center justify-center text-2xl shadow-sm`}>
          {community.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 truncate">{community.name}</h3>
            {community.country !== 'global' && (
              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md">{community.country}</span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{community.description}</p>
          <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {(community.members / 1000).toFixed(1)}k members</span>
            <span>{(community.posts / 1000).toFixed(1)}k posts</span>
          </div>
        </div>
      </div>
      <button className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
        Join Community
      </button>
    </Link>
  )
}
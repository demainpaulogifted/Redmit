import { useParams, Link } from 'react-router-dom'
import { BadgeCheck, Users, Heart, TrendingUp, DollarSign, Settings } from 'lucide-react'
import PostCard from '../components/PostCard'
import { creators, posts } from '../data/mockData'

export default function CreatorPage() {
  const { username } = useParams()
  const creator = creators.find(c => c.username === username)
  const creatorPosts = posts.filter(p => p.author.username === username)

  if (!creator) return <div className="p-8 text-center">Creator not found</div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
        <div className="h-32 bg-gradient-to-br from-blue-500 to-blue-800"></div>
        <div className="p-6 -mt-12 relative">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-700 rounded-full flex items-center justify-center text-5xl shadow-lg border-4 border-white">{creator.avatar}</div>
          <div className="mt-3">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900">{creator.displayName}</h1>
              {creator.verified && <BadgeCheck className="w-5 h-5 text-blue-500" />}
            </div>
            <p className="text-gray-500 text-sm">@{creator.username}</p>
            <p className="text-gray-700 mt-2">{creator.bio}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {(creator.followers / 1000).toFixed(1)}k followers</span>
              <span>{creator.posts} posts</span>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg">Follow</button>
              <Link to="/creator/settings" className="px-5 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg flex items-center gap-1.5"><Settings className="w-4 h-4" /> Monetization</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1"><TrendingUp className="w-4 h-4" /> Total Views</div>
          <div className="text-2xl font-bold text-gray-900">2.4M</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1"><Heart className="w-4 h-4" /> Total Likes</div>
          <div className="text-2xl font-bold text-gray-900">89.2k</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1"><DollarSign className="w-4 h-4" /> Super Thanks</div>
          <div className="text-2xl font-bold text-gray-900">₦1.2M</div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-4">Posts by {creator.displayName}</h2>
      <div className="space-y-4">
        {creatorPosts.length > 0 ? creatorPosts.map(p => <PostCard key={p.id} post={p} />) : <div className="text-center py-12 text-gray-500">No posts yet.</div>}
      </div>
    </div>
  )
}
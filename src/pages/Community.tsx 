import { useParams } from 'react-router-dom'
import { Users } from 'lucide-react'
import PostCard from '../components/PostCard'
import { communities, posts } from '../data/mockData'
export default function CommunityPage() {
  const { slug } = useParams()
  const community = communities.find(c => c.slug === slug)
  const communityPosts = posts.filter(p => p.community === community?.name)
  if (!community) return <div className="p-8 text-center">Not found</div>
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
        <div className={`h-32 ${community.color}`}></div>
        <div className="p-6 -mt-12 relative">
          <div className={`w-20 h-20 ${community.color} rounded-2xl flex items-center justify-center text-4xl shadow-lg border-4 border-white`}>{community.icon}</div>
          <h1 className="text-2xl font-bold text-gray-900 mt-3">{community.name}</h1>
          <p className="text-gray-600 mt-1">{community.description}</p>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
            <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {(community.members / 1000).toFixed(1)}k members</span>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {communityPosts.map(p => <PostCard key={p.id} post={p} />)}
      </div>
    </div>
  )
}
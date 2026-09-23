import { useState } from 'react'
import { BadgeCheck, MapPin, Calendar, Settings } from 'lucide-react'
import PostCard from '../components/PostCard'
import { posts } from '../data/mockData'

export default function Profile() {
  const [tab, setTab] = useState<'posts' | 'about'>('posts')
  const userPosts = posts.slice(0, 2)

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
        <div className="h-32 bg-gradient-to-br from-blue-500 to-blue-800"></div>
        <div className="p-6 -mt-12 relative">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-700 rounded-full flex items-center justify-center text-5xl shadow-lg border-4 border-white">👨🏾</div>
          <div className="mt-3 flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">DanielTech</h1>
                <BadgeCheck className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-gray-500 text-sm">@danieltech</p>
              <p className="text-gray-700 mt-2 max-w-md">Tech enthusiast. Building cool stuff. Nigeria 🇳🇬</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Nigeria</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Joined Sep 2024</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg">Edit Profile</button>
              <button className="p-2 bg-gray-100 rounded-lg"><Settings className="w-4 h-4 text-gray-600" /></button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {(['posts', 'about'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-3 text-sm font-medium capitalize border-b-2 ${tab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>{t}</button>
        ))}
      </div>

      {tab === 'posts' && <div className="space-y-4">{userPosts.map(p => <PostCard key={p.id} post={p} />)}</div>}
      {tab === 'about' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4">About</h3>
          <div className="space-y-3 text-sm">
            <div><span className="text-gray-500">Username:</span> <span className="font-medium">@danieltech</span></div>
            <div><span className="text-gray-500">Country:</span> <span className="font-medium">Nigeria 🇳🇬</span></div>
            <div><span className="text-gray-500">Reputation:</span> <span className="font-medium">4,520 points</span></div>
          </div>
        </div>
      )}
    </div>
  )
}
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { categories } from '../data/mockData'
import PostCard from '../components/PostCard'
import CategoryCard from '../components/CategoryCard'
import AdBanner from '../components/AdBanner'
import { TrendingUp, Users, Sparkles, Clock } from 'lucide-react'

export default function Home() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<any[]>([])
  const [userInterests, setUserInterests] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'foryou' | 'latest'>('foryou')

  useEffect(() => { if (user) fetchUserInterests(user.id) }, [user])
  useEffect(() => { fetchRealPosts() }, [activeTab, userInterests])

  const fetchUserInterests = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('interests').eq('id', userId).single()
    if (data?.interests) setUserInterests(data.interests)
  }

  const fetchRealPosts = async () => {
    const { data, error } = await supabase.from('posts').select(`id, title, content, created_at, category_id, image_url, profiles:author_id (display_name, avatar, username)`).order('created_at', { ascending: false }).limit(20)

    if (data && !error) {
      const mappedPosts = data.map((p: any) => {
        const profile = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles
        const cat = categories.find(c => c.id === p.category_id)
        return {
          id: p.id, title: p.title, content: p.content, image_url: p.image_url,
          author: { displayName: profile?.display_name || 'Anonymous', avatar: profile?.avatar || '👤', badge: 'Member' },
          category: cat?.name || 'General', community: 'Global', timestamp: new Date(p.created_at).toLocaleDateString(),
          likes: 0, replies: 0, shares: 0, tags: [], trending: false, categoryId: p.category_id
        }
      })

      if (activeTab === 'foryou' && userInterests.length > 0) {
        mappedPosts.sort((a, b) => {
          const aMatches = userInterests.includes(a.category)
          const bMatches = userInterests.includes(b.category)
          if (aMatches && !bMatches) return -1
          if (!aMatches && bMatches) return 1
          return 0
        })
      }
      setPosts(mappedPosts)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="relative overflow-hidden rounded-2xl bg-[#0f172a] p-6 md:p-8 mb-6 md:mb-8">
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-3">{user ? `Welcome back! 👋` : `Real People. Real Conversations.`}</h1>
        <p className="text-slate-300 mb-6 text-sm md:text-base">{user && userInterests.length > 0 ? `We personalized your feed based on your interests: ${userInterests.slice(0, 3).join(', ')}` : `Where money, tech, jobs, and business meet.`}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/create" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg text-center">Start a Discussion</Link>
          <Link to="/categories" className="px-6 py-3 bg-transparent border border-white text-white font-semibold rounded-lg text-center">Explore Categories</Link>
        </div>
      </div>

      <AdBanner />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          
          {/* Feed Tabs */}
          <div className="flex gap-2 border-b border-gray-200">
            <button onClick={() => setActiveTab('foryou')} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'foryou' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> For You</span>
            </button>
            <button onClick={() => setActiveTab('latest')} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'latest' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Latest</span>
            </button>
          </div>

          {activeTab === 'foryou' && user && userInterests.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
              <Sparkles className="w-4 h-4" /><span>Showing posts tailored to your interests first!</span>
            </div>
          )}

          <section>
            <div className="space-y-4">
              {posts.length > 0 ? posts.map(p => <PostCard key={p.id} post={p} />) : (
                <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-gray-200">
                  <p>No posts yet. Be the first to start a discussion!</p>
                  <Link to="/create" className="text-blue-600 font-medium mt-2 inline-block">Create a Post</Link>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="hidden lg:block space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-blue-600" /> Popular Categories</h3>
            <div className="space-y-3">
              {categories.slice(0, 5).map(c => (
                <Link key={c.id} to={`/category/${c.id}`} className="flex items-center gap-3 group p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-8 h-8 ${c.color} rounded-lg flex items-center justify-center text-sm flex-shrink-0`}>{c.icon}</div>
                  <div className="flex-1 min-w-0"><div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 truncate">{c.name}</div></div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
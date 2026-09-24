import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { categories } from '../data/mockData'
import PostCard from '../components/PostCard'
import CategoryCard from '../components/CategoryCard'
import { TrendingUp, Users } from 'lucide-react'

export default function Home() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetchRealPosts()
  }, [])

  const fetchRealPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id, title, content, created_at,
        profiles:author_id (display_name, avatar, username)
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    if (data && !error) {
      const mappedPosts = data.map(p => ({
        id: p.id,
        title: p.title,
        content: p.content,
        author: { 
          displayName: p.profiles?.display_name || 'Anonymous', 
          avatar: p.profiles?.avatar || '', 
          badge: 'Member' 
        },
        category: 'General', 
        community: 'Global',
        timestamp: new Date(p.created_at).toLocaleDateString(),
        likes: 0, replies: 0, shares: 0, tags: [], trending: false
      }))
      setPosts(mappedPosts)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="relative overflow-hidden rounded-2xl bg-[#0f172a] p-6 md:p-8 mb-6 md:mb-8">
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-3">Real People. Real Conversations.</h1>
        <p className="text-slate-300 mb-6 text-sm md:text-base">Where money, tech, jobs, and business meet</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/signup" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg text-center">Join Our Community</Link>
          <Link to="/categories" className="px-6 py-3 bg-transparent border border-white text-white font-semibold rounded-lg text-center">Explore Categories</Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map(c => <CategoryCard key={c.id} category={c} />)}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" /> Latest Discussions
            </h2>
            <div className="space-y-4">
              {posts.length > 0 ? (
                posts.map(p => <PostCard key={p.id} post={p} />)
              ) : (
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
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" /> Recommended Communities
            </h3>
            <div className="text-sm text-gray-500">Communities will appear here as users join.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
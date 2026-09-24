import { Link } from 'react-router-dom'
import { TrendingUp, Users, ArrowRight } from 'lucide-react'
import PostCard from '../components/PostCard'
import CategoryCard from '../components/CategoryCard'
import { categories, posts, communities, trendingTopics } from '../data/mockData'

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="relative overflow-hidden rounded-2xl bg-[#0f172a] p-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Real People. Real Conversations.</h1>
        <p className="text-slate-300 mb-6">Ask questions, share ideas, discover communities, and grow together.</p>
        <div className="flex gap-3">
          <Link to="/signup" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg">Join Redmit</Link>
          <Link to="/categories" className="px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg">Explore Categories</Link>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-blue-600" /> Trending</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {posts.filter(p => p.trending).map(p => <PostCard key={p.id} post={p} />)}
            </div>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Categories</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {categories.map(c => <CategoryCard key={c.id} category={c} />)}
            </div>
          </section>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-600" /> Trending Topics</h3>
            <div className="space-y-3">
              {trendingTopics.map(t => (
                <div key={t.tag} className="flex justify-between">
                  <span className="text-sm font-medium text-blue-600">{t.tag}</span>
                  <span className="text-xs text-gray-500">{(t.posts / 1000).toFixed(1)}k</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-blue-600" /> Communities</h3>
            <div className="space-y-4">
              {communities.map(c => (
                <Link key={c.id} to={`/community/${c.slug}`} className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${c.color} rounded-lg flex items-center justify-center text-lg`}>{c.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{c.name}</div>
                    <div className="text-xs text-gray-500">{(c.members / 1000).toFixed(1)}k members</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

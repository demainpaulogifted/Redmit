import { Link } from 'react-router-dom'
import { TrendingUp, Users, ArrowRight } from 'lucide-react'
import PostCard from '../components/PostCard'
import CategoryCard from '../components/CategoryCard'
import { categories, posts, communities, trendingTopics } from '../data/mockData'

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0f172a] p-6 md:p-8 mb-6 md:mb-8">
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-3">Real People. Real Conversations.</h1>
        <p className="text-slate-300 mb-6 text-sm md:text-base">Where money, tech, jobs, and business meet</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/signup" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg text-center">Join Our Community</Link>
          <Link to="/categories" className="px-6 py-3 bg-transparent border border-white text-white font-semibold rounded-lg text-center">Explore Categories</Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {/* Popular Categories - Show ALL categories */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Popular Categories</h2>
              <Link to="/categories" className="text-sm text-blue-600 font-medium flex items-center gap-1">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map(c => <CategoryCard key={c.id} category={c} />)}
            </div>
          </section>

          {/* Trending Discussions */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" /> Trending Discussions
              </h2>
            </div>
            <div className="space-y-4">
              {posts.filter(p => p.trending).slice(0, 3).map(p => <PostCard key={p.id} post={p} />)}
            </div>
          </section>
        </div>

        {/* Sidebar - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:block space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" /> Trending Topics
            </h3>
            <div className="space-y-3">
              {trendingTopics.map(t => (
                <div key={t.tag} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">{t.tag}</span>
                  <span className="text-xs text-gray-500">{(t.posts / 1000).toFixed(1)}k posts</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" /> Recommended Communities
            </h3>
            <div className="space-y-4">
              {communities.slice(0, 4).map(c => (
                <Link key={c.id} to={`/community/${c.slug}`} className="flex items-center gap-3 group">
                  <div className={`w-10 h-10 ${c.color} rounded-lg flex items-center justify-center text-lg flex-shrink-0`}>{c.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 truncate">{c.name}</div>
                    <div className="text-xs text-gray-500">{(c.members / 1000).toFixed(1)}k members</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Ad Banner */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-5 text-white">
            <div className="text-xs font-medium text-blue-200 mb-1">SPONSORED</div>
            <h4 className="font-bold text-lg mb-1">Build Your Financial Future</h4>
            <p className="text-sm text-blue-100 mb-3">Save more. Earn more. Live better.</p>
            <button className="px-4 py-2 bg-white text-blue-700 font-semibold text-sm rounded-lg hover:bg-blue-50 transition-colors">Learn More</button>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { categories } from '../data/mockData'
import PostCard from '../components/PostCard'
import { Users, Sparkles, Clock, Loader2 } from 'lucide-react'

// 🔄 Detect a manual page reload / pull-to-refresh
const isReload = () => {
  try {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    return nav?.type === 'reload'
  } catch {
    return false
  }
}

const shuffleArray = (array: any[]) => {
  const newArr = [...array]
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArr[i], newArr[j]] = [newArr[j], newArr[i]]
  }
  return newArr
}

export default function Home() {
  const { user } = useAuth()
  const location = useLocation()
  const [feed, setFeed] = useState<any[]>([])
  const [ads, setAds] = useState<any[]>([])
  const [userInterests, setUserInterests] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'foryou' | 'latest'>('foryou')
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const lastPostDate = useRef<string | null>(null)
  const observerTarget = useRef(null)

  // 🧠 SESSION CACHE (v2 keys discard old poisoned caches)
  const CACHE_KEY = `redmit_feed_v2_${activeTab}`
  const SCROLL_KEY = `redmit_scroll_v2_${activeTab}`
  const CACHE_TS_KEY = `redmit_feed_ts_${activeTab}`
  const CACHE_MAX_AGE = 30 * 60 * 1000 // Feed cache expires after 30 minutes

  // Restore scroll position when returning from a post
  useEffect(() => {
    const savedScroll = sessionStorage.getItem(SCROLL_KEY)
    if (savedScroll && feed.length > 0) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScroll))
      }, 100)
    }
  }, [feed, location])

  // Save scroll position while scrolling
  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem(SCROLL_KEY, window.scrollY.toString())
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (user) {
      supabase.from('profiles').select('interests').eq('id', user.id).single().then(({ data }) => {
        if (data?.interests) setUserInterests(data.interests)
      })
    }
  }, [user])

  // Initial Load: fresh cache = stable feed | reload/expired/new = fresh fetch
  useEffect(() => {
    const cachedFeed = sessionStorage.getItem(CACHE_KEY)
    const cachedTs = sessionStorage.getItem(CACHE_TS_KEY)
    const isFresh = cachedTs && (Date.now() - parseInt(cachedTs)) < CACHE_MAX_AGE && !isReload()

    if (cachedFeed && isFresh) {
      // 🧠 LOAD FROM MEMORY (No reshuffling on back navigation!)
      const parsed = JSON.parse(cachedFeed)
      setFeed(parsed)
      setHasMore(true)
      // Restore pagination cursor so "load more" doesn't refetch page 1
      const lastPost = [...parsed].reverse().find((x: any) => !x.isAd && x.createdAt)
      if (lastPost) lastPostDate.current = lastPost.createdAt
    } else {
      sessionStorage.removeItem(CACHE_KEY)
      sessionStorage.removeItem(CACHE_TS_KEY)
      setFeed([])
      setHasMore(true)
      lastPostDate.current = null
      fetchPosts(true)
      fetchAds()
    }
  }, [activeTab])

  // Save feed + timestamp to memory whenever it updates
  useEffect(() => {
    if (feed.length > 0) {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(feed))
      sessionStorage.setItem(CACHE_TS_KEY, Date.now().toString())
    }
  }, [feed])

  const fetchAds = async () => {
    const { data } = await supabase.from('ads').select('*').eq('is_active', true)
    if (data) {
      const clickedAds = JSON.parse(localStorage.getItem('redmit_clicked_ads') || '[]')
      const available = data.filter((ad: any) => !clickedAds.includes(ad.id))
      setAds(available)
    }
  }

  const fetchPosts = useCallback(async (isInitial = false) => {
    if (loading || (!hasMore && !isInitial)) return
    setLoading(true)

    let query = supabase
      .from('posts')
      .select(`id, title, content, created_at, category_id, image_url, likes_count, replies_count, profiles:author_id (display_name, avatar, username)`)
      .order('created_at', { ascending: false })
      .limit(20)

    if (!isInitial && lastPostDate.current) {
      query = query.lt('created_at', lastPostDate.current)
    }

    const { data: postData } = await query

    if (postData && postData.length > 0) {
      lastPostDate.current = postData[postData.length - 1].created_at

      let mappedPosts = postData.map((p: any) => {
        const profile = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles
        const cat = categories.find(c => c.id === p.category_id)

        const likes = p.likes_count || 0
        const replies = p.replies_count || 0
        const hoursOld = (Date.now() - new Date(p.created_at).getTime()) / 3600000
        const recencyScore = Math.max(0, 100 - hoursOld)
        const viralityScore = (likes * 3) + (replies * 5) + recencyScore

        return {
          id: p.id, title: p.title, content: p.content, image_url: p.image_url,
          likes, replies, shares: 0, categoryId: p.category_id, createdAt: p.created_at,
          author: { displayName: profile?.display_name || 'Anonymous', avatar: profile?.avatar || '', badge: 'Member' },
          category: cat?.name || 'General', community: 'Global', timestamp: new Date(p.created_at).toLocaleDateString(),
          viralityScore
        }
      })

      // 🚫 NEVER show the same question twice in the feed
      const seenTitles = new Set<string>()
      mappedPosts = mappedPosts.filter(p => {
        const key = p.title.trim().toLowerCase()
        if (seenTitles.has(key)) return false
        seenTitles.add(key)
        return true
      })

      // 🧠 SMART SHUFFLE (Only on fresh fetch, never on scroll/back)
      if (activeTab === 'foryou' && isInitial) {
        mappedPosts.sort((a, b) => b.viralityScore - a.viralityScore)
        const topTier = mappedPosts.slice(0, Math.floor(mappedPosts.length * 0.7))
        const rest = mappedPosts.slice(Math.floor(mappedPosts.length * 0.7))
        mappedPosts = [...shuffleArray(topTier), ...rest]
      }

      // Blend ads invisibly (every 5th position)
      if (ads.length > 0) {
        const clickedAds = JSON.parse(localStorage.getItem('redmit_clicked_ads') || '[]')
        const availableAds = ads.filter((ad: any) => !clickedAds.includes(ad.id))

        for (let i = 4; i < mappedPosts.length; i += 5) {
          if (availableAds.length > 0) {
            const randomAd = availableAds[Math.floor(Math.random() * availableAds.length)]
            mappedPosts.splice(i, 0, { ...randomAd, isAd: true })
          }
        }
      }

      setFeed(prev => {
        if (isInitial) return mappedPosts
        // 🛡️ Never append duplicates when loading more
        const existing = new Set(prev.map(x => x.id))
        const fresh = mappedPosts.filter(x => !existing.has(x.id))
        return [...prev, ...fresh]
      })
    } else {
      setHasMore(false)
    }
    setLoading(false)
  }, [loading, hasMore, activeTab, ads])

  // 🔄 INVISIBLE INFINITE SCROLL
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchPosts()
        }
      },
      { threshold: 0.1 }
    )

    if (observerTarget.current) observer.observe(observerTarget.current)
    return () => { if (observerTarget.current) observer.unobserve(observerTarget.current) }
  }, [fetchPosts, hasMore, loading])

  const logAdView = (adId: string) => {
    const seenAds = JSON.parse(localStorage.getItem('redmit_seen_ads') || '[]')
    if (!seenAds.includes(adId)) {
      seenAds.push(adId)
      localStorage.setItem('redmit_seen_ads', JSON.stringify(seenAds))
      supabase.from('ad_impressions').insert([{ user_id: user?.id || null, ad_id: adId, action: 'view' }])
    }
  }

  const handleAdClick = (e: React.MouseEvent, ad: any) => {
    e.preventDefault()
    const clickedAds = JSON.parse(localStorage.getItem('redmit_clicked_ads') || '[]')
    if (!clickedAds.includes(ad.id)) {
      clickedAds.push(ad.id)
      localStorage.setItem('redmit_clicked_ads', JSON.stringify(clickedAds))
    }
    supabase.from('ad_impressions').insert([{ user_id: user?.id || null, ad_id: ad.id, action: 'click' }])
    window.open(ad.link_url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0f172a] p-6 md:p-8 mb-6 md:mb-8">
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-3">
          {user ? `Welcome back! 👋` : `Real People. Real Conversations.`}
        </h1>
        <p className="text-slate-300 mb-6 text-sm md:text-base">
          {user && userInterests.length > 0
            ? `We personalized your feed based on your interests: ${userInterests.slice(0, 3).join(', ')}`
            : `Where money, tech, jobs, and business meet.`}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/create" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg text-center">Start a Discussion</Link>
          <Link to="/categories" className="px-6 py-3 bg-transparent border border-white text-white font-semibold rounded-lg text-center">Explore Categories</Link>
        </div>
      </div>

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

          {/* 🧠 STABLE INFINITE FEED WITH BLENDED ADS */}
          <div className="space-y-4">
            {feed.length > 0 ? feed.map((item: any) => {
              if (item.isAd) {
                logAdView(item.id)
                return (
                  <div key={`ad-${item.id}`} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-gray-50 px-4 py-1.5 border-b border-gray-200 flex justify-between items-center">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Sponsored</span>
                    </div>
                    <div onClick={(e) => handleAdClick(e, item)} className="block p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                      {item.image_url && <img src={item.image_url} alt={item.title} className="w-full h-40 md:h-48 object-cover rounded-lg mb-3" />}
                      <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                      <span className="inline-block px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg">Learn More →</span>
                    </div>
                  </div>
                )
              }
              return <PostCard key={item.id} post={item} />
            }) : (
              <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-gray-200">
                <p>No posts yet. Be the first to start a discussion!</p>
                <Link to="/create" className="text-blue-600 font-medium mt-2 inline-block">Create a Post</Link>
              </div>
            )}
          </div>

          {/* INVISIBLE LOADING TRIGGER */}
          <div ref={observerTarget} className="flex justify-center py-8">
            {loading && (
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" /> Discovering more...
              </div>
            )}
            {!hasMore && feed.length > 0 && (
              <p className="text-gray-400 text-sm">You're all caught up! 🎉</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" /> Popular Categories
            </h3>
            <div className="space-y-3">
              {categories.slice(0, 5).map(c => (
                <Link key={c.id} to={`/category/${c.id}`} className="flex items-center gap-3 group p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-8 h-8 ${c.color} rounded-lg flex items-center justify-center text-sm flex-shrink-0`}>{c.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 truncate">{c.name}</div>
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
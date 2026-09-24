import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, MessageCircle, Share2, Bookmark, TrendingUp } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import Toast from './Toast'

interface PostCardProps {
  post: any
}

export default function PostCard({ post }: PostCardProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [likes, setLikes] = useState(post.likes_count || 0)
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'success' | 'warning'; redirect?: string } | null>(null)

  useEffect(() => {
    if (user) {
      checkIfLiked()
      checkIfBookmarked()
    }
  }, [user, post.id])

  const checkIfLiked = async () => {
    const { data } = await supabase.from('post_likes').select('*').eq('user_id', user?.id).eq('post_id', post.id).single()
    setLiked(!!data)
  }

  const checkIfBookmarked = async () => {
    const { data } = await supabase.from('bookmarks').select('*').eq('user_id', user?.id).eq('post_id', post.id).single()
    setBookmarked(!!data)
  }

  const requireAuth = (action: string) => {
    setToast({ message: `Please log in to ${action}`, type: 'info', redirect: '/login' })
  }

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    if (!user) { requireAuth('like posts'); return }
    if (loading) return
    setLoading(true)
    
    if (liked) {
      await supabase.from('post_likes').delete().eq('user_id', user.id).eq('post_id', post.id)
      setLiked(false); setLikes(likes - 1)
    } else {
      await supabase.from('post_likes').insert([{ user_id: user.id, post_id: post.id }])
      setLiked(true); setLikes(likes + 1)
    }
    setLoading(false)
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    const shareUrl = `${window.location.origin}/post/${post.id}`
    
    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, text: post.content, url: shareUrl })
      } catch (err) {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(shareUrl)
      setToast({ message: 'Link copied to clipboard!', type: 'success' })
    }
  }

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    if (!user) { requireAuth('save posts'); return }
    
    if (bookmarked) {
      await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('post_id', post.id)
      setBookmarked(false)
      setToast({ message: 'Removed from bookmarks', type: 'info' })
    } else {
      await supabase.from('bookmarks').insert([{ user_id: user.id, post_id: post.id }])
      setBookmarked(true)
      setToast({ message: 'Saved to bookmarks!', type: 'success' })
    }
  }

  const isImageAvatar = post.author?.avatar && post.author.avatar.startsWith('http')

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} redirect={toast.redirect} onClose={() => setToast(null)} />}
      
      <Link to={`/post/${post.id}`} className="block bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg flex-shrink-0 overflow-hidden">
            {isImageAvatar ? <img src={post.author.avatar} alt="" className="w-full h-full object-cover" /> : (post.author?.avatar || '👤')}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm text-gray-900">{post.author?.displayName || 'Anonymous'}</span>
              <span className="text-xs text-gray-500">· {post.timestamp}</span>
              {post.trending && <span className="text-xs text-orange-600 font-medium flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Trending</span>}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">{post.category} · {post.community}</div>
          </div>
        </div>

        <h3 className="mt-3 font-semibold text-gray-900 line-clamp-2">{post.title}</h3>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{post.content}</p>

        {post.image_url && post.image_url.startsWith('http') && (
          <img src={post.image_url} alt="Post" className="w-full max-h-48 object-cover rounded-lg mt-3" onError={(e) => (e.currentTarget.style.display = 'none')} />
        )}

        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
          <button onClick={handleLike} disabled={loading} className={`flex items-center gap-1 text-sm font-medium transition-colors ${liked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'}`}>
            <Heart className={`w-4 h-4 ${liked ? 'fill-red-600' : ''}`} /> {likes}
          </button>
          <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600 text-sm font-medium">
            <MessageCircle className="w-4 h-4" /> {post.replies_count || 0}
          </button>
          <button onClick={handleShare} className="flex items-center gap-1 text-gray-500 hover:text-green-600 text-sm font-medium">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button onClick={handleBookmark} className={`ml-auto flex items-center gap-1 text-sm font-medium transition-colors ${bookmarked ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}>
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-blue-600' : ''}`} /> 
          </button>
        </div>
      </Link>
    </>
  )
}
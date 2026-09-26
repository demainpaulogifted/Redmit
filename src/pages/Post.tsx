import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { ArrowLeft, Heart, MessageCircle, Share2, Bookmark, ThumbsUp, Image as ImageIcon, Gift } from 'lucide-react'
import Toast from '../components/Toast'
import SuperThanks from '../components/SuperThanks'
import SEO from '../components/SEO'

// ================= QUALITY & ANTI-SPAM ENGINE =================
const SUPER_THANKS_MIN_WORDS = 1000  // Words an answer needs to earn Super Thanks (change here if needed)
const MIN_UNIQUE_RATIO = 0.4         // 40% of words must be unique (blocks copy-paste spam)
const MIN_COMMENT_CHARS = 30
const MIN_ANSWER_WORDS = 100
const RATE_LIMIT_SECONDS = 60
const MAX_LINKS = 2
const SPAM_PATTERNS = [
  /click here/i, /whatsapp/i, /telegram/i, /crypto giveaway/i, /free money/i,
  /invest now/i, /dm me/i, /contact me on/i, /claim your/i, /winner/i
]

function analyzeText(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean)
  const unique = new Set(words.map(w => w.toLowerCase().replace(/[^a-z0-9']/gi, '')).filter(Boolean))
  const capsLetters = (text.match(/[A-Z]/g) || []).length
  const allLetters = (text.match(/[A-Za-z]/g) || []).length
  return {
    wordCount: words.length,
    uniqueWords: unique.size,
    uniqueRatio: words.length ? unique.size / words.length : 0,
    capsRatio: allLetters ? capsLetters / allLetters : 0,
    links: (text.match(/https?:\/\//gi) || []).length
  }
}

function spamReason(text: string, isAnswer: boolean): string | null {
  const a = analyzeText(text)
  if (isAnswer && a.wordCount < MIN_ANSWER_WORDS) return `Answers must be at least ${MIN_ANSWER_WORDS} words of real value.`
  if (!isAnswer && text.trim().length < MIN_COMMENT_CHARS) return `Comments must be at least ${MIN_COMMENT_CHARS} characters.`
  if (a.uniqueRatio < MIN_UNIQUE_RATIO) return 'This reply looks repetitive. Add real, unique points.'
  if (a.capsRatio > 0.7 && text.length > 20) return 'Please avoid writing in ALL CAPS.'
  if (a.links > MAX_LINKS) return `Too many links. Maximum ${MAX_LINKS} links per reply.`
  for (const p of SPAM_PATTERNS) if (p.test(text)) return 'This reply looks like spam or advertisement and was blocked.'
  return null
}

function qualifiesForSuperThanks(text: string): boolean {
  const a = analyzeText(text)
  return a.wordCount >= SUPER_THANKS_MIN_WORDS && a.uniqueRatio >= MIN_UNIQUE_RATIO
}
// ==============================================================

export default function PostPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [post, setPost] = useState<any>(null)
  const [replies, setReplies] = useState<any[]>([])
  const [replyType, setReplyType] = useState<'comment' | 'answer'>('comment')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [agreesToTerms, setAgreesToTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'success' | 'warning'; redirect?: string } | null>(null)
  const [showSuperThanks, setShowSuperThanks] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null)

  const requireAuth = (action: string) => {
    setToast({ message: `Please log in to ${action}`, type: 'info', redirect: '/login' })
  }

  useEffect(() => {
    if (id) { fetchPost(); fetchReplies() }
  }, [id])

  useEffect(() => {
    if (user && post) { checkIfLiked(); checkIfBookmarked() }
  }, [user, post])

  const fetchPost = async () => {
    const { data } = await supabase.from('posts').select('*, profiles:author_id(display_name, avatar, username)').eq('id', id).single()
    if (data) { setPost(data); setLikes(data.likes_count || 0) }
  }

  const fetchReplies = async () => {
    const { data } = await supabase
      .from('replies')
      .select('*, profiles:author_id(display_name, avatar, username, payment_url, super_thanks_enabled)')
      .eq('post_id', id)
      .order('created_at', { ascending: true })
    if (data) setReplies(data)
  }

  const checkIfLiked = async () => {
    const { data } = await supabase.from('post_likes').select('*').eq('user_id', user?.id).eq('post_id', id).single()
    setLiked(!!data)
  }

  const checkIfBookmarked = async () => {
    const { data } = await supabase.from('bookmarks').select('*').eq('user_id', user?.id).eq('post_id', id).single()
    setBookmarked(!!data)
  }

  const handleLike = async () => {
    if (!user) { requireAuth('like posts'); return }
    if (liked) {
      await supabase.from('post_likes').delete().eq('user_id', user.id).eq('post_id', id)
      setLiked(false); setLikes(likes - 1)
    } else {
      await supabase.from('post_likes').insert([{ user_id: user.id, post_id: id }])
      setLiked(true); setLikes(likes + 1)
    }
  }

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/post/${id}`
    if (navigator.share) {
      try { await navigator.share({ title: post?.title, text: post?.content, url: shareUrl }) } catch (err) {}
    } else {
      navigator.clipboard.writeText(shareUrl)
      setToast({ message: 'Link copied to clipboard!', type: 'success' })
    }
  }

  const handleBookmark = async () => {
    if (!user) { requireAuth('save posts'); return }
    if (bookmarked) {
      await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('post_id', id)
      setBookmarked(false); setToast({ message: 'Removed from bookmarks', type: 'info' })
    } else {
      await supabase.from('bookmarks').insert([{ user_id: user.id, post_id: id }])
      setBookmarked(true); setToast({ message: 'Saved to bookmarks!', type: 'success' })
    }
  }

  const handleSubmitReply = async () => {
    if (!user) { requireAuth('reply to posts'); return }
    if (!content.trim()) return setToast({ message: 'Please write something first', type: 'warning' })
    if (replyType === 'answer' && !agreesToTerms) return setToast({ message: 'You must agree to the quality pledge', type: 'warning' })

    // 🛡️ ANTI-SPAM CHECK
    const spam = spamReason(content, replyType === 'answer')
    if (spam) return setToast({ message: spam, type: 'warning' })

    // ⏱️ RATE LIMIT + DUPLICATE CHECK
    const { data: recent } = await supabase
      .from('replies')
      .select('created_at, content')
      .eq('author_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)

    if (recent && recent.length > 0) {
      const secsSince = (Date.now() - new Date(recent[0].created_at).getTime()) / 1000
      if (secsSince < RATE_LIMIT_SECONDS) {
        return setToast({ message: `Slow down! Wait ${Math.ceil(RATE_LIMIT_SECONDS - secsSince)}s before posting again.`, type: 'warning' })
      }
      if (recent[0].content.trim() === content.trim()) {
        return setToast({ message: 'You already posted this exact reply.', type: 'warning' })
      }
    }

    setLoading(true)
    const { error } = await supabase.from('replies').insert([{ post_id: id, author_id: user.id, content, image_url: imageUrl, reply_type: replyType }])
    setLoading(false)

    if (error) setToast({ message: 'Error: ' + error.message, type: 'warning' })
    else {
      setContent(''); setImageUrl(''); setAgreesToTerms(false)
      setToast({ message: `${replyType === 'answer' ? 'Answer' : 'Comment'} posted successfully!`, type: 'success' })
      fetchReplies(); fetchPost()
    }
  }

  const openSuperThanks = (reply: any) => {
    if (!user) { requireAuth('send Super Thanks'); return }
    if (!reply.profiles?.payment_url) {
      setToast({ message: `${reply.profiles?.display_name || 'This creator'} hasn't set up Super Thanks yet.`, type: 'info' })
      return
    }
    setSelectedAnswer(reply)
    setShowSuperThanks(true)
  }

  if (!post) return <div className="p-8 text-center">Loading...</div>

  const isImageAvatar = post.profiles?.avatar && post.profiles.avatar.startsWith('http')
  const currentWords = analyzeText(content).wordCount

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
      <SEO title={post.title} description={post.content.substring(0, 150) + '...'} url={`${window.location.origin}/post/${id}`} />
      {toast && <Toast message={toast.message} type={toast.type} redirect={toast.redirect} onClose={() => setToast(null)} />}
      <SuperThanks
        open={showSuperThanks}
        onClose={() => setShowSuperThanks(false)}
        creator={selectedAnswer?.profiles?.display_name || 'Creator'}
        paymentUrl={selectedAnswer?.profiles?.payment_url}
        isEligible={selectedAnswer?.profiles?.super_thanks_enabled || false}
      />

      <Link to="/" className="flex items-center gap-2 text-sm text-gray-600 mb-4"><ArrowLeft className="w-4 h-4" /> Back</Link>

      <article className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
            {isImageAvatar ? <img src={post.profiles.avatar} alt="" className="w-full h-full object-cover" /> : (post.profiles?.avatar || '👤')}
          </div>
          <div>
            <span className="font-semibold text-gray-900">{post.profiles?.display_name || 'Anonymous'}</span>
            <div className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString()}</div>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">{post.title}</h1>
        <p className="text-gray-700 leading-relaxed mb-4">{post.content}</p>
        {post.image_url && post.image_url.startsWith('http') && (
          <img src={post.image_url} alt="Post" className="w-full max-h-96 object-cover rounded-xl mb-4" onError={(e) => (e.currentTarget.style.display = 'none')} />
        )}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
          <button onClick={handleLike} className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${liked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'}`}>
            <Heart className={`w-5 h-5 ${liked ? 'fill-red-600' : ''}`} /> {likes} Likes
          </button>
          <button className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 text-sm font-medium">
            <MessageCircle className="w-5 h-5" /> {post.replies_count || 0} Replies
          </button>
          <button onClick={handleShare} className="flex items-center gap-1.5 text-gray-600 hover:text-green-600 text-sm font-medium">
            <Share2 className="w-5 h-5" /> Share
          </button>
          <button onClick={handleBookmark} className={`flex items-center gap-1.5 text-sm font-medium ml-auto transition-colors ${bookmarked ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>
            <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-blue-600' : ''}`} /> {bookmarked ? 'Saved' : 'Save'}
          </button>
        </div>
      </article>

      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
        <div className="flex gap-2 mb-3">
          <button onClick={() => setReplyType('comment')} className={`flex-1 py-2 rounded-lg text-sm font-medium ${replyType === 'comment' ? 'bg-gray-200 text-gray-900' : 'text-gray-500'}`}>💬 Comment</button>
          <button onClick={() => setReplyType('answer')} className={`flex-1 py-2 rounded-lg text-sm font-medium ${replyType === 'answer' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}>📝 Write Answer</button>
        </div>
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder={replyType === 'answer' ? "Share your detailed, high-quality answer (1,000+ words qualifies for Super Thanks)..." : "Ask a follow-up question..."} rows={replyType === 'answer' ? 6 : 3} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none" />

        {/* Live quality counter for answers */}
        {replyType === 'answer' && (
          <div className={`text-xs mt-1.5 font-medium ${qualifiesForSuperThanks(content) ? 'text-green-600' : 'text-gray-500'}`}>
            {currentWords} / {SUPER_THANKS_MIN_WORDS} words
            {qualifiesForSuperThanks(content) ? ' ✅ This answer qualifies for Super Thanks!' : ' — write a detailed, valuable answer to enable Super Thanks'}
          </div>
        )}

        <div className="mt-3">
          <label className="text-xs font-medium text-gray-500 mb-1.5 block flex items-center gap-1.5"><ImageIcon className="w-3 h-3" /> Image URL (Optional)</label>
          <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm mb-3" />
        </div>
        {replyType === 'answer' && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-2">
            <input type="checkbox" checked={agreesToTerms} onChange={(e) => setAgreesToTerms(e.target.checked)} className="mt-1 w-4 h-4 text-blue-600 rounded" />
            <span className="text-xs text-blue-800">I confirm this is original, high-quality content. I agree it may be indexed by search engines and used to train AI models.</span>
          </div>
        )}
        <div className="flex justify-end mt-3">
          <button onClick={handleSubmitReply} disabled={loading} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-sm font-medium rounded-lg">
            {loading ? 'Posting...' : (replyType === 'answer' ? 'Publish Answer' : 'Post Comment')}
          </button>
        </div>
      </div>

      <h2 className="text-lg font-bold text-gray-900 mb-4">Answers & Comments ({replies.length})</h2>
      <div className="space-y-4">
        {replies.map((r: any) => {
          const isAnswer = r.reply_type === 'answer'
          const deservesThanks = isAnswer && qualifiesForSuperThanks(r.content)
          const replyAvatarIsImage = r.profiles?.avatar && r.profiles.avatar.startsWith('http')
          return (
            <div key={r.id} className={`rounded-xl border p-5 ${isAnswer ? 'bg-blue-50/30 border-blue-200' : 'bg-white border-gray-200'}`}>
              {isAnswer && (
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-blue-100">
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-blue-700 uppercase">Top Answer</span>
                  </div>
                  {/* Super Thanks ONLY on answers that pass the 1,000-word quality gate */}
                  {deservesThanks && (
                    <button onClick={() => openSuperThanks(r)} className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full hover:shadow-lg transition-all">
                      <Gift className="w-3.5 h-3.5" /> Super Thanks
                    </button>
                  )}
                </div>
              )}
              <div className="flex items-start gap-3">
                <Link to={`/creator/${r.profiles?.username || 'user'}`} className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg flex-shrink-0 overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all">
                  {replyAvatarIsImage ? <img src={r.profiles.avatar} alt="" className="w-full h-full object-cover" /> : (r.profiles?.avatar || '👤')}
                </Link>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Link to={`/creator/${r.profiles?.username || 'user'}`} className="font-semibold text-sm text-gray-900 hover:text-blue-600">
                      {r.profiles?.display_name || 'Anonymous'}
                    </Link>
                    <span className="text-xs text-gray-500">· {new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className={`mt-2 whitespace-pre-line ${isAnswer ? 'text-gray-800 text-base' : 'text-gray-600 text-sm'}`}>{r.content}</p>
                  {r.image_url && r.image_url.startsWith('http') && (
                    <img src={r.image_url} alt="Reply" className="w-full max-h-64 object-cover rounded-lg mt-3" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
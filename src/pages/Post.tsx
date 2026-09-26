import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { ArrowLeft, Heart, MessageCircle, Share2, Bookmark, ThumbsUp, Image as ImageIcon, Gift, CornerDownRight, Sparkles, Clock } from 'lucide-react'
import Toast from '../components/Toast'
import SuperThanks from '../components/SuperThanks'
import SEO from '../components/SEO'

// ================= QUALITY & ANTI-SPAM ENGINE =================
const SUPER_THANKS_MIN_WORDS = 1000
const MIN_UNIQUE_RATIO = 0.4
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

function answerScore(r: any): number {
  const words = (r.content || '').trim().split(/\s+/).filter(Boolean).length
  const hours = (Date.now() - new Date(r.created_at).getTime()) / 3600000
  const recency = (Math.max(0, 48 - hours) / 48) * 20
  return (r.likes_count || 0) * 3 + (Math.min(words, 2000) / 100) * 5 + recency
}
// ==============================================================

export default function PostPage() {
  const { slug } = useParams()
  const { user } = useAuth()
  const [post, setPost] = useState<any>(null)
  const [replies, setReplies] = useState<any[]>([])
  const [sortedAnswers, setSortedAnswers] = useState<any[]>([])
  const [answerSort, setAnswerSort] = useState<'best' | 'new'>('best')
  const [replyType, setReplyType] = useState<'comment' | 'answer'>('comment')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [agreesToTerms, setAgreesToTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [replyCounts, setReplyCounts] = useState<Record<string, number>>({})
  const [likedReplies, setLikedReplies] = useState<Record<string, boolean>>({})
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyDraft, setReplyDraft] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'success' | 'warning'; redirect?: string } | null>(null)
  const [showSuperThanks, setShowSuperThanks] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null)

  const requireAuth = (action: string) => {
    setToast({ message: `Please log in to ${action}`, type: 'info', redirect: '/login' })
  }

  useEffect(() => {
    if (slug) {
      fetchPost()
    }
  }, [slug])

  useEffect(() => {
    if (post?.id) {
      fetchReplies()
    }
  }, [post?.id])

  useEffect(() => {
    if (user && post?.id) {
      checkIfLiked()
      checkIfBookmarked()
    }
  }, [user, post?.id])

  useEffect(() => {
    const answers = replies.filter(r => r.reply_type === 'answer' && !r.parent_id)
    if (answerSort === 'best') {
      const keyed = answers.map(r => ({ r, key: answerScore(r) + Math.random() * 8 }))
      keyed.sort((a, b) => b.key - a.key)
      setSortedAnswers(keyed.map(k => k.r))
    } else {
      setSortedAnswers([...answers].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()))
    }
  }, [replies, answerSort])

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles:author_id(display_name, avatar, username)')
      .eq('slug', slug)
      .single()

    if (error || !data) {
      setPost(null)
      return
    }
    setPost(data)
    setLikes(data.likes_count || 0)
  }

  const fetchReplies = async () => {
    if (!post?.id) return
    const { data } = await supabase
      .from('replies')
      .select('*, profiles:author_id(display_name, avatar, username, payment_url, super_thanks_enabled)')
      .eq('post_id', post.id)
      .order('created_at', { ascending: true })

    if (data) {
      setReplies(data)
      setReplyCounts(Object.fromEntries(data.map((r: any) => [r.id, r.likes_count || 0])))
      if (user) {
        const { data: rl } = await supabase.from('reply_likes').select('reply_id').eq('user_id', user.id)
        setLikedReplies(Object.fromEntries((rl || []).map((r: any) => [r.reply_id, true])))
      }
    }
  }

  const checkIfLiked = async () => {
    if (!post?.id || !user) return
    const { data } = await supabase
      .from('post_likes')
      .select('*')
      .eq('user_id', user.id)
      .eq('post_id', post.id)
      .single()
    setLiked(!!data)
  }

  const checkIfBookmarked = async () => {
    if (!post?.id || !user) return
    const { data } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', user.id)
      .eq('post_id', post.id)
      .single()
    setBookmarked(!!data)
  }

  const checkRateLimit = async (newContent: string) => {
    const { data: recent } = await supabase
      .from('replies')
      .select('created_at, content')
      .eq('author_id', user!.id)
      .order('created_at', { ascending: false })
      .limit(1)

    if (recent && recent.length > 0) {
      const secs = (Date.now() - new Date(recent[0].created_at).getTime()) / 1000
      if (secs < RATE_LIMIT_SECONDS) return `Slow down! Wait ${Math.ceil(RATE_LIMIT_SECONDS - secs)}s before posting again.`
      if (recent[0].content.trim() === newContent.trim()) return 'You already posted this exact reply.'
    }
    return null
  }

  const handleLike = async () => {
    if (!user) { requireAuth('like posts'); return }
    if (!post?.id) return

    if (liked) {
      await supabase.from('post_likes').delete().eq('user_id', user.id).eq('post_id', post.id)
      setLiked(false)
      setLikes(prev => Math.max(0, prev - 1))
    } else {
      await supabase.from('post_likes').insert([{ user_id: user.id, post_id: post.id }])
      setLiked(true)
      setLikes(prev => prev + 1)
    }
  }

  const handleLikeReply = async (r: any) => {
    if (!user) { requireAuth('like replies'); return }
    const isLiked = !!likedReplies[r.id]
    if (isLiked) {
      await supabase.from('reply_likes').delete().eq('user_id', user.id).eq('reply_id', r.id)
      setLikedReplies(prev => ({ ...prev, [r.id]: false }))
      setReplyCounts(prev => ({ ...prev, [r.id]: Math.max(0, (prev[r.id] || 0) - 1) }))
    } else {
      await supabase.from('reply_likes').insert([{ user_id: user.id, reply_id: r.id }])
      setLikedReplies(prev => ({ ...prev, [r.id]: true }))
      setReplyCounts(prev => ({ ...prev, [r.id]: (prev[r.id] || 0) + 1) }))
    }
  }

  const handleShare = async () => {
    const shareUrl = `\( {window.location.origin}/post/ \){post?.slug || slug}`
    if (navigator.share) {
      try {
        await navigator.share({ title: post?.title, text: post?.content, url: shareUrl })
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(shareUrl)
      setToast({ message: 'Link copied to clipboard!', type: 'success' })
    }
  }

  const handleBookmark = async () => {
    if (!user) { requireAuth('save posts'); return }
    if (!post?.id) return

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

  const handleSubmitReply = async () => {
    if (!user) { requireAuth('reply to posts'); return }
    if (!post?.id) return
    if (!content.trim()) return setToast({ message: 'Please write something first', type: 'warning' })
    if (replyType === 'answer' && !agreesToTerms) return setToast({ message: 'You must agree to the quality pledge', type: 'warning' })

    const spam = spamReason(content, replyType === 'answer')
    if (spam) return setToast({ message: spam, type: 'warning' })

    const rate = await checkRateLimit(content)
    if (rate) return setToast({ message: rate, type: 'warning' })

    setLoading(true)
    const { error } = await supabase.from('replies').insert([{
      post_id: post.id,
      author_id: user.id,
      content,
      image_url: imageUrl || null,
      reply_type: replyType
    }])
    setLoading(false)

    if (error) {
      setToast({ message: 'Error: ' + error.message, type: 'warning' })
    } else {
      setContent('')
      setImageUrl('')
      setAgreesToTerms(false)
      setToast({ message: `${replyType === 'answer' ? 'Answer' : 'Comment'} posted successfully!`, type: 'success' })
      fetchReplies()
      fetchPost()
    }
  }

  const handleSubmitNested = async (parentId: string) => {
    if (!user) { requireAuth('reply'); return }
    if (!post?.id) return
    if (!replyDraft.trim()) return setToast({ message: 'Please write something first', type: 'warning' })

    const spam = spamReason(replyDraft, false)
    if (spam) return setToast({ message: spam, type: 'warning' })

    const rate = await checkRateLimit(replyDraft)
    if (rate) return setToast({ message: rate, type: 'warning' })

    const { error } = await supabase.from('replies').insert([{
      post_id: post.id,
      author_id: user.id,
      content: replyDraft,
      reply_type: 'comment',
      parent_id: parentId
    }])

    if (error) {
      setToast({ message: 'Error: ' + error.message, type: 'warning' })
    } else {
      setReplyDraft('')
      setReplyingTo(null)
      setToast({ message: 'Reply posted!', type: 'success' })
      fetchReplies()
      fetchPost()
    }
  }

  const openSuperThanks = (reply: any) => {
    if (!user) { requireAuth('send Super Thanks'); return }
    setSelectedAnswer(reply)
    setShowSuperThanks(true)
  }

  if (!post) {
    return <div className="p-8 text-center text-gray-500">Loading post...</div>
  }

  const isImageAvatar = post.profiles?.avatar && post.profiles.avatar.startsWith('http')
  const currentWords = analyzeText(content).wordCount
  const childrenOf = (pid: string) => replies.filter(r => r.parent_id === pid)
  const topComments = replies.filter(r => r.reply_type !== 'answer' && !r.parent_id)

  const renderReply = (r: any, depth: number) => {
    const isAnswer = r.reply_type === 'answer'
    const deservesThanks = isAnswer && qualifiesForSuperThanks(r.content)
    const replyAvatarIsImage = r.profiles?.avatar && r.profiles.avatar.startsWith('http')
    const children = childrenOf(r.id)

    return (
      <div key={r.id} className={depth > 0 ? 'ml-5 pl-4 border-l-2 border-blue-100' : ''}>
        <div className={`rounded-xl border p-5 ${isAnswer ? 'bg-blue-50/30 border-blue-200' : 'bg-white border-gray-200'}`}>
          {isAnswer && (
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-blue-100">
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-blue-700 uppercase">Top Answer</span>
              </div>
              {deservesThanks && (
                <button
                  onClick={() => openSuperThanks(r)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full hover:shadow-lg transition-all"
                >
                  <Gift className="w-3.5 h-3.5" /> Super Thanks
                </button>
              )}
            </div>
          )}
          <div className="flex items-start gap-3">
            <Link
              to={`/creator/${r.profiles?.username || 'user'}`}
              className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg flex-shrink-0 overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all"
            >
              {replyAvatarIsImage ? (
                <img src={r.profiles.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                r.profiles?.avatar || '👤'
              )}
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Link to={`/creator/${r.profiles?.username || 'user'}`} className="font-semibold text-sm text-gray-900 hover:text-blue-600">
                  {r.profiles?.display_name || 'Anonymous'}
                </Link>
                <span className="text-xs text-gray-500">· {new Date(r.created_at).toLocaleDateString()}</span>
              </div>
              <p className={`mt-2 whitespace-pre-line ${isAnswer ? 'text-gray-800 text-base' : 'text-gray-600 text-sm'}`}>
                {r.content}
              </p>
              {r.image_url && r.image_url.startsWith('http') && (
                <img
                  src={r.image_url}
                  alt="Reply"
                  className="w-full max-h-64 object-cover rounded-lg mt-3"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              )}
              <div className="flex items-center gap-4 mt-3">
                <button
                  onClick={() => handleLikeReply(r)}
                  className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                    likedReplies[r.id] ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${likedReplies[r.id] ? 'fill-red-600' : ''}`} />
                  {replyCounts[r.id] || 0}
                </button>
                <button
                  onClick={() => {
                    setReplyingTo(replyingTo === r.id ? null : r.id)
                    setReplyDraft('')
                  }}
                  className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <CornerDownRight className="w-3.5 h-3.5" /> Reply
                </button>
              </div>
              {replyingTo === r.id && (
                <div className="mt-3">
                  <textarea
                    value={replyDraft}
                    onChange={e => setReplyDraft(e.target.value)}
                    placeholder={`Reply to ${r.profiles?.display_name || 'user'}...`}
                    rows={2}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none"
                  />
                  <div className="flex gap-2 mt-2 justify-end">
                    <button onClick={() => setReplyingTo(null)} className="px-3 py-1.5 text-xs text-gray-600 bg-gray-100 rounded-lg">
                      Cancel
                    </button>
                    <button onClick={() => handleSubmitNested(r.id)} className="px-3 py-1.5 text-xs text-white bg-blue-600 rounded-lg">
                      Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {children.length > 0 && (
          <div className="mt-3 space-y-3">
            {children.map(c => renderReply(c, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
      <SEO
        title={post.title}
        description={post.content.substring(0, 150) + '...'}
        url={`\( {window.location.origin}/post/ \){post.slug}`}
      />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          redirect={toast.redirect}
          onClose={() => setToast(null)}
        />
      )}
      <SuperThanks
        open={showSuperThanks}
        onClose={() => setShowSuperThanks(false)}
        creator={selectedAnswer?.profiles?.display_name || 'Creator'}
        earnerId={selectedAnswer?.author_id}
        replyId={selectedAnswer?.id}
      />

      <Link to="/" className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      <article className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
            {isImageAvatar ? (
              <img src={post.profiles.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              post.profiles?.avatar || '👤'
            )}
          </div>
          <div>
            <span className="font-semibold text-gray-900">{post.profiles?.display_name || 'Anonymous'}</span>
            <div className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString()}</div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">{post.title}</h1>
        <p className="text-gray-700 leading-relaxed mb-4 whitespace-pre-line">{post.content}</p>

        {post.image_url && post.image_url.startsWith('http') && (
          <img
            src={post.image_url}
            alt="Post"
            className="w-full max-h-96 object-cover rounded-xl mb-4"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
        )}

        <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
              liked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
            }`}
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-red-600' : ''}`} /> {likes} Likes
          </button>
          <button className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 text-sm font-medium">
            <MessageCircle className="w-5 h-5" /> {post.replies_count || 0} Replies
          </button>
          <button onClick={handleShare} className="flex items-center gap-1.5 text-gray-600 hover:text-green-600 text-sm font-medium">
            <Share2 className="w-5 h-5" /> Share
          </button>
          <button
            onClick={handleBookmark}
            className={`flex items-center gap-1.5 text-sm font-medium ml-auto transition-colors ${
              bookmarked ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-blue-600' : ''}`} />
            {bookmarked ? 'Saved' : 'Save'}
          </button>
        </div>
      </article>

      {/* Reply composer */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setReplyType('comment')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${
              replyType === 'comment' ? 'bg-gray-200 text-gray-900' : 'text-gray-500'
            }`}
          >
            💬 Comment
          </button>
          <button
            onClick={() => setReplyType('answer')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${
              replyType === 'answer' ? 'bg-blue-600 text-white' : 'text-gray-500'
            }`}
          >
            📝 Write Answer
          </button>
        </div>

        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder={
            replyType === 'answer'
              ? 'Share your detailed, high-quality answer (1,000+ words qualifies for Super Thanks)...'
              : 'Ask a follow-up question...'
          }
          rows={replyType === 'answer' ? 6 : 3}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none"
        />

        {replyType === 'answer' && (
          <div className={`text-xs mt-1.5 font-medium ${qualifiesForSuperThanks(content) ? 'text-green-600' : 'text-gray-500'}`}>
            {currentWords} / {SUPER_THANKS_MIN_WORDS} words
            {qualifiesForSuperThanks(content)
              ? ' ✅ This answer qualifies for Super Thanks!'
              : ' — write a detailed, valuable answer to enable Super Thanks'}
          </div>
        )}

        <div className="mt-3">
          <label className="text-xs font-medium text-gray-500 mb-1.5 block flex items-center gap-1.5">
            <ImageIcon className="w-3 h-3" /> Image URL (Optional)
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm mb-3"
          />
        </div>

        {replyType === 'answer' && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-2">
            <input
              type="checkbox"
              checked={agreesToTerms}
              onChange={e => setAgreesToTerms(e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-xs text-blue-800">
              I confirm this is original, high-quality content. I agree it may be indexed by search engines and used to train AI models.
            </span>
          </div>
        )}

        <div className="flex justify-end mt-3">
          <button
            onClick={handleSubmitReply}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-sm font-medium rounded-lg"
          >
            {loading ? 'Posting...' : replyType === 'answer' ? 'Publish Answer' : 'Post Comment'}
          </button>
        </div>
      </div>

      {/* Answers */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-gray-900">Answers ({sortedAnswers.length})</h2>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setAnswerSort('best')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              answerSort === 'best' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            <Sparkles className="w-3 h-3" /> Best
          </button>
          <button
            onClick={() => setAnswerSort('new')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              answerSort === 'new' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            <Clock className="w-3 h-3" /> Newest
          </button>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {sortedAnswers.length === 0 && (
          <p className="text-sm text-gray-500 bg-white border border-gray-200 rounded-xl p-4 text-center">
            No answers yet. Be the first expert!
          </p>
        )}
        {sortedAnswers.map(r => renderReply(r, 0))}
      </div>

      {/* Comments */}
      <h2 className="text-lg font-bold text-gray-900 mb-3">Comments ({topComments.length})</h2>
      <div className="space-y-4">
        {topComments.length === 0 && (
          <p className="text-sm text-gray-500 bg-white border border-gray-200 rounded-xl p-4 text-center">
            No comments yet.
          </p>
        )}
        {topComments.map(r => renderReply(r, 0))}
      </div>
    </div>
  )
}
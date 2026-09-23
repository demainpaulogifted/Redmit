import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Heart, MessageCircle, Share2, Bookmark, Flag, ArrowLeft, ThumbsUp, Send, TrendingUp, Eye, CheckCircle, AlertTriangle } from 'lucide-react'
import { posts, replies } from '../data/mockData'
import SuperThanks from '../components/SuperThanks'
import SEO from '../components/SEO'

export default function PostPage() {
  const { id } = useParams()
  const post = posts.find(p => p.id === id) || posts[0]
  
  // Reply States
  const [replyType, setReplyType] = useState<'comment' | 'answer'>('comment')
  const [replyText, setReplyText] = useState('')
  const [agreesToTerms, setAgreesToTerms] = useState(false)
  const [superThanksOpen, setSuperThanksOpen] = useState(false)
  const [activeAnswerId, setActiveAnswerId] = useState<string | null>(null)

  if (!post) return <div className="p-8 text-center">Post not found</div>

  // Mocking an "Answer" type for the first reply to show the difference
  const displayReplies = replies.map((r, index) => ({
    ...r,
    type: index === 0 ? 'answer' : 'comment' // First reply is an Answer, rest are comments
  }))

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Inject SEO Schema for Google */}
      <SEO post={{
        title: post.title,
        content: post.content,
        authorName: post.author.displayName,
        date: post.timestamp,
        replies: displayReplies.map(r => ({ authorName: r.author.displayName, content: r.content, date: r.timestamp }))
      }} />

      <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to discussions
      </button>

      {/* Main Post (The Question) */}
      <article className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-2xl">{post.author.avatar}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-900">{post.author.displayName}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{post.author.badge}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
              <span>{post.category}</span> · <span>{post.community}</span> · <span>{post.timestamp}</span>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">{post.title}</h1>
        <p className="text-gray-700 leading-relaxed mb-4">{post.content}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.map(t => <span key={t} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md">#{t}</span>)}
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-gray-100 flex-wrap">
          <button className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 text-sm font-medium"><Heart className="w-4 h-4" /> {post.likes} Likes</button>
          <button className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 text-sm font-medium"><MessageCircle className="w-4 h-4" /> {post.replies} Replies</button>
          <button className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 text-sm font-medium"><Share2 className="w-4 h-4" /> {post.shares} Shares</button>
          <button className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 text-sm font-medium ml-auto"><Bookmark className="w-4 h-4" /> Save</button>
        </div>
      </article>

      {/* Reply Input Area with Toggle */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
        <div className="flex gap-2 mb-3">
          <button 
            onClick={() => setReplyType('comment')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${replyType === 'comment' ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            💬 Ask / Comment
          </button>
          <button 
            onClick={() => setReplyType('answer')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${replyType === 'answer' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            📝 Write an Answer
          </button>
        </div>

        <textarea 
          value={replyText} 
          onChange={e => setReplyText(e.target.value)} 
          placeholder={replyType === 'answer' ? "Share your detailed, high-quality answer here..." : "Ask a follow-up question or add a short comment..."} 
          rows={replyType === 'answer' ? 6 : 3} 
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" 
        />

        {/* Quality Pledge for Answers */}
        {replyType === 'answer' && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
            <label className="flex items-start gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={agreesToTerms} 
                onChange={(e) => setAgreesToTerms(e.target.checked)} 
                className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500" 
              />
              <span className="text-xs text-blue-800">
                I confirm this is original, high-quality content. I agree it may be indexed by search engines (SEO) and used to train AI models to help others.
              </span>
            </label>
          </div>
        )}

        <div className="flex justify-end mt-3">
          <button 
            disabled={replyType === 'answer' && !agreesToTerms}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" /> {replyType === 'answer' ? 'Publish Answer' : 'Post Comment'}
          </button>
        </div>
      </div>

      {/* Replies Section */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Replies ({displayReplies.length})</h2>
      </div>

      <div className="space-y-4">
        {displayReplies.map(r => (
          <div key={r.id} className={`rounded-xl border p-5 ${r.type === 'answer' ? 'bg-blue-50/30 border-blue-200' : 'bg-white border-gray-200'}`}>
            
            {/* Answer Header with Follow & Super Thanks */}
            {r.type === 'answer' && (
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-blue-100">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">Verified Answer</span>
                </div>
                <div className="flex gap-2">
                  <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-medium hover:bg-blue-700">+ Follow</button>
                  <button onClick={() => setSuperThanksOpen(true)} className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full font-bold hover:shadow-md transition-shadow">
                    💰 Super Thanks
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-lg flex-shrink-0">{r.author.avatar}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-gray-900">{r.author.displayName}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${r.author.badge === 'Trusted Member' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{r.author.badge}</span>
                  <span className="text-xs text-gray-500">· {r.timestamp}</span>
                </div>
                
                <p className={`mt-2 leading-relaxed ${r.type === 'answer' ? 'text-gray-800 text-base' : 'text-gray-700 text-sm'}`}>{r.content}</p>
                
                <div className="flex items-center gap-4 mt-3">
                  <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600"><ThumbsUp className="w-3 h-3" /> {r.likes}</button>
                  <button className="text-xs text-gray-500 hover:text-blue-600">Reply</button>
                  
                  {/* Community Self-Policing Buttons */}
                  <button className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800 font-medium ml-auto"><CheckCircle className="w-3 h-3" /> Verify</button>
                  <button className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium"><AlertTriangle className="w-3 h-3" /> Flag</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <SuperThanks open={superThanksOpen} onClose={() => setSuperThanksOpen(false)} creator={displayReplies[0].author.displayName} />
    </div>
  )
}
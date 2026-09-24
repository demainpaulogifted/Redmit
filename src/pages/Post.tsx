import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { ArrowLeft, CheckCircle } from 'lucide-react'

export default function PostPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [post, setPost] = useState<any>(null)
  const [replies, setReplies] = useState<any[]>([])
  const [replyType, setReplyType] = useState<'comment' | 'answer'>('comment')
  const [content, setContent] = useState('')
  const [agreesToTerms, setAgreesToTerms] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (id) {
      fetchPost()
      fetchReplies()
    }
  }, [id])

  const fetchPost = async () => {
    const { data } = await supabase.from('posts').select('*, profiles:author_id(display_name, avatar, username)').eq('id', id).single()
    if (data) setPost(data)
  }

  const fetchReplies = async () => {
    const { data } = await supabase.from('replies').select('*, profiles:author_id(display_name, avatar, username)').eq('post_id', id).order('created_at', { ascending: true })
    if (data) setReplies(data)
  }

  const handleSubmitReply = async () => {
    if (!user) return alert('Please log in to reply')
    if (!content) return alert('Please write something')
    if (replyType === 'answer' && !agreesToTerms) return alert('You must agree to the quality pledge')

    setLoading(true)
    const { error } = await supabase.from('replies').insert([{ post_id: id, author_id: user.id, content, reply_type: replyType }])
    setLoading(false)

    if (error) alert('Error: ' + error.message)
    else {
      setContent('')
      setAgreesToTerms(false)
      fetchReplies()
    }
  }

  if (!post) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Link to="/" className="flex items-center gap-2 text-sm text-gray-600 mb-4"><ArrowLeft className="w-4 h-4" /> Back</Link>
      
      <article className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">{post.profiles?.avatar || '👤'}</div>
          <div>
            <span className="font-semibold text-gray-900">{post.profiles?.display_name || 'Anonymous'}</span>
            <div className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString()}</div>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">{post.title}</h1>
        <p className="text-gray-700 leading-relaxed">{post.content}</p>
      </article>

      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
        <div className="flex gap-2 mb-3">
          <button onClick={() => setReplyType('comment')} className={`flex-1 py-2 rounded-lg text-sm font-medium ${replyType === 'comment' ? 'bg-gray-200 text-gray-900' : 'text-gray-500'}`}>💬 Comment</button>
          <button onClick={() => setReplyType('answer')} className={`flex-1 py-2 rounded-lg text-sm font-medium ${replyType === 'answer' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}>📝 Write Answer</button>
        </div>
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder={replyType === 'answer' ? "Share your detailed, high-quality answer..." : "Ask a follow-up question..."} rows={replyType === 'answer' ? 6 : 3} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" />
        
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
          return (
            <div key={r.id} className={`rounded-xl border p-5 ${isAnswer ? 'bg-blue-50/30 border-blue-200' : 'bg-white border-gray-200'}`}>
              {isAnswer && (
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-blue-100">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-blue-700 uppercase">Verified Answer</span>
                </div>
              )}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg">{r.profiles?.avatar || '👤'}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-gray-900">{r.profiles?.display_name || 'Anonymous'}</span>
                    <span className="text-xs text-gray-500">· {new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className={`mt-2 ${isAnswer ? 'text-gray-800 text-base' : 'text-gray-600 text-sm'}`}>{r.content}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
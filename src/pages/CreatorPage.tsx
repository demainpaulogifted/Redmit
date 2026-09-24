import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { BadgeCheck, MessageSquare, HelpCircle, Calendar } from 'lucide-react'

export default function CreatorPage() {
  const { username } = useParams()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [userPosts, setUserPosts] = useState<any[]>([])
  const [userAnswers, setUserAnswers] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'posts' | 'answers'>('posts')

  useEffect(() => {
    if (username) fetchData()
  }, [username])

  const fetchData = async () => {
    // 1. Get Profile
    const { data: profileData } = await supabase.from('profiles').select('*').eq('username', username).single()
    if (profileData) {
      setUserProfile(profileData)
      
      // 2. Get their Posts
      const { data: postsData } = await supabase
        .from('posts')
        .select('id, title, content, created_at, category_id')
        .eq('author_id', profileData.id)
        .order('created_at', { ascending: false })
        .limit(20)
      if (postsData) setUserPosts(postsData)

      // 3. Get their Answers
      const { data: answersData } = await supabase
        .from('replies')
        .select('id, content, created_at, reply_type, post_id, posts:post_id(title)')
        .eq('author_id', profileData.id)
        .eq('reply_type', 'answer')
        .order('created_at', { ascending: false })
        .limit(20)
      if (answersData) setUserAnswers(answersData)
    }
  }

  if (!userProfile) return <div className="p-8 text-center">Loading user profile...</div>

  const isImageAvatar = userProfile.avatar && userProfile.avatar.startsWith('http')

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
        <div className="h-24 bg-gradient-to-br from-blue-600 to-blue-900"></div>
        <div className="p-6 -mt-12 relative flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-5xl shadow-lg border-4 border-white overflow-hidden flex-shrink-0">
            {isImageAvatar ? <img src={userProfile.avatar} alt="" className="w-full h-full object-cover" /> : (userProfile.avatar || '👤')}
          </div>
          <div className="flex-1 mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900">{userProfile.display_name}</h1>
              {userProfile.super_thanks_enabled && <BadgeCheck className="w-5 h-5 text-blue-500" />}
            </div>
            <p className="text-gray-500 text-sm">@{userProfile.username}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Joined {new Date(userProfile.created_at).toLocaleDateString()}</span>
              <span className="flex items-center gap-1"><HelpCircle className="w-4 h-4" /> {userProfile.answers_count || 0} Answers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        <button onClick={() => setActiveTab('posts')} className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === 'posts' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>
          <span className="flex items-center gap-2"><HelpCircle className="w-4 h-4" /> Questions Asked ({userPosts.length})</span>
        </button>
        <button onClick={() => setActiveTab('answers')} className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === 'answers' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>
          <span className="flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Answers Given ({userAnswers.length})</span>
        </button>
      </div>

      {/* Activity Content */}
      <div className="space-y-4">
        {activeTab === 'posts' && (
          userPosts.length > 0 ? userPosts.map(p => (
            <Link key={p.id} to={`/post/${p.id}`} className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-900 mb-2">{p.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{p.content}</p>
              <span className="text-xs text-gray-400 mt-2 block">{new Date(p.created_at).toLocaleDateString()}</span>
            </Link>
          )) : <div className="text-center py-8 text-gray-500 bg-white rounded-xl border border-gray-200">No questions asked yet.</div>
        )}

        {activeTab === 'answers' && (
          userAnswers.length > 0 ? userAnswers.map(a => (
            <Link key={a.id} to={`/post/${a.post_id}`} className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="text-xs text-blue-600 font-medium mb-1">Answered in:</div>
              <h3 className="font-semibold text-gray-900 mb-2">{a.posts?.title || 'Unknown Post'}</h3>
              <p className="text-sm text-gray-700 line-clamp-3">{a.content}</p>
              <span className="text-xs text-gray-400 mt-2 block">{new Date(a.created_at).toLocaleDateString()}</span>
            </Link>
          )) : <div className="text-center py-8 text-gray-500 bg-white rounded-xl border border-gray-200">No answers given yet.</div>
        )}
      </div>
    </div>
  )
}
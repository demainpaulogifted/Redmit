import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { BadgeCheck, MapPin, Calendar, Mail, LogOut, Plus } from 'lucide-react'
import PostCard from '../components/PostCard'

export default function Profile() {
  const { user, signOut, resendVerification } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<any>(null)
  const [userPosts, setUserPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user) {
      fetchProfile()
      fetchUserPosts()
    } else {
      navigate('/login')
    }
  }, [user])

  const fetchProfile = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('id', user?.id).single()
    if (data) setProfile(data)
  }

  const fetchUserPosts = async () => {
    const { data } = await supabase
      .from('posts')
      .select(`id, title, content, created_at, category_id, profiles:author_id(display_name, avatar, username)`)
      .eq('author_id', user?.id)
      .order('created_at', { ascending: false })
    
    if (data) {
      const mapped = data.map((p: any) => ({
        id: p.id, title: p.title, content: p.content,
        author: { displayName: p.profiles?.display_name || 'Anonymous', avatar: p.profiles?.avatar || '👤', badge: 'Member' },
        category: 'General', community: 'Global', timestamp: new Date(p.created_at).toLocaleDateString(),
        likes: 0, replies: 0, shares: 0, tags: [], trending: false
      }))
      setUserPosts(mapped)
    }
  }

  const handleResendEmail = async () => {
    const lastResend = localStorage.getItem('last_email_resend')
    const now = Date.now()
    
    // 24 hours = 86400000 milliseconds
    if (lastResend && (now - parseInt(lastResend)) < 86400000) {
      setMessage('⚠️ You can only request a verification email once every 24 hours.')
      return
    }

    setLoading(true)
    setMessage('')
    const { error } = await resendVerification(user?.email || '')
    setLoading(false)

    if (error) {
      setMessage('❌ Error: ' + error.message)
    } else {
      localStorage.setItem('last_email_resend', now.toString())
      setMessage('✅ Verification email sent! Please check your inbox (and spam folder).')
    }
  }

  if (!user || !profile) return <div className="p-8 text-center">Loading profile...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
        <div className="h-32 bg-gradient-to-br from-blue-600 to-blue-900"></div>
        <div className="p-6 -mt-12 relative">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-5xl shadow-lg border-4 border-white">
            {profile.avatar || '👤'}
          </div>
          <div className="mt-3 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900">{profile.display_name}</h1>
                {user.email_verified && <BadgeCheck className="w-5 h-5 text-blue-500" />}
              </div>
              <p className="text-gray-500 text-sm">@{profile.username}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {profile.country || 'Global'}</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Joined {new Date(profile.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleResendEmail} disabled={loading || user.email_verified} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 text-sm font-medium rounded-lg flex items-center gap-2">
                <Mail className="w-4 h-4" /> {loading ? 'Sending...' : (user.email_verified ? 'Verified' : 'Verify Email')}
              </button>
              <button onClick={async () => { await signOut(); navigate('/') }} className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg flex items-center gap-2">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
          
          {/* Status Message */}
          {message && (
            <div className={`mt-4 p-3 rounded-lg text-sm ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message}
            </div>
          )}
        </div>
      </div>

      {/* User Posts */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">My Discussions</h2>
        <Link to="/create" className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:underline">
          <Plus className="w-4 h-4" /> New Post
        </Link>
      </div>

      <div className="space-y-4">
        {userPosts.length > 0 ? (
          userPosts.map(p => <PostCard key={p.id} post={p} />)
        ) : (
          <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200 border-dashed">
            <p className="mb-2">You haven't started any discussions yet.</p>
            <Link to="/create" className="text-blue-600 font-medium hover:underline">Create your first post</Link>
          </div>
        )}
      </div>
    </div>
  )
}
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { BadgeCheck, MapPin, Calendar, Mail, LogOut, Plus, Upload, Camera } from 'lucide-react'
import PostCard from '../components/PostCard'

export default function Profile() {
  const { user, signOut, resendVerification } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<any>(null)
  const [userPosts, setUserPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  const isEmailVerified = !!user?.email_confirmed_at

  useEffect(() => {
    if (user) { fetchProfile(); fetchUserPosts() }
    else { navigate('/login') }
  }, [user])

  const fetchProfile = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('id', user?.id).single()
    if (data) setProfile(data)
  }

  const fetchUserPosts = async () => {
    const { data } = await supabase.from('posts').select(`id, title, content, created_at, category_id, image_url, profiles:author_id(display_name, avatar, username)`).eq('author_id', user?.id).order('created_at', { ascending: false })
    if (data) {
      const mapped = data.map((p: any) => ({
        id: p.id, title: p.title, content: p.content, image_url: p.image_url,
        author: { displayName: p.profiles?.display_name || 'Anonymous', avatar: p.profiles?.avatar || '👤', badge: 'Member' },
        category: 'General', community: 'Global', timestamp: new Date(p.created_at).toLocaleDateString(),
        likes: 0, replies: 0, shares: 0, tags: [], trending: false
      }))
      setUserPosts(mapped)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    setUploading(true)
    const file = e.target.files[0]
    const fileExt = file.name.split('.').pop()
    const filePath = `${user?.id}/${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage.from('uploads').upload(filePath, file)
    if (uploadError) { alert('Upload failed'); setUploading(false); return }

    const { data: { publicUrl } } = supabase.storage.from('uploads').getPublicUrl(filePath)

    const { error: updateError } = await supabase.from('profiles').update({ avatar: publicUrl }).eq('id', user?.id)
    if (updateError) alert('Failed to update profile')
    else { setProfile({ ...profile, avatar: publicUrl }); alert('Profile picture updated!') }
    setUploading(false)
  }

  const handleResendEmail = async () => {
    const lastResend = localStorage.getItem('last_email_resend')
    const now = Date.now()
    if (lastResend && (now - parseInt(lastResend)) < 86400000) { setMessage('⚠️ You can only request a verification email once every 24 hours.'); return }
    setLoading(true); setMessage('')
    const { error } = await resendVerification(user?.email || '')
    setLoading(false)
    if (error) setMessage('❌ Error: ' + error.message)
    else { localStorage.setItem('last_email_resend', now.toString()); setMessage('✅ Verification email sent!') }
  }

  if (!user || !profile) return <div className="p-8 text-center">Loading profile...</div>

  // Helper to check if avatar is an image URL or an emoji
  const isImageAvatar = profile.avatar && profile.avatar.startsWith('http')

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
        <div className="h-32 bg-gradient-to-br from-blue-600 to-blue-900"></div>
        <div className="p-6 -mt-12 relative">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-5xl shadow-lg border-4 border-white overflow-hidden">
              {isImageAvatar ? <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" /> : (profile.avatar || '👤')}
            </div>
            <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-md">
              <Camera className="w-4 h-4 text-white" />
              <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
            </label>
          </div>
          
          <div className="mt-3 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900">{profile.display_name}</h1>
                {isEmailVerified && <BadgeCheck className="w-5 h-5 text-blue-500" />}
              </div>
              <p className="text-gray-500 text-sm">@{profile.username}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {profile.country || 'Global'}</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Joined {new Date(profile.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleResendEmail} disabled={loading || isEmailVerified} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 text-sm font-medium rounded-lg flex items-center gap-2">
                <Mail className="w-4 h-4" /> {loading ? 'Sending...' : (isEmailVerified ? 'Verified' : 'Verify Email')}
              </button>
              <button onClick={async () => { await signOut(); navigate('/') }} className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg flex items-center gap-2">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
          {message && <div className={`mt-4 p-3 rounded-lg text-sm ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{message}</div>}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">My Discussions</h2>
        <Link to="/create" className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:underline"><Plus className="w-4 h-4" /> New Post</Link>
      </div>

      <div className="space-y-4">
        {userPosts.length > 0 ? userPosts.map(p => <PostCard key={p.id} post={p} />) : (
          <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200 border-dashed">
            <p className="mb-2">You haven't started any discussions yet.</p>
            <Link to="/create" className="text-blue-600 font-medium hover:underline">Create your first post</Link>
          </div>
        )}
      </div>
    </div>
  )
}
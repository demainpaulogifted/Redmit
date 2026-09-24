import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { BadgeCheck, Users, Settings } from 'lucide-react'
import Toast from '../components/Toast'

export default function Creators() {
  const { user } = useAuth()
  const [creators, setCreators] = useState<any[]>([])
  const [toast, setToast] = useState<{ message: string; type: any; redirect?: string } | null>(null)

  useEffect(() => {
    fetchCreators()
  }, [])

  const fetchCreators = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('super_thanks_enabled', true)
      .order('followers_count', { ascending: false })
      .limit(20)
    
    if (data) setCreators(data)
  }

  const handleFollow = async (creatorId: string) => {
    if (!user) {
      setToast({ message: 'Please log in to follow creators', type: 'info', redirect: '/login' })
      return
    }
    setToast({ message: 'Follow feature coming soon!', type: 'info' })
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24">
      {toast && <Toast message={toast.message} type={toast.type} redirect={toast.redirect} onClose={() => setToast(null)} />}
      
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-gray-900">Creator</h1>
        {user && (
          <Link to="/creator/settings" className="flex items-center gap-1.5 text-sm text-blue-600 font-medium">
            <Settings className="w-4 h-4" /> Settings
          </Link>
        )}
      </div>
      <p className="text-gray-600 mb-6">Follow amazing creators and support them with Super Thanks.</p>

      {creators.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">No creators yet</h3>
          <p className="text-sm text-gray-600 mb-4">Be the first to unlock Super Thanks!</p>
          {user && (
            <Link to="/creator/settings" className="inline-block px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg">
              Become a Creator
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {creators.map(c => {
            const isImageAvatar = c.avatar && c.avatar.startsWith('http')
            return (
              <div key={c.id} className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden">
                    {isImageAvatar ? (
                      <img src={c.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      c.avatar || '👤'
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link to={`/creator/${c.username}`} className="text-lg font-bold text-gray-900 hover:text-blue-600">
                        {c.display_name}
                      </Link>
                      <BadgeCheck className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-sm text-gray-500">@{c.username}</p>
                    <p className="text-sm text-gray-700 mt-2">{c.bio || 'Creator on Redmit'}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {c.followers_count || 0} followers</span>
                      <span>{c.answers_count || 0} answers</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleFollow(c.id)}
                  className="w-full mt-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
                >
                  Follow
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
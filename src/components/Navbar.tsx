import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, Bell, Menu, Download, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const ADMIN_EMAILS = ['paulotubo30@gmail.com', 'paulotubo9@gmail.com']

export default function Navbar() {
  const location = useLocation()
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const isAdmin = user && ADMIN_EMAILS.includes(user.email || '')

  // Fetch real profile data so we show the correct Name/Avatar (e.g., "B" instead of "P")
  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const { data } = await supabase.from('profiles').select('display_name, avatar').eq('id', user.id).single()
        if (data) setProfile(data)
      }
      fetchProfile()
    }
  }, [user])

  const links = [
    { to: '/', label: 'Home' },
    { to: '/categories', label: 'Categories' },
    { to: '/trending', label: 'Trending' },
    { to: '/communities', label: 'Communities' },
    { to: '/creators', label: 'Creator' },
  ]

  // Handle Download/Install Click
  const handleDownload = () => {
    // Try to trigger PWA install prompt if available
    if ('share' in navigator) {
       // On mobile, sometimes sharing the URL is the best "download" method if PWA isn't installed
       navigator.share({ title: 'Redmit', text: 'Download Redmit App', url: window.location.href })
    } else {
       alert('To install: Open menu in browser and select "Add to Home Screen" or "Install App".')
    }
  }

  // Determine what to show in the circle: Real Avatar Image OR First Letter of Name
  const isImageAvatar = profile?.avatar && profile.avatar.startsWith('http')
  const initial = profile?.display_name ? profile.display_name[0].toUpperCase() : (user?.email ? user.email[0].toUpperCase() : '?')

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">R</span>
          </div>
          <span className="text-xl font-bold text-gray-900 hidden sm:block">Redmit</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <Link key={l.to} to={l.to} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === l.to ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
              {l.label}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin" className="px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 ml-2">
              Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Download/Install Button */}
          <button onClick={handleDownload} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600" title="Install App">
            <Download className="w-5 h-5" />
          </button>

          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 w-64 bg-gray-100 border-0 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
          
          <Link to="/notifications" className="p-2 rounded-lg hover:bg-gray-100 relative">
            <Bell className="w-5 h-5 text-gray-600" />
          </Link>
          
          {/* User Avatar Circle - Now uses Real Data */}
          <Link to="/profile" className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm overflow-hidden border border-blue-200">
            {isImageAvatar ? (
              <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              initial
            )}
          </Link>
        </div>
      </div>
    </nav>
  )
}
import { Link, useLocation } from 'react-router-dom'
import { Search, Bell, Menu } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const ADMIN_EMAILS = ['paulotubo30@gmail.com', 'paulotubo9@gmail.com']

export default function Navbar() {
  const location = useLocation()
  const { user } = useAuth()
  const isAdmin = user && ADMIN_EMAILS.includes(user.email || '')

  const links = [
    { to: '/', label: 'Home' },
    { to: '/categories', label: 'Categories' },
    { to: '/trending', label: 'Trending' },
    { to: '/communities', label: 'Communities' },
    { to: '/creators', label: 'Creators' },
  ]

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
          {/* Admin Button - Only visible to you */}
          {isAdmin && (
            <Link to="/admin" className="px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 ml-2">
              Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 w-64 bg-gray-100 border-0 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
          <Link to="/notifications" className="p-2 rounded-lg hover:bg-gray-100 relative">
            <Bell className="w-5 h-5 text-gray-600" />
          </Link>
          <Link to="/profile" className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
            {user ? user.email?.[0].toUpperCase() : '?'}
          </Link>
        </div>
      </div>
    </nav>
  )
}
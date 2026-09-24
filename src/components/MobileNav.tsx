import { Link, useLocation } from 'react-router-dom'
import { Home, Grid3x3, TrendingUp, Users, Crown, Shield, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const ADMIN_EMAILS = ['paulotubo30@gmail.com', 'paulotubo9@gmail.com']

export default function MobileNav() {
  const location = useLocation()
  const { user } = useAuth()
  const isAdmin = user && ADMIN_EMAILS.includes(user.email || '')

  const links = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/categories', label: 'Categories', icon: Grid3x3 },
    { to: '/trending', label: 'Trending', icon: TrendingUp },
    { to: '/communities', label: 'Communities', icon: Users },
    { to: '/creators', label: 'Creators', icon: Crown },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around h-16 px-2">
        {links.map(l => {
          const isActive = location.pathname === l.to
          return (
            <Link key={l.to} to={l.to} className={`flex flex-col items-center justify-center w-full h-full ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
              <l.icon className={`w-6 h-6 ${isActive ? 'fill-blue-100' : ''}`} />
              <span className="text-[10px] mt-1 font-medium">{l.label}</span>
            </Link>
          )
        })}
        
        {/* Admin Button for Mobile */}
        {isAdmin && (
          <Link to="/admin" className={`flex flex-col items-center justify-center w-full h-full ${location.pathname === '/admin' ? 'text-purple-600' : 'text-gray-500'}`}>
            <Shield className={`w-6 h-6 ${location.pathname === '/admin' ? 'fill-purple-100' : ''}`} />
            <span className="text-[10px] mt-1 font-medium">Admin</span>
          </Link>
        )}

        {/* Profile Button for Mobile */}
        <Link to="/profile" className={`flex flex-col items-center justify-center w-full h-full ${location.pathname === '/profile' ? 'text-blue-600' : 'text-gray-500'}`}>
          <User className={`w-6 h-6 ${location.pathname === '/profile' ? 'fill-blue-100' : ''}`} />
          <span className="text-[10px] mt-1 font-medium">Profile</span>
        </Link>
      </div>
    </nav>
  )
}
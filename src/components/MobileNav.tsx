import { Link, useLocation } from 'react-router-dom'
import { Home, Grid3x3, Plus, Bell, User } from 'lucide-react'

export default function MobileNav() {
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  const links = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/categories', label: 'Categories', icon: Grid3x3 },
    { to: '/create', label: 'Create', icon: Plus, center: true },
    { to: '/notifications', label: 'Alerts', icon: Bell },
    { to: '/profile', label: 'Profile', icon: User },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 pb-safe">
      <div className="flex items-center justify-around px-2 h-16">
        {links.map(l => {
          const Icon = l.icon
          const active = isActive(l.to)
          if (l.center) {
            return (
              <Link key={l.to} to={l.to} className="flex flex-col items-center -mt-4">
                <div className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/30">
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </Link>
            )
          }
          return (
            <Link 
              key={l.to} 
              to={l.to} 
              className={`flex flex-col items-center gap-1 px-3 py-1 ${
                active ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{l.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
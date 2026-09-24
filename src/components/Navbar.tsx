import { Link, useLocation } from 'react-router-dom'
import { Home, Grid3x3, TrendingUp, Users, Crown, Search, Bell, Menu, X } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Navbar() {
  const { darkMode, setDarkMode, sidebarOpen, setSidebarOpen } = useApp()
  const location = useLocation()

  const links = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/categories', label: 'Categories', icon: Grid3x3 },
    { to: '/trending', label: 'Trending', icon: TrendingUp },
    { to: '/communities', label: 'Communities', icon: Users },
    { to: '/creators', label: 'Creators', icon: Crown },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden lg:block sticky top-0 z-40 bg-navy-900 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg font-bold">R</span>
                </div>
                <span className="text-xl font-bold text-white">Redmit</span>
              </Link>
              <div className="flex items-center gap-1">
                {links.map(l => (
                  <Link 
                    key={l.to} 
                    to={l.to} 
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(l.to) 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-300 hover:bg-navy-800 hover:text-white'
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search Redmit..." 
                  className="pl-9 pr-4 py-2 w-64 bg-navy-800 border-0 rounded-lg text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                />
              </div>
              <button className="p-2 rounded-lg hover:bg-navy-800">
                <Bell className="w-5 h-5 text-gray-300" />
              </button>
              <Link to="/profile" className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
                D
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <nav className="lg:hidden sticky top-0 z-40 bg-navy-900 border-b border-navy-800">
        <div className="flex items-center justify-between px-4 h-14">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-base font-bold">R</span>
            </div>
            <span className="text-lg font-bold text-white">Redmit</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/search" className="p-2 rounded-lg hover:bg-navy-800">
              <Search className="w-5 h-5 text-gray-300" />
            </Link>
            <Link to="/notifications" className="p-2 rounded-lg hover:bg-navy-800 relative">
              <Bell className="w-5 h-5 text-gray-300" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  )
}
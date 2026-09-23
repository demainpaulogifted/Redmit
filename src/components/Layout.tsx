import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import MobileNav from './MobileNav'

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pb-20 lg:pb-0">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  )
}
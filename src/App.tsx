import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Categories from './pages/Categories'
import CategoryPage from './pages/Category'
import PostPage from './pages/Post'
import Communities from './pages/Communities'
import CommunityPage from './pages/Community'
import Creators from './pages/Creators'
import CreatorPage from './pages/Creator'
import CreatorSettings from './pages/CreatorSettings'
import Trending from './pages/Trending'
import Profile from './pages/Profile'
import Notifications from './pages/Notifications'
import SearchPage from './pages/Search'
import CreatePost from './pages/CreatePost'
import Login from './pages/Login'
import Signup from './pages/Signup'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/communities" element={<Communities />} />
          <Route path="/community/:slug" element={<CommunityPage />} />
          <Route path="/creators" element={<Creators />} />
          <Route path="/creator/:username" element={<CreatorPage />} />
          <Route path="/creator/settings" element={<CreatorSettings />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/create" element={<CreatePost />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

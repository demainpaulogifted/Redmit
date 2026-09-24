import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Shield, Plus, Trash2, Eye, MousePointerClick } from 'lucide-react'

const ADMIN_EMAILS = ['paulotubo30@gmail.com', 'paulotubo9@gmail.com']

export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [ads, setAds] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [targetCountries, setTargetCountries] = useState('NG, US, UK')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    if (!ADMIN_EMAILS.includes(user.email || '')) {
      navigate('/')
      return
    }
    fetchAds()
  }, [user])

  const fetchAds = async () => {
    try {
      const { data, error } = await supabase.from('ads').select('*').order('created_at', { ascending: false })
      if (error) {
        setError('Failed to load ads: ' + error.message)
      } else if (data) {
        setAds(data)
      }
    } catch (err) {
      setError('Failed to load ads')
    }
  }

  const handleCreateAd = async () => {
    if (!title || !description) return alert('Title and description are required')
    setLoading(true)
    setError('')
    const countriesArray = targetCountries.split(',').map(c => c.trim().toUpperCase())
    const { error } = await supabase.from('ads').insert([{
      title, description, image_url: imageUrl, link_url: linkUrl,
      target_countries: countriesArray, target_categories: ['ALL'], target_devices: ['ALL'], target_languages: ['ALL'],
      is_active: true, views: 0, clicks: 0
    }])
    setLoading(false)
    if (error) setError('Error: ' + error.message)
    else { setTitle(''); setDescription(''); setImageUrl(''); setLinkUrl(''); fetchAds() }
  }

  const toggleAdStatus = async (id: string, currentStatus: boolean) => {
    await supabase.from('ads').update({ is_active: !currentStatus }).eq('id', id)
    fetchAds()
  }

  if (!user) return <div className="p-8 text-center">Please log in</div>
  if (!ADMIN_EMAILS.includes(user.email || '')) return <div className="p-8 text-center">Access denied</div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 rounded-xl"><Shield className="w-6 h-6 text-blue-600" /></div>
        <div><h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1><p className="text-sm text-gray-500">Manage advertisements and targeting</p></div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Plus className="w-5 h-5" /> Create New Ad</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ad Title" className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
          <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Image URL (https://...)" className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
        </div>
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Ad Description" rows={3} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm mb-4" />
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <input value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="Destination URL (https://...)" className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
          <input value={targetCountries} onChange={e => setTargetCountries(e.target.value)} placeholder="Target Countries (e.g., NG, US)" className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
        </div>
        <button onClick={handleCreateAd} disabled={loading} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-lg">{loading ? 'Creating...' : 'Publish Ad'}</button>
      </div>

      <h2 className="text-lg font-bold text-gray-900 mb-4">Active Campaigns & Analytics</h2>
      <div className="space-y-3">
        {ads.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-white rounded-xl border border-gray-200">No ads yet. Create your first ad above!</div>
        ) : ads.map(ad => (
          <div key={ad.id} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{ad.title}</h3>
              <p className="text-sm text-gray-500">{ad.description}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">Countries: {ad.target_countries?.join(', ') || 'ALL'}</span>
                <span className={`text-xs px-2 py-1 rounded ${ad.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{ad.is_active ? 'Active' : 'Paused'}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm text-gray-600"><Eye className="w-4 h-4" /> {ad.views || 0}</div>
              <div className="flex items-center gap-1 text-sm text-gray-600"><MousePointerClick className="w-4 h-4" /> {ad.clicks || 0}</div>
              <button onClick={() => toggleAdStatus(ad.id, ad.is_active)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 className="w-5 h-5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
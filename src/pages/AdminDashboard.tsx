import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Shield, Plus, Trash2 } from 'lucide-react'

const ADMIN_EMAILS = ['paulotubo30@gmail.com', 'paulotubo9@gmail.com']

export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [ads, setAds] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  
  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [targetCountries, setTargetCountries] = useState('NG, US, UK') // Comma separated

  useEffect(() => {
    if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
      navigate('/') // Kick out non-admins
    } else {
      fetchAds()
    }
  }, [user])

  const fetchAds = async () => {
    const { data } = await supabase.from('ads').select('*').order('created_at', { ascending: false })
    if (data) setAds(data)
  }

  const handleCreateAd = async () => {
    if (!title || !description) return alert('Title and description are required')
    setLoading(true)
    
    const countriesArray = targetCountries.split(',').map(c => c.trim().toUpperCase())
    
    const { error } = await supabase.from('ads').insert([{
      title, description, link_url: linkUrl,
      target_countries: countriesArray,
      target_categories: ['all'], // Can be expanded later
      target_devices: ['all'],
      target_languages: ['all'],
      is_active: true
    }])
    
    setLoading(false)
    if (error) alert('Error: ' + error.message)
    else {
      setTitle(''); setDescription(''); setLinkUrl('')
      fetchAds()
    }
  }

  const toggleAdStatus = async (id: string, currentStatus: boolean) => {
    await supabase.from('ads').update({ is_active: !currentStatus }).eq('id', id)
    fetchAds()
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 rounded-xl"><Shield className="w-6 h-6 text-blue-600" /></div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Manage advertisements and targeting</p>
        </div>
      </div>

      {/* Create Ad Form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Plus className="w-5 h-5" /> Create New Ad</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ad Title (e.g., Learn to Code)" className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
          <input value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="Destination URL (https://...)" className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
        </div>
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Ad Description" rows={3} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm mb-4" />
        
        <div className="mb-4">
          <label className="text-xs font-medium text-gray-500 mb-1 block">Target Countries (comma separated, e.g., NG, US, GH)</label>
          <input value={targetCountries} onChange={e => setTargetCountries(e.target.value)} placeholder="NG, US, UK" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
        </div>

        <button onClick={handleCreateAd} disabled={loading} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-lg">
          {loading ? 'Creating...' : 'Publish Ad'}
        </button>
      </div>

      {/* Ads List */}
      <h2 className="text-lg font-bold text-gray-900 mb-4">Active Campaigns</h2>
      <div className="space-y-3">
        {ads.map(ad => (
          <div key={ad.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{ad.title}</h3>
              <p className="text-sm text-gray-500">{ad.description}</p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">Countries: {ad.target_countries.join(', ')}</span>
                <span className={`text-xs px-2 py-1 rounded ${ad.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {ad.is_active ? 'Active' : 'Paused'}
                </span>
              </div>
            </div>
            <button onClick={() => toggleAdStatus(ad.id, ad.is_active)} className="p-2 text-gray-400 hover:text-red-600">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
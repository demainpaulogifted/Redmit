import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { X } from 'lucide-react'

export default function AdBanner() {
  const { user } = useAuth()
  const [ad, setAd] = useState<any>(null)
  const [closed, setClosed] = useState(false)

  useEffect(() => {
    fetchSmartAd()
  }, [user])

  const fetchSmartAd = async () => {
    let userCountry = 'NG'
    if (user) {
      const { data } = await supabase.from('profiles').select('country').eq('id', user.id).single()
      if (data?.country) userCountry = data.country
    }
    const { data } = await supabase.from('ads').select('*').eq('is_active', true).limit(5)
    if (data && data.length > 0) {
      const matchedAd = data.find((a: any) => a.target_countries.includes('ALL') || a.target_countries.includes(userCountry))
      if (matchedAd) setAd(matchedAd)
    }
  }

  if (!ad || closed) return null

  // Wrap the whole thing in an <a> tag so title, image, and description are all clickable
  return (
    <a href={ad.link_url || '#'} target="_blank" rel="noopener noreferrer" className="block relative bg-white rounded-xl border border-gray-200 overflow-hidden mb-6 shadow-sm hover:shadow-md transition-shadow">
      <button onClick={(e) => { e.preventDefault(); setClosed(true) }} className="absolute top-2 right-2 z-10 p-1 bg-black/20 hover:bg-black/40 text-white rounded-full">
        <X className="w-4 h-4" />
      </button>
      
      {ad.image_url && (
        <div className="w-full h-40 md:h-56 bg-gray-100">
          <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover" />
        </div>
      )}
      
      <div className="p-4">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Sponsored</div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">{ad.title}</h3>
        <p className="text-sm text-gray-600 mb-3">{ad.description}</p>
        <div className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg">
          Learn More →
        </div>
      </div>
    </a>
  )
}
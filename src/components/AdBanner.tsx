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
    // 1. Get user's country (default to 'NG' if not logged in)
    let userCountry = 'NG'
    if (user) {
      const { data } = await supabase.from('profiles').select('country').eq('id', user.id).single()
      if (data?.country) userCountry = data.country
    }

    // 2. Detect device
    const isMobile = window.innerWidth < 768
    const device = isMobile ? 'mobile' : 'desktop'

    // 3. Fetch ads that match the country OR are set to 'all'
    const { data } = await supabase
      .from('ads')
      .select('*')
      .eq('is_active', true)
      .limit(1) // Just grab one for now
    
    if (data && data.length > 0) {
      // Simple client-side filtering for country/device
      const matchedAd = data.find((a: any) => 
        (a.target_countries.includes('ALL') || a.target_countries.includes(userCountry)) &&
        (a.target_devices.includes('ALL') || a.target_devices.includes(device))
      )
      if (matchedAd) setAd(matchedAd)
    }
  }

  if (!ad || closed) return null

  return (
    <div className="relative bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl p-4 mb-6 text-white shadow-lg">
      <button onClick={() => setClosed(true)} className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full">
        <X className="w-4 h-4" />
      </button>
      <div className="pr-6">
        <div className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-1">Sponsored</div>
        <h3 className="text-lg font-bold mb-1">{ad.title}</h3>
        <p className="text-sm text-blue-100 mb-3">{ad.description}</p>
        {ad.link_url && (
          <a href={ad.link_url} target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 bg-white text-blue-700 text-sm font-semibold rounded-lg hover:bg-blue-50 transition-colors">
            Learn More
          </a>
        )}
      </div>
    </div>
  )
}
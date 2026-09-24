import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { CreditCard, CheckCircle, Lock, TrendingUp } from 'lucide-react'
import Toast from '../components/Toast'

export default function CreatorSettings() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<any>(null)
  const [paymentUrl, setPaymentUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: any } | null>(null)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    fetchProfile()
  }, [user])

  const fetchProfile = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('id', user?.id).single()
    if (data) {
      setProfile(data)
      setPaymentUrl(data.payment_url || '')
    }
  }

  const handleSave = async () => {
    if (!paymentUrl) return setToast({ message: 'Please enter a payment URL', type: 'warning' })
    setLoading(true)
    
    // Super Thanks unlocks at 100 answers (hidden rule)
    const canEnable = (profile?.answers_count || 0) >= 100
    
    const { error } = await supabase.from('profiles').update({
      payment_url: paymentUrl,
      super_thanks_enabled: canEnable
    }).eq('id', user?.id)
    
    setLoading(false)
    if (error) setToast({ message: 'Error: ' + error.message, type: 'warning' })
    else {
      setProfile({ ...profile, payment_url: paymentUrl, super_thanks_enabled: canEnable })
      setToast({ 
        message: canEnable 
          ? '🎉 Super Thanks is now active on your profile!' 
          : `Keep answering! You need ${100 - (profile?.answers_count || 0)} more answers to unlock Super Thanks.`,
        type: canEnable ? 'success' : 'info'
      })
    }
  }

  if (!profile) return <div className="p-8 text-center">Loading...</div>

  const answersCount = profile.answers_count || 0
  const progressPercent = Math.min((answersCount / 100) * 100, 100)
  const isUnlocked = answersCount >= 100

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Creator Settings</h1>
      <p className="text-gray-600 mb-6">Configure your Super Thanks payment link.</p>

      {/* Progress Card */}
      <div className={`rounded-2xl border p-6 mb-6 ${isUnlocked ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-3 mb-3">
          {isUnlocked ? <CheckCircle className="w-6 h-6 text-green-600" /> : <Lock className="w-6 h-6 text-gray-400" />}
          <div>
            <h2 className="font-bold text-gray-900">
              {isUnlocked ? 'Super Thanks Unlocked! 🎉' : 'Super Thanks Locked'}
            </h2>
            <p className="text-sm text-gray-600">
              {isUnlocked 
                ? 'You can now receive Super Thanks from your followers.' 
                : 'Keep contributing quality answers to unlock monetization.'}
            </p>
          </div>
        </div>
        
        {!isUnlocked && (
          <>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <p className="text-xs text-gray-500">
              {answersCount} / 100 quality contributions
            </p>
          </>
        )}
      </div>

      {/* Payment Link Form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-blue-600" />
          <h2 className="font-bold text-gray-900">Payment Link</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Add your PayPal, BuyMeACoffee, or any payment link. Followers will use this to send you Super Thanks.
        </p>
        <input
          type="url"
          value={paymentUrl}
          onChange={e => setPaymentUrl(e.target.value)}
          placeholder="https://paypal.me/yourname"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-lg"
        >
          {loading ? 'Saving...' : 'Save Payment Link'}
        </button>
      </div>

      {/* Tip */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
        <div className="flex items-start gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">How Super Thanks Works</p>
            <p className="text-xs text-blue-700 mt-1">
              Once unlocked, a "Super Thanks" button appears on your posts. Followers can click it to send you money directly through your payment link.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
import { X, Heart } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// Updated to accept the new props (earnerId, replyId) so Post.tsx doesn't break
interface Props {
  open: boolean
  onClose: () => void
  creator: string
  earnerId?: string
  replyId?: string
  paymentUrl?: string
  isEligible?: boolean
  currency?: string
  prices?: any[]
}

export default function SuperThanks({ 
  open, 
  onClose, 
  creator, 
  earnerId,       // ✅ Now officially accepted
  replyId,        // ✅ Now officially accepted
  paymentUrl, 
  isEligible, 
  currency = 'USD', 
  prices = [{ amount: '5' }, { amount: '10' }, { amount: '25' }] 
}: Props) {
  const { user } = useAuth()
  if (!open) return null

  const handleSend = async (amount: string) => {
    // When we build the Wallet later, we'll use earnerId and replyId here
    // For now, just open the creator's PayPal link (or the platform default)
    const url = paymentUrl || 'https://www.paypal.com/ncp/payment/UJWZKUPGFQZH2'
    window.open(url, '_blank', 'noopener,noreferrer')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Heart className="w-5 h-5 text-blue-600 fill-blue-600" /> Super Thanks
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <p className="text-sm text-gray-600 mb-4">Support <b>{creator}</b> for their high-quality answer.</p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {prices.map((p: any, i: number) => (
            <button key={i} onClick={() => handleSend(p.amount)} className="py-2 bg-gray-100 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors">
              {currency} {p.amount}
            </button>
          ))}
        </div>
        <button onClick={onClose} className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium">Close</button>
      </div>
    </div>
  )
}
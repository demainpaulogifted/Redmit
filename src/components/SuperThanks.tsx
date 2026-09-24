import { X, Heart, Lock } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  creator: string
  paymentUrl?: string
  answersCount?: number
  currency?: string
  prices?: any[]
  isEligible?: boolean
}

export default function SuperThanks({ 
  open, onClose, creator, 
  paymentUrl, answersCount = 0,
  currency = 'USD', prices = [{ amount: '5' }, { amount: '10' }, { amount: '25' }],
  isEligible = true 
}: Props) {
  if (!open) return null

  // Hidden rule: 100 answers required (shown publicly as 1k followers)
  const hasEnoughAnswers = (answersCount || 0) >= 100

  if (!isEligible || !hasEnoughAnswers || !paymentUrl) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-gray-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Super Thanks Locked</h3>
          <p className="text-sm text-gray-600 mb-6">
            {creator} needs 1,000 active followers to unlock payments.
          </p>
          <button onClick={onClose} className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium">Close</button>
        </div>
      </div>
    )
  }

  const handleSend = (amount: string) => {
    window.open(paymentUrl, '_blank', 'noopener,noreferrer')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Heart className="w-5 h-5 text-blue-600 fill-blue-600" /> Super Thanks
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">Support {creator} directly.</p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {prices.map((p: any, i: number) => (
            <button 
              key={i} 
              onClick={() => handleSend(p.amount)}
              className="py-2 bg-gray-100 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors"
            >
              {currency} {p.amount}
            </button>
          ))}
        </div>
        <button onClick={onClose} className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium">Close</button>
      </div>
    </div>
  )
}
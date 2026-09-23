import { useState } from 'react'
import { X, Heart, Lock, CreditCard, CheckCircle, Loader2 } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  creator: string
  currency: string
  prices: { amount: string }[]
  isEligible: boolean
}

export default function SuperThanks({ open, onClose, creator, currency, prices, isEligible }: Props) {
  const [step, setStep] = useState<'select' | 'checkout' | 'processing' | 'success'>('select')
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null)
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')

  if (!open) return null

  const getCurrencySymbol = (curr: string) => {
    const symbols: any = { USD: '$', NGN: '₦', GBP: '£', EUR: '€', GHS: '₵' }
    return symbols[curr] || curr
  }

  const handleProceedToPay = () => {
    if (selectedAmount) setStep('checkout')
  }

  const handleConfirmPayment = () => {
    setStep('processing')
    // Simulate payment processing (In real app, this calls Paystack/Flutterwave Inline API)
    setTimeout(() => {
      setStep('success')
    }, 2000)
  }

  const handleClose = () => {
    setStep('select')
    setSelectedAmount(null)
    setCardNumber('')
    setExpiry('')
    setCvv('')
    onClose()
  }

  // 1. Eligibility Locked Screen
  if (!isEligible) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-gray-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Super Thanks Locked</h3>
          <p className="text-sm text-gray-600 mb-6">
            {creator} needs 1,000 active followers to unlock payments. Follow them to help!
          </p>
          <button onClick={handleClose} className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium">
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-blue-600 fill-blue-600" /> 
            {step === 'checkout' ? 'Checkout' : 'Super Thanks'}
          </h2>
          <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {/* STEP 1: Select Amount */}
          {step === 'select' && (
            <>
              <p className="text-sm text-gray-600 mb-4">
                Support <span className="font-semibold text-gray-900">{creator}</span> directly.
              </p>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {prices.map((p, index) => (
                  <button 
                    key={index} 
                    onClick={() => setSelectedAmount(p.amount)} 
                    className={`py-4 rounded-xl font-bold text-sm transition-all ${
                      selectedAmount === p.amount 
                        ? 'bg-blue-600 text-white shadow-lg scale-105 ring-2 ring-blue-200' 
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {getCurrencySymbol(currency)}{parseInt(p.amount).toLocaleString()}
                  </button>
                ))}
              </div>
              <button 
                onClick={handleProceedToPay}
                disabled={!selectedAmount}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold rounded-xl transition-all shadow-md"
              >
                Proceed to Pay
              </button>
            </>
          )}

          {/* STEP 2: In-App Card Checkout */}
          {step === 'checkout' && (
            <>
              <div className="bg-blue-50 rounded-xl p-4 mb-6 flex items-center justify-between">
                <span className="text-sm text-blue-800 font-medium">Amount to pay:</span>
                <span className="text-xl font-bold text-blue-900">
                  {getCurrencySymbol(currency)}{parseInt(selectedAmount || '0').toLocaleString()}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Card Number</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="0000 0000 0000 0000" 
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Expiry</label>
                    <input 
                      type="text" 
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="MM/YY" 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">CVV</label>
                    <input 
                      type="text" 
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="123" 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={handleConfirmPayment}
                className="w-full mt-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" /> Pay {getCurrencySymbol(currency)}{parseInt(selectedAmount || '0').toLocaleString()}
              </button>
              <button onClick={() => setStep('select')} className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700">
                ← Back to amounts
              </button>
            </>
          )}

          {/* STEP 3: Processing */}
          {step === 'processing' && (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <h3 className="text-lg font-bold text-gray-900">Processing Payment...</h3>
              <p className="text-sm text-gray-500 mt-1">Please wait while we secure your transaction.</p>
            </div>
          )}

          {/* STEP 4: Success */}
          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
              <p className="text-sm text-gray-600 mb-6">
                You successfully sent <span className="font-bold text-gray-900">{getCurrencySymbol(currency)}{parseInt(selectedAmount || '0').toLocaleString()}</span> to {creator}.
              </p>
              <button onClick={handleClose} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl">
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
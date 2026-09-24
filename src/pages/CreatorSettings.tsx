import { useState } from 'react'
import { Link, ArrowLeft, Plus, Trash2, Save, DollarSign } from 'lucide-react'

export default function CreatorSettings() {
  const [gatewayName, setGatewayName] = useState('Stripe')
  const [paymentUrl, setPaymentUrl] = useState('https://buy.stripe.com/your-link')
  const [currency, setCurrency] = useState('USD')
  const [prices, setPrices] = useState([
    { id: 1, amount: '1' },
    { id: 2, amount: '5' },
    { id: 3, amount: '10' }
  ])
  const [newPrice, setNewPrice] = useState('')

  const addPrice = () => {
    if (newPrice && !prices.find(p => p.amount === newPrice)) {
      setPrices([...prices, { id: Date.now(), amount: newPrice }].sort((a, b) => Number(a.amount) - Number(b.amount)))
      setNewPrice('')
    }
  }

  const removePrice = (id: number) => {
    setPrices(prices.filter(p => p.id !== id))
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Link to="/profile" className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Profile
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Monetization Settings</h1>
      <p className="text-sm text-gray-500 mb-6">Configure how your community supports you via Super Thanks.</p>

      {/* Payment Gateway Setup */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-blue-600" /> Payment Gateway
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Gateway Name (for display)</label>
            <select 
              value={gatewayName} 
              onChange={(e) => setGatewayName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="Stripe">Stripe</option>
              <option value="Paystack">Paystack</option>
              <option value="Flutterwave">Flutterwave</option>
              <option value="PayPal">PayPal</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Currency</label>
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="USD">USD ($)</option>
              <option value="NGN">NGN (₦)</option>
              <option value="GBP">GBP (£)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GHS">GHS (₵)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Base Payment URL</label>
            <input 
              type="url" 
              value={paymentUrl} 
              onChange={(e) => setPaymentUrl(e.target.value)} 
              placeholder="https://buy.stripe.com/..." 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" 
            />
            <p className="text-xs text-gray-400 mt-1">We will automatically append the amount and currency to this link.</p>
          </div>
        </div>
      </div>

      {/* Super Thanks Amounts */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Super Thanks Amounts</h2>
        <p className="text-sm text-gray-500 mb-4">Set the exact amounts fans can send you. Encourage 3-5 standard tiers.</p>
        
        <div className="space-y-3 mb-4">
          {prices.map(p => (
            <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-900">
                {currency === 'USD' ? '$' : currency === 'NGN' ? '₦' : currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '₵'} 
                {parseInt(p.amount).toLocaleString()}
              </span>
              <button onClick={() => removePrice(p.id)} className="text-red-500 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input 
            type="number" 
            value={newPrice} 
            onChange={(e) => setNewPrice(e.target.value)} 
            placeholder="Enter amount" 
            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" 
          />
          <button onClick={addPrice} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 shadow-md">
        <Save className="w-5 h-5" /> Save Monetization Settings
      </button>
    </div>
  )
}
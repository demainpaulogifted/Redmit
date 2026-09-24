import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { countries } from '../data/mockData'

export default function Signup() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [country, setCountry] = useState('NG')
  const [interests, setInterests] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const allInterests = ['Personal Finance', 'Technology', 'Business', 'Jobs', 'Education', 'Sports', 'Entertainment', 'Travel', 'Cars', 'Relationships', 'Gaming', 'Food', 'Health', 'News']

  const toggleInterest = (i: string) => {
    setInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])
  }

  const handleSignup = async () => {
    if (interests.length < 3) {
      setError('Please select at least 3 interests to personalize your feed.')
      return
    }
    setLoading(true)
    setError('')
    
    const { error } = await signUp(email, password, {
      username,
      display_name: displayName,
      country,
      interests
    })

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      navigate('/') // Soft verification: let them in immediately
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 justify-center">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg font-bold">R</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Redmit</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Join Redmit</h1>
          <p className="text-gray-600 mt-1">Real People. Real Conversations.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password (min 6 chars)" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <button onClick={() => email && password ? setStep(2) : setError('Please fill in email and password')} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">Continue</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Username</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="@username" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Display Name</label>
                <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="How should we call you?" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Country</label>
                <select value={country} onChange={e => setCountry(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  {countries.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setStep(1)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg">Back</button>
                <button onClick={() => username && displayName ? setStep(3) : setError('Please fill in username and name')} className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-lg">Next</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">What are you interested in?</h2>
              <p className="text-sm text-gray-600 mb-4">Select at least 3 topics to personalize your feed.</p>
              <div className="grid grid-cols-2 gap-2 mb-4 max-h-60 overflow-y-auto">
                {allInterests.map(i => (
                  <button key={i} onClick={() => toggleInterest(i)} className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${interests.includes(i) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                    {i}
                  </button>
                ))}
              </div>
              {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
              <div className="flex gap-2">
                <button onClick={() => setStep(2)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg">Back</button>
                <button onClick={handleSignup} disabled={loading} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-lg">
                  {loading ? 'Creating Account...' : 'Complete Setup'}
                </button>
              </div>
            </div>
          )}

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account? <Link to="/login" className="text-blue-600 font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
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
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Choose a username" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">Create Account</button>
          </div>
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account? <Link to="/login" className="text-blue-600 font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
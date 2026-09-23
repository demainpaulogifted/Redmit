import CreatorCard from '../components/CreatorCard'
import { creators } from '../data/mockData'

export default function Creators() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Creators</h1>
      <p className="text-gray-600 mb-6">Follow amazing creators and support them with Super Thanks.</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {creators.map(c => <CreatorCard key={c.id} creator={c} />)}
      </div>
    </div>
  )
}
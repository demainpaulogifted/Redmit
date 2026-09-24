import CommunityCard from '../components/CommunityCard'
import { communities } from '../data/mockData'
export default function Communities() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Communities</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {communities.map(c => <CommunityCard key={c.id} community={c} />)}
      </div>
    </div>
  )
}
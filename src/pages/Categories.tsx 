import { useState } from 'react'
import CategoryCard from '../components/CategoryCard'
import { categories } from '../data/mockData'
import { Search } from 'lucide-react'

export default function Categories() {
  const [search, setSearch] = useState('')
  const filtered = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">All Categories</h1>
      <p className="text-gray-600 mb-6">Browse topics and find discussions that interest you.</p>
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search categories..." className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(c => <CategoryCard key={c.id} category={c} />)}
      </div>
    </div>
  )
}
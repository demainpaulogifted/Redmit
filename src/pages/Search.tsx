import { useState } from 'react'
import { Search as SearchIcon } from 'lucide-react'
import PostCard from '../components/PostCard'
import { posts } from '../data/mockData'
export default function SearchPage() {
  const [query, setQuery] = useState('')
  const filtered = posts.filter(p => p.title.toLowerCase().includes(query.toLowerCase()))
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Redmit</h1>
      <div className="relative max-w-2xl mb-6">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search posts..." className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-blue-500 focus:outline-none" autoFocus />
      </div>
      <div className="space-y-4">
        {query && filtered.length > 0 ? filtered.map(p => <PostCard key={p.id} post={p} />) : <div className="text-center py-12 text-gray-500">{query ? 'No results found.' : 'Start typing to search.'}</div>}
      </div>
    </div>
  )
}
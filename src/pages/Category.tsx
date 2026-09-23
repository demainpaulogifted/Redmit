import { useParams } from 'react-router-dom'
import PostCard from '../components/PostCard'
import { categories, posts } from '../data/mockData'

export default function CategoryPage() {
  const { id } = useParams()
  const category = categories.find(c => c.id === id)
  const categoryPosts = posts.filter(p => p.category === category?.name)

  if (!category) return <div className="p-8 text-center text-gray-500">Category not found</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg`}>{category.icon}</div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
          <p className="text-gray-600 mt-1">{category.description}</p>
        </div>
      </div>
      <div className="space-y-4">
        {categoryPosts.length > 0 ? categoryPosts.map(p => <PostCard key={p.id} post={p} />) : <div className="text-center py-12 text-gray-500">No discussions yet.</div>}
      </div>
    </div>
  )
}
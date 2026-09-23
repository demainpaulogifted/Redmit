import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

interface Category {
  id: string
  name: string
  icon: string
  color: string
  topics: number
  posts: number
  description: string
}

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link to={`/category/${category.id}`} className="group bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all p-5">
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-12 h-12 ${category.color} rounded-xl flex items-center justify-center text-2xl shadow-sm`}>
          {category.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{category.name}</h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{category.description}</p>
          <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
            <span>{(category.topics / 1000).toFixed(1)}k topics</span>
            <span>·</span>
            <span>{(category.posts / 1000).toFixed(1)}k posts</span>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 mt-1" />
      </div>
    </Link>
  )
}
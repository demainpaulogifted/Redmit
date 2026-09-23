import { useState } from 'react'
import { categories } from '../data/mockData'
export default function CreatePost() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Post</h1>
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Category</label>
          <select className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <option value="">Select a category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter a clear title" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
        </div>
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Content</label>
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write your question or discussion here..." rows={6} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" />
        </div>
        <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">Post Topic</button>
      </div>
    </div>
  )
}
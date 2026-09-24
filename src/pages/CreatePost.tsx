import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { categories } from '../data/mockData'
import { Image as ImageIcon, Upload } from 'lucide-react'

export default function CreatePost() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const handlePost = async () => {
    if (!user) return navigate('/login')
    if (!title || !content || !categoryId) return alert('Please fill in title, content, and category')
    
    setLoading(true)
    let imageUrl = ''

    // 1. Upload Image if selected
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      const { data, error: uploadError } = await supabase.storage.from('uploads').upload(fileName, imageFile)
      
      if (uploadError) { alert('Image upload failed'); setLoading(false); return; }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage.from('uploads').getPublicUrl(fileName)
      imageUrl = publicUrl
    }

    // 2. Save Post to Database
    const { error } = await supabase.from('posts').insert([{ 
      title, content, image_url: imageUrl, author_id: user.id, category_id: categoryId 
    }])
    setLoading(false)
    
    if (error) alert('Error posting: ' + error.message)
    else navigate('/') 
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Post</h1>
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Category</label>
          <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm">
            <option value="">Select a category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter a clear title" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
        </div>
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Content</label>
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write your question or discussion here..." rows={6} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none" />
        </div>
        
        {/* Image Upload from Gallery */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 mb-1.5 block flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4" /> Add Image (Optional)
          </label>
          <label className="flex items-center justify-center w-full h-32 px-4 transition bg-gray-50 border-2 border-gray-300 border-dashed rounded-lg appearance-none cursor-pointer hover:border-blue-500 focus:outline-none">
            <span className="flex items-center space-x-2">
              <Upload className="w-6 h-6 text-gray-400" />
              <span className="font-medium text-gray-400">{imageFile ? imageFile.name : 'Tap to choose from gallery'}</span>
            </span>
            <input type="file" className="hidden" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
          </label>
        </div>

        <button onClick={handlePost} disabled={loading} className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-lg">
          {loading ? 'Posting...' : 'Post Topic'}
        </button>
      </div>
    </div>
  )
}
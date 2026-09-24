import { useParams } from 'react-router-dom'
import { ArrowLeft, Heart, MessageCircle, Share2, Bookmark, ThumbsUp } from 'lucide-react'
import { posts, replies } from '../data/mockData'
import SEO from '../components/SEO'

export default function PostPage() {
  const { id } = useParams()
  const post = posts.find(p => p.id === id) || posts[0]

  if (!post) return <div className="p-8 text-center">Post not found</div>

  return (
    <>
      <SEO
        title={post.title}
        description={post.content.substring(0, 160)}
        type="article"
        authorName={post.author.displayName}
        publishedTime={post.timestamp}
        tags={post.tags}
        url={window.location.href}
      />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to discussions
        </button>
        
        <article className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-2xl">
              {post.author.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-900">{post.author.displayName}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                  {post.author.badge}
                </span>
                <span className="text-xs text-gray-500">· {post.timestamp}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-gray-500">{post.category}</span>
                <span className="text-xs text-gray-400">·</span>
                <span className="text-xs text-gray-500">{post.community}</span>
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">{post.title}</h1>
          <p className="text-gray-700 leading-relaxed mb-4">{post.content}</p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.map(t => (
              <span key={t} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md">#{t}</span>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-gray-100 flex-wrap">
            <button className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 text-sm font-medium">
              <Heart className="w-4 h-4" /> {post.likes} Likes
            </button>
            <button className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 text-sm font-medium">
              <MessageCircle className="w-4 h-4" /> {post.replies} Replies
            </button>
            <button className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 text-sm font-medium">
              <Share2 className="w-4 h-4" /> {post.shares} Shares
            </button>
            <button className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 text-sm font-medium ml-auto">
              <Bookmark className="w-4 h-4" /> Save
            </button>
          </div>
        </article>

        <h2 className="text-lg font-bold text-gray-900 mb-4">Replies ({replies.length})</h2>
        <div className="space-y-4">
          {replies.map(r => (
            <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                  {r.author.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-gray-900">{r.author.displayName}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      r.author.badge === 'Trusted Member' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {r.author.badge}
                    </span>
                    <span className="text-xs text-gray-500">· {r.timestamp}</span>
                  </div>
                  <p className="mt-2 text-gray-700 leading-relaxed">{r.content}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600">
                      <ThumbsUp className="w-3 h-3" /> {r.likes}
                    </button>
                    <button className="text-xs text-gray-500 hover:text-blue-600">Reply</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

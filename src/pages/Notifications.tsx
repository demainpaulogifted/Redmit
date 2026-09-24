import { Bell } from 'lucide-react'
import { notifications } from '../data/mockData'
export default function Notifications() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Notifications</h1>
      <div className="space-y-2">
        {notifications.map(n => (
          <div key={n.id} className={`bg-white rounded-xl border p-4 flex items-start gap-3 ${n.read ? 'border-gray-200' : 'border-blue-200 bg-blue-50'}`}>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0"><Bell className="w-4 h-4 text-blue-600" /></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900"><span className="font-semibold">{n.user}</span> {n.content}</p>
              <p className="text-xs text-gray-500 mt-1">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
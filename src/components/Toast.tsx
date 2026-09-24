import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, LogIn, AlertCircle, CheckCircle } from 'lucide-react'

interface ToastProps {
  message: string
  type?: 'info' | 'success' | 'warning'
  redirect?: string
  onClose: () => void
}

export default function Toast({ message, type = 'info', redirect, onClose }: ToastProps) {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
      if (redirect) navigate(redirect)
    }, 2500)
    return () => clearTimeout(timer)
  }, [redirect, navigate, onClose])

  const bgColor = type === 'success' ? 'bg-green-600' : type === 'warning' ? 'bg-amber-600' : 'bg-blue-600'
  const Icon = type === 'success' ? CheckCircle : type === 'warning' ? AlertCircle : LogIn

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
      <div className={`${bgColor} text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 max-w-sm`}>
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm font-medium">{message}</span>
        <button onClick={() => { setVisible(false); setTimeout(onClose, 300) }} className="ml-2 p-1 hover:bg-white/20 rounded-full">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
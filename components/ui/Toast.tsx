import React from 'react'
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react'
import { useToast } from '../../hooks/useToast'
import type { Toast as ToastType } from '../../types'

const icons: Record<ToastType['type'], React.ReactNode> = {
  success: <CheckCircle className="w-4 h-4 shrink-0" />,
  error: <AlertCircle className="w-4 h-4 shrink-0" />,
  info: <Info className="w-4 h-4 shrink-0" />,
}

const styles: Record<ToastType['type'], string> = {
  success: 'bg-green-500/15 border-green-500/30 text-green-300',
  error: 'bg-red-500/15 border-red-500/30 text-red-300',
  info: 'bg-yellow-500/15 border-yellow-500/30 text-yellow-300',
}

const ToastItem: React.FC<{ toast: ToastType }> = ({ toast }) => {
  const { removeToast } = useToast()

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border glass-card text-sm font-semibold animate-fade-in ${styles[toast.type]}`}>
      {icons[toast.type]}
      <span className="flex-1">{toast.message}</span>
      <button onClick={() => removeToast(toast.id)} className="opacity-60 hover:opacity-100 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export const ToastContainer: React.FC = () => {
  const { toasts } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map(t => <ToastItem key={t.id} toast={t} />)}
    </div>
  )
}

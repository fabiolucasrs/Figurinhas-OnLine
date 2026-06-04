import React, { useEffect } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg' }

export const Modal: React.FC<ModalProps> = ({ open, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`glass-card rounded-2xl w-full ${sizes[size]} border border-white/20 shadow-2xl`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h3 className="font-display font-bold text-white text-base">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

interface ConfirmModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmLabel?: string
  confirmClass?: string
  loading?: boolean
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open, onClose, onConfirm, title, description,
  confirmLabel = 'Confirmar', confirmClass = 'bg-red-600 hover:bg-red-700', loading,
}) => (
  <Modal open={open} onClose={onClose} title={title} size="sm">
    <p className="text-sm text-slate-300 mb-6">{description}</p>
    <div className="flex gap-3 justify-end">
      <button
        onClick={onClose}
        className="px-4 py-2 rounded-xl glass-card text-sm font-semibold text-slate-300 hover:text-white transition-colors"
      >
        Cancelar
      </button>
      <button
        onClick={onConfirm}
        disabled={loading}
        className={`px-4 py-2 rounded-xl text-sm font-bold text-white transition-all ${confirmClass} disabled:opacity-50`}
      >
        {loading ? 'Aguarde...' : confirmLabel}
      </button>
    </div>
  </Modal>
)

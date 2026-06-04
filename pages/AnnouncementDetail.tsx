import React, { useEffect, useState } from 'react'
import { ArrowLeft, Flag, ShieldAlert, Star } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { StickerCardVisual } from '../components/StickerCardVisual'
import { ConfirmModal, Modal } from '../components/ui/Modal'
import { SkeletonCard } from '../components/ui/SkeletonCard'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { announcementsService } from '../services/announcements.service'
import { purchasesService } from '../services/purchases.service'
import { reportsService } from '../services/reports.service'
import type { Announcement } from '../types'
import { formatCurrency, formatDate } from '../utils/format'

const conditionColors: Record<string, string> = {
  Nova: 'bg-green-500/20 text-green-400 border-green-500/30',
  Usada: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Repetida: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
}

export const AnnouncementDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showToast } = useToast()

  const [announcement, setAnnouncement] = useState<Announcement | null>(null)
  const [related, setRelated] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [buying, setBuying] = useState(false)
  const [buyConfirm, setBuyConfirm] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [reportReason, setReportReason] = useState('')

  useEffect(() => {
    if (!id) return
    announcementsService.get(Number(id))
      .then(a => {
        setAnnouncement(a)
        return announcementsService.list({ country: a.sticker_country })
      })
      .then(res => setRelated(res.data.filter(a => a.id !== Number(id)).slice(0, 4)))
      .catch(() => showToast('error', 'Anúncio não encontrado.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleBuy = async () => {
    if (!user) { navigate('/login'); return }
    setBuying(true)
    try {
      await purchasesService.buy(Number(id))
      showToast('success', 'Compra realizada! Verifique suas compras no painel.')
      setBuyConfirm(false)
      navigate('/painel/compras')
    } catch (err: unknown) {
      showToast('error', err instanceof Error ? err.message : 'Erro ao realizar compra.')
    } finally {
      setBuying(false)
    }
  }

  const handleReport = async () => {
    if (!reportReason.trim()) { showToast('error', 'Descreva o motivo da denúncia.'); return }
    try {
      await reportsService.create(Number(id), reportReason)
      showToast('success', 'Denúncia enviada com sucesso!')
      setReportOpen(false)
      setReportReason('')
    } catch (err: unknown) {
      showToast('error', err instanceof Error ? err.message : 'Erro ao enviar denúncia.')
    }
  }

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SkeletonCard />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-10 bg-white/10 rounded-xl animate-pulse" />)}
        </div>
      </div>
    </div>
  )

  if (!announcement) return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <p className="text-slate-400">Anúncio não encontrado.</p>
      <Link to="/home" className="mt-4 inline-block text-yellow-400 font-bold">← Voltar</Link>
    </div>
  )

  const isOwner = user?.id === announcement.seller.id

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Sticker visual */}
        <div className="flex flex-col items-center gap-6">
          <div className="glass-card rounded-3xl p-8 flex items-center justify-center">
            <StickerCardVisual
              name={announcement.sticker_name}
              country={announcement.sticker_country}
              number={announcement.sticker_number}
              position={announcement.sticker_position}
              rarity={announcement.sticker_rarity}
              photoUrl={announcement.photo_url}
              size="lg"
            />
          </div>
          {announcement.description && (
            <div className="glass-card rounded-2xl p-4 w-full text-left">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Descrição</p>
              <p className="text-sm text-slate-300">{announcement.description}</p>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-5 text-left">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${conditionColors[announcement.condition] ?? ''}`}>
                {announcement.condition}
              </span>
              <span className="text-xs text-slate-400 font-mono">{announcement.sticker_number}</span>
            </div>
            <h1 className="font-display font-black text-3xl text-white">{announcement.sticker_name}</h1>
            <p className="text-slate-400 flex items-center gap-1 mt-1">
              <Flag className="w-4 h-4" /> {announcement.sticker_country} · {announcement.sticker_position}
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Preço unitário</span>
              <span className="font-mono text-2xl font-black text-lime-400">{formatCurrency(announcement.price)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Quantidade disponível</span>
              <span className="font-bold text-white">{announcement.quantity} un.</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Raridade</span>
              <span className="font-bold text-white">{announcement.sticker_rarity}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Publicado em</span>
              <span className="text-white text-sm">{formatDate(announcement.created_at)}</span>
            </div>
          </div>

          {/* Seller card */}
          <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center font-bold text-white text-lg">
              {announcement.seller.avatar ? (
                <img src={announcement.seller.avatar} alt={announcement.seller.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                announcement.seller.name.charAt(0)
              )}
            </div>
            <div className="flex-1 text-left">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Vendedor</p>
              <p className="font-display font-bold text-white">{announcement.seller.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-3 h-3 ${i < Math.round(announcement.seller.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
                ))}
                <span className="text-xs text-slate-400 ml-1">{announcement.seller.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          {!isOwner && announcement.status === 'Ativo' && (
            <button
              onClick={() => user ? setBuyConfirm(true) : navigate('/login')}
              className="w-full bg-gradient-to-r from-green-500 to-lime-400 hover:from-green-600 hover:to-lime-500 text-slate-950 font-extrabold py-4 rounded-2xl text-base transition-all hover:scale-[1.02] shadow-lg shadow-green-950/40"
            >
              Tenho Interesse / Comprar
            </button>
          )}

          {announcement.status !== 'Ativo' && (
            <div className="w-full py-4 rounded-2xl glass-card text-center text-slate-400 font-bold text-sm">
              Este anúncio está {announcement.status === 'Vendido' ? 'vendido' : 'pausado'}
            </div>
          )}

          {user && !isOwner && (
            <button
              onClick={() => setReportOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl glass-card text-xs font-semibold text-slate-400 hover:text-red-300 transition-colors"
            >
              <ShieldAlert className="w-4 h-4" /> Denunciar anúncio
            </button>
          )}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-display font-bold text-xl text-white">Figurinhas Relacionadas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map(r => (
              <Link key={r.id} to={`/anuncios/${r.id}`} className="glass-card glass-card-hover rounded-xl p-3 flex flex-col items-center gap-2">
                <StickerCardVisual name={r.sticker_name} country={r.sticker_country} number={r.sticker_number} position={r.sticker_position} rarity={r.sticker_rarity} size="sm" />
                <p className="text-xs font-bold text-white truncate w-full text-center">{r.sticker_name}</p>
                <p className="font-mono text-lime-400 text-sm font-black">{formatCurrency(r.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Buy confirm modal */}
      <ConfirmModal
        open={buyConfirm}
        onClose={() => setBuyConfirm(false)}
        onConfirm={handleBuy}
        title="Confirmar Compra"
        description={`Deseja comprar a figurinha de ${announcement.sticker_name} por ${formatCurrency(announcement.price)}?`}
        confirmLabel="Confirmar Compra"
        confirmClass="bg-green-600 hover:bg-green-700"
        loading={buying}
      />

      {/* Report modal */}
      <Modal open={reportOpen} onClose={() => setReportOpen(false)} title="Denunciar Anúncio" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-slate-300">Descreva o motivo da denúncia deste anúncio.</p>
          <textarea
            value={reportReason}
            onChange={e => setReportReason(e.target.value)}
            placeholder="Descreva o problema..."
            rows={4}
            className="w-full glass-input p-3 rounded-xl text-sm resize-none"
          />
          <div className="flex gap-3 justify-end">
            <button onClick={() => setReportOpen(false)} className="px-4 py-2 rounded-xl glass-card text-sm font-semibold text-slate-300">Cancelar</button>
            <button onClick={handleReport} className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-all">Enviar Denúncia</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

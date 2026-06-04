import React, { useEffect, useRef, useState } from 'react'
import {
  Edit, Heart, Pause, Play, Settings, ShoppingBag, Star,
  Trash2, User, X
} from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { EmptyState } from '../components/ui/EmptyState'
import { ConfirmModal } from '../components/ui/Modal'
import { StickerCardVisual } from '../components/StickerCardVisual'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { announcementsService } from '../services/announcements.service'
import { favoritesService } from '../services/favorites.service'
import { purchasesService } from '../services/purchases.service'
import type { Announcement, Purchase, User as UserType } from '../types'
import { formatCurrency, formatDate, getInitials } from '../utils/format'

type Tab = 'anuncios' | 'compras' | 'favoritos' | 'configuracoes'

const statusColors: Record<string, string> = {
  Ativo: 'bg-green-500/20 text-green-400 border-green-500/30',
  Pausado: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Vendido: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  Pendente: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Enviado: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Recebido: 'bg-green-500/20 text-green-400 border-green-500/30',
  Cancelado: 'bg-red-500/20 text-red-400 border-red-500/30',
}

export const MyProfile: React.FC = () => {
  const { tab: tabParam } = useParams<{ tab?: Tab }>()
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const { showToast } = useToast()

  const [activeTab, setActiveTab] = useState<Tab>((tabParam as Tab) ?? 'anuncios')
  const [myAds, setMyAds] = useState<Announcement[]>([])
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [favorites, setFavorites] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [profileForm, setProfileForm] = useState({ name: user?.name ?? '', email: user?.email ?? '' })
  const [savingProfile, setSavingProfile] = useState(false)
  const avatarRef = useRef<HTMLInputElement>(null)

  const changeTab = (t: Tab) => {
    setActiveTab(t)
    navigate(`/painel/${t}`, { replace: true })
  }

  useEffect(() => {
    if (tabParam && tabParam !== activeTab) setActiveTab(tabParam as Tab)
  }, [tabParam])

  useEffect(() => {
    setLoading(true)
    const load = activeTab === 'anuncios'
      ? announcementsService.myAnnouncements().then(setMyAds)
      : activeTab === 'compras'
      ? purchasesService.myPurchases().then(setPurchases)
      : activeTab === 'favoritos'
      ? favoritesService.list().then(setFavorites)
      : Promise.resolve()

    load.catch(() => showToast('error', 'Erro ao carregar dados.')).finally(() => setLoading(false))
  }, [activeTab])

  const handleToggleStatus = async (id: number) => {
    try {
      const updated = await announcementsService.toggleStatus(id)
      setMyAds(prev => prev.map(a => a.id === id ? { ...a, status: updated.status } : a))
      showToast('success', `Anúncio ${updated.status === 'Ativo' ? 'reativado' : 'pausado'}!`)
    } catch {
      showToast('error', 'Erro ao atualizar status.')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await announcementsService.delete(deleteId)
      setMyAds(prev => prev.filter(a => a.id !== deleteId))
      showToast('success', 'Anúncio excluído.')
      setDeleteId(null)
    } catch {
      showToast('error', 'Erro ao excluir anúncio.')
    } finally {
      setDeleting(false)
    }
  }

  const handleUnfavorite = async (id: number) => {
    try {
      await favoritesService.toggle(id)
      setFavorites(prev => prev.filter(a => a.id !== id))
      showToast('info', 'Removido dos favoritos.')
    } catch {
      showToast('error', 'Erro ao remover favorito.')
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingProfile(true)
    try {
      const { data } = await import('../services/api').then(m => m.default.put<{ data: UserType }>('/auth/profile', profileForm))
      updateUser(data.data)
      showToast('success', 'Perfil atualizado com sucesso!')
    } catch (err: unknown) {
      showToast('error', err instanceof Error ? err.message : 'Erro ao salvar perfil.')
    } finally {
      setSavingProfile(false)
    }
  }

  const tabs = [
    { key: 'anuncios' as Tab, label: 'Meus Anúncios', icon: <Star className="w-4 h-4" /> },
    { key: 'compras' as Tab, label: 'Minhas Compras', icon: <ShoppingBag className="w-4 h-4" /> },
    { key: 'favoritos' as Tab, label: 'Favoritos', icon: <Heart className="w-4 h-4" /> },
    { key: 'configuracoes' as Tab, label: 'Configurações', icon: <Settings className="w-4 h-4" /> },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-4">
          {/* Profile card */}
          <div className="glass-card rounded-2xl p-5 text-center space-y-3">
            <div className="relative inline-block">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover mx-auto" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center text-xl font-bold mx-auto">
                  {getInitials(user?.name ?? '')}
                </div>
              )}
            </div>
            <div>
              <p className="font-display font-bold text-white">{user?.name}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
            <div className="text-xs text-slate-400 pt-1 border-t border-white/10">
              Saldo: <span className="text-lime-400 font-mono font-bold">{formatCurrency(user?.balance ?? 0)}</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="glass-card rounded-2xl p-2 space-y-1">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => changeTab(t.key)}
                className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-left transition-all ${
                  activeTab === t.key
                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="lg:col-span-9 glass-card rounded-2xl p-6 space-y-6 min-h-[400px]">
          {/* Meus Anúncios */}
          {activeTab === 'anuncios' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="font-display font-bold text-xl text-white">Meus Anúncios</h2>
                <Link to="/anuncios/novo" className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white text-sm font-bold transition-all">
                  + Novo Anúncio
                </Link>
              </div>

              {loading ? (
                <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />)}</div>
              ) : myAds.length === 0 ? (
                <EmptyState emoji="📋" title="Nenhum anúncio publicado" description="Comece a vender suas figurinhas repetidas agora mesmo!" action={<Link to="/anuncios/novo" className="px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-bold">Criar primeiro anúncio</Link>} />
              ) : (
                <div className="space-y-3">
                  {myAds.map(ad => (
                    <div key={ad.id} className="glass-card rounded-xl p-4 flex items-center gap-4">
                      <StickerCardVisual name={ad.sticker_name} country={ad.sticker_country} number={ad.sticker_number} position={ad.sticker_position} rarity={ad.sticker_rarity} size="sm" />
                      <div className="flex-1 text-left min-w-0">
                        <h3 className="font-bold text-white truncate">{ad.sticker_name}</h3>
                        <p className="text-xs text-slate-400">{ad.sticker_country} · {ad.sticker_position} · {ad.condition}</p>
                        <p className="font-mono text-lime-400 font-bold mt-1">{formatCurrency(ad.price)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${statusColors[ad.status]}`}>{ad.status}</span>
                        <div className="flex gap-1">
                          <Link to={`/anuncios/${ad.id}/editar`} className="p-1.5 rounded-lg glass-card hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                          {ad.status !== 'Vendido' && (
                            <button onClick={() => handleToggleStatus(ad.id)} className="p-1.5 rounded-lg glass-card hover:bg-white/10 text-slate-400 hover:text-yellow-400 transition-colors">
                              {ad.status === 'Ativo' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                            </button>
                          )}
                          <button onClick={() => setDeleteId(ad.id)} className="p-1.5 rounded-lg glass-card hover:bg-white/10 text-slate-400 hover:text-red-400 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Minhas Compras */}
          {activeTab === 'compras' && (
            <div className="space-y-4">
              <h2 className="font-display font-bold text-xl text-white">Minhas Compras</h2>
              {loading ? (
                <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />)}</div>
              ) : purchases.length === 0 ? (
                <EmptyState emoji="🛒" title="Nenhuma compra realizada" description="Explore os anúncios e encontre sua figurinha favorita!" action={<Link to="/home" className="px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-bold">Explorar figurinhas</Link>} />
              ) : (
                <div className="space-y-3">
                  {purchases.map(p => (
                    <div key={p.id} className="glass-card rounded-xl p-4 flex items-center gap-4 text-left">
                      <div className="w-10 h-10 rounded-xl bg-green-600/20 flex items-center justify-center text-lg">⚽</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white truncate">{p.sticker_name} ({p.sticker_number})</h3>
                        <p className="text-xs text-slate-400">{p.sticker_country} · Vendedor: {p.seller_name}</p>
                        <p className="text-xs text-slate-500">{formatDate(p.created_at)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="font-mono text-lime-400 font-bold">{formatCurrency(p.price)}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${statusColors[p.status]}`}>{p.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Favoritos */}
          {activeTab === 'favoritos' && (
            <div className="space-y-4">
              <h2 className="font-display font-bold text-xl text-white">Favoritos</h2>
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-48 bg-white/5 rounded-xl animate-pulse" />)}</div>
              ) : favorites.length === 0 ? (
                <EmptyState emoji="❤️" title="Nenhum favorito salvo" description="Marque figurinhas com o coração para salvá-las aqui." action={<Link to="/home" className="px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-bold">Explorar</Link>} />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {favorites.map(ad => (
                    <div key={ad.id} className="glass-card glass-card-hover rounded-xl p-3 flex flex-col items-center gap-2 relative">
                      <button onClick={() => handleUnfavorite(ad.id)} className="absolute top-2 right-2 p-1 rounded-full glass-card text-red-400 hover:bg-white/10 z-10">
                        <X className="w-3 h-3" />
                      </button>
                      <Link to={`/anuncios/${ad.id}`}>
                        <StickerCardVisual name={ad.sticker_name} country={ad.sticker_country} number={ad.sticker_number} position={ad.sticker_position} rarity={ad.sticker_rarity} size="sm" />
                      </Link>
                      <p className="text-xs font-bold text-white truncate w-full text-center">{ad.sticker_name}</p>
                      <p className="font-mono text-lime-400 text-sm font-black">{formatCurrency(ad.price)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Configurações */}
          {activeTab === 'configuracoes' && (
            <div className="space-y-6 max-w-md">
              <h2 className="font-display font-bold text-xl text-white">Configurações de Perfil</h2>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-1 text-left">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Nome Completo</label>
                  <input
                    value={profileForm.name}
                    onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-1 text-left">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">E-mail</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full bg-gradient-to-r from-green-500 to-lime-400 text-slate-950 font-extrabold py-3 rounded-xl text-sm transition-all disabled:opacity-50"
                >
                  {savingProfile ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      <ConfirmModal
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Excluir Anúncio"
        description="Deseja realmente excluir este anúncio? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        loading={deleting}
      />
    </div>
  )
}

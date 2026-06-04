import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Plus, Search, SlidersHorizontal } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AnnouncementCard } from '../components/AnnouncementCard'
import { EmptyState } from '../components/ui/EmptyState'
import { SkeletonCard } from '../components/ui/SkeletonCard'
import { useToast } from '../hooks/useToast'
import { announcementsService } from '../services/announcements.service'
import { favoritesService } from '../services/favorites.service'
import type { Announcement } from '../types'
import { COUNTRIES, CONDITIONS, MAX_PRICE, POSITIONS } from '../utils/constants'

export const HomePage: React.FC = () => {
  const { showToast } = useToast()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [search, setSearch] = useState('')
  const [country, setCountry] = useState('Todos')
  const [position, setPosition] = useState('Todos')
  const [condition, setCondition] = useState('Todos')
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const load = useCallback(async (reset = false) => {
    setLoading(true)
    try {
      const p = reset ? 1 : page
      const res = await announcementsService.list({
        search: search || undefined,
        country: country !== 'Todos' ? country : undefined,
        position: position !== 'Todos' ? position : undefined,
        condition: condition !== 'Todos' ? condition : undefined,
        max_price: maxPrice < MAX_PRICE ? maxPrice : undefined,
        page: p,
      })
      setAnnouncements(prev => reset ? res.data : [...prev, ...res.data])
      setLastPage(res.last_page)
      if (reset) setPage(1)
    } catch {
      showToast('error', 'Erro ao carregar anúncios.')
    } finally {
      setLoading(false)
    }
  }, [search, country, position, condition, maxPrice, page, showToast])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => load(true), 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [search, country, position, condition, maxPrice])

  const handleFavorite = async (id: number) => {
    try {
      const { favorited } = await favoritesService.toggle(id)
      setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, is_favorited: favorited } : a))
      showToast('success', favorited ? 'Adicionado aos favoritos!' : 'Removido dos favoritos.')
    } catch {
      showToast('error', 'Erro ao atualizar favoritos.')
    }
  }

  const clearFilters = () => {
    setSearch(''); setCountry('Todos'); setPosition('Todos'); setCondition('Todos'); setMaxPrice(MAX_PRICE)
  }

  const filterBtn = (active: boolean, onClick: () => void, label: string) => (
    <button
      key={label}
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${active ? 'bg-gradient-to-r from-green-600 to-green-700 text-white' : 'bg-white/5 hover:bg-white/10 text-slate-300'}`}
    >
      {label}
    </button>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Mobile search */}
      <div className="flex md:hidden flex-col gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar figurinha..."
            className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm"
          />
        </div>
        <button
          onClick={() => setShowFilters(o => !o)}
          className="w-full py-2.5 px-4 rounded-xl glass-card flex items-center justify-center gap-2 text-xs font-bold text-slate-200"
        >
          <SlidersHorizontal className="w-4 h-4 text-yellow-400" />
          Filtros {showFilters ? '(Ocultar)' : '(Exibir)'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Sidebar filters */}
        <aside className={`md:col-span-3 space-y-6 glass-card rounded-3xl p-6 border border-white/10 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <h3 className="font-display font-extrabold text-white text-base flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-yellow-400" /> Filtros
            </h3>
            <button onClick={clearFilters} className="text-xs text-yellow-400 hover:text-yellow-300 font-bold">Limpar</button>
          </div>

          <div className="space-y-2 text-left">
            <label className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">País / Seleção</label>
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
              {COUNTRIES.map(c => filterBtn(country === c, () => setCountry(c), c))}
            </div>
          </div>

          <div className="space-y-2 text-left">
            <label className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Posição</label>
            <div className="flex flex-wrap gap-1.5">
              {POSITIONS.map(p => filterBtn(position === p, () => setPosition(p), p))}
            </div>
          </div>

          <div className="space-y-2 text-left">
            <label className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Estado</label>
            <div className="flex flex-wrap gap-1.5">
              {CONDITIONS.map(c => filterBtn(condition === c, () => setCondition(c), c))}
            </div>
          </div>

          <div className="space-y-2 text-left">
            <label className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
              Preço máximo: R$ {maxPrice}
            </label>
            <input
              type="range"
              min={0}
              max={MAX_PRICE}
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-green-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>R$ 0</span>
              <span>R$ {MAX_PRICE}</span>
            </div>
          </div>
        </aside>

        {/* Announcements grid */}
        <main className="md:col-span-9 space-y-6">
          <div className="hidden md:flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por jogador, país, número..."
                className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm"
              />
            </div>
          </div>

          {loading && announcements.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : announcements.length === 0 ? (
            <EmptyState
              emoji="🔍"
              title="Nenhuma figurinha encontrada"
              description="Tente ajustar os filtros ou limpe a busca para ver mais resultados."
              action={<button onClick={clearFilters} className="px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-bold">Limpar filtros</button>}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {announcements.map(ad => (
                  <AnnouncementCard key={ad.id} announcement={ad} onFavorite={handleFavorite} />
                ))}
              </div>
              {page < lastPage && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={() => { setPage(p => p + 1); load(false) }}
                    disabled={loading}
                    className="px-6 py-3 rounded-xl glass-card font-bold text-sm hover:bg-white/15 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Carregando...' : 'Carregar mais'}
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* FAB */}
      <Link
        to="/anuncios/novo"
        className="fixed bottom-6 right-6 flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-green-500 to-yellow-400 text-slate-950 font-extrabold shadow-2xl shadow-green-950/40 hover:scale-105 transition-all z-30"
      >
        <Plus className="w-5 h-5" />
        Anunciar Figurinha
      </Link>
    </div>
  )
}

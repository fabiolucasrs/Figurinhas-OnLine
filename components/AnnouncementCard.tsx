import React from 'react'
import { Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Announcement } from '../types'
import { formatCurrency } from '../utils/format'
import { StickerCardVisual } from './StickerCardVisual'

interface Props {
  announcement: Announcement
  onFavorite?: (id: number) => void
  showFavorite?: boolean
}

const conditionColors: Record<string, string> = {
  Nova: 'text-green-400',
  Usada: 'text-yellow-400',
  Repetida: 'text-blue-400',
}

export const AnnouncementCard: React.FC<Props> = ({ announcement, onFavorite, showFavorite = true }) => {
  const navigate = useNavigate()

  return (
    <div
      className="glass-card glass-card-hover rounded-2xl p-4 flex flex-col justify-between items-center cursor-pointer text-center"
      onClick={() => navigate(`/anuncios/${announcement.id}`)}
    >
      <div className="relative">
        <StickerCardVisual
          name={announcement.sticker_name}
          country={announcement.sticker_country}
          number={announcement.sticker_number}
          position={announcement.sticker_position}
          rarity={announcement.sticker_rarity}
          photoUrl={announcement.photo_url}
          size="md"
        />
        {showFavorite && onFavorite && (
          <button
            onClick={e => { e.stopPropagation(); onFavorite(announcement.id) }}
            className="absolute top-2 right-2 p-1.5 rounded-full glass-card"
          >
            <Heart
              className={`w-4 h-4 ${announcement.is_favorited ? 'fill-red-400 text-red-400' : 'text-white/50'}`}
            />
          </button>
        )}
      </div>

      <div className="w-full mt-3 space-y-1 text-left border-t border-white/5 pt-3">
        <div className="flex justify-between items-center">
          <span className={`text-xs font-mono font-bold uppercase tracking-wider ${conditionColors[announcement.condition] ?? 'text-slate-400'}`}>
            {announcement.condition}
          </span>
          <span className="bg-yellow-400/20 text-yellow-400 font-bold border border-yellow-400/20 rounded-full px-2 py-0.5 text-[10px]">
            ★ {announcement.seller.rating.toFixed(1)}
          </span>
        </div>

        <h4 className="font-display font-bold text-white text-base truncate">{announcement.sticker_name}</h4>

        <div className="flex justify-between items-center pt-2">
          <p className="text-xs text-slate-400">
            Por: <span className="text-slate-200 font-semibold">{announcement.seller.name.split(' ')[0]}</span>
          </p>
          <p className="font-mono text-lime-400 text-lg font-black">{formatCurrency(announcement.price)}</p>
        </div>
      </div>

      <button
        onClick={e => { e.stopPropagation(); navigate(`/anuncios/${announcement.id}`) }}
        className="w-full mt-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-yellow-400 hover:text-slate-950 hover:border-yellow-400 text-xs font-bold transition-all"
      >
        Ver Oferta & Comprar
      </button>
    </div>
  )
}

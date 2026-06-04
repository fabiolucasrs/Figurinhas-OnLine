import React from 'react'

interface StickerVisualProps {
  name: string
  country: string
  number: string
  position: string
  rarity: 'Comum' | 'Rara' | 'Lendária'
  photoUrl?: string | null
  size?: 'sm' | 'md' | 'lg'
}

const countryStyles: Record<string, { bg: string; flag: string }> = {
  brasil:       { bg: 'from-green-600 via-green-700 to-yellow-500', flag: '🇧🇷' },
  argentina:    { bg: 'from-sky-400 via-white to-sky-400',          flag: '🇦🇷' },
  'frança':     { bg: 'from-blue-700 via-white to-red-600',         flag: '🇫🇷' },
  portugal:     { bg: 'from-red-600 via-red-700 to-green-600',      flag: '🇵🇹' },
  alemanha:     { bg: 'from-neutral-900 via-red-600 to-yellow-500', flag: '🇩🇪' },
  espanha:      { bg: 'from-red-700 via-yellow-500 to-red-700',     flag: '🇪🇸' },
  inglaterra:   { bg: 'from-slate-100 via-slate-200 to-red-600',    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  'bélgica':    { bg: 'from-black via-yellow-500 to-red-600',       flag: '🇧🇪' },
  uruguai:      { bg: 'from-sky-300 via-white to-sky-300',          flag: '🇺🇾' },
  holanda:      { bg: 'from-orange-500 to-white',                    flag: '🇳🇱' },
  'itália':     { bg: 'from-green-600 via-white to-red-600',        flag: '🇮🇹' },
}

const rarityConfig: Record<string, { glow: string; badge: string; label: string }> = {
  Lendária: {
    glow: 'shadow-[0_0_20px_rgba(255,214,0,0.45)] border-yellow-400',
    badge: 'bg-gradient-to-r from-amber-500 to-yellow-300 text-slate-950 font-bold',
    label: 'LEGEND',
  },
  Rara: {
    glow: 'shadow-[0_0_15px_rgba(79,70,229,0.3)] border-cyan-400',
    badge: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold',
    label: 'RARA',
  },
  Comum: {
    glow: 'shadow-md border-white/20',
    badge: 'bg-slate-700 text-white',
    label: 'COMUM',
  },
}

const sizes = {
  sm: { card: 'w-24 h-36 rounded-md', padding: 'p-1', avatar: 'w-10 h-10', name: '9px' },
  md: { card: 'w-44 h-64 rounded-xl', padding: 'p-3', avatar: 'w-20 h-20', name: '14px' },
  lg: { card: 'w-60 h-80 rounded-2xl', padding: 'p-4', avatar: 'w-28 h-28', name: '16px' },
}

export const StickerCardVisual: React.FC<StickerVisualProps> = ({
  name, country, number, position, rarity, photoUrl, size = 'md',
}) => {
  const countryKey = country.toLowerCase()
  const colors = countryStyles[countryKey] ?? { bg: 'from-emerald-800 to-slate-800', flag: '⚽' }
  const rc = rarityConfig[rarity] ?? rarityConfig.Comum
  const sz = sizes[size]

  const initials = name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()

  return (
    <div
      className={`relative select-none overflow-hidden flex flex-col justify-between border bg-slate-900 ${rc.glow} ${sz.card}`}
      style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(30,41,59,0.8) 100%)' }}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />

      <div className={`flex justify-between items-center ${sz.padding} border-b border-white/10 bg-slate-950/40 z-10`}>
        <div className="flex items-center gap-1">
          <span className="font-mono text-lime-400 font-bold text-xs">{number}</span>
          <span className="text-white/50 text-xs">|</span>
          <span className="font-mono text-[9px] uppercase tracking-wide text-white/70">{position}</span>
        </div>
        <span className="text-base">{colors.flag}</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative p-2 overflow-hidden">
        <div className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-green-500/25 to-yellow-500/10 blur-xl pointer-events-none" />

        {rarity === 'Lendária' && (
          <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
            <div className="absolute w-full h-2 bg-yellow-400 rotate-45 translate-y-4 animate-pulse" />
            <div className="absolute w-full h-2 bg-yellow-400 rotate-45 translate-y-12 animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
        )}

        <div className={`relative flex items-center justify-center rounded-full bg-gradient-to-b ${colors.bg} ${sz.avatar} overflow-hidden`}>
          {photoUrl ? (
            <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full rounded-full bg-slate-900/40 flex items-center justify-center">
              <span className="font-display font-black text-2xl text-white tracking-tighter">{initials}</span>
            </div>
          )}
          <span className="absolute bottom-1 right-1 opacity-20 text-3xl select-none">{colors.flag}</span>
        </div>

        <div className="mt-2 text-center z-10 w-full px-1">
          <h4 className="font-display font-extrabold text-white truncate max-w-full tracking-tight" style={{ fontSize: sz.name }}>
            {name}
          </h4>
          <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase">{country}</span>
        </div>
      </div>

      <div className={`flex justify-between items-center ${sz.padding} border-t border-white/10 bg-slate-950/60 z-10`}>
        <span className={`text-[9px] px-1.5 py-0.5 rounded-sm tracking-widest font-mono ${rc.badge}`}>{rc.label}</span>
        <span className="font-mono text-white/50 text-[9px] font-semibold">🏆 COPA 2026</span>
      </div>
    </div>
  )
}

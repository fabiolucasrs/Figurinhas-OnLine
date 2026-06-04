import React, { useEffect, useState } from 'react'
import { ArrowRight, ShieldCheck, Trophy, TrendingUp, Users } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { StickerCardVisual } from '../components/StickerCardVisual'
import { announcementsService } from '../services/announcements.service'
import type { Announcement } from '../types'
import { formatCurrency } from '../utils/format'

export const LandingPage: React.FC = () => {
  const navigate = useNavigate()
  const [featured, setFeatured] = useState<Announcement[]>([])

  useEffect(() => {
    announcementsService.featured().then(setFeatured).catch(() => {})
  }, [])

  return (
    <div className="space-y-20 pb-20 overflow-hidden relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-green-500/10 blur-3xl pointer-events-none -z-10" />

      {/* Hero */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-10 sm:pt-16 lg:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="space-y-6 lg:col-span-7 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-bold tracking-wide uppercase animate-pulse">
              <Trophy className="w-4 h-4" />
              Mercado de Figurinhas Copa do Mundo 2026
            </div>

            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-tight">
              Complete seu álbum da <br />
              <span className="text-gradient-gold-green">Copa 2026</span>{' '}
              com colecionadores reais!
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed">
              O maior mercado virtual de figurinhas do Brasil. Negocie suas repetidas de forma rápida, segura e sem burocracia.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                to="/login"
                className="bg-gradient-to-r from-green-500 to-lime-400 hover:from-green-600 hover:to-lime-500 text-slate-950 font-extrabold text-base px-8 py-4 rounded-2xl shadow-xl shadow-green-950/40 hover:scale-105 transition-all flex items-center justify-center gap-2 group"
              >
                Começar Coleção Agora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="glass-card hover:bg-white/10 px-8 py-4 rounded-2xl text-base font-bold text-white transition-all flex items-center justify-center gap-2"
              >
                Anunciar Repetidas
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-md">
              <div>
                <p className="text-xl sm:text-2xl font-black text-white font-mono">1.2k+</p>
                <p className="text-xs text-slate-400 font-semibold uppercase">Figurinhas</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-green-400 font-mono">450+</p>
                <p className="text-xs text-slate-400 font-semibold uppercase">Membros Ativos</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-yellow-400 font-mono">R$ 5k+</p>
                <p className="text-xs text-slate-400 font-semibold uppercase">Negociados</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center items-center relative mt-10 lg:mt-0">
            <div className="absolute w-80 h-80 rounded-full border border-white/5 animate-pulse" />
            <div className="relative w-72 h-96 flex items-center justify-center">
              <div className="absolute -left-16 rotate-[-15deg] translate-y-4 scale-90 opacity-80 hover:z-30 hover:-translate-y-4 hover:scale-100 transition-all duration-300">
                <StickerCardVisual name="Lionel Messi" country="Argentina" number="ARG-10" position="Atacante" rarity="Lendária" size="md" />
              </div>
              <div className="absolute z-20 shadow-2xl hover:scale-105 transition-all duration-300">
                <StickerCardVisual name="Vinícius Júnior" country="Brasil" number="BRA-11" position="Atacante" rarity="Lendária" size="md" />
              </div>
              <div className="absolute -right-16 rotate-[15deg] translate-y-4 scale-90 opacity-80 hover:z-30 hover:-translate-y-4 hover:scale-100 transition-all duration-300">
                <StickerCardVisual name="Kylian Mbappé" country="França" number="FRA-10" position="Atacante" rarity="Lendária" size="md" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="bg-slate-950/40 border-y border-white/5 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white">Como Funciona o Figurinhas OnLine</h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
              Três passos simples para encontrar a figurinha que falta ou vender suas repetidas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            {[
              { num: 1, icon: <Users className="w-6 h-6" />, title: 'Crie Sua Conta', desc: 'Cadastre-se gratuitamente em segundos e acesse o maior mercado de figurinhas do Brasil.', color: 'green' },
              { num: 2, icon: <TrendingUp className="w-6 h-6" />, title: 'Busque ou Anuncie', desc: 'Navegue com filtros avançados por seleção, posição ou preço. Publique suas repetidas facilmente.', color: 'yellow' },
              { num: 3, icon: <ShieldCheck className="w-6 h-6" />, title: 'Negocie com Segurança', desc: 'Transações protegidas pela plataforma. Sem taxas abusivas ou dores de cabeça.', color: 'green' },
            ].map(({ num, icon, title, desc, color }) => (
              <div key={num} className={`glass-card rounded-2xl p-6 text-center space-y-4 relative group hover:border-${color}-500/30 transition-all`}>
                <div className={`absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-${color}-500 text-slate-950 font-mono font-black flex items-center justify-center shadow-lg`}>{num}</div>
                <div className={`w-12 h-12 rounded-xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center mx-auto text-${color}-400 group-hover:scale-110 transition-transform`}>
                  {icon}
                </div>
                <h3 className="font-display font-bold text-lg text-white">{title}</h3>
                <p className="text-sm text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destaques */}
      {featured.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
            <div>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white">📢 Anúncios em Destaque</h2>
              <p className="text-slate-400 text-sm">As figurinhas mais cobiçadas da plataforma</p>
            </div>
            <Link to="/login" className="text-sm font-bold text-yellow-400 hover:text-yellow-300 flex items-center gap-1.5 transition-colors group">
              Ver catálogo completo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.slice(0, 4).map(ad => (
              <div
                key={ad.id}
                onClick={() => navigate('/login')}
                className="glass-card glass-card-hover rounded-2xl p-4 flex flex-col items-center cursor-pointer text-center"
              >
                <StickerCardVisual
                  name={ad.sticker_name}
                  country={ad.sticker_country}
                  number={ad.sticker_number}
                  position={ad.sticker_position}
                  rarity={ad.sticker_rarity}
                  photoUrl={ad.photo_url}
                  size="md"
                />
                <div className="w-full mt-3 space-y-1 text-left border-t border-white/5 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase">{ad.condition}</span>
                    <span className="bg-yellow-400/20 text-yellow-400 font-bold border border-yellow-400/20 rounded-full px-2 py-0.5 text-[10px]">
                      ★ {ad.seller.rating.toFixed(1)}
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-white text-base truncate">{ad.sticker_name}</h4>
                  <div className="flex justify-between items-center pt-2">
                    <p className="text-xs text-slate-400">Por: <span className="text-slate-200 font-semibold">{ad.seller.name.split(' ')[0]}</span></p>
                    <p className="font-mono text-lime-400 text-lg font-black">{formatCurrency(ad.price)}</p>
                  </div>
                </div>
                <button className="w-full mt-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-yellow-400 hover:text-slate-950 hover:border-yellow-400 text-xs font-bold transition-all">
                  Ver Oferta & Comprar
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Safety banner */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="glass-card rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border-green-500/20">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-yellow-400/5 blur-3xl pointer-events-none" />
          <div className="text-left space-y-4 max-w-xl">
            <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white">🔒 Seu Álbum Completo de Forma Segura</h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              O Figurinhas OnLine garante transações protegidas entre colecionadores. O pagamento é processado de forma segura até você confirmar o recebimento da figurinha.
            </p>
            <div className="flex items-center gap-6 pt-2 text-xs font-mono font-semibold text-slate-400">
              <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-green-400" /> Vendedores Verificados</span>
              <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-yellow-400" /> Suporte Administrativo</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 text-center shrink-0">
            <Trophy className="w-16 h-16 text-yellow-400 animate-bounce" />
            <Link to="/login" className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-extrabold px-6 py-3 rounded-xl text-sm transition-all">
              Criar Conta Grátis
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 pt-12 pb-6 px-4 bg-slate-950/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-left">
            <p className="font-display font-extrabold text-base text-white">⭐ Figurinhas OnLine</p>
            <p className="text-xs text-slate-400 mt-1">© 2026 Figurinhas OnLine. Um mercado para colecionadores da Copa do Mundo 2026.</p>
          </div>
          <div className="flex gap-6 text-xs text-slate-400 font-semibold uppercase">
            <span className="hover:text-yellow-400 cursor-pointer">Sobre</span>
            <span className="hover:text-yellow-400 cursor-pointer">Termos de Uso</span>
            <span className="hover:text-yellow-400 cursor-pointer">Privacidade</span>
            <span className="hover:text-yellow-400 cursor-pointer">Contato</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

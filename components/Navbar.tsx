import React, { useRef, useState } from 'react'
import { Bell, ChevronDown, Plus, Search, Shield } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getInitials } from '../utils/format'

interface Props {
  onSearch?: (q: string) => void
}

export const Navbar: React.FC<Props> = ({ onSearch }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="glass-card sticky top-0 z-40 border-b border-white/10 border-x-0 border-t-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to={user ? '/home' : '/'} className="flex items-center gap-2 shrink-0">
            <span className="font-display font-black text-lg text-gradient-logo">⭐ Figurinhas OnLine</span>
          </Link>

          {/* Search bar (authenticated) */}
          {user && onSearch && (
            <div className="hidden md:flex flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar figurinha, jogador, país..."
                onChange={e => onSearch(e.target.value)}
                className="w-full glass-input pl-10 pr-4 py-2 rounded-xl text-sm"
              />
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {/* Announce button */}
                <Link
                  to="/anuncios/novo"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white text-xs font-bold transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Anunciar
                </Link>

                {/* Notifications */}
                <button className="p-2 rounded-xl glass-card text-slate-300 hover:text-white transition-colors">
                  <Bell className="w-4 h-4" />
                </button>

                {/* User menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(o => !o)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-xl glass-card hover:bg-white/10 transition-all"
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center text-xs font-bold">
                        {getInitials(user.name)}
                      </div>
                    )}
                    <span className="hidden sm:block text-xs font-semibold text-white">{user.name.split(' ')[0]}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 glass-card rounded-xl border border-white/15 shadow-2xl overflow-hidden">
                      <Link
                        to="/painel"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-3 text-sm text-slate-200 hover:bg-white/10 transition-colors"
                      >
                        Minha Conta
                      </Link>
                      <Link
                        to="/painel/anuncios"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-3 text-sm text-slate-200 hover:bg-white/10 transition-colors"
                      >
                        Meus Anúncios
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-3 text-sm text-red-300 hover:bg-white/10 transition-colors border-t border-white/10"
                        >
                          Painel Admin
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-slate-400 hover:text-red-300 hover:bg-white/5 transition-colors border-t border-white/10"
                      >
                        Sair
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl glass-card text-sm font-bold text-white hover:bg-white/15 transition-all"
                >
                  Entrar / Cadastrar
                </Link>
                <Link
                  to="/admin"
                  title="Painel Administrativo"
                  className="p-2 rounded-xl glass-card text-slate-400 hover:text-white transition-colors"
                >
                  <Shield className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

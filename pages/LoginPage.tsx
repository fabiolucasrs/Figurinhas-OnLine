import { useState } from 'react'
import { AlertCircle, CheckCircle, Lock, Mail, Shield, Sparkles, User } from 'lucide-react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

type Tab = 'login' | 'register'

const demoProfiles = [
  { label: 'Administrador', email: 'admin@admin.com', icon: <Shield className="w-3.5 h-3.5 text-red-400" />, cls: 'border-red-500/20 text-red-300 hover:bg-red-900/20' },
  { label: 'João Silva (Vendedor)', email: 'joao@email.com', icon: <span>👦</span>, cls: 'border-green-500/15 text-green-300 hover:bg-white/10' },
  { label: 'Maria Oliveira (Compradora)', email: 'maria@email.com', icon: <span>👧</span>, cls: 'border-yellow-500/15 text-yellow-300 hover:bg-white/10' },
]

export const LoginPage: React.FC = () => {
  const { user, login, register } = useAuth()
  const navigate = useNavigate()

  const [tab, setTab] = useState<Tab>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/home'} replace />

  const showFeedback = (msg: string, isError: boolean) => {
    if (isError) { setError(msg); setTimeout(() => setError(''), 4000) }
    else { setSuccess(msg); setTimeout(() => setSuccess(''), 4000) }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { showFeedback('Preencha todos os campos.', true); return }
    setLoading(true)
    try {
      await login(email, password)
      navigate('/home')
    } catch (err: unknown) {
      showFeedback(err instanceof Error ? err.message : 'Erro ao entrar.', true)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password || !confirm) { showFeedback('Preencha todos os campos.', true); return }
    if (password !== confirm) { showFeedback('As senhas não coincidem.', true); return }
    if (password.length < 6) { showFeedback('A senha deve ter pelo menos 6 caracteres.', true); return }
    setLoading(true)
    try {
      await register(name, email, password, confirm)
      navigate('/home')
    } catch (err: unknown) {
      showFeedback(err instanceof Error ? err.message : 'Erro ao cadastrar.', true)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickFill = async (demoEmail: string) => {
    setTab('login')
    setEmail(demoEmail)
    setPassword('123456')
    setLoading(true)
    try {
      await login(demoEmail, '123456')
      navigate(demoEmail === 'admin@admin.com' ? '/admin' : '/home')
    } catch (err: unknown) {
      showFeedback(err instanceof Error ? err.message : 'Erro ao entrar.', true)
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm'

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-8 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-yellow-500/10 blur-3xl pointer-events-none" />

      {/* Main form card */}
      <div className="w-full max-w-md glass-card rounded-3xl overflow-hidden shadow-2xl border border-white/15 p-6 sm:p-8">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 via-green-500 to-yellow-400 p-0.5 items-center justify-center shadow-lg mx-auto">
            <span className="font-display font-black text-white text-2xl tracking-tighter">F⚡O</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl text-white tracking-tight">Figurinhas OnLine</h2>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">Copa do Mundo 2026</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 mb-6">
          {(['login', 'register'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(''); setSuccess('') }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${tab === t ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              {t === 'login' ? 'Entrar' : 'Criar Conta'}
            </button>
          ))}
        </div>

        {/* Feedback */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2 font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />{error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs flex items-center gap-2 font-semibold">
            <CheckCircle className="w-4 h-4 shrink-0" />{success}
          </div>
        )}

        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" className={inputCls} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Sua senha..." className={inputCls} />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 text-slate-950 font-extrabold py-3.5 rounded-xl text-sm tracking-wide transition-all shadow-lg mt-6 disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar na Conta'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            {([
              { label: 'Nome Completo', Icon: User, val: name, set: setName, type: 'text', placeholder: 'Seu nome completo...' },
              { label: 'E-mail', Icon: Mail, val: email, set: setEmail, type: 'email', placeholder: 'seu@email.com' },
              { label: 'Senha', Icon: Lock, val: password, set: setPassword, type: 'password', placeholder: 'Mínimo 6 caracteres...' },
              { label: 'Confirmar Senha', Icon: Lock, val: confirm, set: setConfirm, type: 'password', placeholder: 'Repita a senha...' },
            ] as const).map(({ label, Icon, val, set, type, placeholder }) => (
              <div key={label} className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">{label}</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none">
                    <Icon className="w-4 h-4" />
                  </div>
                  <input type={type} value={val} onChange={e => set(e.target.value)} placeholder={placeholder} className={inputCls} />
                </div>
              </div>
            ))}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 text-slate-950 font-extrabold py-3.5 rounded-xl text-sm tracking-wide transition-all shadow-lg mt-6 disabled:opacity-50"
            >
              {loading ? 'Criando conta...' : 'Criar Minha Conta'}
            </button>
          </form>
        )}
      </div>

      {/* Demo card */}
      <div className="w-full max-w-sm mt-6 glass-card rounded-2xl p-4 border border-white/10 shadow-lg text-center">
        <h4 className="font-display font-extrabold text-xs text-yellow-400 uppercase tracking-widest flex items-center justify-center gap-1.5 mb-3">
          <Sparkles className="w-4 h-4" /> ⚡ Acesso Rápido (Demo)
        </h4>
        <p className="text-[10px] text-slate-400 mb-4 px-2">
          Clique em um perfil para entrar imediatamente e testar a plataforma.
        </p>
        <div className="space-y-2">
          {demoProfiles.map(p => (
            <button
              key={p.email}
              onClick={() => handleQuickFill(p.email)}
              disabled={loading}
              className={`w-full py-2 px-3 rounded-lg glass-card border text-xs font-bold flex items-center justify-between transition-all disabled:opacity-50 ${p.cls}`}
            >
              <span className="flex items-center gap-1.5">{p.icon} {p.label}</span>
              <span className="text-[10px] opacity-75 font-mono">Entrar →</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

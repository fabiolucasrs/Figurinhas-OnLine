import React, { useEffect, useState } from 'react'
import {
  FileText, Landmark, RefreshCw, ShieldAlert,
  Trash2, UserCheck, UserX, Users
} from 'lucide-react'
import { Navigate } from 'react-router-dom'
import { ConfirmModal } from '../../components/ui/Modal'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { adminService } from '../../services/admin.service'
import type { AdminDashboard, Announcement, Report, User } from '../../types'
import { formatCurrency, formatDate } from '../../utils/format'

type Tab = 'dash' | 'users' | 'ads' | 'reports'

export const AdminPanel: React.FC = () => {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [tab, setTab] = useState<Tab>('dash')
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [ads, setAds] = useState<Announcement[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [confirmAction, setConfirmAction] = useState<{ type: string; id: number; label: string } | null>(null)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    setLoading(true)
    const load = tab === 'dash'
      ? adminService.dashboard().then(setDashboard)
      : tab === 'users'
      ? adminService.users().then(setUsers)
      : tab === 'ads'
      ? adminService.announcements().then(setAds)
      : adminService.reports().then(setReports)
    load.catch(() => showToast('error', 'Erro ao carregar dados.')).finally(() => setLoading(false))
  }, [tab])

  useEffect(() => {
    if (tab === 'users') {
      const t = setTimeout(() => adminService.users(search).then(setUsers).catch(() => {}), 300)
      return () => clearTimeout(t)
    }
  }, [search, tab])

  const handleAction = async () => {
    if (!confirmAction) return
    setProcessing(true)
    try {
      const { type, id } = confirmAction
      if (type === 'ban') { const u = await adminService.banUser(id); setUsers(prev => prev.map(x => x.id === id ? u : x)); showToast('success', 'Usuário banido.') }
      else if (type === 'activate') { const u = await adminService.activateUser(id); setUsers(prev => prev.map(x => x.id === id ? u : x)); showToast('success', 'Usuário reativado.') }
      else if (type === 'remove_ad') { await adminService.removeAnnouncement(id); setAds(prev => prev.filter(a => a.id !== id)); showToast('success', 'Anúncio removido.') }
      else if (type === 'resolve') { const r = await adminService.resolveReport(id); setReports(prev => prev.map(x => x.id === id ? r : x)); showToast('success', 'Denúncia resolvida.') }
      else if (type === 'ignore') { const r = await adminService.ignoreReport(id); setReports(prev => prev.map(x => x.id === id ? r : x)); showToast('info', 'Denúncia ignorada.') }
      setConfirmAction(null)
    } catch (err: unknown) {
      showToast('error', err instanceof Error ? err.message : 'Erro ao processar ação.')
    } finally {
      setProcessing(false)
    }
  }

  const navBtn = (t: Tab, label: string, icon: React.ReactNode) => (
    <button
      onClick={() => setTab(t)}
      className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-left shrink-0 ${tab === t ? 'bg-gradient-to-r from-red-600 to-red-700 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
    >
      {icon} {label}
    </button>
  )

  const metricCard = (icon: React.ReactNode, label: string, value: number | string, color: string) => (
    <div className="glass-card rounded-2xl p-5 border-white/5 space-y-1">
      <div className={`w-8 h-8 rounded-lg bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center text-${color}-400`}>{icon}</div>
      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider pt-1">{label}</p>
      <h3 className="text-2xl font-black text-white font-mono">{value}</h3>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-white/5 pb-4 text-left">
        <div>
          <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest font-mono">Painel de Controle</span>
          <h1 className="font-display font-black text-3xl text-white flex items-center gap-2">🛡️ Central de Administração</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar */}
        <aside className="lg:col-span-3 glass-card rounded-2xl p-2 border-white/10 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible">
          {navBtn('dash', 'Dashboard', <Landmark className="w-4 h-4" />)}
          {navBtn('users', `Usuários (${users.length || '...'})`, <Users className="w-4 h-4" />)}
          {navBtn('ads', `Anúncios (${ads.length || '...'})`, <FileText className="w-4 h-4" />)}
          {navBtn('reports', `Denúncias (${reports.filter(r => r.status === 'Pendente').length || '...'})`, <ShieldAlert className="w-4 h-4" />)}
        </aside>

        {/* Content */}
        <div className="lg:col-span-9 bg-slate-900/30 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-8 min-h-[400px]">
          {loading && <div className="flex justify-center py-12"><RefreshCw className="w-8 h-8 text-slate-400 animate-spin" /></div>}

          {!loading && tab === 'dash' && dashboard && (
            <div className="space-y-8 text-left">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {metricCard(<Users className="w-4 h-4" />, 'Usuários Registrados', dashboard.total_users, 'blue')}
                {metricCard(<FileText className="w-4 h-4" />, 'Anúncios Ativos', dashboard.active_announcements, 'green')}
                {metricCard(<ShieldAlert className="w-4 h-4" />, 'Compras Totais', dashboard.total_purchases, 'yellow')}
                {metricCard(<ShieldAlert className="w-4 h-4" />, 'Denúncias Ativas', dashboard.pending_reports, 'red')}
              </div>
              <div className="glass-card rounded-2xl p-5 text-left">
                <p className="text-xs text-yellow-400 uppercase font-bold tracking-widest mb-3">Acesso Rápido</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Gerenciar Usuários', tab: 'users' as Tab },
                    { label: 'Gerenciar Anúncios', tab: 'ads' as Tab },
                    { label: 'Ver Denúncias', tab: 'reports' as Tab },
                  ].map(({ label, tab: t }) => (
                    <button key={t} onClick={() => setTab(t)} className="py-2.5 px-4 rounded-xl glass-card text-sm font-bold text-slate-200 hover:bg-white/15 transition-all text-left">
                      → {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!loading && tab === 'users' && (
            <div className="space-y-4 text-left">
              <div className="flex justify-between items-center">
                <h2 className="font-display font-bold text-xl text-white">Gestão de Usuários</h2>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar usuário..." className="glass-input px-3 py-2 rounded-xl text-sm w-48" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-slate-400 uppercase tracking-widest border-b border-white/5">
                      <th className="text-left pb-3 font-bold">Nome</th>
                      <th className="text-left pb-3 font-bold hidden sm:table-cell">E-mail</th>
                      <th className="text-left pb-3 font-bold hidden md:table-cell">Cadastro</th>
                      <th className="text-center pb-3 font-bold">Status</th>
                      <th className="text-center pb-3 font-bold">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-white/3 transition-colors">
                        <td className="py-3 font-semibold text-white">{u.name}</td>
                        <td className="py-3 text-slate-400 hidden sm:table-cell">{u.email}</td>
                        <td className="py-3 text-slate-400 hidden md:table-cell">{formatDate(u.created_at)}</td>
                        <td className="py-3 text-center">
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${u.status === 'Ativo' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          {u.role !== 'admin' && (
                            u.status === 'Ativo'
                              ? <button onClick={() => setConfirmAction({ type: 'ban', id: u.id, label: `Banir ${u.name}?` })} className="p-1.5 rounded-lg glass-card text-slate-400 hover:text-red-400 transition-colors"><UserX className="w-4 h-4" /></button>
                              : <button onClick={() => setConfirmAction({ type: 'activate', id: u.id, label: `Reativar ${u.name}?` })} className="p-1.5 rounded-lg glass-card text-slate-400 hover:text-green-400 transition-colors"><UserCheck className="w-4 h-4" /></button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!loading && tab === 'ads' && (
            <div className="space-y-4 text-left">
              <h2 className="font-display font-bold text-xl text-white">Gestão de Anúncios</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-slate-400 uppercase tracking-widest border-b border-white/5">
                      <th className="text-left pb-3 font-bold">Figurinha</th>
                      <th className="text-left pb-3 font-bold hidden sm:table-cell">Vendedor</th>
                      <th className="text-left pb-3 font-bold">Preço</th>
                      <th className="text-center pb-3 font-bold">Status</th>
                      <th className="text-center pb-3 font-bold">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {ads.map(ad => (
                      <tr key={ad.id} className="hover:bg-white/3 transition-colors">
                        <td className="py-3">
                          <p className="font-semibold text-white">{ad.sticker_name}</p>
                          <p className="text-xs text-slate-400">{ad.sticker_country} · {ad.sticker_number}</p>
                        </td>
                        <td className="py-3 text-slate-400 hidden sm:table-cell">{ad.seller.name}</td>
                        <td className="py-3 font-mono text-lime-400 font-bold">{formatCurrency(ad.price)}</td>
                        <td className="py-3 text-center">
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${ad.status === 'Ativo' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}`}>
                            {ad.status}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <button onClick={() => setConfirmAction({ type: 'remove_ad', id: ad.id, label: `Remover anúncio de ${ad.sticker_name}?` })} className="p-1.5 rounded-lg glass-card text-slate-400 hover:text-red-400 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!loading && tab === 'reports' && (
            <div className="space-y-4 text-left">
              <h2 className="font-display font-bold text-xl text-white">Gestão de Denúncias</h2>
              <div className="space-y-3">
                {reports.length === 0 ? (
                  <p className="text-slate-400 text-center py-8">Nenhuma denúncia registrada.</p>
                ) : reports.map(r => (
                  <div key={r.id} className="glass-card rounded-xl p-4 flex items-start gap-4">
                    <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div className="flex-1 text-left">
                      <p className="font-bold text-white">{r.sticker_name}</p>
                      <p className="text-xs text-slate-400">Por: {r.reporter_name} · {formatDate(r.created_at)}</p>
                      <p className="text-sm text-slate-300 mt-1">{r.reason}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${r.status === 'Pendente' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}`}>
                        {r.status}
                      </span>
                      {r.status === 'Pendente' && (
                        <div className="flex gap-1">
                          <button onClick={() => setConfirmAction({ type: 'resolve', id: r.id, label: 'Marcar denúncia como resolvida?' })} className="px-2 py-1 rounded-lg text-xs font-bold bg-green-600/20 text-green-400 hover:bg-green-600/40 transition-all">Resolver</button>
                          <button onClick={() => setConfirmAction({ type: 'ignore', id: r.id, label: 'Ignorar esta denúncia?' })} className="px-2 py-1 rounded-lg text-xs font-bold bg-white/5 text-slate-400 hover:bg-white/10 transition-all">Ignorar</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        open={confirmAction !== null}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleAction}
        title="Confirmar Ação"
        description={confirmAction?.label ?? ''}
        loading={processing}
      />
    </div>
  )
}

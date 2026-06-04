import React, { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Upload } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { StickerCardVisual } from '../components/StickerCardVisual'
import { useToast } from '../hooks/useToast'
import { announcementsService } from '../services/announcements.service'
import type { Announcement } from '../types'
import { COUNTRIES, CONDITIONS, POSITIONS, RARITIES } from '../utils/constants'

export const AnnouncementForm: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const fileRef = useRef<HTMLInputElement>(null)
  const isEdit = Boolean(id)

  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(isEdit)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const [form, setForm] = useState({
    sticker_name: '',
    sticker_country: 'Brasil',
    sticker_position: 'Atacante',
    sticker_number: '',
    sticker_rarity: 'Comum',
    condition: 'Nova',
    quantity: 1,
    price: '',
    description: '',
    photo: undefined as File | undefined,
  })

  useEffect(() => {
    if (!isEdit || !id) return
    announcementsService.get(Number(id))
      .then((a: Announcement) => {
        setForm({
          sticker_name: a.sticker_name,
          sticker_country: a.sticker_country,
          sticker_position: a.sticker_position,
          sticker_number: a.sticker_number,
          sticker_rarity: a.sticker_rarity,
          condition: a.condition,
          quantity: a.quantity,
          price: String(a.price),
          description: a.description ?? '',
          photo: undefined,
        })
        if (a.photo_url) setPhotoPreview(a.photo_url)
      })
      .catch(() => showToast('error', 'Anúncio não encontrado.'))
      .finally(() => setInitialLoading(false))
  }, [id, isEdit])

  const set = (field: string, value: unknown) => setForm(prev => ({ ...prev, [field]: value }))

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    set('photo', file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.sticker_name || !form.sticker_number || !form.price) {
      showToast('error', 'Preencha todos os campos obrigatórios.')
      return
    }

    setLoading(true)
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        quantity: Number(form.quantity),
      }

      if (isEdit && id) {
        await announcementsService.update(Number(id), payload)
        showToast('success', 'Anúncio atualizado com sucesso!')
        navigate('/painel/anuncios')
      } else {
        await announcementsService.create(payload)
        showToast('success', 'Anúncio publicado com sucesso!')
        navigate('/home')
      }
    } catch (err: unknown) {
      showToast('error', err instanceof Error ? err.message : 'Erro ao salvar anúncio.')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'w-full glass-input px-4 py-2.5 rounded-xl text-sm'
  const selectCls = 'w-full glass-input px-4 py-2.5 rounded-xl text-sm'

  const Field: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({ label, required, children }) => (
    <div className="space-y-1 text-left">
      <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
    </div>
  )

  if (initialLoading) return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
      {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-12 bg-white/10 rounded-xl animate-pulse" />)}
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold mb-6">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Preview */}
        <div className="lg:col-span-1 flex flex-col items-center gap-4">
          <div className="glass-card rounded-3xl p-6 flex items-center justify-center">
            <StickerCardVisual
              name={form.sticker_name || 'Nome do Jogador'}
              country={form.sticker_country}
              number={form.sticker_number || '???'}
              position={form.sticker_position as never}
              rarity={form.sticker_rarity as never}
              photoUrl={photoPreview}
              size="lg"
            />
          </div>
          <p className="text-xs text-slate-400 text-center">Prévia em tempo real</p>
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-3xl p-6 sm:p-8">
            <h1 className="font-display font-black text-2xl text-white mb-6">
              {isEdit ? 'Editar Anúncio' : 'Publicar Figurinha'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Nome do Jogador" required>
                  <input value={form.sticker_name} onChange={e => set('sticker_name', e.target.value)} placeholder="Ex: Vinícius Júnior" className={inputCls} />
                </Field>
                <Field label="Número no Álbum" required>
                  <input value={form.sticker_number} onChange={e => set('sticker_number', e.target.value)} placeholder="Ex: BRA-11" className={inputCls} />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="País / Seleção" required>
                  <select value={form.sticker_country} onChange={e => set('sticker_country', e.target.value)} className={selectCls}>
                    {COUNTRIES.filter(c => c !== 'Todos').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Posição" required>
                  <select value={form.sticker_position} onChange={e => set('sticker_position', e.target.value)} className={selectCls}>
                    {POSITIONS.filter(p => p !== 'Todos').map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <Field label="Raridade" required>
                  <select value={form.sticker_rarity} onChange={e => set('sticker_rarity', e.target.value)} className={selectCls}>
                    {RARITIES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </Field>
                <Field label="Estado" required>
                  <select value={form.condition} onChange={e => set('condition', e.target.value)} className={selectCls}>
                    {CONDITIONS.filter(c => c !== 'Todos').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Quantidade" required>
                  <input type="number" min={1} max={99} value={form.quantity} onChange={e => set('quantity', e.target.value)} className={inputCls} />
                </Field>
              </div>

              <Field label="Preço Unitário (R$)" required>
                <input
                  type="number"
                  min={0.01}
                  step={0.01}
                  value={form.price}
                  onChange={e => set('price', e.target.value)}
                  placeholder="0,00"
                  className={inputCls}
                />
              </Field>

              <Field label="Foto da Figurinha">
                <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full glass-card rounded-xl py-3 flex items-center justify-center gap-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-all border border-dashed border-white/20"
                >
                  <Upload className="w-4 h-4" />
                  {photoPreview ? 'Trocar foto' : 'Enviar foto (opcional)'}
                </button>
              </Field>

              <Field label="Descrição Adicional">
                <textarea
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  placeholder="Detalhes sobre o estado da figurinha, disponibilidade para troca, etc."
                  rows={3}
                  className="w-full glass-input px-4 py-3 rounded-xl text-sm resize-none"
                />
              </Field>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 py-3 rounded-xl glass-card text-sm font-bold text-slate-300 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-lime-400 hover:from-green-600 hover:to-lime-500 text-slate-950 font-extrabold py-3 rounded-xl text-sm transition-all disabled:opacity-50"
                >
                  {loading ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Publicar Anúncio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

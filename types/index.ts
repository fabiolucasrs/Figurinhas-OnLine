export interface User {
  id: number
  name: string
  email: string
  avatar: string | null
  role: 'admin' | 'user'
  balance: number
  rating: number
  status: 'Ativo' | 'Banido'
  created_at: string
}

export interface Sticker {
  name: string
  country: string
  position: 'Goleiro' | 'Defensor' | 'Meio-Campista' | 'Atacante'
  number: string
  rarity: 'Comum' | 'Rara' | 'Lendária'
}

export interface Announcement {
  id: number
  sticker_name: string
  sticker_country: string
  sticker_position: 'Goleiro' | 'Defensor' | 'Meio-Campista' | 'Atacante'
  sticker_number: string
  sticker_rarity: 'Comum' | 'Rara' | 'Lendária'
  photo_url: string | null
  price: number
  condition: 'Nova' | 'Usada' | 'Repetida'
  quantity: number
  description: string
  status: 'Ativo' | 'Pausado' | 'Vendido'
  seller: {
    id: number
    name: string
    rating: number
    avatar: string | null
  }
  is_favorited?: boolean
  created_at: string
}

export interface Purchase {
  id: number
  announcement_id: number
  sticker_name: string
  sticker_number: string
  sticker_country: string
  price: number
  seller_name: string
  status: 'Pendente' | 'Enviado' | 'Recebido' | 'Cancelado'
  created_at: string
}

export interface Favorite {
  id: number
  announcement: Announcement
  created_at: string
}

export interface Report {
  id: number
  announcement_id: number
  sticker_name: string
  reporter_name: string
  reason: string
  status: 'Pendente' | 'Resolvida'
  created_at: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface Filters {
  country: string
  position: string
  condition: string
  min_price: number
  max_price: number
  search: string
}

export interface Toast {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}

export interface AdminDashboard {
  total_users: number
  active_announcements: number
  total_purchases: number
  pending_reports: number
}

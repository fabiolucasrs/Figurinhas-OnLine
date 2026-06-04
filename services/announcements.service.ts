import api from './api'
import type { Announcement, PaginatedResponse } from '../types'

export interface AnnouncementFilters {
  search?: string
  country?: string
  position?: string
  condition?: string
  min_price?: number
  max_price?: number
  page?: number
}

export interface AnnouncementPayload {
  sticker_name: string
  sticker_country: string
  sticker_position: string
  sticker_number: string
  sticker_rarity: string
  price: number
  condition: string
  quantity: number
  description?: string
  photo?: File
}

export const announcementsService = {
  async list(filters: AnnouncementFilters = {}): Promise<PaginatedResponse<Announcement>> {
    const { data } = await api.get<PaginatedResponse<Announcement>>('/announcements', { params: filters })
    return data
  },

  async featured(): Promise<Announcement[]> {
    const { data } = await api.get<{ data: Announcement[] }>('/announcements/featured')
    return data.data
  },

  async get(id: number): Promise<Announcement> {
    const { data } = await api.get<{ data: Announcement }>(`/announcements/${id}`)
    return data.data
  },

  async create(payload: AnnouncementPayload): Promise<Announcement> {
    const form = new FormData()
    Object.entries(payload).forEach(([k, v]) => {
      if (v !== undefined && v !== null) form.append(k, v as string | Blob)
    })
    const { data } = await api.post<{ data: Announcement }>('/announcements', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data
  },

  async update(id: number, payload: Partial<AnnouncementPayload>): Promise<Announcement> {
    const form = new FormData()
    form.append('_method', 'PUT')
    Object.entries(payload).forEach(([k, v]) => {
      if (v !== undefined && v !== null) form.append(k, v as string | Blob)
    })
    const { data } = await api.post<{ data: Announcement }>(`/announcements/${id}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/announcements/${id}`)
  },

  async toggleStatus(id: number): Promise<Announcement> {
    const { data } = await api.patch<{ data: Announcement }>(`/announcements/${id}/toggle-status`)
    return data.data
  },

  async myAnnouncements(): Promise<Announcement[]> {
    const { data } = await api.get<{ data: Announcement[] }>('/announcements/mine')
    return data.data
  },
}

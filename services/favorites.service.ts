import api from './api'
import type { Announcement } from '../types'

export const favoritesService = {
  async list(): Promise<Announcement[]> {
    const { data } = await api.get<{ data: Announcement[] }>('/favorites')
    return data.data
  },

  async toggle(announcementId: number): Promise<{ favorited: boolean }> {
    const { data } = await api.post<{ favorited: boolean }>(`/favorites/${announcementId}`)
    return data
  },
}

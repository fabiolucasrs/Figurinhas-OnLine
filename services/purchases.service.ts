import api from './api'
import type { Purchase } from '../types'

export const purchasesService = {
  async buy(announcementId: number): Promise<Purchase> {
    const { data } = await api.post<{ data: Purchase }>('/purchases', { announcement_id: announcementId })
    return data.data
  },

  async myPurchases(): Promise<Purchase[]> {
    const { data } = await api.get<{ data: Purchase[] }>('/purchases')
    return data.data
  },
}

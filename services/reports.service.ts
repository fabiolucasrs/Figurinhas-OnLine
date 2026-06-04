import api from './api'
import type { Report } from '../types'

export const reportsService = {
  async create(announcementId: number, reason: string): Promise<Report> {
    const { data } = await api.post<{ data: Report }>('/reports', {
      announcement_id: announcementId,
      reason,
    })
    return data.data
  },
}

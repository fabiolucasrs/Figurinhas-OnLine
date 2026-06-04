import api from './api'
import type { AdminDashboard, Announcement, Report, User } from '../types'

export const adminService = {
  async dashboard(): Promise<AdminDashboard> {
    const { data } = await api.get<{ data: AdminDashboard }>('/admin/dashboard')
    return data.data
  },

  async users(search?: string): Promise<User[]> {
    const { data } = await api.get<{ data: User[] }>('/admin/users', { params: { search } })
    return data.data
  },

  async banUser(userId: number): Promise<User> {
    const { data } = await api.patch<{ data: User }>(`/admin/users/${userId}/ban`)
    return data.data
  },

  async activateUser(userId: number): Promise<User> {
    const { data } = await api.patch<{ data: User }>(`/admin/users/${userId}/activate`)
    return data.data
  },

  async announcements(status?: string): Promise<Announcement[]> {
    const { data } = await api.get<{ data: Announcement[] }>('/admin/announcements', { params: { status } })
    return data.data
  },

  async removeAnnouncement(id: number): Promise<void> {
    await api.delete(`/admin/announcements/${id}`)
  },

  async reports(status?: string): Promise<Report[]> {
    const { data } = await api.get<{ data: Report[] }>('/admin/reports', { params: { status } })
    return data.data
  },

  async resolveReport(id: number): Promise<Report> {
    const { data } = await api.patch<{ data: Report }>(`/admin/reports/${id}/resolve`)
    return data.data
  },

  async ignoreReport(id: number): Promise<Report> {
    const { data } = await api.patch<{ data: Report }>(`/admin/reports/${id}/ignore`)
    return data.data
  },
}

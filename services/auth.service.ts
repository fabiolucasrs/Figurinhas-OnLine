import api from './api'
import type { User } from '../types'

interface AuthResponse {
  token: string
  user: User
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password })
    return data
  },

  async register(name: string, email: string, password: string, password_confirmation: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', {
      name, email, password, password_confirmation,
    })
    return data
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
  },

  async me(): Promise<User> {
    const { data } = await api.get<{ data: User }>('/auth/me')
    return data.data
  },
}

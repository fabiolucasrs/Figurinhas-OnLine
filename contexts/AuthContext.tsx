import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { User } from '../types'
import { authService } from '../services/auth.service'

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (name: string, email: string, password: string, password_confirmation: string) => Promise<void>
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      authService.me()
        .then(u => setUser(u))
        .catch(() => {
          localStorage.removeItem('token')
          setToken(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token])

  const login = useCallback(async (email: string, password: string) => {
    const { token: t, user: u } = await authService.login(email, password)
    localStorage.setItem('token', t)
    setToken(t)
    setUser(u)
  }, [])

  const logout = useCallback(async () => {
    try { await authService.logout() } catch {}
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }, [])

  const register = useCallback(async (name: string, email: string, password: string, password_confirmation: string) => {
    const { token: t, user: u } = await authService.register(name, email, password, password_confirmation)
    localStorage.setItem('token', t)
    setToken(t)
    setUser(u)
  }, [])

  const updateUser = useCallback((u: User) => setUser(u), [])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, register, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}

import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { ToastContainer } from './components/ui/Toast'
import { useAuth } from './hooks/useAuth'
import { AdminPanel } from './pages/admin/AdminPanel'
import { AnnouncementDetail } from './pages/AnnouncementDetail'
import { AnnouncementForm } from './pages/AnnouncementForm'
import { HomePage } from './pages/HomePage'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { MyProfile } from './pages/MyProfile'

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin" /></div>
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-2 border-red-400 border-t-transparent rounded-full animate-spin" /></div>
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/home" replace />
  return <>{children}</>
}

export const App: React.FC = () => {
  const { user } = useAuth()

  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden">
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-yellow-400/15 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-500/25 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
            <Route path="/anuncios/novo" element={<PrivateRoute><AnnouncementForm /></PrivateRoute>} />
            <Route path="/anuncios/:id" element={<AnnouncementDetail />} />
            <Route path="/anuncios/:id/editar" element={<PrivateRoute><AnnouncementForm /></PrivateRoute>} />

            <Route path="/painel" element={<PrivateRoute><MyProfile /></PrivateRoute>} />
            <Route path="/painel/:tab" element={<PrivateRoute><MyProfile /></PrivateRoute>} />

            <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />

            <Route path="*" element={<Navigate to={user ? '/home' : '/'} replace />} />
          </Routes>
        </main>
      </div>

      <ToastContainer />
    </div>
  )
}

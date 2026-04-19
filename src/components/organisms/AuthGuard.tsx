import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Sidebar from './Sidebar'

function AuthGuard() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black-500 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-red-100 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen bg-black-500 flex">
      <Sidebar />
      <main className="flex-1 min-h-screen flex flex-col">
        <Outlet />
      </main>
    </div>
  )
}

export default AuthGuard

import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'

interface ProtectedRouteProps {
  role?: 'BUYER' | 'SELLER' | 'ADMIN'
}

const ProtectedRoute = ({ role }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (role && user?.role !== role) {
    // Redirect to appropriate dashboard based on user role
    if (user?.role === 'SELLER') return <Navigate to="/seller/dashboard" replace />
    if (user?.role === 'BUYER') return <Navigate to="/buyer/dashboard" replace />
    if (user?.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRoute

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'

// Layouts
import MainLayout from '@/layouts/MainLayout'
import DashboardLayout from '@/layouts/DashboardLayout'

// Public Pages
import HomePage from '@/pages/HomePage'
import MarketplacePage from '@/pages/MarketplacePage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'

// Buyer Pages
import BuyerDashboard from '@/pages/buyer/BuyerDashboard'
import OrdersPage from '@/pages/buyer/OrdersPage'

// Seller Pages
import SellerDashboard from '@/pages/seller/SellerDashboard'
import CreateListingPage from '@/pages/seller/CreateListingPage'
import MyListingsPage from '@/pages/seller/MyListingsPage'
import SalesPage from '@/pages/seller/SalesPage'
import InquiriesPage from '@/pages/seller/InquiriesPage'

// Admin Pages
import AdminDashboard from '@/pages/admin/AdminDashboard'

// Protected Route Component
import ProtectedRoute from '@/components/auth/ProtectedRoute'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Buyer Protected Routes */}
          <Route element={<ProtectedRoute role="BUYER" />}>
            <Route element={<DashboardLayout />}>
              <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
              <Route path="/buyer/orders" element={<OrdersPage />} />
            </Route>
          </Route>

          {/* Seller Protected Routes */}
          <Route element={<ProtectedRoute role="SELLER" />}>
            <Route element={<DashboardLayout />}>
              <Route path="/seller/dashboard" element={<SellerDashboard />} />
              <Route path="/seller/listings" element={<MyListingsPage />} />
              <Route path="/seller/create-listing" element={<CreateListingPage />} />
              <Route path="/seller/sales" element={<SalesPage />} />
              <Route path="/seller/inquiries" element={<InquiriesPage />} />
            </Route>
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute role="ADMIN" />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'glass shadow-glass',
          style: {
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(124, 58, 237, 0.1)',
          },
        }}
      />
    </>
  )
}

export default App

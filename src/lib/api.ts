import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/useAuthStore'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { token } = useAuthStore.getState()
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const { refreshToken } = useAuthStore.getState()
        
        if (refreshToken) {
          // Attempt to refresh token
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken,
          })

          const { token: newToken, user } = response.data

          // Update auth store with new token
          useAuthStore.getState().setAuth(user, newToken, refreshToken)

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
          }
          
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh token failed, logout user
        useAuthStore.getState().logout()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// API Service Functions
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (data: { name: string; email: string; password: string; role: string }) =>
    api.post('/auth/register', data),
  
  verifyEmail: (token: string) =>
    api.post('/auth/verify-email', { token }),
  
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),
}

export const listingAPI = {
  getAll: (params?: any) =>
    api.get('/listings', { params }),
  
  getById: (id: string) =>
    api.get(`/listings/${id}`),
  
  create: (data: FormData) =>
    api.post('/listings', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  update: (id: string, data: FormData) =>
    api.put(`/listings/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  delete: (id: string) =>
    api.delete(`/listings/${id}`),
}

export const orderAPI = {
  create: (listingId: string) =>
    api.post('/orders/create', { listingId }),
  
  verify: (data: { orderId: string; paymentId: string; signature: string }) =>
    api.post('/orders/verify', data),
  
  getMyOrders: () =>
    api.get('/buyer/orders'),
  
  getMySales: () =>
    api.get('/seller/sales'),
}

export const inquiryAPI = {
  create: (listingId: string, data: any) =>
    api.post(`/listings/${listingId}/inquiries`, data),
  
  getMyInquiries: () =>
    api.get('/seller/inquiries'),
  
  updateStatus: (id: string, status: string) =>
    api.patch(`/seller/inquiries/${id}/status`, { status }),
}

export const reviewAPI = {
  create: (listingId: string, data: { rating: number; comment: string }) =>
    api.post(`/listings/${listingId}/reviews`, data),
  
  getByListing: (listingId: string) =>
    api.get(`/listings/${listingId}/reviews`),
}

export const adminAPI = {
  getUsers: (params?: any) =>
    api.get('/admin/users', { params }),
  
  updateUserStatus: (userId: string, status: string) =>
    api.patch(`/admin/users/${userId}/status`, { status }),
  
  approveListing: (listingId: string) =>
    api.patch(`/admin/listings/${listingId}/approve`),
  
  rejectListing: (listingId: string, reason: string) =>
    api.patch(`/admin/listings/${listingId}/reject`, { reason }),
  
  getTransactions: (params?: any) =>
    api.get('/admin/transactions', { params }),
  
  getAnalytics: () =>
    api.get('/admin/analytics'),
}

export default api

import { supabase } from './supabase'
import { useAuthStore } from '@/stores/useAuthStore'

export interface SignUpData {
  email: string
  password: string
  name: string
  role: 'BUYER' | 'SELLER'
  phone?: string
}

export interface AuthResponse {
  success: boolean
  data?: any
  error?: string
}

/**
 * Supabase Authentication Service
 * Handles all authentication operations with Supabase Auth
 */
export const authService = {
  /**
   * Sign up a new user with email verification
   */
  signUp: async (userData: SignUpData): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: userData.role,
            phone: userData.phone || null,
          },
          emailRedirectTo: `${window.location.origin}/auth/verify-email`,
        },
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (!data.user) {
        return { success: false, error: 'Failed to create user' }
      }

      return {
        success: true,
        data: {
          user: data.user,
          session: data.session,
          needsEmailVerification: !data.session, // If session is null, email needs verification
        },
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Registration failed' }
    }
  },

  /**
   * Sign in with email and password
   */
  signIn: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (!data.user || !data.session) {
        return { success: false, error: 'Login failed' }
      }

      // Check if email is verified
      if (!data.user.email_confirmed_at) {
        return {
          success: false,
          error: 'Please verify your email address before logging in',
        }
      }

      // Update Zustand store
      useAuthStore.getState().setAuth(
        {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata.name || '',
          role: data.user.user_metadata.role || 'BUYER',
          isVerified: !!data.user.email_confirmed_at,
          avatar: data.user.user_metadata.avatar_url,
          phone: data.user.phone || data.user.user_metadata.phone,
          createdAt: data.user.created_at,
        },
        data.session.access_token,
        data.session.refresh_token
      )

      return {
        success: true,
        data: {
          user: data.user,
          session: data.session,
        },
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Login failed' }
    }
  },

  /**
   * Sign out the current user
   */
  signOut: async (): Promise<AuthResponse> => {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        return { success: false, error: error.message }
      }

      // Clear Zustand store
      useAuthStore.getState().logout()

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message || 'Logout failed' }
    }
  },

  /**
   * Request password reset email
   */
  resetPassword: async (email: string): Promise<AuthResponse> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return {
        success: true,
        data: { message: 'Password reset email sent' },
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to send reset email' }
    }
  },

  /**
   * Update user password (requires active session)
   */
  updatePassword: async (newPassword: string): Promise<AuthResponse> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return {
        success: true,
        data: { message: 'Password updated successfully' },
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to update password' }
    }
  },

  /**
   * Get current session
   */
  getSession: async (): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        return { success: false, error: error.message }
      }

      return {
        success: true,
        data: { session: data.session },
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to get session' }
    }
  },

  /**
   * Refresh the current session
   */
  refreshSession: async (): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.refreshSession()

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.session) {
        // Update Zustand store with new tokens
        const { user } = data.session
        useAuthStore.getState().setAuth(
          {
            id: user.id,
            email: user.email!,
            name: user.user_metadata.name || '',
            role: user.user_metadata.role || 'BUYER',
            isVerified: !!user.email_confirmed_at,
            avatar: user.user_metadata.avatar_url,
            phone: user.phone || user.user_metadata.phone,
            createdAt: user.created_at,
          },
          data.session.access_token,
          data.session.refresh_token
        )
      }

      return {
        success: true,
        data: { session: data.session },
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to refresh session' }
    }
  },

  /**
   * Resend verification email
   */
  resendVerificationEmail: async (email: string): Promise<AuthResponse> => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify-email`,
        },
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return {
        success: true,
        data: { message: 'Verification email sent' },
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to resend verification email' }
    }
  },

  /**
   * Verify email with token from URL
   */
  verifyEmail: async (token: string): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email',
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return {
        success: true,
        data: { user: data.user, session: data.session },
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Email verification failed' }
    }
  },
}

/**
 * Initialize auth state listener
 * Call this once in your app initialization
 */
export const initializeAuth = () => {
  // Listen for auth state changes
  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('Auth event:', event)

    if (event === 'SIGNED_IN' && session) {
      const { user } = session
      useAuthStore.getState().setAuth(
        {
          id: user.id,
          email: user.email!,
          name: user.user_metadata.name || '',
          role: user.user_metadata.role || 'BUYER',
          isVerified: !!user.email_confirmed_at,
          avatar: user.user_metadata.avatar_url,
          phone: user.phone || user.user_metadata.phone,
          createdAt: user.created_at,
        },
        session.access_token,
        session.refresh_token
      )
    } else if (event === 'SIGNED_OUT') {
      useAuthStore.getState().logout()
    } else if (event === 'TOKEN_REFRESHED' && session) {
      const { user } = session
      useAuthStore.getState().setAuth(
        {
          id: user.id,
          email: user.email!,
          name: user.user_metadata.name || '',
          role: user.user_metadata.role || 'BUYER',
          isVerified: !!user.email_confirmed_at,
          avatar: user.user_metadata.avatar_url,
          phone: user.phone || user.user_metadata.phone,
          createdAt: user.created_at,
        },
        session.access_token,
        session.refresh_token
      )
    } else if (event === 'USER_UPDATED' && session) {
      const { user } = session
      useAuthStore.getState().updateUser({
        name: user.user_metadata.name,
        avatar: user.user_metadata.avatar_url,
        phone: user.phone || user.user_metadata.phone,
      })
    }
  })

  // Check for existing session on init
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      const { user } = session
      useAuthStore.getState().setAuth(
        {
          id: user.id,
          email: user.email!,
          name: user.user_metadata.name || '',
          role: user.user_metadata.role || 'BUYER',
          isVerified: !!user.email_confirmed_at,
          avatar: user.user_metadata.avatar_url,
          phone: user.phone || user.user_metadata.phone,
          createdAt: user.created_at,
        },
        session.access_token,
        session.refresh_token
      )
    }
  })
}

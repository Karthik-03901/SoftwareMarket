import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react'
import { toast } from 'sonner'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { authService } from '@/lib/auth'
import { useAuthStore } from '@/stores/useAuthStore'

type VerificationStatus = 'verifying' | 'success' | 'error' | 'expired'

const VerifyEmailPage = () => {
  const [status, setStatus] = useState<VerificationStatus>('verifying')
  const [errorMessage, setErrorMessage] = useState('')
  const [email, setEmail] = useState('')
  const [isResending, setIsResending] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuthStore()

  useEffect(() => {
    verifyEmail()
  }, [])

  const verifyEmail = async () => {
    try {
      // Get token from URL hash (Supabase sends it in hash)
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const token = hashParams.get('token') || hashParams.get('token_hash')
      const type = hashParams.get('type')

      if (!token) {
        setStatus('error')
        setErrorMessage('Invalid verification link. No token found.')
        return
      }

      // For Supabase, the verification happens automatically when the user clicks the link
      // We just need to check if they're now logged in
      const sessionResult = await authService.getSession()

      if (sessionResult.success && sessionResult.data?.session) {
        setStatus('success')
        toast.success('Email verified!', {
          description: 'Your account has been activated',
        })

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          const currentUser = useAuthStore.getState().user
          if (currentUser) {
            if (currentUser.role === 'SELLER') navigate('/seller/dashboard')
            else if (currentUser.role === 'ADMIN') navigate('/admin/dashboard')
            else navigate('/buyer/dashboard')
          } else {
            navigate('/login')
          }
        }, 2000)
      } else if (type === 'recovery') {
        // This is a password reset link, not email verification
        navigate('/auth/reset-password')
      } else {
        setStatus('error')
        setErrorMessage('Unable to verify email. The link may have expired.')
      }
    } catch (error: any) {
      console.error('Verification error:', error)
      setStatus('error')
      setErrorMessage(error.message || 'Verification failed. Please try again.')
    }
  }

  const handleResendVerification = async () => {
    if (!email && !user?.email) {
      toast.error('Email required', {
        description: 'Please enter your email address',
      })
      return
    }

    setIsResending(true)
    try {
      const emailToUse = email || user?.email || ''
      const result = await authService.resendVerificationEmail(emailToUse)

      if (!result.success) {
        toast.error('Failed to resend email', {
          description: result.error,
        })
        return
      }

      toast.success('Verification email sent!', {
        description: 'Please check your inbox',
      })
    } catch (error: any) {
      toast.error('Failed to resend email', {
        description: error.message || 'An error occurred',
      })
    } finally {
      setIsResending(false)
    }
  }

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <Card variant="glass" className="shadow-glass-hover text-center">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
              <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground mb-2">
              Verifying Your Email
            </h1>
            <p className="text-muted-foreground">
              Please wait while we verify your email address...
            </p>
          </Card>
        )

      case 'success':
        return (
          <Card variant="glass" className="shadow-glass-hover text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground mb-2">
              Email Verified!
            </h1>
            <p className="text-muted-foreground mb-6">
              Your email has been successfully verified. Redirecting to your dashboard...
            </p>
            <Link to={user?.role === 'SELLER' ? '/seller/dashboard' : '/buyer/dashboard'} className="block">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </Link>
          </Card>
        )

      case 'error':
      case 'expired':
        return (
          <Card variant="glass" className="shadow-glass-hover text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground mb-2">
              Verification Failed
            </h1>
            <p className="text-muted-foreground mb-6">
              {errorMessage || 'The verification link is invalid or has expired.'}
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleResendVerification}
                  isLoading={isResending}
                  leftIcon={<Mail className="h-4 w-4" />}
                >
                  Resend
                </Button>
              </div>

              <Link to="/login" className="block">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  Back to Login
                </Button>
              </Link>
            </div>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-secondary-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="flex items-center justify-center gap-3 mb-8 group">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <span className="text-white text-2xl font-bold">S</span>
          </div>
          <span className="text-3xl font-display font-bold text-gradient-primary">
            SoftMarket
          </span>
        </Link>

        {renderContent()}

        {status !== 'success' && (
          <div className="text-center mt-6 text-sm text-muted-foreground">
            <p>
              Need help?{' '}
              <Link to="/contact" className="text-primary-600 hover:underline">
                Contact support
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default VerifyEmailPage

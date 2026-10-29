import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import { authService } from '@/lib/auth'

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [sentToEmail, setSentToEmail] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    try {
      const result = await authService.resetPassword(data.email)

      if (!result.success) {
        toast.error('Failed to send reset email', {
          description: result.error,
        })
        return
      }

      setSentToEmail(data.email)
      setEmailSent(true)
      toast.success('Reset email sent!', {
        description: 'Check your inbox for password reset instructions',
      })
    } catch (error: any) {
      toast.error('Failed to send reset email', {
        description: error.message || 'An error occurred',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (!sentToEmail) return
    
    setIsLoading(true)
    try {
      const result = await authService.resetPassword(sentToEmail)
      
      if (!result.success) {
        toast.error('Failed to resend email', {
          description: result.error,
        })
        return
      }

      toast.success('Email resent!', {
        description: 'Check your inbox',
      })
    } catch (error: any) {
      toast.error('Failed to resend email', {
        description: error.message || 'An error occurred',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
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

          <Card variant="glass" className="shadow-glass-hover text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground mb-2">
              Check Your Email
            </h1>
            <p className="text-muted-foreground mb-6">
              We've sent password reset instructions to{' '}
              <span className="font-medium text-foreground block mt-1">{sentToEmail}</span>
            </p>
            <div className="p-4 rounded-lg bg-muted/30 border border-border mb-6">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Didn't receive it?</strong>
                <br />
                Check your spam folder or click the button below to resend.
              </p>
            </div>
            <div className="space-y-3">
              <Link to="/login" className="block">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  Back to Login
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="md"
                className="w-full"
                onClick={handleResend}
                isLoading={isLoading}
              >
                Resend Email
              </Button>
            </div>
          </Card>

          <div className="text-center mt-6 text-sm text-muted-foreground">
            <p>
              Wrong email?{' '}
              <button
                onClick={() => setEmailSent(false)}
                className="text-primary-600 hover:underline"
              >
                Try a different one
              </button>
            </p>
          </div>
        </div>
      </div>
    )
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

        <Card variant="glass" className="shadow-glass-hover">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              Forgot Password?
            </h1>
            <p className="text-muted-foreground">
              No worries! Enter your email and we'll send you reset instructions.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail className="h-5 w-5" />}
              error={errors.email?.message}
              {...register('email')}
              autoFocus
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              Send Reset Instructions
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </Card>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>
            Remember your password?{' '}
            <Link to="/login" className="text-primary-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User as UserIcon, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import { authService } from '@/lib/auth'
import { strongPasswordSchema, checkPasswordBreach } from '@/lib/passwordSecurity'
import PasswordStrengthIndicator from '@/components/auth/PasswordStrengthIndicator'

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: strongPasswordSchema,
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

const RegisterPage = () => {
  const [selectedRole, setSelectedRole] = useState<'BUYER' | 'SELLER'>('BUYER')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const password = watch('password') || ''

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      // Check password breach
      toast.loading('Checking password security...')
      const breachCheck = await checkPasswordBreach(data.password)
      toast.dismiss()

      if (breachCheck.breached) {
        toast.warning('Password Security Warning', {
          description: `This password has been found in ${breachCheck.occurrences.toLocaleString()} data breaches. Please choose a different password.`,
          duration: 8000,
        })
        setIsLoading(false)
        return
      }

      // Register user
      const result = await authService.signUp({
        email: data.email,
        password: data.password,
        name: data.name,
        role: selectedRole,
      })

      if (!result.success) {
        toast.error('Registration failed', {
          description: result.error,
        })
        return
      }

      toast.success('Registration successful!', {
        description: 'Please check your email to verify your account',
        duration: 6000,
      })

      navigate('/login', {
        state: { message: 'Please check your email to verify your account' },
      })
    } catch (error: any) {
      toast.error('Registration failed', {
        description: error.message || 'An error occurred',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
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
              Create Your Account
            </h1>
            <p className="text-muted-foreground">
              Join our community of developers and businesses
            </p>
          </div>

          {/* Role Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-foreground mb-3">
              I want to
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSelectedRole('BUYER')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  selectedRole === 'BUYER'
                    ? 'border-primary-500 bg-primary-50 shadow-card'
                    : 'border-border glass hover:border-primary-300'
                }`}
              >
                <div className="text-4xl mb-3">🛒</div>
                <h3 className="font-semibold text-foreground mb-1">Buy Software</h3>
                <p className="text-sm text-muted-foreground">Browse and purchase products</p>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('SELLER')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  selectedRole === 'SELLER'
                    ? 'border-primary-500 bg-primary-50 shadow-card'
                    : 'border-border glass hover:border-primary-300'
                }`}
              >
                <div className="text-4xl mb-3">💼</div>
                <h3 className="font-semibold text-foreground mb-1">Sell Software</h3>
                <p className="text-sm text-muted-foreground">List and monetize products</p>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              leftIcon={<UserIcon className="h-5 w-5" />}
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail className="h-5 w-5" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <div>
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  leftIcon={<Lock className="h-5 w-5" />}
                  error={errors.password?.message}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <PasswordStrengthIndicator password={password} />
            </div>

            <div className="relative">
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
                leftIcon={<Lock className="h-5 w-5" />}
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-10 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 h-4 w-4 rounded border-border text-primary-600 focus:ring-2 focus:ring-ring"
                {...register('terms')}
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                I agree to the{' '}
                <Link to="/terms" className="text-primary-600 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary-600 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.terms && (
              <p className="text-sm text-red-600">{errors.terms.message}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="h-5 w-5" />}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default RegisterPage

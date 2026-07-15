import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

const RegisterPage = () => {
  const [selectedRole, setSelectedRole] = useState<'BUYER' | 'SELLER'>('BUYER')

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

          <form className="space-y-6">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              leftIcon={<UserIcon className="h-5 w-5" />}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail className="h-5 w-5" />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Create a strong password"
              leftIcon={<Lock className="h-5 w-5" />}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter your password"
              leftIcon={<Lock className="h-5 w-5" />}
              required
            />

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 h-4 w-4 rounded border-border text-primary-600 focus:ring-2 focus:ring-ring"
                required
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

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
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

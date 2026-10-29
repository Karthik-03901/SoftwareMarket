# 🎯 Final Steps to Complete Phase 1

## ✅ Current Status
- Forgot Password page: ✅ **WORKING!**
- Reset Password page: ✅ Created
- Verify Email page: ✅ Created
- Auth library: ✅ Complete
- Password security: ✅ Complete

## 🔧 Just 2 Files Need Manual Updates

### Update 1: LoginPage.tsx

**File**: `src/pages/auth/LoginPage.tsx`

**Line 12**: Change this:
```typescript
import { authAPI } from '@/lib/api'
```

**To**:
```typescript
import { authService } from '@/lib/auth'
```

**Lines 36-60**: Replace the entire `onSubmit` function with:
```typescript
const onSubmit = async (data: LoginFormData) => {
  setIsLoading(true)
  try {
    const result = await authService.signIn(data.email, data.password)

    if (!result.success) {
      toast.error('Login failed', {
        description: result.error || 'Invalid email or password',
      })
      return
    }

    const user = useAuthStore.getState().user
    if (!user) {
      toast.error('Login failed', {
        description: 'User data not found',
      })
      return
    }

    toast.success('Login successful!', {
      description: `Welcome back, ${user.name}!`,
    })

    // Redirect based on role
    if (user.role === 'SELLER') navigate('/seller/dashboard')
    else if (user.role === 'ADMIN') navigate('/admin/dashboard')
    else navigate('/buyer/dashboard')
  } catch (error: any) {
    toast.error('Login failed', {
      description: error.message || 'An error occurred',
    })
  } finally {
    setIsLoading(false)
  }
}
```

**Line 129**: Change this:
```typescript
to="/forgot-password"
```

**To**:
```typescript
to="/auth/forgot-password"
```

---

### Update 2: RegisterPage.tsx

**File**: `src/pages/auth/RegisterPage.tsx`

**Replace the ENTIRE file** with this code:

```typescript
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
```

---

## 🗄️ Database Setup

Go to Supabase Dashboard → SQL Editor → New Query → Paste and Run:

```sql
-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role VARCHAR(10) NOT NULL CHECK (role IN ('BUYER', 'SELLER', 'ADMIN')),
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  company_name VARCHAR(255),
  phone VARCHAR(20),
  two_factor_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, role, name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'BUYER'),
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', NEW.phone)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## ✅ Quick Checklist

- [ ] Update LoginPage.tsx (3 small changes)
- [ ] Replace RegisterPage.tsx (full file)
- [ ] Run SQL in Supabase (database setup)
- [ ] Test registration flow
- [ ] Test login flow

---

## 🎉 After Completion

You'll have:
- ✅ Full authentication with Supabase
- ✅ Email verification
- ✅ Forgot/Reset password
- ✅ Password breach detection
- ✅ Strong password requirements
- ✅ Beautiful password strength indicator
- ✅ Real-time session sync

---

**Estimated time**: 10 minutes

**Need help?** Check the browser console for any errors after making changes.

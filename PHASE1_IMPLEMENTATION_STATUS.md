# Phase 1 Implementation Status

## ✅ Completed Files

### 1. Core Authentication Library
- ✅ `src/lib/auth.ts` - Complete Supabase Auth integration
  - signUp with email verification
  - signIn with email confirmation check
  - signOut
  - resetPassword / updatePassword
  - getSession / refreshSession
  - resendVerificationEmail
  - initializeAuth() for real-time session sync

### 2. Password Security Library
- ✅ `src/lib/passwordSecurity.ts` - Password validation & security
  - Strong password validation (12+ chars, mixed case, numbers, special)
  - Password strength calculator (0-100 score)
  - HaveIBeenPwned API integration
  - Common password blacklist
  - Sequential character detection
  - Password generator

### 3. UI Components
- ✅ `src/components/auth/PasswordStrengthIndicator.tsx`
  - Real-time strength visualization
  - Progress bar + strength bars
  - Feedback messages
  - Requirements checklist

### 4. Packages Installed
- ✅ `crypto-js` - For SHA-1 hashing (HaveIBeenPwned)
- ✅ `@types/crypto-js` - TypeScript definitions
- ✅ `libphonenumber-js` - Phone number validation

---

## 🔄 Next Steps - Remaining Phase 1 Files

### Priority 1: Update Existing Auth Pages

#### A. Update LoginPage.tsx
```typescript
// Key changes needed:
1. Import authService from '@/lib/auth'
2. Replace authAPI.login() with authService.signIn()
3. Add better error handling
4. Add "email not verified" message
5. Keep existing UI/UX
```

#### B. Update RegisterPage.tsx
```typescript
// Key changes needed:
1. Import authService and password security
2. Add PasswordStrengthIndicator component
3. Add HaveIBeenPwned check before submit
4. Use authService.signUp()
5. Show success message with "check your email"
6. Add form validation with Zod
```

### Priority 2: Create New Auth Pages

#### C. Create ForgotPasswordPage.tsx
- Email input form
- Call authService.resetPassword()
- Success message: "Check your email"
- Link back to login

#### D. Create ResetPasswordPage.tsx
- New password + confirm password
- Password strength indicator
- Extract token from URL
- Call authService.updatePassword()
- Redirect to login on success

#### E. Create VerifyEmailPage.tsx
- Extract token from URL hash
- Auto-verify on load
- Show success/error message
- Redirect to login or dashboard
- Resend verification option

### Priority 3: Update Auth Store
- Update useAuthStore.ts to work with Supabase session
- Already mostly compatible!

### Priority 4: Add Routes
- Add new pages to App.tsx
- /auth/forgot-password
- /auth/reset-password
- /auth/verify-email

### Priority 5: Initialize Auth
- Call initializeAuth() in main.tsx or App.tsx
- Sets up real-time session listener

---

## 📝 Implementation Guide

### Step 1: Update LoginPage.tsx

**Replace the onSubmit function:**

```typescript
const onSubmit = async (data: LoginFormData) => {
  setIsLoading(true)
  try {
    const result = await authService.signIn(data.email, data.password)
    
    if (!result.success) {
      toast.error('Login failed', {
        description: result.error || 'Invalid credentials',
      })
      return
    }

    const user = useAuthStore.getState().user
    if (!user) return

    toast.success('Welcome back!', {
      description: `Logged in as ${user.name}`,
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

### Step 2: Update RegisterPage.tsx

**Add imports:**
```typescript
import { authService } from '@/lib/auth'
import { strongPasswordSchema, checkPasswordBreach } from '@/lib/passwordSecurity'
import PasswordStrengthIndicator from '@/components/auth/PasswordStrengthIndicator'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
```

**Add validation schema:**
```typescript
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: strongPasswordSchema,
  confirmPassword: z.string(),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})
```

**Add form submit:**
```typescript
const onSubmit = async (data: z.infer<typeof registerSchema>) => {
  setIsLoading(true)
  try {
    // Check password breach
    const breachCheck = await checkPasswordBreach(data.password)
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
```

### Step 3: Create ForgotPasswordPage.tsx

```typescript
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

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-secondary-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center justify-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center shadow-lg">
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
              <span className="font-medium text-foreground">{sentToEmail}</span>
            </p>
            <div className="space-y-3">
              <Button as={Link} to="/login" variant="primary" size="lg" className="w-full">
                Back to Login
              </Button>
              <Button variant="ghost" size="md" className="w-full" onClick={() => setEmailSent(false)}>
                Resend Email
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center shadow-lg">
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
      </div>
    </div>
  )
}

export default ForgotPasswordPage
```

### Step 4: Initialize Auth in main.tsx

**Add to main.tsx after imports:**
```typescript
import { initializeAuth } from './lib/auth'

// Initialize auth state listener
initializeAuth()
```

### Step 5: Add Routes in App.tsx

```typescript
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage'
import VerifyEmailPage from '@/pages/auth/VerifyEmailPage'

// In Routes:
<Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
<Route path="/auth/reset-password" element={<ResetPasswordPage />} />
<Route path="/auth/verify-email" element={<VerifyEmailPage />} />
```

---

## 🗄️ Database Setup Required

### Step 1: Create Tables in Supabase

Go to Supabase SQL Editor and run:

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
  two_factor_method VARCHAR(10) CHECK (two_factor_method IN ('SMS', 'EMAIL', 'TOTP')),
  kyc_status VARCHAR(20) DEFAULT 'NOT_SUBMITTED' CHECK (kyc_status IN ('NOT_SUBMITTED', 'PENDING', 'APPROVED', 'REJECTED')),
  kyc_documents JSONB,
  account_status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (account_status IN ('ACTIVE', 'SUSPENDED', 'DISABLED')),
  preferred_language VARCHAR(5) DEFAULT 'en',
  failed_login_attempts INT DEFAULT 0,
  last_failed_login TIMESTAMP,
  account_locked_until TIMESTAMP,
  password_changed_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Trigger to create profile on user signup
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

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

### Step 2: Configure Email Templates in Supabase

1. Go to Authentication > Email Templates
2. Customize templates for:
   - Confirm Signup
   - Reset Password
   - Change Email

---

## ✅ Quick Test Checklist

After implementation:

1. [ ] Register new user - email sent?
2. [ ] Click verification link - account activated?
3. [ ] Login with unverified email - blocked?
4. [ ] Login with verified email - works?
5. [ ] Password strength indicator works?
6. [ ] HaveIBeenPwned check works? (try "password123")
7. [ ] Forgot password - email sent?
8. [ ] Reset password - works and logs in?
9. [ ] Session persists on page refresh?
10. [ ] Logout clears session?

---

## 🎯 Status Summary

**Completed**: 30% of Phase 1
**Remaining**: Update 2 pages, create 3 new pages, database setup

**Estimated Time Remaining**: 2-3 hours

**Next Command**: "Update LoginPage and RegisterPage"

Would you like me to continue with the remaining files?

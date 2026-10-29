# 🔐 Authentication Security Analysis & Implementation Plan

## 📊 Current Implementation Status

### ✅ What's Working
- Basic login page with form validation (Zod)
- Basic register page with role selection
- JWT token storage in Zustand
- Protected routes by role
- Password visibility toggle

### ❌ Critical Security Gaps

| Security Feature | Status | Risk Level | PRD Requirement |
|------------------|--------|------------|-----------------|
| **Supabase Auth Integration** | ❌ Not Implemented | 🔴 CRITICAL | Core |
| **Email Verification** | ❌ Not Implemented | 🔴 CRITICAL | FR-1.6 |
| **Forgot Password Flow** | ❌ Not Implemented | 🔴 CRITICAL | FR-1.11 |
| **2FA (Two-Factor Auth)** | ❌ Not Implemented | 🔴 CRITICAL | FR-1.4, FR-11.3 |
| **HaveIBeenPwned API** | ❌ Not Implemented | 🟠 HIGH | FR-1.3, FR-11.2 |
| **Cloudflare Turnstile CAPTCHA** | ❌ Not Implemented | 🟠 HIGH | FR-1.8, FR-11.1 |
| **Rate Limiting** | ❌ Not Implemented | 🟠 HIGH | FR-11.5 |
| **Session Management** | ⚠️ Partial (JWT only) | 🟠 HIGH | FR-1.5 |
| **KYC Verification** | ❌ Not Implemented | 🟡 MEDIUM | FR-1.13, FR-11.4 |
| **Password Strength** | ⚠️ Weak (6 chars) | 🟡 MEDIUM | FR-1.2 |
| **Account Lockout** | ❌ Not Implemented | 🟡 MEDIUM | Security |
| **Real-time Auth Sync** | ❌ Not Implemented | 🟡 MEDIUM | Performance |

---

## 🎯 Implementation Priority Matrix

### Phase 1: Critical Security (Week 1-2) 🔴
**Must-Have for Production**

1. **Supabase Authentication Integration**
   - Replace custom JWT with Supabase Auth
   - Real-time session management
   - Multi-device session tracking
   - Auto token refresh

2. **Email Verification Flow**
   - Email confirmation on registration
   - Verification link/OTP via Resend
   - Prevent unverified user access
   - Resend verification email option

3. **Forgot Password / Reset Password**
   - Secure password reset flow
   - Time-limited reset tokens (1 hour)
   - Email + SMS notification
   - Password reset history

4. **Strong Password Requirements**
   - Minimum 12 characters (not 6)
   - Must include: uppercase, lowercase, number, special char
   - Password strength indicator
   - Common password blacklist

### Phase 2: Enhanced Security (Week 3-4) 🟠

5. **HaveIBeenPwned Integration**
   - Check passwords on registration
   - Check passwords on change
   - Warn users of breached passwords
   - Force change if compromised

6. **Cloudflare Turnstile CAPTCHA**
   - Invisible CAPTCHA on registration
   - CAPTCHA on login after 3 failed attempts
   - CAPTCHA on forgot password
   - Bot protection

7. **Rate Limiting & Brute Force Protection**
   - 5 login attempts per 15 minutes per IP
   - 3 wrong passwords = temporary lockout (15 min)
   - 10 failed attempts = account lockout (requires admin)
   - Progressive delays on failed attempts

8. **Two-Factor Authentication (2FA)**
   - Optional 2FA for all users
   - Mandatory for sellers with high volume
   - SMS OTP via Textbee
   - Email OTP via Resend
   - TOTP app support (Google Authenticator)
   - Recovery codes

### Phase 3: Advanced Features (Week 5-6) 🟡

9. **Real-time Session Management**
   - Active sessions dashboard
   - View all logged-in devices
   - Remote logout from other devices
   - Session activity log
   - Suspicious activity alerts

10. **KYC Verification System**
    - Document upload (Aadhaar/PAN)
    - Admin review workflow
    - Verification badge
    - Document encryption
    - Status tracking

11. **Security Dashboard**
    - Recent login activity
    - Failed login attempts
    - Password last changed
    - 2FA status
    - Connected devices
    - Security recommendations

---

## 🏗️ Technical Architecture

### Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    USER REGISTRATION                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  1. User fills registration form  │
        │     - Name, Email, Password       │
        │     - Role selection (Buyer/Seller)│
        │     - CAPTCHA verification         │
        └───────────┬───────────────────────┘
                    │
                    ▼
        ┌───────────────────────────────────┐
        │  2. Client-side validation        │
        │     - Zod schema validation       │
        │     - Password strength check     │
        └───────────┬───────────────────────┘
                    │
                    ▼
        ┌───────────────────────────────────┐
        │  3. HaveIBeenPwned API check      │
        │     - Check for breached password │
        │     - Warn user if compromised    │
        └───────────┬───────────────────────┘
                    │
                    ▼
        ┌───────────────────────────────────┐
        │  4. Supabase Auth signUp()        │
        │     - Create user in auth.users   │
        │     - Send verification email     │
        └───────────┬───────────────────────┘
                    │
                    ▼
        ┌───────────────────────────────────┐
        │  5. Email sent (Resend)           │
        │     - Verification link + OTP     │
        │     - Link expires in 24 hours    │
        └───────────┬───────────────────────┘
                    │
                    ▼
        ┌───────────────────────────────────┐
        │  6. User clicks verification link │
        │     - Supabase verifies email     │
        │     - Account activated           │
        └───────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                         USER LOGIN                           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  1. User enters credentials       │
        │     - Email + Password            │
        │     - CAPTCHA (if needed)         │
        └───────────┬───────────────────────┘
                    │
                    ▼
        ┌───────────────────────────────────┐
        │  2. Rate limit check              │
        │     - Check failed attempts       │
        │     - Apply progressive delay     │
        └───────────┬───────────────────────┘
                    │
                    ▼
        ┌───────────────────────────────────┐
        │  3. Supabase Auth signIn()        │
        │     - Verify credentials          │
        │     - Check email verified        │
        └───────────┬───────────────────────┘
                    │
                    ▼
        ┌───────────────────────────────────┐
        │  4. Check 2FA enabled?            │
        └───────────┬───────────────────────┘
                    │
            ┌───────┴───────┐
            │               │
        YES │               │ NO
            │               │
            ▼               ▼
    ┌──────────────┐  ┌──────────────┐
    │ Send OTP     │  │ Create       │
    │ (SMS/Email)  │  │ Session      │
    └──────┬───────┘  └──────┬───────┘
           │                 │
           ▼                 │
    ┌──────────────┐         │
    │ Verify OTP   │         │
    └──────┬───────┘         │
           │                 │
           └────────┬────────┘
                    │
                    ▼
        ┌───────────────────────────────────┐
        │  5. Create JWT + Refresh Token    │
        │     - Store in Zustand            │
        │     - Sync with Supabase session  │
        └───────────┬───────────────────────┘
                    │
                    ▼
        ┌───────────────────────────────────┐
        │  6. Redirect to dashboard         │
        │     - Based on user role          │
        └───────────────────────────────────┘
```

---

## 📝 Detailed Implementation Specifications

### 1. Supabase Authentication Integration

**Current Problem**: Using custom JWT without Supabase Auth features

**Solution**: Integrate Supabase Auth

**Implementation**:

```typescript
// src/lib/auth.ts
import { supabase } from './supabase'
import { useAuthStore } from '@/stores/useAuthStore'

export const authService = {
  // Sign up with email verification
  signUp: async (email: string, password: string, metadata: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata, // role, name, etc.
        emailRedirectTo: `${window.location.origin}/auth/verify-email`,
      },
    })
    return { data, error }
  },

  // Sign in
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    useAuthStore.getState().logout()
    return { error }
  },

  // Reset password
  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    return { data, error }
  },

  // Update password
  updatePassword: async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    return { data, error }
  },

  // Get current session
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession()
    return { data, error }
  },

  // Refresh session
  refreshSession: async () => {
    const { data, error } = await supabase.auth.refreshSession()
    return { data, error }
  },
}

// Real-time auth state listener
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event)
  
  if (session) {
    // Update Zustand store
    const user = session.user
    useAuthStore.getState().setAuth(
      {
        id: user.id,
        email: user.email!,
        name: user.user_metadata.name,
        role: user.user_metadata.role,
        isVerified: user.email_confirmed_at !== null,
        avatar: user.user_metadata.avatar_url,
        phone: user.phone,
        createdAt: user.created_at,
      },
      session.access_token,
      session.refresh_token
    )
  } else {
    useAuthStore.getState().logout()
  }
})
```

**Database Schema Updates**:

```sql
-- Add to users table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
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

-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, role, name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'role',
    NEW.raw_user_meta_data->>'name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

### 2. Password Strength & HaveIBeenPwned Integration

**Implementation**:

```typescript
// src/lib/passwordSecurity.ts
import { z } from 'zod'
import crypto from 'crypto-js'

// Strong password validation
export const strongPasswordSchema = z
  .string()
  .min(12, 'Password must be at least 12 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')

// Password strength calculator
export const calculatePasswordStrength = (password: string): {
  score: number // 0-100
  level: 'weak' | 'fair' | 'good' | 'strong' | 'very-strong'
  feedback: string[]
} => {
  let score = 0
  const feedback: string[] = []

  // Length check
  if (password.length >= 12) score += 25
  else if (password.length >= 8) score += 10
  else feedback.push('Use at least 12 characters')

  // Character variety
  if (/[a-z]/.test(password)) score += 15
  else feedback.push('Add lowercase letters')

  if (/[A-Z]/.test(password)) score += 15
  else feedback.push('Add uppercase letters')

  if (/[0-9]/.test(password)) score += 15
  else feedback.push('Add numbers')

  if (/[^A-Za-z0-9]/.test(password)) score += 20
  else feedback.push('Add special characters')

  // Complexity bonus
  const uniqueChars = new Set(password).size
  if (uniqueChars > password.length * 0.8) score += 10

  // Determine level
  let level: 'weak' | 'fair' | 'good' | 'strong' | 'very-strong'
  if (score >= 90) level = 'very-strong'
  else if (score >= 75) level = 'strong'
  else if (score >= 50) level = 'good'
  else if (score >= 25) level = 'fair'
  else level = 'weak'

  return { score, level, feedback }
}

// Check password against HaveIBeenPwned API
export const checkPasswordBreach = async (password: string): Promise<{
  breached: boolean
  occurrences: number
}> => {
  try {
    // Hash password with SHA-1
    const sha1Hash = crypto.SHA1(password).toString().toUpperCase()
    const prefix = sha1Hash.substring(0, 5)
    const suffix = sha1Hash.substring(5)

    // Call HaveIBeenPwned API (k-anonymity model)
    const response = await fetch(
      `https://api.pwnedpasswords.com/range/${prefix}`
    )
    const text = await response.text()

    // Check if our suffix appears in the response
    const lines = text.split('\n')
    for (const line of lines) {
      const [hashSuffix, count] = line.split(':')
      if (hashSuffix === suffix) {
        return {
          breached: true,
          occurrences: parseInt(count.trim(), 10),
        }
      }
    }

    return { breached: false, occurrences: 0 }
  } catch (error) {
    console.error('Error checking password breach:', error)
    // Fail open - don't block registration if API is down
    return { breached: false, occurrences: 0 }
  }
}

// Common password blacklist (top 1000 most common)
const COMMON_PASSWORDS = [
  'password', '123456', '12345678', 'qwerty', 'abc123',
  'monkey', '1234567', 'letmein', 'trustno1', 'dragon',
  // ... add more
]

export const isCommonPassword = (password: string): boolean => {
  return COMMON_PASSWORDS.includes(password.toLowerCase())
}
```

**Password Strength Component**:

```tsx
// src/components/auth/PasswordStrengthIndicator.tsx
import { useEffect, useState } from 'react'
import { calculatePasswordStrength } from '@/lib/passwordSecurity'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface Props {
  password: string
}

const PasswordStrengthIndicator = ({ password }: Props) => {
  const [strength, setStrength] = useState({
    score: 0,
    level: 'weak' as const,
    feedback: [] as string[],
  })

  useEffect(() => {
    if (password) {
      const result = calculatePasswordStrength(password)
      setStrength(result)
    }
  }, [password])

  const getColorClass = () => {
    switch (strength.level) {
      case 'very-strong': return 'bg-green-500'
      case 'strong': return 'bg-green-400'
      case 'good': return 'bg-yellow-500'
      case 'fair': return 'bg-orange-500'
      case 'weak': return 'bg-red-500'
    }
  }

  const getLevelText = () => {
    switch (strength.level) {
      case 'very-strong': return 'Very Strong'
      case 'strong': return 'Strong'
      case 'good': return 'Good'
      case 'fair': return 'Fair'
      case 'weak': return 'Weak'
    }
  }

  if (!password) return null

  return (
    <div className="mt-2 space-y-2">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getColorClass()}`}
            style={{ width: `${strength.score}%` }}
          />
        </div>
        <span className="text-sm font-medium text-foreground min-w-24">
          {getLevelText()}
        </span>
      </div>

      {/* Feedback */}
      {strength.feedback.length > 0 && (
        <div className="space-y-1">
          {strength.feedback.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
              <AlertCircle className="h-3 w-3" />
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PasswordStrengthIndicator
```

---

### 3. Cloudflare Turnstile CAPTCHA Integration

**Implementation**:

```typescript
// src/lib/captcha.ts
export const loadTurnstile = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.turnstile) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Turnstile'))
    document.head.appendChild(script)
  })
}

export const renderTurnstile = (
  containerId: string,
  callback: (token: string) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    loadTurnstile()
      .then(() => {
        if (!window.turnstile) {
          reject(new Error('Turnstile not loaded'))
          return
        }

        const widgetId = window.turnstile.render(`#${containerId}`, {
          sitekey: import.meta.env.VITE_CLOUDFLARE_TURNSTILE_SITE_KEY,
          callback: (token: string) => {
            callback(token)
            resolve(token)
          },
          'error-callback': () => {
            reject(new Error('Turnstile verification failed'))
          },
        })

        resolve(widgetId)
      })
      .catch(reject)
  })
}

// Type declarations
declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string,
        options: {
          sitekey: string
          callback: (token: string) => void
          'error-callback': () => void
        }
      ) => string
      remove: (widgetId: string) => void
      reset: (widgetId: string) => void
    }
  }
}
```

**Turnstile Component**:

```tsx
// src/components/auth/TurnstileCaptcha.tsx
import { useEffect, useRef } from 'react'
import { renderTurnstile } from '@/lib/captcha'

interface Props {
  onVerify: (token: string) => void
  onError?: () => void
}

const TurnstileCaptcha = ({ onVerify, onError }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const containerId = `turnstile-${Math.random().toString(36).substring(7)}`
    containerRef.current.id = containerId

    renderTurnstile(containerId, onVerify).catch((error) => {
      console.error('Turnstile error:', error)
      onError?.()
    })

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
      }
    }
  }, [onVerify, onError])

  return <div ref={containerRef} className="my-4" />
}

export default TurnstileCaptcha
```

---

## 📄 Files to Create/Update

### New Files to Create:

1. **Authentication Pages**
   - `src/pages/auth/ForgotPasswordPage.tsx`
   - `src/pages/auth/ResetPasswordPage.tsx`
   - `src/pages/auth/VerifyEmailPage.tsx`
   - `src/pages/auth/Enable2FAPage.tsx`

2. **Security Components**
   - `src/components/auth/PasswordStrengthIndicator.tsx` ✅ (above)
   - `src/components/auth/TurnstileCaptcha.tsx` ✅ (above)
   - `src/components/auth/SessionManager.tsx`
   - `src/components/auth/SecurityDashboard.tsx`

3. **Utility Libraries**
   - `src/lib/auth.ts` ✅ (above)
   - `src/lib/passwordSecurity.ts` ✅ (above)
   - `src/lib/captcha.ts` ✅ (above)
   - `src/lib/rateLimiter.ts`
   - `src/lib/twoFactor.ts`

4. **Hooks**
   - `src/hooks/useAuth.ts`
   - `src/hooks/useSession.ts`
   - `src/hooks/use2FA.ts`

5. **KYC System**
   - `src/pages/seller/KYCVerificationPage.tsx`
   - `src/components/kyc/DocumentUpload.tsx`
   - `src/pages/admin/KYCReviewPage.tsx`

### Files to Update:

1. **Existing Auth Pages**
   - `src/pages/auth/LoginPage.tsx` - Integrate Supabase Auth
   - `src/pages/auth/RegisterPage.tsx` - Integrate Supabase Auth

2. **State Management**
   - `src/stores/useAuthStore.ts` - Sync with Supabase session

3. **API Layer**
   - `src/lib/api.ts` - Update auth interceptors

4. **Routing**
   - `src/App.tsx` - Add new auth routes

5. **Environment**
   - `.env` - Add new API keys

---

## 🔑 Environment Variables Needed

Add to `.env`:

```env
# Cloudflare Turnstile
VITE_CLOUDFLARE_TURNSTILE_SITE_KEY=your_site_key_here

# Textbee (SMS)
VITE_TEXTBEE_API_KEY=your_api_key_here
VITE_TEXTBEE_SENDER_ID=SOFTMKT

# HaveIBeenPwned (optional - public API)
# No key needed for basic usage

# Session Management
VITE_SESSION_TIMEOUT=900000
VITE_MAX_SESSIONS_PER_USER=5
```

---

## 📊 Success Metrics

### Security Metrics:
- ✅ 0 accounts created without email verification
- ✅ 100% of passwords checked against breaches
- ✅ < 0.1% bot registration rate (CAPTCHA)
- ✅ 0 successful brute force attacks
- ✅ < 1 second authentication response time
- ✅ 99.9% uptime for auth service

### User Experience Metrics:
- ✅ < 30 seconds for registration flow
- ✅ < 5 seconds for login
- ✅ < 3 minutes for password reset
- ✅ > 90% 2FA adoption for sellers
- ✅ < 5% support tickets for auth issues

---

## 🚀 Next Steps

Would you like me to:

1. **Implement Phase 1** - Create Supabase auth integration + email verification + forgot password?
2. **Implement Phase 2** - Add HaveIBeenPwned + CAPTCHA + rate limiting?
3. **Implement Phase 3** - Build 2FA + session management + KYC system?
4. **Create database schema** - Set up all required tables and RLS policies?
5. **Build complete pages** - Create all authentication pages with full functionality?

Let me know which phase you'd like to start with, and I'll begin implementation!

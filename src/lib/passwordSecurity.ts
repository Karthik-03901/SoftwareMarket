import { z } from 'zod'
import CryptoJS from 'crypto-js'

/**
 * Strong password validation schema
 * Requires: 12+ chars, uppercase, lowercase, number, special char
 */
export const strongPasswordSchema = z
  .string()
  .min(12, 'Password must be at least 12 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
  .refine(
    (password) => !isCommonPassword(password),
    'This password is too common. Please choose a stronger password'
  )

export interface PasswordStrength {
  score: number // 0-100
  level: 'weak' | 'fair' | 'good' | 'strong' | 'very-strong'
  feedback: string[]
}

/**
 * Calculate password strength score
 */
export const calculatePasswordStrength = (password: string): PasswordStrength => {
  let score = 0
  const feedback: string[] = []

  if (!password) {
    return { score: 0, level: 'weak', feedback: ['Password is required'] }
  }

  // Length check (25 points max)
  if (password.length >= 16) {
    score += 25
  } else if (password.length >= 12) {
    score += 20
  } else if (password.length >= 8) {
    score += 10
  } else {
    feedback.push('Use at least 12 characters')
  }

  // Lowercase check (15 points)
  if (/[a-z]/.test(password)) {
    score += 15
  } else {
    feedback.push('Add lowercase letters')
  }

  // Uppercase check (15 points)
  if (/[A-Z]/.test(password)) {
    score += 15
  } else {
    feedback.push('Add uppercase letters')
  }

  // Number check (15 points)
  if (/[0-9]/.test(password)) {
    score += 15
  } else {
    feedback.push('Add numbers')
  }

  // Special character check (20 points)
  if (/[^A-Za-z0-9]/.test(password)) {
    score += 20
  } else {
    feedback.push('Add special characters (!@#$%^&*)')
  }

  // Complexity bonus (10 points)
  const uniqueChars = new Set(password).size
  if (uniqueChars > password.length * 0.7) {
    score += 10
  } else {
    feedback.push('Use more variety in characters')
  }

  // Penalize common passwords
  if (isCommonPassword(password)) {
    score = Math.max(0, score - 30)
    feedback.push('This password is too common')
  }

  // Penalize sequential characters
  if (hasSequentialChars(password)) {
    score = Math.max(0, score - 10)
    feedback.push('Avoid sequential characters (abc, 123)')
  }

  // Determine level
  let level: PasswordStrength['level']
  if (score >= 90) level = 'very-strong'
  else if (score >= 75) level = 'strong'
  else if (score >= 50) level = 'good'
  else if (score >= 25) level = 'fair'
  else level = 'weak'

  return { score: Math.min(100, score), level, feedback }
}

/**
 * Check if password has been breached using HaveIBeenPwned API
 * Uses k-anonymity model (only first 5 chars of hash sent to API)
 */
export const checkPasswordBreach = async (
  password: string
): Promise<{
  breached: boolean
  occurrences: number
  error?: string
}> => {
  try {
    // Hash password with SHA-1
    const sha1Hash = CryptoJS.SHA1(password).toString().toUpperCase()
    const prefix = sha1Hash.substring(0, 5)
    const suffix = sha1Hash.substring(5)

    // Call HaveIBeenPwned API with only first 5 chars
    const response = await fetch(
      `https://api.pwnedpasswords.com/range/${prefix}`,
      {
        method: 'GET',
        headers: {
          'User-Agent': 'SoftMarket-Password-Check',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`)
    }

    const text = await response.text()

    // Check if our suffix appears in the response
    const lines = text.split('\n')
    for (const line of lines) {
      const [hashSuffix, count] = line.split(':')
      if (hashSuffix.trim() === suffix) {
        return {
          breached: true,
          occurrences: parseInt(count.trim(), 10),
        }
      }
    }

    return { breached: false, occurrences: 0 }
  } catch (error: any) {
    console.error('Error checking password breach:', error)
    // Fail open - don't block registration if API is down
    return {
      breached: false,
      occurrences: 0,
      error: error.message || 'Unable to check password breach database',
    }
  }
}

/**
 * Check if password contains sequential characters
 */
const hasSequentialChars = (password: string): boolean => {
  const sequences = [
    'abc', 'bcd', 'cde', 'def', 'efg', 'fgh', 'ghi', 'hij', 'ijk', 'jkl',
    'klm', 'lmn', 'mno', 'nop', 'opq', 'pqr', 'qrs', 'rst', 'stu', 'tuv',
    'uvw', 'vwx', 'wxy', 'xyz',
    '012', '123', '234', '345', '456', '567', '678', '789',
    'qwe', 'wer', 'ert', 'rty', 'tyu', 'yui', 'uio', 'iop',
    'asd', 'sdf', 'dfg', 'fgh', 'ghj', 'hjk', 'jkl',
    'zxc', 'xcv', 'cvb', 'vbn', 'bnm',
  ]

  const lowerPassword = password.toLowerCase()
  return sequences.some((seq) => lowerPassword.includes(seq))
}

/**
 * Check if password is in common password list
 */
const COMMON_PASSWORDS = [
  'password', 'password123', '123456', '12345678', 'qwerty', 'abc123',
  'monkey', '1234567', 'letmein', 'trustno1', 'dragon', 'baseball',
  'iloveyou', 'master', 'sunshine', 'ashley', 'bailey', 'passw0rd',
  'shadow', '123123', '654321', 'superman', 'qazwsx', 'michael',
  'football', 'welcome', 'jesus', 'ninja', 'mustang', 'password1',
  'admin', 'admin123', 'root', 'toor', 'pass', 'test', 'guest',
  'changeme', 'welcome123', 'login', 'admin@123', 'user', 'user123',
  // Add more common passwords
]

export const isCommonPassword = (password: string): boolean => {
  return COMMON_PASSWORDS.includes(password.toLowerCase())
}

/**
 * Generate a strong random password
 */
export const generateStrongPassword = (length: number = 16): string => {
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const lowercase = 'abcdefghjkmnpqrstuvwxyz'
  const numbers = '23456789'
  const special = '!@#$%^&*-_=+'

  const all = uppercase + lowercase + numbers + special
  let password = ''

  // Ensure at least one of each type
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += special[Math.floor(Math.random() * special.length)]

  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)]
  }

  // Shuffle the password
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('')
}

/**
 * Validate password confirmation match
 */
export const passwordMatchSchema = z
  .object({
    password: strongPasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

/**
 * Get color class for password strength level
 */
export const getPasswordStrengthColor = (level: PasswordStrength['level']): string => {
  switch (level) {
    case 'very-strong':
      return 'bg-green-500'
    case 'strong':
      return 'bg-green-400'
    case 'good':
      return 'bg-yellow-500'
    case 'fair':
      return 'bg-orange-500'
    case 'weak':
      return 'bg-red-500'
  }
}

/**
 * Get text for password strength level
 */
export const getPasswordStrengthText = (level: PasswordStrength['level']): string => {
  switch (level) {
    case 'very-strong':
      return 'Very Strong'
    case 'strong':
      return 'Strong'
    case 'good':
      return 'Good'
    case 'fair':
      return 'Fair'
    case 'weak':
      return 'Weak'
  }
}

import { useEffect, useState } from 'react'
import {
  calculatePasswordStrength,
  getPasswordStrengthColor,
  getPasswordStrengthText,
  type PasswordStrength,
} from '@/lib/passwordSecurity'
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react'

interface Props {
  password: string
  showFeedback?: boolean
}

const PasswordStrengthIndicator = ({ password, showFeedback = true }: Props) => {
  const [strength, setStrength] = useState<PasswordStrength>({
    score: 0,
    level: 'weak',
    feedback: [],
  })

  useEffect(() => {
    if (password) {
      const result = calculatePasswordStrength(password)
      setStrength(result)
    } else {
      setStrength({ score: 0, level: 'weak', feedback: [] })
    }
  }, [password])

  if (!password) return null

  const colorClass = getPasswordStrengthColor(strength.level)
  const levelText = getPasswordStrengthText(strength.level)

  return (
    <div className="mt-3 space-y-2">
      {/* Progress Bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${colorClass}`}
            style={{ width: `${strength.score}%` }}
          />
        </div>
        <span className="text-sm font-medium text-foreground min-w-24 text-right">
          {levelText}
        </span>
      </div>

      {/* Strength Bars (Alternative visual) */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => {
          let isActive = false
          if (strength.level === 'weak' && level === 1) isActive = true
          if (strength.level === 'fair' && level <= 2) isActive = true
          if (strength.level === 'good' && level <= 3) isActive = true
          if (strength.level === 'strong' && level <= 4) isActive = true
          if (strength.level === 'very-strong' && level <= 5) isActive = true

          return (
            <div
              key={level}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                isActive ? colorClass : 'bg-muted'
              }`}
            />
          )
        })}
      </div>

      {/* Feedback Messages */}
      {showFeedback && strength.feedback.length > 0 && (
        <div className="space-y-1 mt-3">
          {strength.feedback.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-2 text-xs text-muted-foreground"
            >
              {strength.level === 'very-strong' || strength.level === 'strong' ? (
                <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 shrink-0" />
              ) : strength.level === 'weak' ? (
                <XCircle className="h-3 w-3 text-red-500 mt-0.5 shrink-0" />
              ) : (
                <AlertCircle className="h-3 w-3 text-orange-500 mt-0.5 shrink-0" />
              )}
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}

      {/* Requirements Checklist */}
      <div className="mt-3 p-3 rounded-lg bg-muted/30 border border-border">
        <p className="text-xs font-medium text-foreground mb-2">Password Requirements:</p>
        <div className="space-y-1">
          <RequirementItem
            met={password.length >= 12}
            text="At least 12 characters"
          />
          <RequirementItem
            met={/[A-Z]/.test(password)}
            text="One uppercase letter"
          />
          <RequirementItem
            met={/[a-z]/.test(password)}
            text="One lowercase letter"
          />
          <RequirementItem met={/[0-9]/.test(password)} text="One number" />
          <RequirementItem
            met={/[^A-Za-z0-9]/.test(password)}
            text="One special character"
          />
        </div>
      </div>
    </div>
  )
}

interface RequirementItemProps {
  met: boolean
  text: string
}

const RequirementItem = ({ met, text }: RequirementItemProps) => (
  <div className="flex items-center gap-2 text-xs">
    {met ? (
      <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />
    ) : (
      <XCircle className="h-3 w-3 text-muted-foreground shrink-0" />
    )}
    <span className={met ? 'text-green-600' : 'text-muted-foreground'}>{text}</span>
  </div>
)

export default PasswordStrengthIndicator

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

    const variants = {
      primary:
        'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:scale-[1.02] active:scale-[0.98]',
      secondary:
        'bg-gradient-to-r from-secondary-400 to-secondary-500 text-white shadow-lg shadow-secondary-400/30 hover:shadow-xl hover:shadow-secondary-400/40 hover:scale-[1.02] active:scale-[0.98]',
      outline:
        'glass border-2 border-primary-200 text-primary-700 hover:bg-primary-50 hover:border-primary-300 hover:shadow-card',
      ghost:
        'text-primary-700 hover:bg-primary-50 hover:text-primary-800',
      destructive:
        'bg-gradient-to-r from-destructive to-red-700 text-destructive-foreground shadow-lg shadow-destructive/30 hover:shadow-xl hover:shadow-destructive/40 hover:scale-[1.02] active:scale-[0.98]',
      success:
        'bg-gradient-to-r from-success-600 to-success-700 text-white shadow-lg shadow-success-500/30 hover:shadow-xl hover:shadow-success-500/40 hover:scale-[1.02] active:scale-[0.98]',
    }

    const sizes = {
      sm: 'h-9 px-4 text-sm rounded-lg gap-1.5',
      md: 'h-11 px-6 text-base rounded-lg gap-2',
      lg: 'h-12 px-8 text-lg rounded-xl gap-2.5',
      xl: 'h-14 px-10 text-xl rounded-xl gap-3',
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="animate-spin" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
        {!isLoading && leftIcon && leftIcon}
        {children}
        {!isLoading && rightIcon && rightIcon}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button

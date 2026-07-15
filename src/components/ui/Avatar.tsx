import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { getInitials } from '@/lib/utils'

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  verified?: boolean
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, name, size = 'md', verified = false, ...props }, ref) => {
    const sizes = {
      sm: 'h-8 w-8 text-xs',
      md: 'h-10 w-10 text-sm',
      lg: 'h-12 w-12 text-base',
      xl: 'h-16 w-16 text-lg',
      '2xl': 'h-24 w-24 text-2xl',
    }

    const initials = name ? getInitials(name) : '??'

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center rounded-full overflow-hidden',
          'bg-gradient-to-br from-primary-400 to-primary-600 text-white font-semibold',
          'shadow-lg ring-2 ring-white',
          sizes[size],
          className
        )}
        {...props}
      >
        {src ? (
          <img src={src} alt={alt || name || 'Avatar'} className="h-full w-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
        {verified && (
          <div className="absolute -bottom-0.5 -right-0.5 bg-success-500 rounded-full p-0.5 ring-2 ring-white">
            <svg
              className="h-3 w-3 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'

export default Avatar

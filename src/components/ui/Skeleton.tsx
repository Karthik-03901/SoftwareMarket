import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
}

const Skeleton = ({ className, variant = 'rectangular', width, height, ...props }: SkeletonProps) => {
  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }

  return (
    <div
      className={cn('skeleton bg-muted', variants[variant], className)}
      style={{ width, height }}
      {...props}
    />
  )
}

export default Skeleton

// Preset Skeleton Components
export const SkeletonCard = () => (
  <div className="glass rounded-xl p-6 space-y-4">
    <Skeleton variant="rectangular" height={200} />
    <Skeleton variant="text" width="60%" />
    <Skeleton variant="text" width="80%" />
    <div className="flex gap-2">
      <Skeleton variant="circular" width={40} height={40} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" width="60%" />
      </div>
    </div>
  </div>
)

export const SkeletonList = ({ count = 3 }: { count?: number }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="glass rounded-xl p-4 flex gap-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="50%" />
        </div>
      </div>
    ))}
  </div>
)

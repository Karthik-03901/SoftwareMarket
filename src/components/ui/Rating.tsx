import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface RatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  readonly?: boolean
  onRatingChange?: (rating: number) => void
}

const Rating = ({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = false,
  readonly = true,
  onRatingChange,
}: RatingProps) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  const handleClick = (value: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value)
    }
  }

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }).map((_, index) => {
        const starValue = index + 1
        const isFilled = starValue <= Math.round(rating)
        const isPartial = starValue === Math.ceil(rating) && rating % 1 !== 0

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(starValue)}
            disabled={readonly}
            className={cn(
              'transition-transform',
              !readonly && 'hover:scale-110 cursor-pointer',
              readonly && 'cursor-default'
            )}
          >
            <Star
              className={cn(
                sizes[size],
                isFilled || isPartial
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-none text-muted-foreground'
              )}
            />
          </button>
        )
      })}
      {showValue && (
        <span className="ml-1 text-sm font-semibold text-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}

export default Rating

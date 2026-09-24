'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  max?: number;
  size?: number;
  showValue?: boolean;
  numReviews?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  max = 5,
  size = 15,
  showValue = false,
  numReviews,
  interactive = false,
  onRatingChange,
}) => {
  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: max }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= Math.round(rating);

          return (
            <button
              type="button"
              key={index}
              disabled={!interactive}
              onClick={() => interactive && onRatingChange && onRatingChange(starValue)}
              className={`${
                interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'
              } p-0.5 text-gold`}
              aria-label={`${starValue} star`}
            >
              <Star
                size={size}
                className={isFilled ? 'fill-gold text-gold' : 'text-stone-300 stroke-[1.5]'}
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs font-semibold text-text tracking-wide ml-1">
          {rating.toFixed(1)}
        </span>
      )}
      {numReviews !== undefined && (
        <span className="text-xs text-secondary ml-1">
          ({numReviews})
        </span>
      )}
    </div>
  );
};

export default RatingStars;

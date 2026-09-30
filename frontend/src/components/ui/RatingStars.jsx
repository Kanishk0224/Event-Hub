import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({ rating = 5, maxRating = 5, size = 'sm', onChange, readOnly = true }) => {
  const sizes = {
    xs: 'h-3.5 w-3.5',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const iconSize = sizes[size] || sizes.sm;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;
        return (
          <button
            type="button"
            key={index}
            disabled={readOnly}
            onClick={() => !readOnly && onChange && onChange(starValue)}
            className={`${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
          >
            <Star
              className={`${iconSize} ${
                isFilled
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-slate-200 text-slate-200 dark:fill-slate-800 dark:text-slate-800'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default RatingStars;

import React, { useState } from 'react';
import { Star } from 'lucide-react';

function Stars({
  rating = 0,
  userRating = 0,
  maxStars = 5,
  onRate = () => {},
  interactive = false,
}) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (index) => {
    if (interactive) {
      setHoverRating(index);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const handleClick = (index) => {
    if (interactive) {
      onRate(index);
    }
  };

  return (
    <div className={`flex items-center ${interactive ? 'cursor-pointer' : ''}`}>
      {[...Array(maxStars)].map((_, i) => {
        const starValue = i + 1;
        
        // Determine which rating to display based on priority: hover > user > average
        const displayRating = hoverRating || userRating || rating;
        
        const isFilled = starValue <= Math.round(displayRating);

        return (
          <Star
            key={starValue}
            className={`w-6 h-6 transition-colors duration-150 ${
              isFilled
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            } ${interactive && 'hover:text-yellow-300'}`}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(starValue)}
          />
        );
      })}
    </div>
  );
}

export default Stars;
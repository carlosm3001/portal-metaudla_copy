import React from 'react';
import { Star } from 'lucide-react';

function Stars({ rating, maxStars = 5 }) {
  const filledStars = Math.round(rating);
  const emptyStars = maxStars - filledStars;

  return (
    <div className="flex items-center">
      {[...Array(filledStars)].map((_, i) => (
        <Star key={`filled-${i}`} className="text-yellow-500 fill-current w-5 h-5" />
      ))}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="text-gray-300 w-5 h-5" />
      ))}
    </div>
  );
}

export default Stars;
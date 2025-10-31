import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function Rating({ projectId, onRatingSuccess }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSetRating = (newRating) => {
    if (isSubmitting) return;
    setRating(newRating);
  };

  const handleSubmitRating = async () => {
    if (rating === 0) {
      setError('Por favor, selecciona una calificación antes de enviar.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Debes iniciar sesión para calificar.');
      }

      const response = await fetch(`https://meta-verso-carlos.b0falx.easypanel.host/api/projects/${projectId}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ calificacion: rating }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'No se pudo enviar la calificación.');
      }

      const result = await response.json();
      onRatingSuccess(result);
      alert('¡Gracias por tu calificación!');

    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 border rounded-xl">
      <h4 className="font-bold text-lg mb-2">Tu Calificación</h4>
      <div className="flex items-center gap-2">
        {[...Array(5)].map((_, i) => {
          const starValue = i + 1;
          return (
            <Star
              key={starValue}
              className={`w-8 h-8 cursor-pointer transition-colors ${starValue <= (hoverRating || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
              onMouseEnter={() => setHoverRating(starValue)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => handleSetRating(starValue)}
            />
          );
        })}
      </div>
      <button onClick={handleSubmitRating} className="btn btn-primary w-full mt-4" disabled={isSubmitting || rating === 0}>
        {isSubmitting ? 'Enviando...' : 'Calificar'}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}

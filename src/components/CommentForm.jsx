import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

export default function CommentForm({ projectId, onCommentSubmitted }) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const newComment = await api.addComment({ projectId, content, user });
      onCommentSubmitted(newComment); // Callback to update parent state
      setContent(''); // Clear textarea

    } catch (err) {
      setError(err.message || "No se pudo enviar el comentario.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 pt-6 border-t border-border">
      <h4 className="h-title text-xl mb-3">Deja un comentario</h4>
      <textarea
        className="input w-full min-h-[100px]"
        rows="4"
        placeholder="Escribe tu opinión, sugerencia o pregunta..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isSubmitting}
        required
      />
      <div className="flex items-center justify-between mt-3">
        {error && <p className="error-text text-sm">{error}</p>}
        <button type="submit" className="btn btn-primary btn-sm ml-auto" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Enviar Comentario'}
        </button>
      </div>
    </form>
  );
}
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('https://meta-verso-carlos.b0falx.easypanel.host/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al solicitar el restablecimiento de contraseña');
      }

      setMessage('Si el correo electrónico está registrado, recibirás un enlace para restablecer tu contraseña. Revisa la consola del servidor para el token.');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-grow flex items-center justify-center p-6 min-h-screen bg-bg">
      <div className="card p-8 sm:p-10 w-full max-w-md">
        <h1 className="text-2xl font-extrabold text-ink mb-4">¿Olvidaste tu Contraseña?</h1>
        <p className="text-muted mb-6">Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="label">Correo Electrónico</label>
            <input id="email" type="email" className="input" placeholder="tu@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </div>
          
          {error && <p className="error-text text-center">{error}</p>}
          {message && <p className="success-text text-center">{message}</p>}

          <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar Enlace de Restablecimiento'}
          </button>
          <p className="helper text-center">¿Recordaste tu contraseña? <Link to="/login" className="underline font-semibold">Inicia sesión</Link></p>
        </form>
      </div>
    </main>
  );
}

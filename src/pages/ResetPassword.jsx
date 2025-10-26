import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Token de restablecimiento no encontrado.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsSubmitting(true);

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al restablecer la contraseña');
      }

      setMessage('Contraseña restablecida exitosamente. Ya puedes iniciar sesión.');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-grow flex items-center justify-center p-6 min-h-screen bg-bg">
      <div className="card p-8 sm:p-10 w-full max-w-md">
        <h1 className="text-2xl font-extrabold text-ink mb-4">Restablecer Contraseña</h1>
        {token ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="label">Nueva Contraseña</label>
              <input id="password" type="password" className="input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="label">Confirmar Contraseña</label>
              <input id="confirmPassword" type="password" className="input" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            
            {error && <p className="error-text text-center">{error}</p>}
            {message && <p className="success-text text-center">{message}</p>}

            <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Restableciendo...' : 'Restablecer Contraseña'}
            </button>
          </form>
        ) : (
          <p className="error-text text-center">{error}</p>
        )}
        <p className="helper text-center mt-4">¿Ya tienes tu contraseña? <Link to="/login" className="underline font-semibold">Inicia sesión</Link></p>
      </div>
    </main>
  );
}

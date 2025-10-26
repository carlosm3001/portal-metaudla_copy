import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login({ email, password });
      // Navigation is handled inside the login function in AuthContext
    } catch (err) {
      setError(err.message || 'Error de inicio de sesión');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-grow flex items-center justify-center p-6 min-h-screen bg-bg">
      <div className="card p-8 sm:p-10 w-full max-w-md">
        <h1 className="text-2xl font-extrabold text-ink mb-4">Bienvenido de Nuevo</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="label">Correo Electrónico</label>
            <input id="email" type="email" className="input" placeholder="tu@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </div>
          <div>
            <label htmlFor="password" className="label">Contraseña</label>
            <input id="password" type="password" className="input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
          </div>
          <div className="text-right text-sm">
            <Link to="/forgot-password" className="link link-hover">¿Olvidaste tu contraseña?</Link>
          </div>
          
          {error && <p className="error-text text-center">{error}</p>}

          <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
          <p className="helper text-center">¿No tienes cuenta? <Link to="/register" className="underline font-semibold">Crea una aquí</Link></p>
        </form>
      </div>
    </main>
  );
}
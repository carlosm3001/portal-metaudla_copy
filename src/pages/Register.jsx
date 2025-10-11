import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setIsSubmitting(true);

    try {
      await register({ name, email, password });
      // Navigation is handled inside the register function in AuthContext
    } catch (err) {
      setError(err.message || 'Error al registrar el usuario.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-grow flex items-center justify-center p-6 min-h-screen bg-bg">
      <div className="card p-8 sm:p-10 w-full max-w-md">
        <h1 className="text-2xl font-extrabold text-ink mb-4">Crear una Cuenta</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="label">Nombre Completo</label>
            <input id="name" type="text" className="input" placeholder="Tu Nombre" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
          </div>
          <div>
            <label htmlFor="email" className="label">Correo Electrónico</label>
            <input id="email" type="email" className="input" placeholder="tu@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </div>
          <div>
            <label htmlFor="password" className="label">Contraseña</label>
            <input id="password" type="password" className="input" placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="label">Confirmar Contraseña</label>
            <input id="confirmPassword" type="password" className="input" placeholder="Repite tu contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required autoComplete="new-password" />
          </div>
          
          {error && <p className="error-text text-center">{error}</p>}

          <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>
        <p className="helper text-center mt-4">¿Ya tienes cuenta? <Link to="/login" className="underline font-semibold">Inicia sesión aquí</Link></p>
      </div>
    </main>
  );
}
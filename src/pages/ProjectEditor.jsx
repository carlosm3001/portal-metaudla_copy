import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProjectForm from '../components/ProjectForm';
import { useAuth } from '../context/AuthContext';

export default function ProjectEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, userRole } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoggedIn || userRole !== 'admin') {
      navigate('/login');
      return;
    }

    if (id) {
      const fetchProject = async () => {
        try {
          const response = await fetch(`http://localhost:3001/api/projects/${id}`, {
            headers: { 'x-auth-token': localStorage.getItem('token') },
          });
          if (!response.ok) throw new Error('Proyecto no encontrado.');
          const data = await response.json();
          setProject(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchProject();
    } else {
      setLoading(false); // No hay ID, es un nuevo proyecto
    }
  }, [id, isLoggedIn, userRole, navigate]);

  const handleSaveProject = async (formData) => {
    try {
      const method = id ? 'PUT' : 'POST';
      const url = id
        ? `http://localhost:3001/api/projects/${id}`
        : 'http://localhost:3001/api/projects';
      const response = await fetch(url, { method, headers: { 'x-auth-token': localStorage.getItem('token') }, body: formData });
      if (!response.ok) throw new Error('Error al guardar el proyecto.');
      navigate('/admin'); // Volver al panel de admin
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    navigate('/admin'); // Volver al panel de admin
  };

  if (loading) return <main className="container mx-auto max-w-6xl px-4 py-6 text-center">Cargando formulario...</main>;
  if (error) return <main className="container mx-auto max-w-6xl px-4 py-6 text-center error-text">{error}</main>;

  return (
    <main className="container mx-auto max-w-6xl px-4 py-6">
      <h1 className="h-title text-3xl mb-6">{id ? 'Editar Proyecto' : 'Añadir Nuevo Proyecto'}</h1>
      <div className="card p-6">
        <ProjectForm project={id ? project : null} onSubmit={handleSaveProject} onCancel={handleCancel} />
      </div>
    </main>
  );
}
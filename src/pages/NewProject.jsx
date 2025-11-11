import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectForm from '../components/ProjectForm';
import { useAuth } from '../context/AuthContext';
import { createProject } from '../services/api';

export default function NewProject() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setError(null);
    try {
      await createProject(formData, token);
      alert('Proyecto creado exitosamente!');
      navigate('/projects');
    } catch (err) {
      setError(err.message);
      console.error("Error creating project:", err);
    }
  };

  return (
    <main className="container mx-auto max-w-[960px] px-4 md:px-6 py-10">
      <h1 className="text-3xl font-extrabold text-text mb-6">Crear Nuevo Proyecto</h1>
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      <ProjectForm onSubmit={handleSubmit} />
    </main>
  );
}
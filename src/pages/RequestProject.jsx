import React from 'react';
import RequestProjectForm from '../components/RequestProjectForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RequestProject() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleSubmit = async (formData) => {
    try {
      const response = await fetch("https://meta-verso-carlos.b0falx.easypanel.host/api/solicitudes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al enviar la solicitud");
      }

      alert("¡Solicitud enviada con éxito! Un administrador la revisará pronto.");
      navigate('/projects');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-extrabold text-ink-primary mb-4">Solicitar la subida de un proyecto</h1>
      <p className="text-ink-secondary mb-8">
        Completa el siguiente formulario para solicitar que tu proyecto sea añadido al portal. Un administrador revisará tu solicitud.
      </p>
      <RequestProjectForm onSubmit={handleSubmit} onCancel={() => navigate('/projects')} />
    </div>
  );
}

export default RequestProject;

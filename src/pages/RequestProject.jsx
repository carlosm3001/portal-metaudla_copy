import React from 'react';
import RequestProjectForm from '../components/RequestProjectForm';

function RequestProject() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-extrabold text-ink-primary mb-4">Solicitar la subida de un proyecto</h1>
      <p className="text-ink-secondary mb-8">
        Completa el siguiente formulario para solicitar que tu proyecto sea añadido al portal. Un administrador revisará tu solicitud.
      </p>
      <RequestProjectForm />
    </div>
  );
}

export default RequestProject;

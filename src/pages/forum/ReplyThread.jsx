import React from 'react';
import { useParams } from 'react-router-dom';

export default function ReplyThread() {
  const { id } = useParams();
  return (
    <main className="container mx-auto max-w-[960px] px-4 md:px-6 py-10">
      <h1 className="text-3xl font-extrabold text-ink">Respondiendo al Hilo #{id}</h1>
      <p className="text-muted">Placeholder para el formulario de respuesta.</p>
    </main>
  );
}
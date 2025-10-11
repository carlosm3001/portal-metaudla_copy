import React from 'react';
import TeamSection from '../components/About/TeamSection';

export default function Nosotros() {
  return (
    <main className="container mx-auto max-w-[960px] px-4 md:px-6 py-10">
      {/* HERO – banda suave superior */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-[#EEF2FF] to-white p-8 mb-8">
        <div className="max-w-[920px]">
          <h1 className="text-4xl font-extrabold text-ink mb-2">Sobre Meta-Uniamazonia</h1>
          <p className="text-muted text-lg leading-relaxed">
            La vitrina digital para visibilizar, conectar y potenciar los proyectos de la Universidad de la Amazonia.
          </p>
        </div>
        {/* acentos decorativos */}
        <div className="pointer-events-none absolute -top-10 -right-10 w-72 h-72 rounded-full bg-[rgba(108,138,228,.17)] blur-3xl" />
      </section>

      <div className="prose lg:prose-lg mx-auto text-muted">
        <h2 className="text-2xl mt-8 text-ink">Nuestra Misión</h2>
        <ul>
          <li><strong>Visibilizar:</strong> Ofrecer un espacio centralizado y accesible donde cada proyecto, sin importar su escala, pueda brillar y ser descubierto.</li>
          <li><strong>Conectar:</strong> Facilitar la colaboración interdisciplinaria, permitiendo que estudiantes de diferentes facultades se unan para crear soluciones más robustas e innovadoras.</li>
          <li><strong>Generar Impacto:</strong> Destacar cómo los proyectos de la Universidad de la Amazonia contribuyen a la sociedad, la tecnología y el conocimiento.</li>
        </ul>

        <p>Desde aplicaciones móviles y software educativo hasta investigaciones científicas, Meta-Uniamazonia es un crisol de disciplinas unidas por un objetivo común: innovar y construir el futuro.</p>
      </div>

      <TeamSection />
    </main>
  );
}
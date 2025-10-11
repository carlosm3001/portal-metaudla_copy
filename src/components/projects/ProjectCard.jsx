import React from 'react';

export default function ProjectCard({ project }) {
  const { id, name, description, imageUrl, technologies, votes = 0 } = project;
  const techs = technologies ? technologies.split(',').map(t => t.trim()) : [];

  return (
    <article className="project-card card h-full overflow-hidden flex flex-col">
      {/* Imagen 4:3 con fallback */}
      <div className="relative bg-brand-50">
        {imageUrl ? (
          <img
            src={imageUrl.startsWith('http') ? imageUrl : `http://localhost:3001/${imageUrl}`}
            alt={name}
            className="w-full object-cover"
            style={{ aspectRatio: "4 / 3" }}
            loading="lazy"
          />
        ) : (
          <div
            className="w-full grid place-items-center text-muted"
            style={{ aspectRatio: "4 / 3" }}
          >
            <div className="w-4/5 h-3/4 rounded-2xl bg-[rgba(108,138,228,.25)] grid place-items-center">
              <span>Sin Imagen</span>
            </div>
          </div>
        )}
        {/* Vineta de votos en la esquina */}
        <div className="absolute right-3 top-3 text-xs px-2 py-1 rounded-full bg-white/90 border border-border shadow-sm">
          {votes} votos
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-lg font-bold text-ink leading-5 line-clamp-2">{name}</h3>
        {description && (
          <p className="text-sm text-muted line-clamp-3">{description}</p>
        )}
        {techs.length > 0 && (
          <div className="flex flex-wrap gap-2 max-h-[56px] overflow-hidden relative">
            {techs.map(t => <span key={t} className="pill pill-sm">{t}</span>)}
            <div className="fade-bottom" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Footer fijo */}
      <div className="mt-auto border-t border-border bg-white/70 backdrop-blur-sm p-3 flex items-center justify-between">
        <a className="btn btn-primary btn-xs" href={`/projects/${id}`}>Ver detalle</a>
        <button className="btn btn-ghost btn-xs">Guardar</button>
      </div>
    </article>
  );
}
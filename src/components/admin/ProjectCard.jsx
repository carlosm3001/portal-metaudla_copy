import React from 'react';

export default function ProjectCard({ project, onEdit, onDelete }) {
  const { id, name, description, technologies, votes = 0 } = project;
  const techs = technologies ? technologies.split(',').map(t => t.trim()) : [];

  return (
    <article className="card h-full flex flex-col overflow-hidden project-card">
      {/* Imagen opcional */}
      {/* <div className="relative">
        {cover ? (
          <img src={cover} alt="" className="w-full object-cover" style={{aspectRatio: "4 / 3"}} />
        ) : (
          <div className="w-full bg-[rgba(108,138,228,.16)] grid place-items-center" style={{aspectRatio: "4 / 3"}}>
            <span className="text-muted">Sin imagen</span>
          </div>
        )}
      </div> */}

      <div className="p-4 flex flex-col gap-2 min-h-[180px]">
        <h3 className="text-lg font-bold text-ink leading-5 line-clamp-2">{name}</h3>
        {description && <p className="text-sm text-muted line-clamp-3">{description}</p>}
        {techs.length > 0 && (
          <div className="tech-pills">
            <div className="flex flex-wrap gap-2 max-h-[56px] overflow-hidden">
              {techs.map(t => <span key={t} className="pill pill-sm">{t}</span>)}
            </div>
            <div className="pill-fade" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="mt-auto border-t border-border bg-white/70 backdrop-blur-sm p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted">{votes} votos</span>
          <div className="flex gap-2">
            <a href={`/projects/${id}`} className="btn btn-ghost btn-xs">Ver</a>
            <button onClick={() => onEdit(project)} className="btn btn-primary btn-xs">Editar</button>
            <button onClick={() => onDelete(id)} className="btn btn-danger btn-xs">Eliminar</button>
          </div>
        </div>
      </div>
    </article>
  );
}
import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function MiniProjectCard({ project }) {
  const { id, name, imageUrl, technologies } = project;
  const techs = technologies ? technologies.split(',').map(t => t.trim()).slice(0, 2) : [];

  return (
    <article className="mini-project-card bg-white rounded-2xl shadow-sm border border-border overflow-hidden transition-all duration-200 ease-in-out hover:shadow-md hover:-translate-y-1">
      <a href={`/projects/${id}`} className="block">
        <div className="w-full h-32 bg-brand-50">
          {imageUrl && (
            <img 
              src={imageUrl.startsWith('http') ? imageUrl : `http://localhost:3001/${imageUrl}`} 
              alt={name} 
              className="w-full h-full object-cover" 
            />
          )}
        </div>
        <div className="p-4">
          <h3 className="font-bold text-ink text-md leading-tight truncate">{name}</h3>
          <div className="flex items-center justify-between mt-2">
            <div className="flex gap-2">
              {techs.map(t => <span key={t} className="pill pill-sm">{t}</span>)}
            </div>
            <ArrowRight className="text-muted" size={18} />
          </div>
        </div>
      </a>
    </article>
  );
}
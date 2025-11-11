import React from 'react';
import MiniProjectCard from './MiniProjectCard';
import { ArrowRight } from 'lucide-react';

export default function ProjectReel({ projects }) {
  if (!projects || projects.length === 0) {
    return null; // Don't render anything if there are no projects
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-text">
            Proyectos Recientes
          </h2>
          <a href="/projects" className="btn btn-ghost hidden sm:inline-flex">
            Ver todos
            <ArrowRight size={18} className="ml-2" />
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {projects.map(project => (
            <MiniProjectCard key={project.id} project={project} />
          ))}
        </div>
        <div className="text-center mt-6 sm:hidden">
            <a href="/projects" className="btn btn-ghost">
                Ver todos
                <ArrowRight size={18} className="ml-2" />
            </a>
        </div>
      </div>
    </section>
  );
}

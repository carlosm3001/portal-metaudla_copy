import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Users, BarChart3, ArrowRight } from 'lucide-react';
import CommunityShowcase from '../components/home/CommunityShowcase';
import FeatureCard from '../components/home/FeatureCard';

const features = [
  { icon: <Rocket size={20}/>, title: "Publica en Minutos", text: "Sube tu proyecto, describe tus metas y compártelo con la comunidad." },
  { icon: <Users size={20}/>, title: "Encuentra Colaboradores", text: "Conecta con estudiantes y docentes de todas las facultades para formar equipos." },
  { icon: <BarChart3 size={20}/>, title: "Gana Visibilidad", text: "Presenta tus resultados a mentores, empresas y en eventos universitarios." },
];

export default function Home() {
  const [recentProjects, setRecentProjects] = useState([]);

  useEffect(() => {
    const fetchRecentProjects = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/projects');
        if (!response.ok) throw new Error('Error fetching projects');
        const data = await response.json();
        setRecentProjects(data.slice(0, 4));
      } catch (error) {
        console.error("Could not fetch recent projects:", error);
      }
    };
    fetchRecentProjects();
  }, []);

  return (
    <main className="space-y-10 md:space-y-20">
      {/* HERO */}
      <section className="text-center pt-10 md:pt-16">
        <div className="absolute top-0 left-0 w-full h-[550px] bg-gradient-to-b from-brand-50 to-bg -z-10" />
        <h1 className="text-5xl md:text-6xl font-extrabold text-ink tracking-tighter max-w-[760px] mx-auto">
          El Hub de Innovación de Uniamazonia
        </h1>
        <p className="max-w-2xl mx-auto mt-4 text-lg text-muted leading-relaxed">
          Un espacio para visibilizar, conectar y potenciar los proyectos que definen el futuro de nuestra región.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/projects" className="btn btn-primary">Explorar Proyectos</Link>
          <Link to="/request-project" className="btn btn-ghost">Publicar un Proyecto</Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container mx-auto max-w-5xl">
        <div className="grid md:grid-cols-3 gap-5">
          {features.map((feature) => <FeatureCard key={feature.title} {...feature} />)}
        </div>
      </section>

      {/* COMMUNITY SHOWCASE */}
      {recentProjects.length > 0 && (
        <section className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-extrabold text-ink text-center">Proyectos Recientes</h2>
          <p className="text-muted text-center mt-1">Descubre lo que otros están construyendo.</p>
          <div className="mt-8">
            <CommunityShowcase items={recentProjects} />
          </div>
        </section>
      )}

      {/* TESTIMONIAL */}
      <section className="container mx-auto max-w-3xl text-center">
        <blockquote className="text-xl md:text-2xl font-medium text-ink italic">
          “Esta plataforma fue clave para organizar nuestro proyecto. Encontramos un colaborador de otra facultad y el feedback fue inmediato”
          <span className="text-3xl align-[-.35em] ml-1">”</span>
        </blockquote>
        <div className="mt-3 text-sm text-muted">
          — Equipo de Ingeniería de Software, 2024
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-[#EEF2FF] to-white p-8">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-extrabold text-ink">¿Listo para compartir tu proyecto?</h3>
            <p className="text-muted">Publícalo hoy y conecta con colaboradores.</p>
          </div>
          <Link to="/request-project" className="btn btn-primary inline-flex items-center gap-2">
            Solicitar Proyecto <ArrowRight size={18}/>
          </Link>
        </div>
        <div className="pointer-events-none absolute -bottom-16 right-10 w-64 h-64 rounded-full bg-[rgba(108,138,228,.12)] blur-3xl" />
      </section>
    </main>
  );
}
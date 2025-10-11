import { useEffect, useMemo, useState } from "react";
import ProjectCard from "../components/projects/ProjectCard"; // New path
import ProjectSkeleton from "../components/projects/ProjectSkeleton"; // New component

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("Todas");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/api/projects');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError('No se pudieron cargar los proyectos.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const tags = useMemo(() => {
    if (projects.length === 0) return [];
    const allTechs = projects.flatMap(p => p.technologies ? p.technologies.split(',').map(t => t.trim()) : []);
    return [...new Set(allTechs)].sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const searchTerm = query.toLowerCase();
    return projects.filter(p => {
      const hasTag = activeTag === "Todas" || (p.technologies || '').toLowerCase().includes(activeTag.toLowerCase());
      const matchesSearch = searchTerm === '' || 
        p.name.toLowerCase().includes(searchTerm) || 
        p.description.toLowerCase().includes(searchTerm) ||
        (p.author || '').toLowerCase().includes(searchTerm) || // Assuming author field exists
        (p.technologies || '').toLowerCase().includes(searchTerm);
      return hasTag && matchesSearch;
    });
  }, [query, activeTag, projects]);

  if (error) {
    return (
      <main className="container mx-auto max-w-[1200px] px-4 md:px-6 py-10">
        <div className="card bg-danger/10 text-danger text-center p-6">{error}</div>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-[1200px] px-4 md:px-6 py-10">
      {/* Encabezado */}
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-ink">Proyectos</h1>
        <p className="text-muted">Explora y descubre miniproyectos de la comunidad.</p>
      </header>

      {/* Toolbar: chips + búsqueda */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-5">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag("Todas")}
            className={`chip ${activeTag === "Todas" ? "chip-active" : ""}`}
          >Todas</button>
          {tags.map(t => (
            <button
              key={t}
              onClick={() => setActiveTag(t)}
              className={`chip ${activeTag === t ? "chip-active" : ""}`}
            >{t}</button>
          ))}
        </div>

        <div className="w-full lg:w-[320px]">
          <input
            className="input w-full h-10"
            placeholder="Buscar por nombre, autor o tecnología…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Grid fluida con mín 280px */}
      {loading ? (
        <section
          className="grid gap-5"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
        >
          {Array.from({ length: 8 }).map((_, i) => <ProjectSkeleton key={i} />)}
        </section>
      ) : filteredProjects.length > 0 ? (
        <section
          className="grid gap-5"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
        >
          {filteredProjects.map(p => <ProjectCard key={p.id} project={p} />)}
        </section>
      ) : (
        <div className="text-center py-16">
          <div className="text-7xl">🔍</div>
          <h3 className="text-lg font-semibold mt-2">No encontramos resultados</h3>
          <p className="text-muted">Prueba con otra palabra clave o cambia el filtro.</p>
        </div>
      )}
    </main>
  );
}
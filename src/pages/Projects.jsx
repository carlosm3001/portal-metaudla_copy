import { useMemo, useState, useEffect } from "react";
import ProjectCardFlip from "../components/ProjectCardFlip";
import ProjectFilterBar from "../components/ProjectFilterBar";
import { getProjects } from "../services/api";

// MOCK (reemplaza por fetch a tu API si ya existe)
export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        console.log("API Data:", data);
        setProjects(data);
      } catch (err) {
        setError('Error al cargar proyectos.');
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);
  const [type, setType] = useState("Todos");
  const [query, setQuery] = useState("");
  const [semester, setSemester] = useState("Todos los semestres");

  const semestersList = ["Todos los semestres", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filteredProjects = projects.filter(p => {
      const okType = type === "Todos" ? true : p.category === type;
      const okQ = !q || p.name.toLowerCase().includes(q) || (p.description||"").toLowerCase().includes(q);
      const okSem = semester === "Todos los semestres" ? true : p.semestre === parseInt(semester);
      return okType && okQ && okSem;
    });
    console.log("Filtered Projects:", filteredProjects);
    return filteredProjects;
  }, [type, query, semester, projects]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 space-y-8">
      <h1 className="text-3xl md:text-4xl font-extrabold text-text">Proyectos Destacados</h1>

      <ProjectFilterBar
        valueQuery={query}
        onQueryChange={setQuery}
        valueType={type}
        onTypeChange={setType}
        valueSemester={semester}
        onSemesterChange={setSemester}
        semesters={semestersList}
      />

      {loading && <p className="text-center text-text">Cargando proyectos...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="text-7xl">🤷</div>
          <h3 className="text-lg font-semibold mt-2">No se encontraron proyectos</h3>
          <p className="text-muted">Intenta con otros filtros o términos de búsqueda.</p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => <ProjectCardFlip key={p.id} project={p} />)}
        </div>
      )}
    </main>
  );
}

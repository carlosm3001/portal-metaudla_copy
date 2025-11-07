import { useMemo, useState } from "react";
import ProjectCardFlip from "../components/ProjectCardFlip";
import ProjectFilterBar from "../components/ProjectFilterBar";

// MOCK (reemplaza por fetch a tu API si ya existe)
const PROJECTS = [
  { id: 1, title: "Simulador de Ecuaciones", type: "Simulación", imageUrl: "/images/uniamazonia-biblioteca.jpg", summary: "Explora ecuaciones diferenciales con sliders y gráficos en tiempo real.", tags: ["Matemáticas","Simulación"], semestre: 5 },
  { id: 2, title: "Física Divertida", type: "Juego", imageUrl: "/images/uniamazonia-pradera.jpg", summary: "Minijuegos para aprender cinemática y dinámica jugando.", tags: ["Física","Juego"], semestre: 3 },
  { id: 3, title: "Portal Web UDLA", type: "Web", imageUrl: "/images/uniamazonia-administrativo.jpg", summary: "Sitio para visibilizar proyectos y conectar equipos académicos.", tags: ["Web","React"], semestre: 7 },
  { id: 4, title: "App de Realidad Aumentada", type: "Móvil", imageUrl: "/images/uniamazonia-administrativo.jpg", summary: "Una aplicación móvil que utiliza la realidad aumentada para visualizar modelos 3D en el mundo real.", tags: ["Móvil","AR"], semestre: 8 },
  { id: 5, title: "Dashboard de Analítica", type: "Web", imageUrl: "/images/uniamazonia-biblioteca.jpg", summary: "Un dashboard para visualizar y analizar datos de ventas y marketing.", tags: ["Web","Data Analytics"], semestre: 6 },
  { id: 6, title: "Red Social para Estudiantes", type: "Web", imageUrl: "/images/uniamazonia-pradera.jpg", summary: "Una red social para que los estudiantes de la universidad se conecten y colaboren.", tags: ["Web","Comunidad"], semestre: 4 },
  { id: 7, title: "Juego de Estrategia", type: "Juego", imageUrl: "/images/uniamazonia-administrativo.jpg", summary: "Un juego de estrategia en tiempo real con temática de ciencia ficción.", tags: ["Juego","Estrategia"], semestre: 5 },
  { id: 8, title: "App de Fitness", type: "Móvil", imageUrl: "/images/uniamazonia-biblioteca.jpg", summary: "Una aplicación móvil para seguir tus entrenamientos y tu progreso.", tags: ["Móvil","Salud"], semestre: 7 },
];

export default function Projects() {
  const [type, setType] = useState("Todos");
  const [query, setQuery] = useState("");
  const [semester, setSemester] = useState("Todos los semestres");

  const semestersList = ["Todos los semestres", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PROJECTS.filter(p => {
      const okType = type === "Todos" ? true : p.type === type;
      const okQ = !q || p.title.toLowerCase().includes(q) || (p.summary||"").toLowerCase().includes(q);
      const okSem = semester === "Todos los semestres" ? true : p.semestre === parseInt(semester);
      return okType && okQ && okSem;
    });
  }, [type, query, semester]);

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(p => <ProjectCardFlip key={p.id} project={p} />)}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="text-7xl">🤷</div>
          <h3 className="text-lg font-semibold mt-2">No se encontraron proyectos</h3>
          <p className="text-muted">Intenta con otros filtros o términos de búsqueda.</p>
        </div>
      )}
    </main>
  );
}

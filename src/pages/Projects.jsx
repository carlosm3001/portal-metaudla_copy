import { useEffect, useState } from "react";
import ProjectCard from "../components/projects/ProjectCard";
import ProjectSkeleton from "../components/projects/ProjectSkeleton";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedTechnology, setSelectedTechnology] = useState("");

  const semesters = Array.from({ length: 10 }, (_, i) => i + 1);
  const difficulties = ["Principiante", "Intermedio", "Avanzado"];

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [categoriesRes, technologiesRes] = await Promise.all([
          fetch('https://meta-verso-carlos.b0falx.easypanel.host/api/categories'),
          fetch('https://meta-verso-carlos.b0falx.easypanel.host/api/technologies'),
        ]);

        const categoriesData = await categoriesRes.json();
        const technologiesData = await technologiesRes.json();

        setCategories(categoriesData);
        setTechnologies(technologiesData);
      } catch (err) {
        console.error("Error fetching filters:", err);
        // Optionally set an error state for filters
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (searchTerm) params.append('q', searchTerm);
        if (selectedCategory) params.append('categoria_id', selectedCategory);
        if (selectedSemester) params.append('semestre', selectedSemester);
        if (selectedDifficulty) params.append('dificultad', selectedDifficulty);
        // Note: The backend currently filters by technology name if 'q' is used. 
        // If a dedicated technology filter is needed, the backend API needs adjustment.
        // For now, we'll rely on 'q' for technology search if the user types it.

        const url = `https://meta-verso-carlos.b0falx.easypanel.host/api/projects?${params.toString()}`;
        const response = await fetch(url);
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
  }, [searchTerm, selectedCategory, selectedSemester, selectedDifficulty]);

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

      {/* Toolbar: filtros + búsqueda */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-5">
        <div className="flex flex-wrap gap-2 items-center">
          {/* Search Input */}
          <div className="w-full lg:w-[320px]">
            <input
              className="input w-full h-10"
              placeholder="Buscar por nombre, descripción..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <select
            className="select h-10"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            <option value="">Todas las Categorías</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>

          {/* Semester Filter */}
          <select
            className="select h-10"
            value={selectedSemester}
            onChange={e => setSelectedSemester(e.target.value)}
          >
            <option value="">Todos los Semestres</option>
            {semesters.map(sem => (
              <option key={sem} value={sem}>
                Semestre {sem}
              </option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            className="select h-10"
            value={selectedDifficulty}
            onChange={e => setSelectedDifficulty(e.target.value)}
          >
            <option value="">Todas las Dificultades</option>
            {difficulties.map(diff => (
              <option key={diff} value={diff}>
                {diff}
              </option>
            ))}
          </select>

          {/* Technology Filter (using 'q' for now, can be enhanced) */}
          {/* Re-evaluating the technology filter: The backend currently searches technology names via 'q'.
              If a dedicated technology filter is desired, the backend API needs to be updated to accept a 'technology_id' or 'technology_name' parameter.
              For now, the 'q' parameter can be used for searching technologies as well if the user types the technology name.
              Keeping this as a placeholder for future enhancement if needed. */}
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
      ) : projects.length > 0 ? (
        <section
          className="grid gap-5"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
        >
          {projects.map(p => <ProjectCard key={p.id} project={p} />)}
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
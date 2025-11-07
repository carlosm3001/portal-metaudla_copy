import { useEffect, useState } from "react";
import "../styles/filters.css";

const DEFAULT_TYPES = ["Todos", "Simulación", "Juego", "Web", "Móvil"];

export default function ProjectFilterBar({
  valueQuery = "",
  onQueryChange,
  valueType = "Todos",
  onTypeChange,
  types = DEFAULT_TYPES,
  valueSemester = "Todos los semestres",
  onSemesterChange,
  semesters = ["Todos los semestres", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
}) {
  const [q, setQ] = useState(valueQuery);

  // Debounce 300ms
  useEffect(() => {
    const t = setTimeout(() => onQueryChange?.(q), 300);
    return () => clearTimeout(t);
  }, [q, onQueryChange]);

  return (
    <section className="bg-card/90 backdrop-blur-md border border-slate-200 rounded-2xl shadow-sm px-5 py-4 md:px-8">
      <div className="flex flex-col md:grid md:grid-cols-[1fr_auto_auto] md:items-center gap-3 md:gap-5">
        
        {/* 🔍 Búsqueda */}
        <div className="relative w-full">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted"
            fill="currentColor" viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.387a1 1 0 01-1.414 1.414l-4.387-4.387zM14 8a6 6 0 11-12 0 6 6 0 0112 0z" clipRule="evenodd"/>
          </svg>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar proyectos..."
            aria-label="Buscar proyectos"
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-bg border border-slate-200
                       text-text placeholder-muted
                       focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
          />
        </div>

        {/* 🎯 Chips */}
        <div className="chips-scroll md:justify-center flex items-center gap-2 py-1 px-1 scrollbar-thin scrollbar-thumb-slate-300">
          {types.map((t) => {
            const active = t === valueType;
            return (
              <button
                key={t}
                type="button"
                aria-pressed={active}
                onClick={() => onTypeChange?.(t)}
                className={`snap-start whitespace-nowrap px-4 py-2 rounded-full font-semibold text-sm
                  ${active
                    ? "bg-primary text-white shadow-indigo"
                    : "bg-leaf/20 text-primary hover:bg-leaf/40"}
                focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all duration-200`}
              >
                {t}
              </button>
            );
          })}
        </div>

        {/* 📅 Select */}
        <div className="relative w-full md:w-[230px]">
          <label className="sr-only" htmlFor="semester">Filtrar por semestre</label>
          <div className="relative">
            <select
              id="semester"
              aria-label="Filtrar por semestre"
              value={valueSemester}
              onChange={(e) => onSemesterChange?.(e.target.value)}
              className="appearance-none w-full pl-4 pr-10 py-2.5 rounded-full bg-bg border border-slate-200
                       text-text focus:ring-2 focus:ring-primary/60 focus:outline-none transition-all duration-200"
            >
              {semesters.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {/* Chevron */}
            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.125l3.71-3.895a.75.75 0 011.08 1.04l-4.24 4.45a.75.75 0 01-1.08 0L5.25 8.27a.75.75 0 01-.02-1.06z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

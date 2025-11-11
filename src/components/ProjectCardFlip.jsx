import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/project-flip.css";
import { API_URL } from "../services/api";

export default function ProjectCardFlip({ project }) {
  const [flipped, setFlipped] = useState(false);
  const API_BASE_URL = API_URL.replace('/api', '');

  // Manejo para dispositivos táctiles (mobile)
  const handleTouch = (e) => {
    // Solo si el dispositivo no soporta hover (es decir, es táctil)
    if (window.matchMedia('(hover: none)').matches) {
      // Previene la navegación inmediata si no está volteada
      if (!flipped) {
        e.preventDefault();
        setFlipped(true);
      } else {
        // Si ya está volteada, permite que el Link o el botón de detalles manejen la navegación
        // No hacemos nada aquí, el Link o el botón se encargarán
      }
    }
  };

  // Manejo para teclado (accesibilidad)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); // Previene el scroll si es espacio
      setFlipped(!flipped);
    }
  };

  // Previene el flip si se hace clic en el botón de detalles
  const onCardClick = (e) => {
    e.stopPropagation(); // Evita que el clic en el botón propague al div padre y cause un flip
  };

  return (
    <div
      className={`card3d rounded-xl shadow-lg ${flipped ? "is-flipped" : ""}`}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={handleTouch}
      onKeyDown={handleKeyDown}
      tabIndex="0" // Hace la tarjeta enfocable con teclado
      role="button" // Indica que es un elemento interactivo
      aria-label={`Ver detalles del proyecto ${project.title}`}
    >
      <div className="card3d-inner aspect-[16/9]">
        {/* FRONT */}
        <div className="face front">
          <img src={project.imageUrl ? `${API_BASE_URL}${project.imageUrl}` : 'https://via.placeholder.com/400x225?text=No+Image'} alt={project.name} loading="lazy" />
          <div className="absolute bottom-3 left-4 right-4 z-10">
            <h3 className="text-white font-bold text-lg drop-shadow">
              {project.name}
            </h3>
          </div>
        </div>

        {/* BACK */}
        <div className="face back">
          <div className="p-5 md:p-6 text-center space-y-3">
            <h3 className="text-white text-lg font-semibold">
              {project.name}
            </h3>
            {project.description && (
              <p
                className="text-white/85 text-sm leading-relaxed line-clamp-3"
                title={project.description}
              >
                {project.description}
              </p>
            )}

            {/* Tags opcionales */}
            {Array.isArray(project.tags) && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {project.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-full text-xs font-medium bg-card text-text"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            <Link
              to={`/projects/${project.id}`}
              aria-label={`Ver detalles de ${project.title}`}
              onClick={onCardClick}
              className="inline-flex items-center justify-center px-4 py-2 rounded-full
                         bg-primary text-white font-semibold
                         transition-all duration-200 ease-out
                         hover:bg-primary focus-visible:outline-none
                         focus-visible:ring-2 focus-visible:ring-primary"
            >
              Ver detalles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

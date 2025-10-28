import React, { useState, useEffect } from "react";

import TechChipOption from './admin/TechChipOption';
import TechChipSelected from './admin/TechChipSelected';

const CATEGORIES = [
  'Juegos de Matemáticas',
  'Juegos de Física',
  'Simulaciones Interactivas',
  'Realidad Virtual (VR) Educativa',
  'Realidad Aumentada (AR) Educativa',
  'Software de Tutoría Inteligente',
  'Plataformas de Aprendizaje',
  'Otro',
];

const ProjectForm = React.forwardRef(({ project, onSubmit, onCancel }, ref) => {
  // Estados del formulario
  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(project?.description || "");
  const [participantes, setParticipantes] = useState(project?.participantes || "");
  const [githubUrl, setGithubUrl] = useState(project?.githubUrl || "");
  const [websiteUrl, setWebsiteUrl] = useState(project?.websiteUrl || "");
  const [category, setCategory] = useState(project?.category || CATEGORIES[0]);
  
  // Estados para imágenes
  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  const [availableTechnologies, setAvailableTechnologies] = useState([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);

  useEffect(() => {
    if (project) {
      setName(project.name || project.nombre || "");
      setDescription(project.description || project.descripcion || "");
      setParticipantes(project.participantes || "");
      setGithubUrl(project.githubUrl || "");
      setWebsiteUrl(project.websiteUrl || "");
      setCategory(project.category || project.categoria || CATEGORIES[0]);
      const initialTechs = (project.technologies || project.tecnologias) ? (project.technologies || project.tecnologias).split(',').map(t => t.trim()) : [];
      setSelectedTechnologies(initialTechs);
    }
  }, [project]);

  useEffect(() => {
    const fetchTechs = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/technologies');
        const data = await response.json();
        setAvailableTechnologies(data);
      } catch (error) {
        console.error("Error al cargar tecnologías:", error);
      }
    };
    fetchTechs();
  }, []);

  const toggleTech = (techName) => {
    setSelectedTechnologies(prev =>
      prev.includes(techName) ? prev.filter(t => t !== techName) : [...prev, techName]
    );
  };

  const removeTech = (techName) => {
    setSelectedTechnologies(prev => prev.filter(t => t !== techName));
  };

  const clearTechs = () => {
    setSelectedTechnologies([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    if (project?.id) {
      fd.append("id", project.id);
      if (project.imageUrl) {
        fd.append("imageUrl", project.imageUrl);
      }
    }

    fd.append("name", name.trim());
    fd.append("description", description.trim());
    fd.append("participantes", participantes.trim());
    fd.append("githubUrl", githubUrl.trim());
    fd.append("websiteUrl", websiteUrl.trim());
    fd.append("category", category);
    fd.append("technologies", selectedTechnologies.join(', '));

    if (mainImage) fd.append("projectImage", mainImage);
    for (let i = 0; i < galleryImages.length; i++) {
      fd.append("galleryImages", galleryImages[i]);
    }

    onSubmit?.(fd);
  };

  return (
    <form ref={ref} onSubmit={handleSubmit} encType="multipart/form-data">
      <div className="p-4 md:p-6">
        <div className="flex items-start justify-between mb-5">
          <h3 className="text-lg md:text-xl font-bold text-ink">
            {project ? 'Editar Proyecto' : 'Añadir Proyecto'}
          </h3>
          <button type="button" className="btn btn-ghost btn-xs" onClick={onCancel} aria-label="Cerrar">×</button>
        </div>

        <div className="space-y-4">
          <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="label">Nombre del Proyecto</label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="md:col-span-2">
              <label className="label">Descripción</label>
              <textarea className="textarea" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>

            <div>
              <label className="label">Imagen Principal</label>
              {project?.imageUrl && (
                <div className="mb-4">
                  <img src={`http://localhost:3001${project.imageUrl}`} alt="Imagen Principal Actual" className="w-full h-auto object-cover rounded-lg border border-border" />
                </div>
              )}
              <input type="file" accept="image/*" className="input" name="projectImage" onChange={(e) => setMainImage(e.target.files?.[0] || null)} />
              <p className="helper mt-1">Sube la imagen que representará tu proyecto.</p>
            </div>
            <div>
              <label className="label">Imágenes de Galería (hasta 8)</label>
              {project?.gallery && project.gallery.length > 0 && (
                <div className="mb-4 grid grid-cols-3 gap-4">
                  {project.gallery.map(image => (
                    <div key={image.id}>
                      <img src={`http://localhost:3001${image.imagenUrl}`} alt="Imagen de Galería" className="w-full h-auto object-cover rounded-lg border border-border" />
                    </div>
                  ))}
                </div>
              )}
              <input type="file" accept="image/*" multiple className="input" name="galleryImages" onChange={(e) => setGalleryImages(Array.from(e.target.files))} />
              <p className="helper mt-1">Muestra más detalles de tu proyecto.</p>
            </div>

            <div className="md:col-span-2">
              <label className="label">Categoría</label>
              <select className="input" value={category} onChange={(e) => setCategory(e.target.value)} required>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="label">Participantes (separados por comas)</label>
              <input className="input" value={participantes} onChange={(e) => setParticipantes(e.target.value)} placeholder="Ej. Ada Lovelace, Charles Babbage" />
            </div>

            <div>
              <label className="label">URL de GitHub</label>
              <input className="input" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/..." />
            </div>
            <div>
              <label className="label">URL del Sitio Web</label>
              <input className="input" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://mi-proyecto.com" />
            </div>

            <div className="md:col-span-2">
              {/* Resumen de tecnologías seleccionadas */}
              <div className="card p-3 mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-ink">Seleccionadas</span>
                  {selectedTechnologies.length > 0 && (
                    <button type="button" className="text-xs text-muted hover:text-ink underline" onClick={clearTechs}>
                      Limpiar
                    </button>
                  )}
                </div>
                {selectedTechnologies.length === 0 ? (
                  <p className="helper mt-1">Ninguna seleccionada aún.</p>
                ) : (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedTechnologies.map(t => (
                      <TechChipSelected key={t} t={t} onRemove={removeTech} />
                    ))}
                  </div>
                )}
              </div>

              <label className="label">Tecnologías</label>
              <div key="tech-options-container" className="p-3 border border-border rounded-xl bg-bg flex flex-wrap gap-2">
                {availableTechnologies.map(tech => (
                  <TechChipOption
                    key={tech.id}
                    tech={tech}
                    onToggle={toggleTech}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 left-0 bg-white/95 backdrop-blur-sm border-t border-border px-4 py-3 flex justify-end gap-2">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-primary">{project ? "Guardar Cambios" : "Crear Proyecto"}</button>
      </div>
    </form>
  );
});

export default ProjectForm;
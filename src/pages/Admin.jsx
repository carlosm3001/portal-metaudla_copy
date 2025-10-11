import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import ProjectForm from '../components/ProjectForm';
import ProjectCard from '../components/admin/ProjectCard';
import RightPanelTabs from '../components/admin/RightPanelTabs';

function Admin({ isLoggedIn, userRole }) {
  // Estados para datos
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Estados de carga y error
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [auditLoading, setAuditLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usersError, setUsersError] = useState(null);
  const [auditError, setAuditError] = useState(null);

  // Estado para el modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const navigate = useNavigate();

  // Estados para filtros y orden
  const [query, setQuery] = useState("");
  const [techFilter, setTechFilter] = useState("Todas");
  const [sortBy, setSortBy] = useState("recientes");

  const getAuthHeaders = useCallback(() => ({ 'x-auth-token': localStorage.getItem('session_token') }), []);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/projects', { headers: getAuthHeaders() });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setProjects(data);
    } catch (_) { setError('Error al cargar proyectos.'); } 
    finally { setLoading(false); }
  }, [getAuthHeaders]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/api/users', { headers: getAuthHeaders() });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setUsers(data);
    } catch (_) { setUsersError('Error al cargar usuarios.'); } 
    finally { setUsersLoading(false); }
  }, [getAuthHeaders]);

  const fetchAuditLogs = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/api/audit', { headers: getAuthHeaders() });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setAuditLogs(data);
    } catch (_) { setAuditError('Error al cargar auditoría.'); } 
    finally { setAuditLoading(false); }
  }, [getAuthHeaders]);

  useEffect(() => {
    if (!isLoggedIn || userRole !== 'admin') {
      navigate('/login');
      return;
    }
    fetchProjects();
    fetchUsers();
    fetchAuditLogs();
  }, [isLoggedIn, userRole, navigate, fetchProjects, fetchUsers, fetchAuditLogs]);

  const handleSaveProject = async (formData) => {
    try {
      const method = formData.get('id') ? 'PUT' : 'POST';
      const url = formData.get('id')
        ? `http://localhost:3001/api/projects/${formData.get('id')}`
        : 'http://localhost:3001/api/projects';
      const response = await fetch(url, { method, headers: getAuthHeaders(), body: formData });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setIsModalOpen(false);
      fetchProjects(); // Recargar proyectos
    } catch (err) {
      setError('Error al guardar el proyecto.');
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      try {
        await fetch(`http://localhost:3001/api/projects/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
        fetchProjects(); // Recargar
      } catch (err) { setError('Error al eliminar el proyecto.'); }
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await fetch(`http://localhost:3001/api/users/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
        fetchUsers(); // Recargar
      } catch (err) { setUsersError('Error al eliminar el usuario.'); }
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  }

  const filteredProjects = projects
    .filter(p => {
        const techs = p.technologies ? p.technologies.split(',').map(t => t.trim()) : [];
        return (techFilter === "Todas" ? true : techs.includes(techFilter))
    })
    .filter(p => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      const techs = p.technologies ? p.technologies.split(',').map(t => t.trim()) : [];
      return (
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        techs.some(t => t.toLowerCase().includes(q))
      );
    })
    .sort((a,b) => {
      if (sortBy === "recientes") return (b.id || 0) - (a.id || 0);
      if (sortBy === "votos") return (b.votes || 0) - (a.votes || 0);
      return a.name.localeCompare(b.name);
    });

  if (loading || usersLoading || auditLoading) {
    return (
      <main className="container mx-auto max-w-7xl px-4 py-8">
        {/* Skeleton state */}
      </main>
    );
  }

  return (
    <div className="bg-base-100 text-base-content min-h-screen" data-sticky-root>
      <main className="container mx-auto max-w-screen-2xl px-4 py-8 lg:px-6">
        {/* Encabezado y botón de acción principal */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-ink-primary">Panel de Administración</h1>
            <p className="text-ink-secondary mt-1">Gestión de proyectos, usuarios y auditoría del portal.</p>
          </div>
          <button 
            className="btn btn-primary shadow-md hover:shadow-lg transition-shadow" 
            onClick={() => { setEditingProject(null); setIsModalOpen(true); }}
          >
            + Añadir proyecto
          </button>
        </div>

        {/* Layout principal de dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-20 items-start gap-8 admin-grid">
          
          {/* Columna Izquierda: Gestión de Proyectos */}
          <section className="bg-base-200 rounded-2xl shadow-sm p-4 sm:p-6 lg:col-span-11">
            {/* Toolbar de Proyectos */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-ink-primary flex-shrink-0">Gestión de Proyectos</h2>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:justify-end">
                <input
                  type="search"
                  className="input input-bordered w-full sm:w-48 h-10"
                  placeholder="Buscar..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />
                <select className="select select-bordered w-full sm:w-auto h-10" value={techFilter} onChange={e => setTechFilter(e.target.value)}>
                  <option value="Todas">Todas las tecnologías</option>
                  {(Array.from(new Set(projects.flatMap(p => p.technologies ? p.technologies.split(',').map(t=>t.trim()) : [])))).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select className="select select-bordered w-full sm:w-auto h-10" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="recientes">Más recientes</option>
                  <option value="alfabetico">A–Z</option>
                  <option value="votos">Más votados</option>
                </select>
              </div>
            </div>

            {/* Grid de Proyectos */}
            {error && <p className="text-red-500">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
              {filteredProjects.map(p => (
                <ProjectCard key={p.id} project={p} onEdit={handleEditProject} onDelete={handleDeleteProject} />
              ))}
            </div>

            {/* Estado Vacío */}
            {!loading && filteredProjects.length === 0 && (
              <div className="text-center py-16 col-span-full">
                <div className="text-6xl opacity-50">🗂️</div>
                <h3 className="text-xl font-semibold mt-4">No hay proyectos que coincidan</h3>
                <p className="text-ink-secondary mt-2">Prueba a cambiar los filtros o tu búsqueda.</p>
              </div>
            )}
          </section>

          {/* Columna Derecha: Paneles de Actividad y Usuarios */}
          <aside className="lg:col-span-9">
            <div className="lg:sticky lg:top-20">
              <RightPanelTabs
                auditLogs={auditLogs}
                users={users}
                onDeleteUser={handleDeleteUser}
                auditLoading={auditLoading}
                usersLoading={usersLoading}
                auditError={auditError}
                usersError={usersError}
              />
            </div>
          </aside>
        </div>

        {/* Modal para crear/editar proyecto */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProject ? 'Editar Proyecto' : 'Añadir Nuevo Proyecto'}>
          <ProjectForm 
            project={editingProject} 
            onSubmit={handleSaveProject} 
            onCancel={() => setIsModalOpen(false)} 
          />
        </Modal>
      </main>
    </div>
  );
}

export default Admin;

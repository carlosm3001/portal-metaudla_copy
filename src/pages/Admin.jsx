import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import ProjectForm from '../components/ProjectForm';
import ProjectCard from '../components/admin/ProjectCard';
import RightPanelTabs from '../components/admin/RightPanelTabs';
import { listUsersUnified, setUserRoleUnified, toggleUserActiveUnified } from "@/services/users.unified";
import { listLogsUnified, formatDateSafe, actionBadge, actionIcon } from "@/services/activityLog.unified";
import { extractEmailFromDetails, formatAuditDate } from "@/utils/audit.jsx";
import { useAuth } from '../context/AuthContext';

function Admin({ isLoggedIn, userRole }) {
  const { user } = useAuth();
  // Estados para datos
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = React.useState("activity"); // 'activity' | 'users'
  const [logs, setLogs] = React.useState(null);
  const [q, setQ] = React.useState(""); // búsqueda
  const [userFilter, setUserFilter] = React.useState(null); // email para filtrar actividad

  // Estados de carga y error
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usersError, setUsersError] = useState(null);

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



  useEffect(() => {
    if (!isLoggedIn || userRole !== 'admin') {
      navigate('/login');
      return;
    }
    fetchProjects();
    fetchUsers();
  }, [isLoggedIn, userRole, navigate, fetchProjects, fetchUsers]);

  React.useEffect(() => {
    (async () => {
      const us = await listUsersUnified();
      setUsers(us);
      const lg = await listLogsUnified(100);
      setLogs(lg);
    })();
  }, []);

  const filteredUsers = React.useMemo(() => {
    if (!users) return null;
    if (!q) return users;
    const s = q.toLowerCase();
    return users.filter(u =>
      (u.email || "").toLowerCase().includes(s) ||
      (u.display_name || "").toLowerCase().includes(s)
    );
  }, [users, q]);

  const logsByUser = React.useMemo(() => {
    if (!logs) return null;
    if (!userFilter) return logs;
    return logs.filter(l =>
      (l.user || "").toLowerCase() === userFilter.toLowerCase()
    );
  }, [logs, userFilter]);

  const handleSaveProject = async (formData) => {
    try {
      const method = formData.get('id') ? 'PUT' : 'POST';
      const url = formData.get('id')
        ? `http://localhost:3001/api/projects/${formData.get('id')}`
        : 'http://localhost:3001/api/projects';
      const response = await fetch(url, { method, headers: getAuthHeaders(), body: formData });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const action = formData.get('id') ? 'edit_project' : 'create_project';

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

  if (loading || usersLoading || logs === null) {
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
                    <div className="lg:col-span-9">
                      <div className="flex gap-2 mb-4">
                        <button
                          className={`pill ${tab === "activity" ? "bg-brand-100 text-brand-700" : ""}`}
                          onClick={() => setTab("activity")}
                        >
                          Registro de Actividad
                        </button>
                        <button
                          className={`pill ${tab === "users" ? "bg-brand-100 text-brand-700" : ""}`}
                          onClick={() => setTab("users")}
                        >
                          Gestión de Usuarios
                        </button>
                      </div>
          
                      {tab === "users" ? (
                        <section className="card p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h2 className="text-ink font-bold">Gestión de Usuarios</h2>
                            <input
                              value={q}
                              onChange={(e) => setQ(e.target.value)}
                              placeholder="Buscar por email o nombre…"
                              className="input w-[320px]"
                            />
                          </div>
          
                          {filteredUsers === null ? (
                            <div className="py-12 text-center text-muted">Cargando usuarios…</div>
                          ) : filteredUsers.length === 0 ? (
                            <div className="py-12 text-center text-muted">
                              No hay usuarios que coincidan.
                            </div>
                          ) : (
                            <div className="overflow-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="text-ink font-semibold border-b">
                                    <th className="py-2 text-left">Email</th>
                                    <th className="text-left">Nombre</th>
                                    <th className="text-left">Rol</th>
                                    <th className="text-left">Estado</th>
                                    <th className="text-left">Última vez</th>
                                    <th className="text-left">Acciones</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {filteredUsers.map((u) => (
                                    <tr
                                      key={u.id || u.email}
                                      className="border-b hover:bg-brand-50/50"
                                    >
                                      <td className="py-2">
                                        <button className="link" onClick={() => setUserFilter(u.email)}>
                                          {u.email}
                                        </button>
                                      </td>
                                      <td>{u.display_name || "—"}</td>
                                      <td>
                                        <select
                                          className="input input-sm"
                                          defaultValue={u.role || "user"}
                                          onChange={async (e) => {
                                            await setUserRoleUnified(u.email, e.target.value);
                                            setUsers((prev) =>
                                              prev.map((p) =>
                                                p.email === u.email
                                                  ? { ...p, role: e.target.value }
                                                  : p
                                              )
                                            );
                                          }}
                                        >
                                          <option value="user">user</option>
                                          <option value="admin">admin</option>
                                        </select>
                                      </td>
                                      <td>
                                        <label className="inline-flex items-center gap-2">
                                          <input
                                            type="checkbox"
                                            defaultChecked={u.is_active !== false}
                                            onChange={async (e) => {
                                              await toggleUserActiveUnified(
                                                u.email,
                                                e.target.checked
                                              );
                                              setUsers((prev) =>
                                                prev.map((p) =>
                                                  p.email === u.email
                                                    ? { ...p, is_active: e.target.checked }
                                                    : p
                                                )
                                              );
                                            }}
                                          />
                                          <span className="pill pill-sm">
                                            {u.is_active !== false ? "activo" : "inactivo"}
                                          </span>
                                        </label>
                                      </td>
                                      <td>{formatDateSafe(u.last_seen_at || u.created_at)}</td>
                                      <td>
                                        <button
                                          className="btn btn-sm"
                                          onClick={() => setUserFilter(u.email)}
                                        >
                                          Ver actividad
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </section>
                      ) : (
                        <section className="card p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h2 className="text-ink font-bold">Registro de Actividad</h2>
                            <div className="flex items-center gap-2">
                              <input
                                value={userFilter || ""}
                                onChange={(e) => setUserFilter(e.target.value || null)}
                                placeholder="Filtrar por email…"
                                className="input w-[280px]"
                              />
                              {userFilter && (
                                <button className="btn btn-sm" onClick={() => setUserFilter(null)}>
                                  Quitar filtro
                                </button>
                              )}
                            </div>
                          </div>
          
                          {logsByUser === null ? (
                            <div className="py-12 text-center text-muted">Cargando registros…</div>
                          ) : logsByUser.length === 0 ? (
                            <div className="py-12 text-center text-muted">
                              No hay actividad registrada.
                            </div>
                          ) : (
                            <div className="overflow-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="text-ink font-semibold border-b">
                                    <th className="py-2 text-left">Usuario</th>
                                    <th className="text-left">Acción</th>
                                    <th className="text-left">Detalles</th>
                                    <th className="text-left">Fecha</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {logsByUser.map((l) => (
                                    <tr key={l.id} className="border-b hover:bg-brand-50/50">
                                      <td className="py-2">{l.user}</td>
                                      <td>
                                        <span className={actionBadge(l.action)}>
                                          <span className="mr-1">{actionIcon(l.action)}</span>
                                          {l.action}
                                        </span>
                                      </td>
                                      <td className="max-w-[420px] truncate">
                                        {renderDetails(l.details)}
                                      </td>
                                      <td>{formatDateSafe(l.iso)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </section>
                      )}
                    </div>        </div>

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

function renderDetails(details) {
  if (!details) return "—";
  if (typeof details === "string") return details;
  try {
    return JSON.stringify(details);
  } catch {
    return String(details);
  }
}

export default Admin;

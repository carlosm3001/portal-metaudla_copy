import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import ProjectForm from '../components/ProjectForm';
import ProjectCard from '../components/admin/ProjectCard'; // Renamed to avoid conflict with ProjectCardFlip
import AdminHeader from "../components/admin/AdminHeader";
import AdminTabs from "../components/admin/AdminTabs";
import AdminCard from "../components/admin/AdminCard";
import AdminTable from "../components/admin/AdminTable";

// Unified services (assuming these exist and are correctly implemented)
import { listUsersUnified, setUserRoleUnified, toggleUserActiveUnified } from "../services/users.unified";
import { listLogsUnified, formatDateSafe, actionBadge, actionIcon } from "../services/activityLog.unified";
import { extractEmailFromDetails, formatAuditDate } from "../utils/audit.jsx";
import { useAuth } from '../context/AuthContext';

import NewsCard from '../components/admin/NewsCard';
import ActivityLogModal from '../components/admin/ActivityLogModal';
import NewsForm from '../components/admin/NewsForm';

function Admin({ isLoggedIn, userRole }) {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // State for data
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [news, setNews] = useState([]);
  const [logs, setLogs] = useState(null);
  const [projectRequests, setProjectRequests] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usersError, setUsersError] = useState(null);
  const [newsError, setNewsError] = useState(null);

  // Modal states
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editingNews, setEditingNews] = useState(null);
  const [isActivityLogModalOpen, setIsActivityLogModalOpen] = useState(false);
  const [selectedUserEmail, setSelectedUserEmail] = useState(null);
  const [viewingRequest, setViewingRequest] = useState(null);
  const [isViewRequestModalOpen, setIsViewRequestModalOpen] = useState(false);

  // Filter and sort states
  const [query, setQuery] = useState(""); // For project search
  const [userQuery, setUserQuery] = useState(""); // For user search
  const [techFilter, setTechFilter] = useState("Todas");
  const [sortBy, setSortBy] = useState("recientes");
  const [activeTab, setActiveTab] = useState(0); // 0: Projects, 1: News, 2: Users, 3: Activity, 4: Requests
  const [userFilter, setUserFilter] = useState(null); // For activity log user filter

  const tabs = [
    "Gestión de Proyectos",
    "Gestión de Noticias",
    "Gestión de Usuarios",
    "Registro de Actividad",
    "Solicitudes de Proyectos",
  ];

  // Fetch functions
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('https://meta-verso-carlos.b0falx.easypanel.host/api/projects', { headers: { 'Authorization': `Bearer ${token}` } });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setProjects(data);
    } catch (err) { setError('Error al cargar proyectos.'); }
    finally { setLoading(false); }
  }, [token]);

  const fetchUsers = useCallback(async () => {
    try {
      setUsersLoading(true);
      const data = await listUsersUnified(token);
      setUsers(data);
    } catch (err) { setUsersError('Error al cargar usuarios.'); }
    finally { setUsersLoading(false); }
  }, [token]);

  const fetchNews = useCallback(async () => {
    try {
      setNewsLoading(true);
      const response = await fetch('https://meta-verso-carlos.b0falx.easypanel.host/api/news', { headers: { 'Authorization': `Bearer ${token}` } });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setNews(data);
    } catch (err) { setNewsError('Error al cargar noticias.'); }
    finally { setNewsLoading(false); }
  }, [token]);

  const fetchLogs = useCallback(async () => {
    try {
      const data = await listLogsUnified(100, token);
      setLogs(data);
    } catch (err) { console.error("Error fetching logs:", err); }
  }, [token]);

  const fetchProjectRequests = useCallback(async () => {
    try {
      const response = await fetch('https://meta-verso-carlos.b0falx.easypanel.host/api/solicitudes', { headers: { 'Authorization': `Bearer ${token}` } });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setProjectRequests(data);
    } catch (err) { console.error("Error fetching project requests:", err); }
  }, [token]);

  // Initial data fetch
  useEffect(() => {
    if (!isLoggedIn || userRole !== 'admin') {
      navigate('/login');
      return;
    }
    fetchProjects();
    fetchUsers();
    fetchNews();
    fetchLogs();
    fetchProjectRequests();
  }, [isLoggedIn, userRole, navigate, token, fetchProjects, fetchUsers, fetchNews, fetchLogs, fetchProjectRequests]);

  // Filtered data
  const filteredProjects = React.useMemo(() => {
    return projects
      .filter(p => {
        const techs = p.technologies ? p.technologies.split(',').map(t => t.trim()) : [];
        return (techFilter === "Todas" ? true : techs.includes(techFilter));
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
      .sort((a, b) => {
        if (sortBy === "recientes") return (b.id || 0) - (a.id || 0);
        if (sortBy === "votos") return (b.likes || 0) - (a.likes || 0);
        return a.name.localeCompare(b.name);
      });
  }, [projects, techFilter, query, sortBy]);

  const filteredUsers = React.useMemo(() => {
    if (!users) return [];
    if (!userQuery) return users;
    const s = userQuery.toLowerCase();
    return users.filter(u =>
      (u.email || "").toLowerCase().includes(s) ||
      (u.display_name || "").toLowerCase().includes(s)
    );
  }, [users, userQuery]);

  const logsByUser = React.useMemo(() => {
    if (!logs) return [];
    if (!userFilter) return logs;
    return logs.filter(l =>
      (l.user || "").toLowerCase() === userFilter.toLowerCase()
    );
  }, [logs, userFilter]);

  // Action handlers
  const handleSaveProject = async (formData) => {
    try {
      const method = formData.get('id') ? 'PUT' : 'POST';
      const url = formData.get('id')
        ? `https://meta-verso-carlos.b0falx.easypanel.host/api/projects/${formData.get('id')}`
        : 'https://meta-verso-carlos.b0falx.easypanel.host/api/projects';
      const response = await fetch(url, { method, headers: { 'Authorization': `Bearer ${token}` }, body: formData });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setIsProjectModalOpen(false);
      fetchProjects();
      fetchLogs();
    } catch (err) { setError('Error al guardar el proyecto.'); }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      try {
        await fetch(`https://meta-verso-carlos.b0falx.easypanel.host/api/projects/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        fetchProjects();
        fetchLogs();
      } catch (err) { setError('Error al eliminar el proyecto.'); }
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setIsProjectModalOpen(true);
  };

  const handleSaveNews = async (formData) => {
    try {
      const method = formData.get('id') ? 'PUT' : 'POST';
      const url = formData.get('id')
        ? `https://meta-verso-carlos.b0falx.easypanel.host/api/news/${formData.get('id')}`
        : 'https://meta-verso-carlos.b0falx.easypanel.host/api/news';
      const response = await fetch(url, { 
        method, 
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, 
        body: JSON.stringify(Object.fromEntries(formData))
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setIsNewsModalOpen(false);
      fetchNews();
      fetchLogs();
    } catch (err) { setNewsError('Error al guardar la noticia.'); }
  };

  const handleEditNews = (news) => {
    setEditingNews(news);
    setIsNewsModalOpen(true);
  };

  const handleDeleteNews = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta noticia?')) {
      try {
        await fetch(`https://meta-verso-carlos.b0falx.easypanel.host/api/news/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        fetchNews();
        fetchLogs();
      } catch (err) { setNewsError('Error al eliminar la noticia.'); }
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await fetch(`https://meta-verso-carlos.b0falx.easypanel.host/api/users/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        fetchUsers();
        fetchLogs();
      } catch (err) { setUsersError('Error al eliminar el usuario.'); }
    }
  };

  const handleRequestUpdate = async (id, estado) => {
    try {
      await fetch(`https://meta-verso-carlos.b0falx.easypanel.host/api/solicitudes/${id}`, { 
        method: 'PUT', 
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ estado })
      });
      setProjectRequests(prev => prev.map(r => r.id === id ? { ...r, estado } : r));
      fetchLogs();
    } catch (err) { console.error("Error updating request", err); }
  };

  const handleViewRequest = async (id) => {
    try {
      const response = await fetch(`https://meta-verso-carlos.b0falx.easypanel.host/api/solicitudes/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setViewingRequest(data);
      setIsViewRequestModalOpen(true);
    } catch (err) { console.error("Error fetching request details", err); setError('Error al cargar los detalles de la solicitud.'); }
  };

  if (loading || usersLoading || newsLoading || logs === null) {
    return (
      <main className="bg-[var(--udla-bg)] min-h-screen p-4">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Skeleton state */}
          <p>Cargando panel de administración...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[var(--udla-bg)] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <AdminHeader
          onCta={() => { setEditingProject(null); setIsProjectModalOpen(true); }}
        />
        <AdminTabs active={activeTab} onChange={setActiveTab} items={tabs} />

        {activeTab === 0 && (
          <AdminCard title="Gestión de Proyectos">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <input
                type="search"
                className="input w-full sm:w-auto"
                placeholder="Buscar proyectos..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <select className="select w-full sm:w-auto" value={techFilter} onChange={e => setTechFilter(e.target.value)}>
                <option value="Todas">Todas las tecnologías</option>
                {(Array.from(new Set(projects.flatMap(p => p.technologies ? p.technologies.split(',').map(t=>t.trim()) : [])))).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select className="select w-full sm:w-auto" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="recientes">Más recientes</option>
                <option value="alfabetico">A–Z</option>
                <option value="votos">Más votados</option>
              </select>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredProjects.map(p => (
                <ProjectCard key={p.id} project={p} onEdit={handleEditProject} onDelete={handleDeleteProject} />
              ))}
            </div>
            {!loading && filteredProjects.length === 0 && (
              <div className="text-center py-16 col-span-full">
                <div className="text-6xl opacity-50">🗂️</div>
                <h3 className="text-xl font-semibold mt-4">No hay proyectos que coincidan</h3>
                <p className="text-ink-secondary mt-2">Prueba a cambiar los filtros o tu búsqueda.</p>
              </div>
            )}
          </AdminCard>
        )}

        {activeTab === 1 && (
          <AdminCard title="Gestión de Noticias">
            <div className="flex items-center justify-between mb-3">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar noticias..."
                className="input w-full sm:w-auto"
              />
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => { setEditingNews(null); setIsNewsModalOpen(true); }}
              >
                + Añadir Noticia
              </button>
            </div>
            {newsError && <p className="text-red-500">{newsError}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {news.map(n => (
                <NewsCard key={n.id} news={n} onEdit={handleEditNews} onDelete={handleDeleteNews} />
              ))}
            </div>
          </AdminCard>
        )}

        {activeTab === 2 && (
          <AdminCard title="Gestión de Usuarios">
            <div className="flex items-center justify-between mb-3">
              <input
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Buscar por email o nombre…"
                className="input w-full sm:w-auto"
              />
            </div>
            {usersError && <p className="text-red-500">{usersError}</p>}
            {usersLoading ? (
              <div className="py-12 text-center text-muted">Cargando usuarios…</div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-12 text-center text-muted">
                No hay usuarios que coincidan.
              </div>
            ) : (
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-text font-semibold border-b border-slate-200">
                      <th className="py-2 text-left">Nombre</th>
                      <th className="py-2 text-left">Email</th>
                      <th className="text-left">Rol</th>
                      <th className="text-left">Activo</th>
                      <th className="text-left">Última Actividad</th>
                      <th className="text-left">Creado</th>
                      <th className="text-left">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr
                        key={u.id || u.email}
                        className="border-b border-slate-100 hover:bg-leaf/10"
                      >
                        <td className="py-2 text-text">{u.display_name}</td>
                        <td className="py-2">
                          <button className="text-primary hover:underline" onClick={() => setUserFilter(u.email)}>
                            {u.email}
                          </button>
                        </td>
                        <td>
                          <select
                            className="input input-sm bg-card border border-slate-200 text-text"
                            defaultValue={u.role || "user"}
                            onChange={async (e) => {
                              await setUserRoleUnified(u.email, e.target.value, token);
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
                          <input
                            type="checkbox"
                            className="toggle toggle-sm"
                            checked={u.is_active}
                            onChange={async (e) => {
                              await toggleUserActiveUnified(u.email, e.target.checked, token);
                              setUsers((prev) =>
                                prev.map((p) =>
                                  p.email === u.email
                                    ? { ...p, is_active: e.target.checked }
                                    : p
                                )
                              );
                            }}
                          />
                        </td>
                        <td className="text-text">{formatDateSafe(u.last_activity_at)}</td>
                        <td className="text-text">{formatDateSafe(u.created_at)}</td>
                        <td>
                          <button
                            className="px-3 py-1.5 rounded-full bg-card border border-slate-200 text-text hover:bg-bg"
                            onClick={() => {
                            setSelectedUserEmail(u.email);
                            setIsActivityLogModalOpen(true);
                          }}
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
          </AdminCard>
        )}

        {activeTab === 3 && (
          <AdminCard title="Registro de Actividad">
            <div className="flex items-center justify-between mb-3">
              <input
                value={userFilter || ""}
                onChange={(e) => setUserFilter(e.target.value || null)}
                placeholder="Filtrar por email…"
                className="input w-full sm:w-auto"
              />
              {userFilter && (
                <button className="px-3 py-1.5 rounded-full bg-card border border-slate-200 text-text hover:bg-bg" onClick={() => setUserFilter(null)}>
                  Quitar filtro
                </button>
              )}
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
                    <tr className="text-text font-semibold border-b border-slate-200">
                      <th className="py-2 text-left">Usuario</th>
                      <th className="text-left">Acción</th>
                      <th className="text-left">Detalles</th>
                      <th className="text-left">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logsByUser.map((l) => (
                      <tr key={l.id} className="border-b border-slate-100 hover:bg-leaf/10">
                        <td className="py-2 text-text">{l.display_name || l.user}</td>
                        <td>
                          <span className={actionBadge(l.action)}>
                            <span className="mr-1">{actionIcon(l.action)}</span>
                            {l.action}
                          </span>
                        </td>
                        <td className="max-w-[200px] truncate text-text">
                          {renderDetails(l.details)}
                        </td>
                        <td className="text-text">{formatDateSafe(l.iso)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </AdminCard>
        )}

        {activeTab === 4 && (
          <AdminCard title="Solicitudes de Proyectos">
            <div className="overflow-auto">
              <AdminTable rows={projectRequests.map(req => ({
                name: req.nombre,
                desc: req.descripcion,
                user: req.usuario_id, // Assuming usuario_id is enough for now
                status: req.estado,
                id: req.id
              }))} />
            </div>
          </AdminCard>
        )}

        {/* Modals */}
        <Modal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} title={editingProject ? 'Editar Proyecto' : 'Añadir Nuevo Proyecto'}>
          <ProjectForm 
            project={editingProject} 
            onSubmit={handleSaveProject} 
            onCancel={() => setIsProjectModalOpen(false)} 
          />
        </Modal>

        <Modal isOpen={isNewsModalOpen} onClose={() => setIsNewsModalOpen(false)} title={editingNews ? 'Editar Noticia' : 'Añadir Nueva Noticia'}>
          <NewsForm 
            news={editingNews} 
            onSubmit={handleSaveNews} 
            onCancel={() => setIsNewsModalOpen(false)} 
          />
        </Modal>

        <ActivityLogModal 
          isOpen={isActivityLogModalOpen}
          onClose={() => setIsActivityLogModalOpen(false)}
          logs={logs}
          userEmail={selectedUserEmail}
        />

        <Modal isOpen={isViewRequestModalOpen} onClose={() => setIsViewRequestModalOpen(false)} title="Detalles de Solicitud de Proyecto">
          {viewingRequest && (
            <div className="space-y-6 text-text">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-card">
                <div>
                  <p className="font-semibold text-text mb-1">Nombre del Proyecto:</p>
                  <p>{viewingRequest.nombre}</p>
                </div>
                <div>
                  <p className="font-semibold text-text mb-1">Categoría:</p>
                  <p>{viewingRequest.categoria}</p>
                </div>
                <div>
                  <p className="font-semibold text-text mb-1">Semestre:</p>
                  <p>{viewingRequest.semestre || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-semibold text-text mb-1">Estado:</p>
                  <span className={`badge ${viewingRequest.estado === 'pendiente' ? 'badge-warning' : viewingRequest.estado === 'aprobado' ? 'badge-success' : 'badge-error'}`}>{viewingRequest.estado}</span>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-card">
                <p className="font-semibold text-text mb-1">Descripción:</p>
                <p className="whitespace-pre-wrap">{viewingRequest.descripcion || 'Sin descripción'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-card">
                <div>
                  <p className="font-semibold text-text mb-1">URL de GitHub:</p>
                  <p>{viewingRequest.githubUrl ? <a href={viewingRequest.githubUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{viewingRequest.githubUrl}</a> : 'N/A'}</p>
                </div>
                <div>
                  <p className="font-semibold text-text mb-1">URL del Sitio Web:</p>
                  <p>{viewingRequest.websiteUrl ? <a href={viewingRequest.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{viewingRequest.websiteUrl}</a> : 'N/A'}</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-card">
                <p className="font-semibold text-text mb-1">Participantes:</p>
                <p>{viewingRequest.participantes || 'N/A'}</p>
              </div>

              <div className="p-4 border rounded-lg bg-card">
                <p className="font-semibold text-text mb-1">Tecnologías:</p>
                <p>{viewingRequest.tecnologias || 'N/A'}</p>
              </div>

              <div className="p-4 border rounded-lg bg-card">
                <p className="font-semibold text-text mb-1">Solicitado por Usuario ID:</p>
                <p>{viewingRequest.usuario_id}</p>
              </div>

              {viewingRequest.imagenUrl && (
                <div className="p-4 border rounded-lg bg-card">
                  <p className="font-semibold text-text mb-1">Imagen Principal:</p>
                  <img src={`http://localhost:3001${viewingRequest.imagenUrl}`} alt="Imagen Principal" className="w-full h-48 object-cover rounded-lg mt-2 border border-slate-200" />
                </div>
              )}
              {viewingRequest.gallery && viewingRequest.gallery.length > 0 && (
                <div className="p-4 border rounded-lg bg-card">
                  <p className="font-semibold text-text mb-1">Imágenes de Galería:</p>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                    {viewingRequest.gallery.map((img, index) => (
                      <div key={index} className="w-full h-24 overflow-hidden rounded-lg border border-slate-200">
                        <img src={`http://localhost:3001${img.imagenUrl}`} alt={`Galería ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="mt-6 flex justify-end">
            <button className="bg-card text-text border border-slate-200 hover:bg-bg px-4 py-2 rounded-full font-semibold" onClick={() => setIsViewRequestModalOpen(false)}>Volver</button>
          </div>
        </Modal>
      </div>
    </main>
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

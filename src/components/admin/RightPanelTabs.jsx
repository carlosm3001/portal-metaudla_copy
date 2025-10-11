import React from 'react';

export default function RightPanelTabs({ auditLogs = [], users = [], onDeleteUser }) {
  const [tab, setTab] = React.useState("activity");
  const Tab = ({ id, children }) => (
    <button
      type="button"
      onClick={() => setTab(id)}
      className={`px-3 py-2 text-sm font-semibold rounded-xl border transition ${
        tab === id ? "bg-white text-ink border-border shadow-sm" : "bg-transparent text-ink/70 border-transparent hover:bg-white/60"
      }`}
      aria-pressed={tab===id}
    >{children}</button>
  );

  return (
    <section className="card p-4 md:p-6 lg:h-[calc(100dvh-140px)] flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Tab id="activity">Registro de Actividad</Tab>
        <Tab id="users">Gestión de Usuarios</Tab>
      </div>
      <div className="flex-1 min-h-0">
        {tab === "activity" ? (
          <div className="overflow-hidden rounded-xl border border-border h-full">
            <div className="h-full overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="sticky top-0 bg-white/92 backdrop-blur text-muted">
                  <tr className="[&>th]:text-left [&>th]:py-2 [&>th]:px-3">
                    <th>Usuario</th><th>Acción</th><th>Detalles</th><th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((l,i)=>(
                    <tr key={i} className="bg-white/80 hover:bg-brand-50 border-b border-border">
                      <td className="p-3 whitespace-nowrap">{l.usuario_email}</td>
                      <td className="p-3"><span className="pill pill-sm">{l.accion}</span></td>
                      <td className="p-3 truncate max-w-[280px]" title={l.detalles}>{l.detalles}</td>
                      <td className="p-3 text-muted whitespace-nowrap">{new Date(l.fecha).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border h-full">
            <div className="h-full overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="sticky top-0 bg-white/92 text-muted">
                  <tr className="[&>th]:text-left [&>th]:py-2 [&>th]:px-3">
                    <th>ID</th><th>Correo</th><th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u=>(
                    <tr key={u.id} className="bg-white/80 border-b border-border">
                      <td className="p-3">{u.id}</td>
                      <td className="p-3">{u.email}</td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-2">
                          <button className="btn btn-ghost btn-xs">Ver</button>
                          <button className="btn btn-primary btn-xs">Editar</button>
                          <button onClick={() => onDeleteUser(u.id)} className="btn btn-danger btn-xs">Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
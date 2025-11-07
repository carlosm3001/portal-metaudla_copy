function Badge({ status }) {
  const map = {
    Aprobado:   "bg-emerald-100 text-emerald-800",
    "En revisión":"bg-amber-100 text-amber-800",
    Rechazado:  "bg-rose-100 text-rose-800",
  };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${map[status]||"bg-slate-100 text-slate-700"}`}>{status}</span>;
}

export default function AdminTable({ rows=[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-emerald-50 text-slate-800">
          <tr>
            {["Nombre","Descripción","Usuario","Estado","Acciones"].map(h=>(
              <th key={h} className="text-left font-semibold px-4 py-3">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-12">
                <div className="text-center text-slate-500">
                  <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 grid place-items-center mb-2">
                    🌿
                  </div>
                  No hay solicitudes por ahora. 
                  <div className="mt-2">
                    <a href="/solicitar" className="text-emerald-700 font-semibold hover:underline">Crear nuevo proyecto</a>
                  </div>
                </div>
              </td>
            </tr>
          ) : rows.map((r,idx)=>(
            <tr key={idx} className="even:bg-slate-50/40">
              <td className="px-4 py-3 font-medium text-slate-900">{r.name}</td>
              <td className="px-4 py-3 text-slate-700">{r.desc}</td>
              <td className="px-4 py-3 text-slate-700">{r.user}</td>
              <td className="px-4 py-3"><Badge status={r.status}/></td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:bg-slate-50">Ver</button>
                  <button className="px-3 py-1.5 rounded-full bg-emerald-600 text-white hover:brightness-110">Aprobar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

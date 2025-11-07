const items = [
  "Gestión de Proyectos","Gestión de Noticias","Gestión de Usuarios","Registro de Actividad","Solicitudes de Proyectos"
];

export default function AdminTabs({ active=0, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {items.map((t,i)=>(
        <button
          key={t}
          onClick={()=>onChange?.(i)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition
          ${i===active
            ? "bg-[var(--udla-primary)] text-white shadow"
            : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
          } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

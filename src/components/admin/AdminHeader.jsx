import "../../styles/admin-theme.css";

export default function AdminHeader({ title="Panel de Administración", subtitle="Gestión de proyectos, usuarios y auditoría del portal.", ctaLabel="+ Añadir proyecto", onCta }) {
  return (
    <section className="udla-hero rounded-3xl border border-slate-200 shadow-sm px-6 md:px-8 py-6 mb-5 bg-white/60">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">{title}</h1>
          <p className="text-slate-600">{subtitle}</p>
        </div>
        {onCta && (
          <button
            onClick={onCta}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--udla-primary)] text-white font-semibold shadow hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            {ctaLabel}
          </button>
        )}
      </div>
    </section>
  );
}

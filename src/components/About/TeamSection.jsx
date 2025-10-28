const TEAM = [
  {
    id: 4,
    name: "Carlos Mario Villegas Artunduaga",
    role: "Creador de la web",
    email: "carlos.villegas@udla.edu.co",
    bio: "Estudiante de la Universidad de la Amazonia, 8 semestre."
  },
  {
    id: 5,
    name: "Ingeniero Eduardo Millan Rojas",
    role: "Ingeniero revisor, supervisor y colaborador del proyecto",
    email: "eduardo.millan@udla.edu.co",
    bio: ""
  },
  {
    id: 6,
    name: "Docente Fredy Antonio Verástegui González",
    role: "Docente de apoyo",
    email: "fredy.verastegui@udla.edu.co", // Placeholder email
    bio: ""
  },
];

export default function TeamSection() {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-extrabold text-ink">Equipo de expertos</h2>
      <p className="text-muted mt-1">Conoce a los administradores que mantienen Meta-Uniamazonia.</p>

      <div className="grid gap-5 mt-6" style={{ gridTemplateColumns: "repeat(3, minmax(260px, 1fr))" }}>
        {TEAM.map(m => (
          <article key={m.id} className="team-card2 card p-6 flex flex-col gap-5 overflow-hidden">
            <div className="flex items-start gap-5">
              {/* Avatar XL redondo */}
              {m.photo ? (
                <img src={m.photo} alt={m.name} className="w-24 h-24 rounded-full object-cover ring-2 ring-white shadow-[0_0_0_1px_var(--border)]" loading="lazy" />
              ) : (
                <div className="w-24 h-24 rounded-full grid place-items-center bg-[rgba(108,138,228,.15)] ring-2 ring-white shadow-[0_0_0_1px_var(--border)] text-ink/60">
                  <span>Foto</span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-xl font-bold text-ink leading-6">{m.name}</h3>
                  <span className="badge-admin">Admin</span>
                </div>
                <p className="text-[15px] text-ink/80 font-semibold mt-1">{m.role}</p>
                <p className="text-sm text-muted mt-2 leading-6">{m.bio}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
              <a href={`mailto:${m.email}`} className="chip-link inline-flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 8l8 5 8-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.8"/></svg>
                {m.email}
              </a>

              <div className="flex items-center gap-2">
                {!!m.github && <a className="icon-btn2" href={m.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.85 9.7.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.2-3.37-1.2-.46-1.2-1.12-1.52-1.12-1.52-.92-.64.07-.63.07-.63 1.02.07 1.56 1.07 1.56 1.07.9 1.58 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.37-2.22-.26-4.56-1.13-4.56-5 0-1.11.39-2.01 1.03-2.72-.1-.26-.45-1.3.09-2.7 0 0 .84-.27 2.75 1.03.8-.23 1.65-.35 2.5-.35s1.7.12 2.5.35c1.91-1.3 2.75-1.03 2.75-1.03.54 1.4.19 2.44.09 2.7.64.71 1.03 1.61 1.03 2.72 0 3.88-2.35 4.73-4.59 4.98.36.32.68.94.68 1.91 0 1.38-.01 2.49-.01 2.83 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.26C22 6.58 17.52 2 12 2z"/></svg>
                </a>}
                {!!m.linkedin && <a className="icon-btn2" href={m.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6.94 8.5v10.5H3.9V8.5h3.04ZM5.42 3.75a1.77 1.77 0 1 0 0 3.54 1.77 1.77 0 0 0 0-3.54ZM20.1 19H17.06v-5.62c0-1.34-.48-2.25-1.67-2.25-.91 0-1.45.62-1.69 1.22-.09.22-.11.53-.11.84V19H10.55V8.5h3.04v1.45c.44-.67 1.13-1.62 2.75-1.62 2 0 3.76 1.3 3.76 4.09V19Z"/></svg>
                </a>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
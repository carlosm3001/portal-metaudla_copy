export default function Footer() {
  return (
    <footer className="border-t border-border bg-white/70 backdrop-blur">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="text-lg font-extrabold text-ink">Meta-Uniamazonia</div>
            <p className="text-sm text-muted mt-1">
              Plataforma de proyectos de la Universidad de la Amazonia.
            </p>
          </div>

          {/* Enlaces secundarios (NO la navegación principal) */}
          <nav aria-label="Enlaces del pie" className="flex flex-wrap gap-3">
            <a href="/nosotros" className="text-muted hover:text-ink focus-visible:outline-[var(--focus)]">
              Sobre la plataforma
            </a>
            <a href="/projects" className="text-muted hover:text-ink focus-visible:outline-[var(--focus)]">
              Explorar proyectos
            </a>
            <a href="/login" className="text-muted hover:text-ink focus-visible:outline-[var(--focus)]">
              Ingresar
            </a>
            <a href="/register" className="text-muted hover:text-ink focus-visible:outline-[var(--focus)]">
              Crear cuenta
            </a>
          </nav>
        </div>

        <div className="mt-6 text-xs text-muted">
          © {new Date().getFullYear()} Meta-Uniamazonia. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
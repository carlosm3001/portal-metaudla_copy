export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-card/70 backdrop-blur">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="text-lg font-extrabold text-text">ExploraUDLA</div>
            <p className="text-sm text-muted mt-1">
              Plataforma de proyectos de la Universidad de la Amazonia.
            </p>
          </div>

          {/* Enlaces secundarios (NO la navegación principal) */}
          <nav aria-label="Enlaces del pie" className="flex flex-wrap gap-3">
            <a href="/nosotros" className="text-muted hover:text-text focus-visible:outline-primary">
              Sobre la plataforma
            </a>
            <a href="/projects" className="text-muted hover:text-text focus-visible:outline-primary">
              Explorar proyectos
            </a>
            <a href="/login" className="text-muted hover:text-text focus-visible:outline-primary">
              Ingresar
            </a>
            <a href="/register" className="text-muted hover:text-text focus-visible:outline-primary">
              Crear cuenta
            </a>
          </nav>
        </div>

        <div className="mt-6 text-xs text-muted">
          © {new Date().getFullYear()} ExploraUDLA. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}

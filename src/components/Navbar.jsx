import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { isLoggedIn, userRole, handleLogout } = useAuth();

  return (
    <header className="w-full bg-white/70 backdrop-blur border-b border-border">
      <nav className="container mx-auto max-w-[1200px] px-6 h-14 flex items-center justify-between">
        {/* Marca */}
        <Link to="/" className="font-extrabold text-ink">Meta-Uniamazonia</Link>

        {/* Menú */}
        <ul className="flex items-center gap-5 text-sm font-semibold">
          <li><NavLink to="/" end className={navClass}>Inicio</NavLink></li>
          <li><NavLink to="/projects" className={navClass}>Proyectos</NavLink></li>
          <li><NavLink to="/nosotros" className={navClass}>Nosotros</NavLink></li>
          <li><NavLink to="/foro" className={navClass}>Foro</NavLink></li>
          <li><NavLink to="/blog" className={navClass}>Blog</NavLink></li>
          <li><NavLink to="/news" className={navClass}>Noticias</NavLink></li>
          {isLoggedIn && (
            <li><NavLink to="/request-project" className={navClass}>Solicitar Proyecto</NavLink></li>
          )}
          {isLoggedIn && userRole === 'admin' && (
            <li><NavLink to="/admin" className={navClass}>Administración</NavLink></li>
          )}
        </ul>

        {/* Acciones */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <button onClick={handleLogout} className="btn btn-ghost">Salir</button>
          ) : (
            <>
              <NavLink to="/login" className="btn btn-ghost">Ingresar</NavLink>
              <NavLink to="/register" className="btn btn-primary">Crear cuenta</NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

function navClass({ isActive }) {
  return [
    "px-2 py-1 rounded-lg transition",
    isActive ? "text-ink bg-brand-50 border border-border"
             : "text-ink/70 hover:text-ink"
  ].join(" ");
}
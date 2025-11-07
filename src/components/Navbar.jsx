import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GitHubButtonMini from "./GitHubButtonMini";
import NavItemGlow from "./NavItemGlow";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
  const { isLoggedIn, userRole, handleLogout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/75 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-slate-200 shadow-[0_1px_12px_rgba(0,0,0,.04)]">
      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Marca */}
        <div className="flex items-center gap-3">
          <Link to="/" className="font-extrabold text-text">ExploraUDLA</Link>
          <GitHubButtonMini />
        </div>

        {/* Menú */}
        <ul className="hidden md:flex items-center gap-1.5">
          <li><NavItemGlow to="/" exact>Inicio</NavItemGlow></li>
          <li><NavItemGlow to="/projects">Proyectos</NavItemGlow></li>
          <li><NavItemGlow to="/nosotros">Nosotros</NavItemGlow></li>
          <li><NavItemGlow to="/foro">Foro</NavItemGlow></li>
          <li><NavItemGlow to="/blog">Blog</NavItemGlow></li>
          <li><NavItemGlow to="/news">Noticias</NavItemGlow></li>
          {isLoggedIn && (
            <>
              <li><NavItemGlow to="/request-project" className="bg-primary text-white">Solicitar Proyecto</NavItemGlow></li>
              <li><NavItemGlow to="/profile">Mi Perfil</NavItemGlow></li>
            </>
          )}
          {isLoggedIn && userRole === 'admin' && (
            <li><NavItemGlow to="/admin">Administración</NavItemGlow></li>
          )}
        </ul>

        {/* Acciones */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <LogoutButton onSignOut={handleLogout} />
          ) : (
            <>
              <Link to="/login" className="bg-card text-text border border-slate-200 hover:bg-slate-100 px-4 py-2 rounded-full font-semibold">Ingresar</Link>
              <Link to="/register" className="bg-primary text-white hover:bg-primary-dark px-4 py-2 rounded-full font-semibold">Crear cuenta</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
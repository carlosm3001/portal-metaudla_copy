import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import "../styles/logout-anim.css";

function ExitIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M10 3a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0V5H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2v-2a1 1 0 0 1 2 0v3a1 1 0 0 1-1 1H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4h3z"/>
      <path d="M14.293 7.293a1 1 0 0 1 1.414 0L20 11.586a2 2 0 0 1 0 2.828l-4.293 4.293a1 1 0 1 1-1.414-1.414L17.586 14H10a1 1 0 1 1 0-2h7.586l-3.293-3.293a1 1 0 0 1 0-1.414z"/>
    </svg>
  );
}

/**
 * Props:
 * - onSignOut: async () => void  (acción real de logout)
 * - size?: "md" | "lg"
 */
export default function LogoutButton({ onSignOut, size = "md", className = "" }) {
  const [open, setOpen] = useState(false);
  const [shaking, setShaking] = useState(false);

  const sizes = {
    md: "h-11 px-5 text-sm",
    lg: "h-12 px-6 text-base"
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setShaking(true);
          setTimeout(() => setShaking(false), 430);
          setOpen(true);
        }}
        className={`btn-logout inline-flex items-center gap-3 rounded-full border border-slate-200
                    bg-card text-text shadow-sm transition-all duration-200
                    hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf
                    dark:bg-card dark:text-text dark:border-muted/20 ${sizes[size]} ${className} ${shaking ? "btn-shake" : ""}`}
        aria-haspopup="dialog"
        aria-controls="logout-modal"
      >
        <span className="font-semibold">Cerrar sesión</span>
        <ExitIcon className="btn-logout__icon w-5 h-5" />
      </button>

      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={async () => {
          setOpen(false);
          await onSignOut?.(); // aquí ejecutas la lógica real de logout
        }}
        title="¿Cerrar sesión?"
        message="Confirmá que deseas salir de tu cuenta."
        confirmText="Sí, salir"
        cancelText="Cancelar"
      />
    </>
  );
}
import { useEffect, useRef } from "react";

export default function ConfirmModal({
  open, title="¿Cerrar sesión?", message="Confirmá que deseas salir de tu cuenta.",
  confirmText="Sí, salir", cancelText="Cancelar",
  onClose, onConfirm
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden"; // scroll-lock
    dialogRef.current?.focus();
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onEsc);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onEsc);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm animate-fadeIn" onClick={onClose} />
      <div
        role="dialog" aria-modal="true" aria-labelledby="logout-title"
        tabIndex={-1} ref={dialogRef}
        className="relative w-full max-w-sm rounded-2xl border border-slate-200 bg-white shadow-xl p-5
                   animate-scaleIn focus:outline-none"
      >
        <h3 id="logout-title" className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="mt-1 text-slate-600">{message}</p>
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <button
            onClick={onConfirm}
            className="inline-flex justify-center items-center gap-2 px-4 py-2 rounded-full
                       bg-emerald-700 text-white font-semibold hover:brightness-110
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400">
            Sí, salir
          </button>
          <button
            onClick={onClose}
            className="inline-flex justify-center items-center px-4 py-2 rounded-full
                       border border-slate-300 text-slate-700 bg-white hover:bg-slate-50">
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}

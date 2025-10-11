import React, { useEffect, useRef } from "react";

/**
 * Modal estilizado con overlay.
 * Compatibilidad:
 * - props: isOpen | open, onClose, title, children, actions (opcional)
 */
export default function Modal({
  isOpen,
  open,
  onClose,
  title,
  children,
  actions,
}) {
  const visible = typeof isOpen !== "undefined" ? isOpen : open;
  const cardRef = useRef(null);

  // Cerrar con ESC y bloquear scroll del body
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && visible) onClose?.();
    };
    if (visible) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [visible, onClose]);

  // Cerrar al hacer click fuera
  const onBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onBackdropClick}
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm modal-backdrop" />
      <div
        ref={cardRef}
        className="modal-surface w-full md:max-w-3xl rounded-2xl bg-white/95 shadow-xl border border-border transform transition-all max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Evita que el click se propague al backdrop
      >
        {children}
      </div>
    </div>
  );
}

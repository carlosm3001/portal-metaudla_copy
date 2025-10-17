// Capa unificada: intenta Supabase y si falla usa localStorage
import { supabase } from "@/lib/supabase";
import { getActivities as listLocal } from "@/services/activityLog.dev";

export async function listLogsUnified(limit = 100) {
  try {
    const { data, error } = await supabase
      .from("activity_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []).map(normalizeLog);
  } catch {
    const local = listLocal(limit) || [];
    return local.map(normalizeLog);
  }
}

function normalizeLog(raw) {
  const user =
    raw.user_email || raw.user || raw?.user?.email || "anónimo";

  const action = raw.action || "-";

  // details puede ser texto, objeto o null; intentamos parsear si es string JSON
  let details = raw.details ?? "";
  if (typeof details === "string") {
    try { details = JSON.parse(details); } catch { /* queda string */ }
  }

  // Fecha: created_at (supabase) o date (local)
  const iso =
    raw.created_at ||
    raw.date ||
    raw.createdAt ||
    null;

  return {
    id: raw.id || crypto.randomUUID(),
    user,
    action,
    details,
    iso,
    display_name: raw.usuarios?.display_name
  };
}

// Formateo de fecha tolerante a múltiples formatos (ISO, timestamps, locales)
export function formatDateSafe(iso) {
  if (!iso) return "—";
  
  let d;

  if (iso instanceof Date) {
    d = iso;
  } else if (typeof iso === "number") {
    d = new Date(iso);
  } else if (typeof iso === "string") {
    const normalized = iso
      .replace(" ", "T")
      .replace(/\//g, "-")
      .replace(",", "")
      .trim();

    d = new Date(normalized);

    if (isNaN(d.getTime())) {
      const parts = iso.match(/(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})/);
      if (parts) {
        const [_, day, month, year] = parts;
        d = new Date(`${year}-${month}-${day}`);
      }
    }
  }

  if (isNaN(d.getTime())) return "—";

  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

// Badge visual según tipo de acción
export function actionBadge(action) {
  const base = "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs";
  const map = {
    acceso:        `${base} bg-blue-100 text-blue-700`,
    cerrar_sesión: `${base} bg-slate-100 text-slate-700`,
    registro:      `${base} bg-emerald-100 text-emerald-700`,
    crear_cuenta:  `${base} bg-emerald-100 text-emerald-700`,

    crear_tema:       `${base} bg-indigo-100 text-indigo-700`,
    responder_tema:   `${base} bg-violet-100 text-violet-700`,

    crear_proyecto:      `${base} bg-teal-100 text-teal-700`,
    actualizar_proyecto: `${base} bg-amber-100 text-amber-700`,
    eliminar_proyecto:   `${base} bg-rose-100 text-rose-700`,
    votar_proyecto:      `${base} bg-sky-100 text-sky-700`,
    comentar_proyecto:   `${base} bg-fuchsia-100 text-fuchsia-700`,
  };
  return map[action] || `${base} bg-slate-100 text-slate-700`;
}

// Ícono simple (emoji) por tipo de acción; puede sustituirse por iconos reales
export function actionIcon(action) {
  const map = {
    acceso: "🔑",
    cerrar_sesión: "🚪",
    registro: "🆕",
    crear_cuenta: "🆕",

    crear_tema: "📝",
    responder_tema: "💬",

    crear_proyecto: "📦",
    actualizar_proyecto: "🛠️",
    eliminar_proyecto: "🗑️",
    votar_proyecto: "👍",
    comentar_proyecto: "💭",
  };
  return map[action] || "•";
}
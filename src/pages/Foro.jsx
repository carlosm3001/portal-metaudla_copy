import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThreadModal from "../components/forum/ThreadModal";
import * as api from "../services/api";
import { timeAgo } from '../utils/time';

const CATEGORIES = ["Anuncios","Colaboración","Dudas técnicas"];

export default function Foro(){
  const { user, isLoggedIn } = useAuth();
  const nav = useNavigate();
  const [sp, setSp] = useSearchParams();
  const cat = sp.get("cat") || "";
  const tab = sp.get("tab") || "all";
  const [open, setOpen] = useState(false);
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    const filters = {
      category: cat || undefined,
      onlyMine: tab === "mine",
      onlyRepliedBy: tab === "replied",
    };
    setThreads(api.listThreads(filters, user));
  }, [cat, tab, user]);

  const applyFilter = (k,v)=> {
    const next = new URLSearchParams(sp);
    if (v) next.set(k,v); else next.delete(k);
    setSp(next,{ replace:true });
  };

  const handleCreate = () => {
    if (!isLoggedIn) return nav("/login", { state:{ from: "/foro" }});
    setOpen(true);
  };

  const handleSubmitThread = ({ title, category, firstContent }) => {
    const t = api.createThread({ title, category, firstContent, user });
    setOpen(false);
    // Refresh threads list
    setThreads(api.listThreads({
      category: cat || undefined,
      onlyMine: tab === "mine",
      onlyRepliedBy: tab === "replied",
    }, user));
    nav(`/foro/hilo/${t.id}`);
  };

  return (
    <main className="container mx-auto max-w-[1200px] px-6 py-10">
      <h1 className="text-3xl font-extrabold text-ink mb-1">Foro</h1>
      <p className="text-muted mb-6">Interactúa con otros estudiantes: publica dudas, encuentra colaboradores y comparte avances.</p>

      <div className="grid gap-6" style={{ gridTemplateColumns: "320px 1fr" }}>
        {/* CATEGORÍAS */}
        <aside className="card p-4 h-fit">
          <h2 className="text-ink font-bold mb-3">Categorías</h2>
          <ul className="space-y-3">
            {CATEGORIES.map(c => (
              <li key={c}>
                <button
                  className={`w-full text-left p-3 rounded-xl border transition ${cat===c ? "bg-brand-50 border-ink/10" : "border-border hover:bg-brand-50"}`}
                  onClick={()=> applyFilter("cat", c)}
                >
                  <div className="text-ink font-semibold">{c}</div>
                  <div className="text-muted text-sm">
                    {c==="Anuncios" ? "Novedades del portal y eventos."
                     : c==="Colaboración" ? "Busca/ofrece compañeros para proyectos."
                     : "Frontend, backend, despliegues, etc."}
                  </div>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-4">
            <button className="btn btn-primary w-full" onClick={handleCreate}>Crear tema</button>
          </div>
        </aside>

        {/* HILOS */}
        <section className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-ink font-bold">Últimos hilos {cat && <span className="pill pill-sm ml-2">{cat}</span>}</h2>
            <div className="flex gap-2">
              <button className={`btn btn-ghost ${tab==="mine"&&"bg-brand-50"}`} onClick={()=>applyFilter("tab","mine")}>Mis hilos</button>
              <button className={`btn btn-ghost ${tab==="replied"&&"bg-brand-50"}`} onClick={()=>applyFilter("tab","replied")}>Mis respuestas</button>
              <button className="btn btn-ghost" onClick={()=>{applyFilter("tab",""); applyFilter("cat","");}}>Todos</button>
            </div>
          </div>

          <div className="divide-y divide-[var(--border)]">
            {threads.map(t => (
              <article key={t.id} className="py-3 flex items-center justify-between hover:bg-brand-50/50 rounded-lg px-2 cursor-pointer"
                       onClick={()=> nav(`/foro/hilo/${t.id}`)}>
                <div className="min-w-0">
                  <div className="font-semibold text-ink truncate">{t.title}</div>
                  <div className="text-sm text-muted">
                    En <span className="pill pill-sm">{t.category}</span> · por {t.authorName} · {timeAgo(t.lastActivityAt)}
                  </div>
                </div>
                <div className="text-sm text-ink/70">{t.replies} respuestas</div>
              </article>
            ))}
            {threads.length === 0 && <div className="py-8 text-center text-muted">No hay hilos para este filtro.</div>}
          </div>
        </section>
      </div>

      <ThreadModal open={open} onClose={()=>setOpen(false)} onSubmit={handleSubmitThread} />
    </main>
  );
}
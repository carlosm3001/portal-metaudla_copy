import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getThread, listPosts, replyThread } from "../../services/api";
import { useEffect, useState } from "react";
import { timeAgo } from "../../utils/time";

export default function ThreadPage(){
  const { id } = useParams();
  const { user, isLoggedIn } = useAuth();
  const nav = useNavigate();
  const [thread, setThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(()=> {
    const threadData = getThread(id);
    if (threadData) {
      setThread(threadData);
      setPosts(listPosts(id));
    } 
  }, [id]);

  const handleReply = (e) => {
    e.preventDefault();
    if (!isLoggedIn) return nav(`/login`, { state:{ from: `/foro/hilo/${id}` }});
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    try {
      replyThread({ threadId:id, content, user });
      setContent("");
      // Refresh posts and thread data to show the new reply and updated counts
      setPosts(listPosts(id));
      setThread(getThread(id));
    } catch (error) {
      console.error("Failed to reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!thread) return <main className="container mx-auto max-w-[900px] px-6 py-10">Hilo no encontrado.</main>;

  return (
    <main className="container mx-auto max-w-[900px] px-6 py-10">
      <header className="mb-4">
        <div className="pill pill-sm inline-block mb-2">{thread.category}</div>
        <h1 className="text-2xl font-extrabold text-ink">{thread.title}</h1>
        <p className="text-muted text-sm">por {thread.authorName} · {new Date(thread.createdAt).toLocaleString()}</p>
      </header>

      <section className="card p-4 mb-6">
        <h2 className="text-ink font-bold mb-3">{posts.length} mensajes</h2>
        <div className="space-y-4">
          {posts.map(p=>(
            <article key={p.id} className="p-3 rounded-xl border border-border">
              <div className="text-sm text-muted mb-1">por <span className="font-semibold text-ink">{p.authorName}</span> · {timeAgo(p.createdAt)}</div>
              <p className="text-ink whitespace-pre-wrap">{p.content}</p>
            </article>
          ))}
          {posts.length===0 && <div className="text-muted">Aún no hay respuestas.</div>}
        </div>
      </section>

      <section className="card p-4">
        <h3 className="text-ink font-bold mb-2">Responder</h3>
        {!isLoggedIn && <div className="text-muted mb-2">Debes <Link to={`/login?redirect=/foro/hilo/${id}`} className="font-bold text-brand hover:underline">iniciar sesión</Link> para responder.</div>}
        <form onSubmit={handleReply} className="space-y-3">
          <textarea 
            className="w-full border border-border rounded-lg px-3 py-2 h-28"
            value={content} 
            onChange={e=>setContent(e.target.value)} 
            placeholder="Escribe tu respuesta..." 
            disabled={!isLoggedIn}
          />
          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary" disabled={!isLoggedIn || isSubmitting}>
              {isSubmitting ? 'Publicando...' : 'Publicar respuesta'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
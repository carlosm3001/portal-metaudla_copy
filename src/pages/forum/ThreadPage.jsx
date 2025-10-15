import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getThread, replyThread } from "../../services/api";
import { useEffect, useState } from "react";
import { timeAgo } from "../../utils/time";

export default function ThreadPage(){
  const { id } = useParams();
  const { user, isLoggedIn, token } = useAuth();
  const nav = useNavigate();
  const [thread, setThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(()=> {
    const fetchThreadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getThread(id);
        setThread(data.thread);
        setPosts(data.posts);
      } catch (err) {
        setError('No se pudo cargar el hilo del foro.');
        console.error('Error fetching thread:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchThreadData();
  }, [id]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) return nav(`/login`, { state:{ from: `/foro/hilo/${id}` }});
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    try {
      await replyThread(id, { content, user, token });
      setContent("");
      // Refresh posts and thread data to show the new reply and updated counts
      const data = await getThread(id);
      setThread(data.thread);
      setPosts(data.posts);
    } catch (error) {
      setError(error.message || 'Error al publicar la respuesta.');
      console.error("Failed to reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="container mx-auto max-w-[900px] px-6 py-10">
        <div className="bg-white rounded-lg shadow-md p-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto max-w-[900px] px-6 py-10">
        <div className="card bg-danger/10 text-danger text-center p-6">{error}</div>
      </main>
    );
  }

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
            disabled={!isLoggedIn || isSubmitting}
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
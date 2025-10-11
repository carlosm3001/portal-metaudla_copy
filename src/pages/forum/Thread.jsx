import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import * as api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

function Post({ post }) {
  return (
    <article className="p-4 border-b border-border last:border-b-0">
      <div className="flex items-start gap-4">
        {/* Simple avatar placeholder */}
        <div className="w-10 h-10 rounded-full bg-brand-50 flex-shrink-0 grid place-items-center font-bold text-brand">{post.authorName.charAt(0)}</div>
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <span className="font-bold text-ink">{post.authorName}</span>
            <span className="text-xs text-muted">{new Date(post.createdAt).toLocaleString()}</span>
          </div>
          <div className="prose prose-sm mt-2 text-ink max-w-none">
            {post.content}
          </div>
        </div>
      </div>
    </article>
  );
}

function ReplyForm({ threadId, onReplySuccess }) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const newPost = await api.replyThread({ threadId, content, user });
      onReplySuccess(newPost);
      setContent('');
    } catch (error) {
      console.error("Failed to post reply:", error);
      alert("No se pudo enviar la respuesta.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-border">
      <h3 className="font-bold text-lg mb-2">Escribe una respuesta</h3>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="input w-full min-h-[100px]"
        placeholder="Comparte tu opinión..."
        required
      />
      <div className="text-right mt-2">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Publicar Respuesta'}
        </button>
      </div>
    </form>
  );
}

export default function Thread() {
  const { id } = useParams();
  const [thread, setThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [threadData, postsData] = await Promise.all([
          api.getThread(id),
          api.listPosts(id),
        ]);
        setThread(threadData);
        setPosts(postsData);
      } catch (error) {
        console.error("Failed to fetch thread data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleReplySuccess = (newPost) => {
    setPosts(currentPosts => [...currentPosts, newPost]);
    // Also update the thread's reply count and last activity
    setThread(currentThread => ({
      ...currentThread,
      replies: currentThread.replies + 1,
      lastActivityAt: Date.now(),
    }));
  };

  if (loading) return <div className="container mx-auto max-w-[960px] px-4 md:px-6 py-10">Cargando hilo...</div>;
  if (!thread) return <div className="container mx-auto max-w-[960px] px-4 md:px-6 py-10">Hilo no encontrado.</div>;

  return (
    <main className="container mx-auto max-w-[960px] px-4 md:px-6 py-10">
      <header className="mb-6">
        <span className="pill pill-sm">{thread.category}</span>
        <h1 className="text-3xl font-extrabold text-ink mt-2">{thread.title}</h1>
        <p className="text-muted text-sm mt-1">
          Por {thread.authorName} · {new Date(thread.createdAt).toLocaleDateString()}
        </p>
      </header>

      <div className="card overflow-hidden">
        {posts.map(post => <Post key={post.id} post={post} />)}
      </div>

      {isLoggedIn ? (
        <div className="card mt-6">
          <ReplyForm threadId={id} onReplySuccess={handleReplySuccess} />
        </div>
      ) : (
        <div className="card mt-6 p-6 text-center">
          <p className="text-muted">Debes <Link to={`/login?redirect=/foro/hilo/${id}`} className="font-bold text-brand hover:underline">iniciar sesión</Link> para responder a este hilo.</p>
        </div>
      )}
    </main>
  );
}

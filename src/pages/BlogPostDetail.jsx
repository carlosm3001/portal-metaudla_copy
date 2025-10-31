import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function BlogPostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://meta-verso-carlos.b0falx.easypanel.host/api/blog/${id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError('No se pudo cargar la publicación del blog.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlogPost();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
      try {
        const response = await fetch(`https://meta-verso-carlos.b0falx.easypanel.host/api/blog/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Error al eliminar la publicación.');
        alert('Publicación eliminada exitosamente.');
        navigate('/blog');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const canManage = user && (user.id === post?.autor_id || user.rol === 'admin');

  if (loading) {
    return (
      <main className="container mx-auto max-w-[800px] px-4 md:px-6 py-10">
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
      <main className="container mx-auto max-w-[800px] px-4 md:px-6 py-10">
        <div className="card bg-danger/10 text-danger text-center p-6">{error}</div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="container mx-auto max-w-[800px] px-4 md:px-6 py-10">
        <div className="text-center py-16">
          <div className="text-7xl">🤔</div>
          <h3 className="text-lg font-semibold mt-2">Publicación no encontrada</h3>
          <p className="text-muted">Parece que esta publicación no existe o fue eliminada.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-[800px] px-4 md:px-6 py-10">
      <article className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-extrabold text-ink mb-3">{post.titulo}</h1>
            <p className="text-muted text-sm mb-6">
              Por <span className="font-medium">{post.autor_email}</span> el {new Date(post.creado_en).toLocaleDateString()}
              {post.tema && <span className="ml-2 px-2 py-1 bg-gray-100 rounded-full text-xs">{post.tema}</span>}
            </p>
          </div>
          {canManage && (
            <div className="flex gap-2">
              <Link to={`/blog/${id}/edit`} className="btn btn-sm btn-outline">Editar</Link>
              <button onClick={handleDelete} className="btn btn-sm btn-danger">Eliminar</button>
            </div>
          )}
        </div>
        <div className="prose prose-lg max-w-none">
          <p>{post.contenido}</p>
        </div>
      </article>
    </main>
  );
}

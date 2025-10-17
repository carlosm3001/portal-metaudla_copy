import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BlogPostCard from "../components/blog/BlogPostCard";
import { useAuth } from "../context/AuthContext";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/api/blog');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError('No se pudieron cargar las publicaciones del blog.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlogPosts();
  }, []);

  if (error) {
    return (
      <main className="container mx-auto max-w-[1200px] px-4 md:px-6 py-10">
        <div className="card bg-danger/10 text-danger text-center p-6">{error}</div>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-[1200px] px-4 md:px-6 py-10">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-ink">Blog Estudiantil</h1>
          <p className="text-muted">Explora experiencias, reflexiones y aprendizajes de la comunidad.</p>
        </div>
        {isLoggedIn && (
          <Link to="/blog/new" className="btn btn-primary">
            Crear Publicación
          </Link>
        )}
      </header>

      {loading ? (
        <section
          className="grid gap-5"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          ))}
        </section>
      ) : posts.length > 0 ? (
        <section
          className="grid gap-5"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
        >
          {posts.map(post => <BlogPostCard key={post.id} post={post} />)}
        </section>
      ) : (
        <div className="text-center py-16">
          <div className="text-7xl">📝</div>
          <h3 className="text-lg font-semibold mt-2">Aún no hay publicaciones en el blog</h3>
          <p className="text-muted">Sé el primero en compartir tu experiencia.</p>
        </div>
      )}
    </main>
  );
}

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function NewsDetail() {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsItem = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3001/api/news/${id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setNewsItem(data);
      } catch (err) {
        setError('No se pudo cargar la noticia.');
      } finally {
        setLoading(false);
      }
    };
    fetchNewsItem();
  }, [id]);

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

  if (!newsItem) {
    return (
      <main className="container mx-auto max-w-[800px] px-4 md:px-6 py-10">
        <div className="text-center py-16">
          <div className="text-7xl">🤔</div>
          <h3 className="text-lg font-semibold mt-2">Noticia no encontrada</h3>
          <p className="text-muted">Parece que esta noticia no existe o fue eliminada.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-[800px] px-4 md:px-6 py-10">
      <article className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-extrabold text-ink mb-3">{newsItem.titulo}</h1>
        <p className="text-muted text-sm mb-6">
          Por <span className="font-medium">{newsItem.autor_email}</span> el {new Date(newsItem.creado_en).toLocaleDateString()}
        </p>
        <div className="prose prose-lg max-w-none">
          <p>{newsItem.contenido}</p>
        </div>
      </article>
    </main>
  );
}

import { useEffect, useState } from "react";
import NewsCard from "../components/news/NewsCard";

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/api/news');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setNews(data);
      } catch (err) {
        setError('No se pudieron cargar las noticias.');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
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
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-ink">Noticias y Eventos</h1>
        <p className="text-muted">Mantente al día con las últimas novedades y eventos académicos.</p>
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
      ) : news.length > 0 ? (
        <section
          className="grid gap-5"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
        >
          {news.map(newsItem => <NewsCard key={newsItem.id} newsItem={newsItem} />)}
        </section>
      ) : (
        <div className="text-center py-16">
          <div className="text-7xl">📰</div>
          <h3 className="text-lg font-semibold mt-2">No hay noticias disponibles</h3>
          <p className="text-muted">Vuelve pronto para las últimas actualizaciones.</p>
        </div>
      )}
    </main>
  );
}

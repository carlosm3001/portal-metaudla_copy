import { Link } from "react-router-dom";

export default function NewsCard({ newsItem }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-ink mb-2">{newsItem.titulo}</h3>
        <p className="text-muted text-sm mb-4">
          Por <span className="font-medium">{newsItem.autor_email}</span> el {new Date(newsItem.creado_en).toLocaleDateString()}
        </p>
        <p className="text-ink/80 mb-4 line-clamp-3">{newsItem.contenido}</p>
        <Link to={`/news/${newsItem.id}`} className="text-brand hover:underline">
          Leer más
        </Link>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";

export default function BlogPostCard({ post }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-ink mb-2">{post.titulo}</h3>
        <p className="text-muted text-sm mb-4">
          Por <span className="font-medium">{post.autor_email}</span> el {new Date(post.creado_en).toLocaleDateString()}
          {post.tema && <span className="ml-2 px-2 py-1 bg-gray-100 rounded-full text-xs">{post.tema}</span>}
        </p>
        <p className="text-ink/80 mb-4 line-clamp-3">{post.contenido}</p>
        <Link to={`/blog/${post.id}`} className="text-brand hover:underline">
          Leer más
        </Link>
      </div>
    </div>
  );
}

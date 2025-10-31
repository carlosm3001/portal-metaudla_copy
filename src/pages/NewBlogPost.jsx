import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NewBlogPost() {
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [tema, setTema] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);



    try {
      const response = await fetch('https://meta-verso-carlos.b0falx.easypanel.host/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ titulo, contenido, tema }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la publicación.');
      }

      const result = await response.json();
      alert('Publicación creada exitosamente!');
      navigate(`/blog/${result.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto max-w-[800px] px-4 md:px-6 py-10">
      <h1 className="text-3xl font-extrabold text-ink mb-6">Crear Nueva Publicación de Blog</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
        {error && <div className="card bg-danger/10 text-danger p-4 mb-4">{error}</div>}
        <div className="mb-4">
          <label htmlFor="titulo" className="block text-ink text-sm font-bold mb-2">Título</label>
          <input
            type="text"
            id="titulo"
            className="input w-full"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="tema" className="block text-ink text-sm font-bold mb-2">Tema</label>
          <input
            type="text"
            id="tema"
            className="input w-full"
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="contenido" className="block text-ink text-sm font-bold mb-2">Contenido</label>
          <textarea
            id="contenido"
            className="textarea w-full h-48"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            required
            disabled={loading}
          ></textarea>
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? 'Creando...' : 'Publicar'}
        </button>
      </form>
    </main>
  );
}

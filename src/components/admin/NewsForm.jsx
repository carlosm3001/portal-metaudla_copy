import { useState, useEffect } from "react";

export default function NewsForm({ news, onSubmit, onCancel }) {
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");

  useEffect(() => {
    if (news) {
      setTitulo(news.titulo);
      setContenido(news.contenido);
    }
  }, [news]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (news) {
      formData.append("id", news.id);
    }
    formData.append("titulo", titulo);
    formData.append("contenido", contenido);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título</label>
        <input
          type="text"
          id="titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label htmlFor="contenido" className="block text-sm font-medium text-gray-700">Contenido</label>
        <textarea
          id="contenido"
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          rows={10}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        ></textarea>
      </div>
      <div className="flex justify-end gap-4">
        <button type="button" onClick={onCancel} className="btn btn-ghost">Cancelar</button>
        <button type="submit" className="btn btn-primary">Guardar</button>
      </div>
    </form>
  );
}

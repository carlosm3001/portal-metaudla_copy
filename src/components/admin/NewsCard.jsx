export default function NewsCard({ news, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <h3 className="text-lg font-semibold">{news.titulo}</h3>
        <p className="text-sm text-gray-600 truncate">{news.contenido}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={() => onEdit(news)} className="btn btn-sm btn-outline">Editar</button>
          <button onClick={() => onDelete(news.id)} className="btn btn-sm btn-danger">Eliminar</button>
        </div>
      </div>
    </div>
  );
}

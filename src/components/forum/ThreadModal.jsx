import React, { useState } from 'react';
import Modal from '../Modal'; // Assuming Modal is in ../components/Modal

const CATEGORIES = ["Anuncios", "Colaboración", "Dudas técnicas"];

export default function ThreadModal({ open, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("El título y el contenido son obligatorios.");
      return;
    }
    onSubmit({ title, category, firstContent: content });
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Crear un nuevo tema">
      <div className="p-1">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-ink mb-1">Título</label>
            <input className="w-full border border-border rounded-lg px-3 py-2" 
                   value={title} onChange={e => setTitle(e.target.value)} placeholder="¿Sobre qué quieres hablar?" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink mb-1">Categoría</label>
            <select className="w-full border border-border rounded-lg px-3 py-2 bg-white" 
                    value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink mb-1">Contenido</label>
            <textarea className="w-full border border-border rounded-lg px-3 py-2 h-32" 
                      value={content} onChange={e => setContent(e.target.value)} placeholder="Describe tu idea o pregunta..." />
          </div>
          <div className="flex justify-end gap-2 mt-5">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary" type="submit">Publicar</button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
import React from 'react';
import { Mail, Linkedin, Github } from 'lucide-react';

export default function TeamCard({ photo, name, role, bio, email, tags=[] }) {
  return (
    <article className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all p-5 md:p-6 min-h-[420px]">
      {/* Contenido superior */}
      <div className="flex flex-col items-center text-center flex-1">
        <img
          src={photo}
          alt={`Foto de ${name}`}
          loading="lazy"
          width="128"
          height="128"
          className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover ring-2 ring-white shadow mb-3"
        />
        <h3 className="text-lg md:text-xl font-bold text-slate-900">{name}</h3>
        <span className="inline-flex mt-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
          {role}
        </span>
        <p className="mt-2 text-slate-600 line-clamp-3">{bio}</p>

        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {tags.map(t => (
              <span key={t} className="px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-700">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Botón de correo */}
      {email && (
        <div className="mt-4 flex justify-center">
          <a
            href={`mailto:${email}`}
            aria-label={`Enviar correo a ${name}`}
            className="flex items-center justify-center gap-2 w-full md:max-w-[90%] px-3 py-2 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium transition overflow-hidden text-ellipsis whitespace-nowrap"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
            {email}
          </a>
        </div>
      )}
    </article>
  );
}
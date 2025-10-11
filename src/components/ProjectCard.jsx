export default function ProjectCard({ cover, title, excerpt, techs = [], href }){
  return (
    <article className="card p-6 hover:-translate-y-1 transition">
      {cover && <img src={cover} alt="" className="rounded-xl h-40 w-full object-cover mb-4" />}
      <h3 className="text-lg font-bold text-ink">{title}</h3>
      {excerpt && <p className="text-sm text-muted mt-1">{excerpt}</p>}
      {techs?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {techs.map(t => <span key={t} className="pill">{t}</span>)}
        </div>
      )}
      <div className="mt-4 flex items-center gap-2">
        <button className="btn btn-ghost btn-xs">0 votos</button>
        <a href={href} className="btn btn-primary btn-xs">Ver detalle</a>
      </div>
    </article>
  );
}
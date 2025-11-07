export default function AdminCard({ title, children, right }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        {right}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

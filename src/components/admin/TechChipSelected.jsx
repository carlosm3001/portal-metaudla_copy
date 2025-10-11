export default function TechChipSelected({ t, onRemove }) {
  return (
    <span className="pill pill-sm inline-flex items-center gap-1">
      {t}
      <button
        type="button"
        aria-label={`Quitar ${t}`}
        onClick={() => onRemove(t)}
        className="remove-x"
      >×</button>
    </span>
  );
}
export default function TechChipOption({ t, active, onToggle }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(t)}
      className={`pill transition-all duration-150 ${
        active
          ? "bg-brand-200 text-brand-800 border-brand-400 ring-2 ring-brand-200"
          : "hover:bg-brand-50"
      }`}
    >
      {active ? "✓ " : ""}{t}
    </button>
  );
}
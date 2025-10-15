export default function TechChipOption({ tech, onToggle }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(tech.nombre)}
      className="pill transition-all duration-150 hover:bg-brand-50"
    >
      {tech.nombre}
    </button>
  );
}
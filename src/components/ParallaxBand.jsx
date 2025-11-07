import "../styles/parallax-basic.css";

export default function ParallaxBand({
  imageUrl,
  height = "65vh",
  title,
  subtitle,
  className = "",
}) {
  return (
    <section
      className={`parallax-band ${className}`}
      style={{ backgroundImage: `url(${imageUrl})`, minHeight: height }}
      aria-label={title || "Sección con efecto parallax"}
    >
      <div className="parallax-overlay" />
      <div className="parallax-inner px-4">
        {title && (
          <h2 className="parallax-title text-3xl md:text-5xl">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="parallax-subtitle mt-3 md:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}

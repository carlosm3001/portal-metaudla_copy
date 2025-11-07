import { useInView } from 'react-intersection-observer';

export default function ProjectCard({ project, onClick }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <article
      ref={ref}
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-500 ease-out transform-gpu 
        ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      onClick={() => onClick(project.id)}
    >
      <div className="relative group h-48">
        <img
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out">
          <h3 className="absolute bottom-3 left-4 text-white text-lg font-bold">
            {project.title}
          </h3>
        </div>
      </div>
    </article>
  );
}

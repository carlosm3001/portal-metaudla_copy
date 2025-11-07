import "./../styles/hero.css";
import TeamGrid from "../components/About/TeamGrid";
// Usa UNA de las dos opciones de fotos:
import { PHOTOS_EXACT as PHOTOS } from "../photos"; // crea este pequeño módulo o pega las constantes aquí
// import { PHOTOS } from "../photos-normalized";

const members = [
  {
    photo: PHOTOS.carlos,
    name: "Carlos Mario Villegas Artunduaga",
    role: "Administración",
    bio: "Creador de la web. Estudiante de la Universidad de la Amazonía, 8.º semestre.",
    email: "carlos.villegas@udla.edu.co",
    tags: ["React","Vite","Tailwind"]
  },
  {
    photo: PHOTOS.edwin,
    name: "Ingeniero Eduardo Millán Rojas",
    role: "Administración",
    bio: "Ingeniero revisor, supervisor y colaborador del proyecto.",
    email: "eduardo.millan@udla.edu.co",
    tags: ["Supervisión","DevOps"]
  },
  {
    photo: PHOTOS.fredy,
    name: "Docente Fredy Antonio Verástegui González",
    role: "Administración",
    bio: "Docente de apoyo.",
    email: "fredy.verastegui@udla.edu.co",
    tags: ["Docencia","Asesoría"]
  },
];

export default function Nosotros() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 space-y-8">
      {/* HERO */}
      <section className="radial-hero rounded-3xl border border-slate-200 shadow-sm p-6 md:p-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-text">Sobre ExploraUDLA</h1>
        <p className="mt-2 text-muted md:text-lg max-w-3xl">
          La vitrina digital para visibilizar, conectar y potenciar los proyectos de la Universidad de la Amazonía.
        </p>
      </section>

      {/* MISIÓN y VISIÓN */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-card p-6 shadow-sm">
          <h2 className="text-xl font-bold text-text">Nuestra Misión</h2>
          <p className="mt-2 text-text leading-relaxed">
            Visibilizar, conectar y potenciar los proyectos de la Universidad de la Amazonía mediante una plataforma abierta,
            accesible y colaborativa. Nuestro objetivo es facilitar que estudiantes y docentes publiquen sus iniciativas,
            encuentren compañeros de trabajo, reciban retroalimentación oportuna y transformen sus ideas en resultados con
            impacto social y académico.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-card p-6 shadow-sm">
          <h2 className="text-xl font-bold text-text">Nuestra Visión</h2>
          <p className="mt-2 text-text leading-relaxed">
            Ser la vitrina digital de referencia para la innovación universitaria en la región amazónica. Aspiramos a consolidar
            una comunidad interdisciplinaria que comparte conocimientos, promueve la ciencia abierta y construye soluciones
            tecnológicas, educativas y culturales que mejoren la vida de las personas.
          </p>
        </div>
      </section>

      {/* EQUIPO */}
      <section>
        <div className="flex items-baseline justify-between flex-wrap gap-2 mb-3">
          <h2 className="text-2xl font-bold text-text">Equipo de expertos</h2>
          <p className="text-muted">Conoce a los administradores que mantienen ExploraUDLA.</p>
        </div>
        <TeamGrid members={members} />
      </section>
    </main>
  );
}

import { useEffect } from "react";

const BASE = import.meta.env.BASE_URL || "/";

export default function Home() {
  return (
    <main className="flex flex-col items-center space-y-8 py-10">
      {/* Bloque 1 */}
      <section className="w-full max-w-6xl mt-6 md:mt-8">
        <div className="relative rounded-2xl overflow-hidden shadow-lg">
          <img
            src="/images/uniamazonia-administrativo.jpg"
            alt="Edificio administrativo de la Universidad de la Amazonia"
            className="w-full h-[65vh] object-cover brightness-90"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white px-4">
            <h1 className="text-3xl md:text-5xl font-extrabold drop-shadow">
              Bienvenido a ExploraUDLA
            </h1>
            <p className="mt-2 text-white/90 max-w-2xl">
              Tu portal de proyectos universitarios.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full max-w-5xl px-6 md:px-0">
        <div className="bg-white border-[var(--brand-light-green-border)] rounded-2xl p-8 shadow-sm text-center md:text-left">
          <h2 className="text-2xl font-bold text-primary">
            Conecta y Colabora
          </h2>
          <p className="mt-2 text-slate-700">
            Explora proyectos innovadores, encuentra colaboradores y comparte tus propias ideas con la comunidad de la Universidad de la Amazonía.
          </p>
        </div>
      </section>

      {/* Bloque 2 */}
      <section className="w-full max-w-6xl">
        <div className="relative rounded-2xl overflow-hidden shadow-lg">
          <img
            src="/images/uniamazonia-pradera.jpg"
            alt="Pradera de la Universidad de la Amazonia"
            className="w-full h-[65vh] object-cover brightness-90"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white px-4">
            <h2 className="text-3xl md:text-4xl font-extrabold drop-shadow">
              Innovación y Desarrollo
            </h2>
            <p className="mt-2 text-white/90 max-w-2xl">
              Descubre proyectos que transforman nuestra región.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full max-w-5xl px-6 md:px-0">
        <div className="bg-white border-[var(--brand-light-green-border)] rounded-2xl p-8 shadow-sm text-center md:text-left">
          <h2 className="text-2xl font-bold text-primary">
            Impacto y Visibilidad
          </h2>
          <p className="mt-2 text-slate-700">
            Destaca tus logros y contribuye al desarrollo académico y social de la región amazónica.
          </p>
        </div>
      </section>

      {/* Bloque 3 */}
      <section className="w-full max-w-6xl">
        <div className="relative rounded-2xl overflow-hidden shadow-lg">
          <img
            src="/images/uniamazonia-biblioteca.jpg"
            alt="Biblioteca de la Universidad de la Amazonia"
            className="w-full h-[65vh] object-cover brightness-90"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white px-4">
            <h2 className="text-3xl md:text-4xl font-extrabold drop-shadow">
              Conocimiento que Transforma
            </h2>
            <p className="mt-2 text-white/90 max-w-2xl">
              Investiga, crea y comparte en ExploraUDLA.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full max-w-5xl px-6 md:px-0">
        <div className="bg-white border-[var(--brand-light-green-border)] rounded-2xl p-8 shadow-sm text-center md:text-left">
          <h2 className="text-2xl font-bold text-primary">
            Únete a la Comunidad
          </h2>
          <p className="mt-2 text-slate-700">
            Participa en foros, comenta proyectos y sé parte del ecosistema de innovación de la Universidad de la Amazonia.
          </p>
        </div>
      </section>
    </main>
  );
}
import { ArrowUpRight, Sparkles, Terminal, Activity, Layers } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function About() {
  const sectionRef = useScrollReveal([
    {
      trigger: '.about-header',
      selector: '.about-header > *',
      duration: 1.0,
      stagger: 0.14,
      y: 40,
      blur: 8
    },
    {
      trigger: '.about-text-col',
      selector: '.about-text-col > *',
      duration: 1.0,
      stagger: 0.16,
      y: 35,
      blur: 6
    },
    {
      trigger: '.about-card',
      selector: '.about-card',
      duration: 1.1,
      y: 45,
      blur: 8
    }
  ]);

  return (
    <section
      id="sobre-mi"
      ref={sectionRef}
      aria-labelledby="about-title"
      className="relative bg-[#0c0c10] text-stone-100 pt-24 pb-28 overflow-hidden border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* ENCABEZADO EDITORIAL DE SECCIÓN */}
        <header className="about-header mb-14">
          <div className="flex items-center gap-3 text-red-500 font-mono text-xs uppercase tracking-widest">
            <span className="w-8 h-px bg-red-500 inline-block" />
            <span>[ 01 // MANIFIESTO ]</span>
          </div>

          <h2
            id="about-title"
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black font-display tracking-tight text-white mt-4 uppercase leading-[0.95]"
          >
            FUSIONANDO CÓDIGO PRECISO, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-white">
              ARQUITECTURA MODERNA
            </span>{' '}
            Y EXPERIENCIAS MEMORABLES.
          </h2>
        </header>

        {/* CONTENIDO EDITORIAL A DOS COLUMNAS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Columna Izquierda: Narrativa y Métricas (7 cols) */}
          <div className="about-text-col lg:col-span-7 space-y-8">
            <p className="text-stone-300 text-lg sm:text-xl font-normal leading-relaxed">
              Desarrollador web enfocado en la convergencia entre ingeniería de software de alto nivel y diseño interactivo de vanguardia. Concibo cada proyecto no como una página estática convencional, sino como un producto digital interactivo, rápido y con identidad propia.
            </p>

            <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
              Priorizo interfaces con una arquitectura modular limpia, optimización exhaustiva de <strong className="text-white font-semibold">Core Web Vitals</strong> y microinteracciones fluidas que elevan la percepción de valor de cualquier producto o marca.
            </p>
          </div>

          {/* Columna Derecha: Tarjeta de Estado & Telemetría (5 cols) */}
          <div className="lg:col-span-5">
            <aside
              aria-label="Estado operativo y detalles de desarrollo"
              className="about-card rounded-2xl bg-stone-900/80 border border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden group hover:border-red-500/40 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

              {/* Cabecera estilo Consola / Studio */}
              <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6 font-mono text-xs">
                <div className="flex items-center gap-2 text-stone-300">
                  <Terminal className="w-4 h-4 text-red-500" />
                  <span className="tracking-wider">FACUNDO_OS // PROFILE</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ONLINE</span>
                </div>
              </div>

              {/* Registros de Estado */}
              <dl className="space-y-4 font-mono text-xs">
                <div>
                  <dt className="text-stone-500 uppercase tracking-widest text-[10px]">Estado Actual</dt>
                  <dd className="text-stone-100 font-bold mt-0.5 flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Disponible para proyectos & roles</span>
                  </dd>
                </div>

                <div>
                  <dt className="text-stone-500 uppercase tracking-widest text-[10px]">Ubicación</dt>
                  <dd className="text-stone-200 mt-0.5">Buenos Aires, Argentina (Trabajo Remoto Global)</dd>
                </div>

                <div>
                  <dt className="text-stone-500 uppercase tracking-widest text-[10px]">Enfoque Principal</dt>
                  <dd className="text-stone-200 mt-0.5 flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-red-400" />
                    <span>Frontend Avanzado, Interactividad & Animaciones</span>
                  </dd>
                </div>

                <div>
                  <dt className="text-stone-500 uppercase tracking-widest text-[10px]">Metodología</dt>
                  <dd className="text-stone-300 mt-0.5 text-[11px] leading-relaxed font-sans">
                    Desarrollo iterativo, código tipado/modular, accesibilidad WCAG y rendimiento como prioridad no negociable.
                  </dd>
                </div>
              </dl>

              {/* Enlace de acción rápido hacia contacto */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <a
                  href="#contacto"
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-red-600/20 border border-white/10 hover:border-red-500/40 text-stone-200 hover:text-white transition-all duration-200 group/link"
                >
                  <span className="font-mono text-xs tracking-wider uppercase flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-red-400" />
                    Iniciar conversación
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover/link:text-red-400 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}


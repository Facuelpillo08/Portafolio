import { ArrowUpRight, Sparkles, User, Activity, Layers, FileText } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function About() {
  const sectionRef = useScrollReveal([
    {
      trigger: '.about-header',
      selector: '.about-header > *',
      duration: 0.85,
      stagger: 0.1,
      y: 35
    },
    {
      trigger: '.about-text-col',
      selector: '.about-text-col > p',
      duration: 0.8,
      stagger: 0.12,
      y: 25
    },
    {
      trigger: '.about-card',
      selector: '.about-card',
      duration: 0.85,
      y: 35,
      scale: 0.97
    }
  ]);

  return (
    <section
      id="sobre-mi"
      ref={sectionRef}
      aria-labelledby="about-title"
      className="relative bg-[#0c0c10] text-stone-100 py-12 md:py-16 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* ENCABEZADO EDITORIAL DE SECCIÓN */}
        <header className="about-header mb-10 md:mb-12">
          <div className="flex items-center gap-2 text-red-500 font-mono text-xs uppercase tracking-widest">
            <span>[ 01 · SOBRE MÍ ]</span>
          </div>

          <h2
            id="about-title"
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black font-display tracking-tight text-white mt-4 uppercase leading-[0.95]"
          >
            DISEÑO IMPACTANTE, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-white">
              CÓDIGO CONFIABLE
            </span>{' '}
            Y EXPERIENCIAS QUE CONVIERTEN.
          </h2>
        </header>

        {/* CONTENIDO EDITORIAL A DOS COLUMNAS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Columna Izquierda: Narrativa y Métricas (7 cols) */}
          <div className="about-text-col lg:col-span-7 space-y-6">
            <p className="text-stone-300 text-lg sm:text-xl font-normal leading-relaxed">
              Desarrollo sitios y aplicaciones web que combinan una estética visual moderna con un funcionamiento rápido y sin fallas. Para quien visita la web, la experiencia es atractiva, intuitiva y fluida; para tu proyecto o negocio, se traduce en profesionalismo, confianza y mejores resultados.
            </p>

            <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
              Detrás de cada pantalla aplico ingeniería rigurosa: código limpio y escalable, arquitectura modular conectada a servidores y bases de datos, y una optimización exhaustiva de velocidad de carga y accesibilidad.
            </p>

            <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
              Mi objetivo es simple: que no tengas que elegir entre un producto que se vea bien o uno que funcione bien, sino construir una solución completa que destaque en ambos aspectos.
            </p>
          </div>

          {/* Columna Derecha: Tarjeta de Perfil & Enfoque (5 cols) */}
          <div className="lg:col-span-5">
            <aside
              aria-label="Perfil profesional y enfoque de trabajo"
              className="about-card rounded-2xl bg-stone-900/80 border border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden group hover:border-red-500/40 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

              {/* Cabecera de Perfil */}
              <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6 font-mono text-xs">
                <div className="flex items-center gap-2 text-stone-300">
                  <User className="w-4 h-4 text-red-500" />
                  <span className="tracking-wider">FACUNDO ACOSTA · PERFIL</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>DISPONIBLE</span>
                </div>
              </div>

              {/* Datos de Enfoque */}
              <dl className="space-y-4 font-mono text-xs">
                <div>
                  <dt className="text-stone-500 uppercase tracking-widest text-[10px]">Disponibilidad</dt>
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
                  <dt className="text-stone-500 uppercase tracking-widest text-[10px]">Especialidad</dt>
                  <dd className="text-stone-200 mt-0.5 flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-red-400" />
                    <span>Desarrollo Web Fullstack & Experiencias Interactivas</span>
                  </dd>
                </div>

                <div>
                  <dt className="text-stone-500 uppercase tracking-widest text-[10px]">Filosofía de desarrollo</dt>
                  <dd className="text-stone-300 mt-0.5 text-[11px] leading-relaxed font-sans">
                    Código modular, velocidad de carga optimizada, estándares de accesibilidad y foco en la experiencia del usuario.
                  </dd>
                </div>
              </dl>

              {/* Enlaces de acción rápidos: Contacto & Descargar CV */}
              <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="#contacto"
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-red-600/20 border border-white/10 hover:border-red-500/40 text-stone-200 hover:text-white transition-all duration-200 group/link"
                >
                  <span className="font-mono text-xs tracking-wider uppercase flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-red-400" />
                    Contacto
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover/link:text-red-400 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </a>

                <a
                  href="/cv-facundo-acosta.pdf"
                  download="CV_Facundo_Acosta.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-red-600/15 hover:bg-red-600 text-stone-200 hover:text-white border border-red-500/30 hover:border-red-500 transition-all duration-200 group/cv"
                >
                  <span className="font-mono text-xs tracking-wider uppercase flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-red-400 group-hover/cv:text-white" />
                    Descargar CV
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover/cv:text-white group-hover/cv:translate-x-0.5 group-hover/cv:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useState } from 'react';
import { projects } from '../data/projects';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { GithubIcon } from './Icons';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function FeaturedProjects() {
  const [activeProject, setActiveProject] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const containerRef = useScrollReveal([
    {
      trigger: '.projects-header',
      selector: '.projects-header > *',
      duration: 1.0,
      stagger: 0.14,
      y: 40,
      blur: 8
    },
    {
      trigger: '.projects-list',
      selector: '.project-row',
      duration: 0.9,
      stagger: 0.12,
      y: 35,
      blur: 6
    },
    {
      trigger: '.projects-footer',
      selector: '.projects-footer',
      duration: 0.85,
      y: 25,
      blur: 6
    }
  ]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    // Coordenadas relativas al contenedor de proyectos
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <section
      id="proyectos"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      aria-labelledby="projects-title"
      className="relative bg-[#0c0c10] text-stone-100 py-28 px-6 md:px-12 border-t border-white/10 overflow-hidden"
    >
      {/* Luz ambiental sutil en el fondo */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-red-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ENCABEZADO EDITORIAL */}
        <header className="projects-header mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3 text-red-500 font-mono text-xs uppercase tracking-widest mb-3">
              <span className="w-8 h-px bg-red-500 inline-block" />
              <span>[ 02 // CATÁLOGO ]</span>
            </div>
            <h2
              id="projects-title"
              className="text-4xl sm:text-5xl md:text-7xl font-black font-display tracking-tight text-white uppercase"
            >
              PROYECTOS<span className="text-red-500">.</span>
            </h2>
          </div>

          <p className="text-stone-400 font-mono text-xs md:text-sm max-w-sm uppercase tracking-wider">
            UNA CURADURÍA DE ARQUITECTURA FRONTEND, RENDIMIENTO EXTREMO Y EXPERIENCIAS INTERACTIVAS.
          </p>
        </header>

        {/* LISTA EDITORIAL INTERACTIVA */}
        <div
          role="list"
          className="projects-list divide-y divide-white/10 border-b border-white/10"
          onMouseLeave={() => setActiveProject(null)}
        >
          {projects.map((project) => {
            return (
              <article
                key={project.id}
                role="listitem"
                onMouseEnter={() => setActiveProject(project)}
                className="project-row group relative py-10 md:py-14 transition-all duration-300"
              >
                {/* FILA PRINCIPAL */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 cursor-pointer">
                  {/* Número & Título con desplazamiento suave */}
                  <div className="flex items-start sm:items-center gap-6 md:gap-10">
                    <span className="font-mono text-xs sm:text-sm tracking-widest text-stone-500 group-hover:text-red-500 transition-colors pt-1 sm:pt-0">
                      /{project.number}
                    </span>

                    <div>
                      <h3 className="text-2xl sm:text-3xl md:text-5xl font-extrabold font-display uppercase tracking-tight text-white group-hover:text-red-500 group-hover:translate-x-3 transition-all duration-300">
                        {project.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-400 font-mono mt-1 group-hover:text-stone-300 transition-colors">
                        {project.category} // {project.year}
                      </p>
                    </div>
                  </div>

                  {/* Etiquetas y Enlaces de acción */}
                  <div className="flex flex-wrap items-center gap-4 lg:gap-8 justify-between lg:justify-end">
                    <ul className="hidden sm:flex flex-wrap gap-2" aria-label="Tecnologías principales">
                      {project.tags.map((tag) => (
                        <li key={tag}>
                          <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider rounded-md bg-white/5 text-stone-300 border border-white/10 group-hover:border-red-500/30 transition-colors">
                            {tag}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Botones de enlace directo */}
                    <div className="flex items-center gap-3">
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Ver demo en vivo de ${project.title}`}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 hover:bg-red-600 text-stone-200 hover:text-white border border-white/10 hover:border-red-500 text-xs font-mono tracking-wider uppercase transition-all duration-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>Demo</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Ver repositorio de ${project.title}`}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-stone-300 hover:text-white border border-white/10 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>

                      <div className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-stone-400 group-hover:text-white group-hover:border-red-500 group-hover:bg-red-600 group-hover:rotate-45 transition-all duration-300">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* VISTA PREVIA INTEGRADA EN MÓVIL / PANTALLAS PEQUEÑAS (< lg) */}
                <div className="mt-6 lg:hidden space-y-4">
                  <figure className="aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-stone-900">
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </figure>
                  <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        {/* FOOTER DE SECCIÓN / GITHUB EXPLORER */}
        <div className="projects-footer mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-xs text-stone-400">
          <span className="tracking-widest uppercase">
            [ MÁS PROYECTOS Y EXPERIMENTOS DISPONIBLES EN GITHUB ]
          </span>
          <a
            href="https://github.com/facundoacosta"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-stone-200 hover:text-red-400 font-bold uppercase tracking-wider transition-colors"
          >
            <span>Ver perfil completo en GitHub</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* ELEMENTO FLOTANTE DE VISTA PREVIA (DESKTOP: LOCOMOTIVE / AWWWARDS FLOATING PREVIEW) */}
      {activeProject && (
        <aside
          aria-hidden="true"
          className="hidden lg:block pointer-events-none absolute z-40 transition-transform duration-100 ease-out"
          style={{
            left: `${cursorPos.x}px`,
            top: `${cursorPos.y}px`,
            transform: 'translate(-50%, -50%)',
            willChange: 'transform'
          }}
        >
          <div className="w-80 rounded-2xl overflow-hidden bg-stone-900/95 border border-white/20 shadow-2xl p-3 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
            <figure className="relative aspect-video rounded-xl overflow-hidden bg-black mb-3 border border-white/10">
              <img
                src={activeProject.image}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute bottom-2 left-2 text-[10px] font-mono tracking-widest text-red-400 font-bold uppercase bg-black/60 px-2 py-0.5 rounded">
                // {activeProject.category}
              </span>
            </figure>
            <p className="text-stone-300 text-xs line-clamp-2 leading-relaxed px-1 font-sans">
              {activeProject.description}
            </p>
          </div>
        </aside>
      )}
    </section>
  );
}


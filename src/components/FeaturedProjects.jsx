import { useEffect, useRef } from 'react';
import { projects } from '../data/projects';
import studioBg from '../assets/studio_background.webp';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function FeaturedProjects({ containerRef }) {
  const localRef = useRef(null);
  const sectionRef = containerRef || localRef;
  const cardsRef = useRef([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean);
      if (!cards.length) return;

      // 1. Entrada suave del encabezado al llegar a la sección
      gsap.fromTo(
        '.projects-header-item',
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          clearProps: 'all',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      );

      // 2. Estado inicial de las tarjetas:
      // Card 0 visible y en reposo (yPercent: 0, scale: 1).
      // Card 1 y 2 preparadas completamente abajo fuera del viewport (yPercent: 150)
      cards.forEach((card, i) => {
        gsap.set(card, {
          yPercent: i === 0 ? 0 : 150,
          y: 0,
          scale: 1,
          opacity: 1,
          transformOrigin: '50% 0%',
          force3D: true,
        });
      });

      // 2.1 Elevación Flotante (Float-in 3D) de la Card 01 mientras la lámina blanca de Proyectos entra
      if (cards[0]) {
        gsap.fromTo(
          cards[0],
          { y: 35, scale: 0.97, opacity: 0.85 },
          {
            y: 0,
            scale: 1.0,
            opacity: 1.0,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'top top',
              scrub: 0.2,
              invalidateOnRefresh: true,
            }
          }
        );
      }

      // 3. Suavizar esquinas superiores a 0px al clavarse (pin) en el tope de pantalla
      // scrub: true elimina cualquier retraso de inercia y start: 'top 20%' ofrece una transición progresiva y limpia
      gsap.to(sectionRef.current, {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 20%',
          end: 'top top',
          scrub: true,
          invalidateOnRefresh: true,
        }
      });

      // 4. Timeline de Pinning Cinemático ultra fluido con ScrollTrigger
      // scrub: 0.2 sincroniza al milisegundo con la inercia de Lenis sin delay pesado
      // Se elimina anticipatePin para evitar rebotes o saltos hacia atrás antes de anclar la sección
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * 4.3}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.2,
          invalidateOnRefresh: true,
        }
      });

      const stepOffset = typeof window !== 'undefined' && window.innerWidth < 640 ? 14 : 20;

      cards.forEach((card, i) => {
        if (i === 0) {
          // Pausa inicial para contemplar el Proyecto 1 (HEXA)
          tl.to({}, { duration: 0.6 });
          return;
        }

        const label = `step-${i}`;

        // A) Las tarjetas anteriores se desplazan hacia arriba en cascada 3D uniforme
        for (let prev = 0; prev < i; prev++) {
          const depthLevel = i - prev;
          tl.to(
            cards[prev],
            {
              scale: 1 - depthLevel * 0.035,
              y: -depthLevel * stepOffset,
              opacity: 1 - depthLevel * 0.07,
              duration: 0.8,
              ease: 'none',
              force3D: true,
            },
            label
          );
        }

        // B) La tarjeta entrante sube limpia, sólida y al 100% de brillo desde abajo hacia el frente
        tl.to(
          card,
          {
            yPercent: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: 'none',
            force3D: true,
          },
          label
        );

        // C) Pausa para contemplar el proyecto actual
        // Para KNTX (i=1): 0.5s. Para VANDAL (i=2, último): 0.6s de contemplación pura y nítida
        const pauseDuration = i === cards.length - 1 ? 0.6 : 0.5;
        tl.to({}, { duration: pauseDuration });
      });

      // D) Transición de salida hacia Habilidades (exactamente 1.0s / 1.0H de scroll)
      // Mientras la lámina oscura de Habilidades asciende en scroll nativo desde abajo (gracias a -mt-[100vh]),
      // el mazo de tarjetas se repliega sutilmente en 3D y el encabezado se atenúa.
      const exitLabel = 'exit-to-skills';
      tl.to(
        '.projects-cards-stack',
        {
          scale: 0.95,
          opacity: 0.4,
          duration: 1.0,
          ease: 'none',
          force3D: true,
        },
        exitLabel
      );

      tl.to(
        '.projects-header-item',
        {
          opacity: 0.25,
          y: -20,
          duration: 1.0,
          ease: 'none',
        },
        exitLabel
      );

    }, sectionRef);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, [sectionRef]);

  return (
    <section
      id="proyectos"
      ref={sectionRef}
      aria-labelledby="projects-title"
      className="curtain-slab-panel relative z-30 w-full h-screen min-h-screen rounded-t-[40px] md:rounded-t-[56px] bg-[#f8f9fb] curtain-slab-light text-stone-900 overflow-hidden flex flex-col justify-between py-5 sm:py-6"
    >
      {/* FONDO DE ESTUDIO LUMINOSO OPTIMIZADO (0 COSTO DE BACKDROP-FILTER) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Imagen fotográfica de estudio con opacidad moderada y blur de raster único */}
        <img
          src={studioBg}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-center opacity-30 blur-[1px]"
        />

        {/* Capa difusora de estudio blanca sólida y pura */}
        <div className="absolute inset-0 bg-[#f8f9fb]/90" />

        {/* Reflejos cáusticos y luz ambiental */}
        <div
          className="absolute inset-0 opacity-40 mix-blend-soft-light"
          style={{
            backgroundImage: `radial-gradient(ellipse 80% 50% at 50% -20%, rgba(255, 255, 255, 0.9), transparent),
                              radial-gradient(ellipse 60% 40% at 85% 60%, rgba(239, 68, 68, 0.08), transparent)`
          }}
        />

        {/* Luces volumétricas GPU 100% vectoriales con radial-gradient (0 filtros) */}
        <div
          className="absolute top-1/4 left-1/4 w-[750px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(239, 68, 68, 0.05) 0%, transparent 70%)'
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[350px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(244, 63, 94, 0.04) 0%, transparent 70%)'
          }}
        />
      </div>

      {/* ENCABEZADO EDITORIAL COMPACTO */}
      <header className="projects-header relative z-30 flex-shrink-0 pt-2 sm:pt-4 pb-1 text-center px-6">
        <div className="projects-header-item inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-stone-200/90 shadow-xs text-red-600 font-mono text-[11px] uppercase tracking-widest mb-2">
          <span className="w-2 h-2 rounded-full bg-red-600 inline-block shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse" />
          <span>[ 02 // PROYECTOS SELECCIONADOS ]</span>
        </div>
        <h2
          id="projects-title"
          className="projects-header-item text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-stone-950 uppercase leading-none"
        >
          PROYECTOS<span className="text-red-600">.</span>
        </h2>
        <p className="projects-header-item text-stone-500 font-mono text-xs uppercase tracking-wider mt-1.5 font-medium">
          Haz clic sobre cualquier proyecto para abrir la demo en vivo
        </p>
      </header>

      {/* MAZO DE VENTANAS ESCULTURALES 3D SUPERPUESTAS */}
      <div className="relative z-20 w-full max-w-5xl xl:max-w-6xl mx-auto flex-1 h-[60vh] sm:h-[64vh] md:h-[68vh] max-h-[640px] px-4 sm:px-6 flex items-center justify-center my-auto">
        <div className="projects-cards-stack relative w-full h-full">
          {projects.map((project, index) => {
            return (
              <a
                key={project.id}
                ref={(el) => (cardsRef.current[index] = el)}
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Abrir proyecto ${project.title} en vivo`}
                className="project-sculptural-card absolute inset-0 w-full h-full rounded-2xl sm:rounded-3xl bg-[#18181b] border-t border-white/20 border-x border-b border-stone-800/80 shadow-[0_-10px_32px_rgba(0,0,0,0.35),0_30px_90px_rgba(0,0,0,0.35)] hover:shadow-[0_0_50px_rgba(239,68,68,0.3)] overflow-hidden cursor-pointer group flex flex-col will-change-transform transition-shadow duration-300"
                style={{
                  zIndex: (index + 1) * 10,
                }}
              >
                {/* 1. Barra superior escultural limpia (sin filtros costosos) */}
                <div className="flex items-center justify-between px-5 sm:px-7 py-3 sm:py-3.5 bg-[#18181b] border-b border-white/10 select-none flex-shrink-0">
                  {/* Número de proyecto */}
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-red-500 tracking-wider">
                      /{project.number}
                    </span>
                  </div>

                  {/* Título Central & Categoría */}
                  <div className="flex items-center gap-2 truncate px-2">
                    <span className="font-display font-extrabold text-xs sm:text-sm md:text-base text-stone-100 uppercase tracking-tight truncate group-hover:text-red-400 transition-colors">
                      {project.title}
                    </span>
                    <span className="hidden sm:inline-block text-[11px] font-mono text-stone-400 font-normal">
                      · {project.category}
                    </span>
                  </div>

                  {/* Indicador sutil de año */}
                  <div className="flex items-center">
                    <span className="font-mono text-xs text-stone-400 font-medium">
                      {project.year}
                    </span>
                  </div>
                </div>

                {/* 2. Cuerpo de la ventana: GPU composite directo sin repaint de filtros */}
                <div className="relative flex-1 w-full h-full bg-stone-900 overflow-hidden">
                  <img
                    src={project.image}
                    alt={`Captura del proyecto ${project.title}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-top group-hover:scale-[1.015] transition-transform duration-500 ease-out"
                  />

                  {/* Reflejo especular diagonal sutil de cristal */}
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/15 via-white/[0.02] to-transparent opacity-80"
                    aria-hidden="true"
                  />
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Espaciador sutil inferior */}
      <div className="relative z-10 h-3 flex-shrink-0" />
    </section>
  );
}

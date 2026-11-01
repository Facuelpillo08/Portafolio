import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  window.ScrollTrigger = ScrollTrigger;
  window.gsap = gsap;
}

/**
 * useSectionTransitions - Coreografía Cinematográfica Awwwards:
 * 
 * 1. Hero -> Manifiesto: Pinned stage con Camera Dolly-in simultáneo de Silueta + Tipografía
 *    y revelado fluido del Manifiesto emergente.
 * 2. Manifiesto -> Proyectos: Telón Lateral Escultural (Horizontal Wipe / Slide).
 *    El Manifiesto se desliza a la izquierda (xPercent: 0 -> -100) mientras el set blanco
 *    de Proyectos entra deslizándose desde la derecha (xPercent: 100 -> 0) con sombra arquitectónica.
 * 3. Habilidades & Contacto: Stacked layers 3D en cascada.
 */
export function useSectionTransitions(transitionPairs = [], containerRef) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      transitionPairs.forEach(({ outgoing: outRef, incoming: inRef }) => {
        const outgoing = outRef?.current;
        const incoming = inRef?.current;
        if (!outgoing || !incoming) return;

        // Si la sección saliente tiene su propio pinning interno (como FeaturedProjects), omitir
        const hasInternalPin = outgoing.id === 'proyectos' || outgoing.querySelector('#proyectos') !== null;
        if (hasInternalPin) return;

        outgoing.style.willChange = 'transform, filter';

        const isHeroToAbout = outgoing.querySelector('#inicio') !== null || outgoing.id === 'inicio';
        const isAboutToProjects = (outgoing.querySelector('#sobre-mi') !== null || outgoing.id === 'sobre-mi') &&
                                  (incoming.querySelector('#proyectos') !== null || incoming.id === 'proyectos');

        // =========================================================================
        // CASO 1: HERO -> MANIFIESTO (FLUJO CONTINUO CON ENFOQUE ÓPTICO)
        // =========================================================================
        if (isHeroToAbout) {
          // El Hero no se clava; fluye de forma continua hacia el Manifiesto
          // permitiendo que su física óptica unificada (desenfoque 0 a 14px y disolución a #0c0c10)
          // se funda de manera orgánica con el fondo oscuro de Sobre Mí.
          return;
        }

        // =========================================================================
        // CASO 2: MANIFIESTO -> PROYECTOS (ASCENSO DE LÁMINA ESCULTURAL SOBRE MANIFIESTO)
        // =========================================================================
        if (isAboutToProjects) {
          outgoing.style.willChange = 'transform, opacity';

          // El Manifiesto se ancla al llegar al final (bottom bottom), y permanece fijo
          // mientras la lámina blanca de Proyectos asciende montándose por encima como un telón escultural.
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: outgoing,
              start: 'bottom bottom',
              end: () => '+=' + window.innerHeight,
              pin: true,
              pinSpacing: false,
              scrub: 0.25,
              invalidateOnRefresh: true,
            }
          });

          // A medida que la lámina blanca de Proyectos sube por encima, el Manifiesto
          // retrocede en profundidad 3D y se disuelve (100% composite-only para 120 FPS fluidos)
          tl.to(
            '.about-content-inner',
            {
              scale: 0.95,
              opacity: 0.2,
              ease: 'none',
              force3D: true,
            },
            0
          );
          return;
        }

        // =========================================================================
        // CASO 3: HABILIDADES -> CONTACTO (ASCENSO DE LÁMINA BLANCA SOBRE HABILIDADES)
        // =========================================================================
        const isSkillsToContact = (outgoing.querySelector('#habilidades') !== null || outgoing.id === 'habilidades') &&
                                  (incoming.querySelector('#contacto') !== null || incoming.id === 'contacto');

        if (isSkillsToContact) {
          outgoing.style.willChange = 'transform, opacity';

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: outgoing,
              start: 'bottom bottom',
              endTrigger: incoming,
              end: 'top top',
              pin: true,
              pinSpacing: false,
              scrub: 0.25,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            }
          });

          // Desvanecido suave sin repaints de blur
          tl.to(
            '.skills-content-inner',
            {
              opacity: 0.45,
              ease: 'none',
              force3D: true,
            },
            0
          );
          return;
        }
      });
    }, containerRef);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, [transitionPairs, containerRef]);
}

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * useScrollReveal - Hook de revelado editorial por scroll impulsado por GSAP ScrollTrigger.
 *
 * Sincronizado nativamente con Lenis a través del ticker global.
 * - Modo individual: anima cada tarjeta/fila conforme entra en el viewport.
 * - Modo grupo: anima el conjunto con stagger.
 * - Limpieza total con `clearProps: 'all'` para que los textos, botones y estados hover
 *   queden 100% limpios y visibles en el DOM sin quedar atrapados en opacity: 0.
 */
export function useScrollReveal(config = []) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      config.forEach(({
        trigger,
        selector,
        duration = 0.8,
        stagger = 0.08,
        y = 30,
        scale = 0.98,
        delay = 0,
        individual = false,
        scaleX = false,
      }) => {
        if (individual) {
          const items = container.querySelectorAll(selector);
          if (!items.length) return;

          items.forEach((item, index) => {
            gsap.fromTo(
              item,
              scaleX
                ? { scaleX: 0, transformOrigin: 'left' }
                : { opacity: 0, y, scale },
              {
                ...(scaleX ? { scaleX: 1 } : { opacity: 1, y: 0, scale: 1 }),
                duration,
                delay: delay + (index % 4) * 0.03,
                ease: 'power3.out',
                clearProps: 'all',
                scrollTrigger: {
                  trigger: item,
                  start: 'top 92%',
                  toggleActions: 'play none none none',
                },
              }
            );
          });
        } else {
          const triggerEl = container.querySelector(trigger || selector);
          const targets = container.querySelectorAll(selector);
          if (!triggerEl || !targets.length) return;

          gsap.fromTo(
            targets,
            scaleX
              ? { scaleX: 0, transformOrigin: 'left' }
              : { opacity: 0, y, scale },
            {
              ...(scaleX ? { scaleX: 1 } : { opacity: 1, y: 0, scale: 1 }),
              duration,
              stagger,
              delay,
              ease: 'power3.out',
              clearProps: 'all',
              scrollTrigger: {
                trigger: triggerEl,
                start: 'top 88%',
                toggleActions: 'play none none none',
              },
            }
          );
        }
      });
    }, container);

    // Refrescar ScrollTrigger para asegurar sincronización con alturas dinámicas
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return containerRef;
}

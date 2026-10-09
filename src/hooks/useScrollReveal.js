import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Custom Hook para revelado editorial por scroll utilizando IntersectionObserver + GSAP.
 * Garantiza un 100% de confiabilidad en la detección de visibilidad sin depender de
 * cálculos de desplazamiento fijos de ScrollTrigger ni verse afectado por layout-shifts.
 *
 * @param {Array} config - Array de configuraciones para cada grupo de elementos:
 *   [
 *     {
 *       trigger: '.selector-del-disparador', // Opcional, si no se indica usa `selector`
 *       selector: '.elementos-a-animar',
 *       duration: 0.95,
 *       stagger: 0.12,
 *       y: 35,
 *       blur: 6,
 *       delay: 0,
 *       rootMargin: '0px 0px -40px 0px'
 *     }
 *   ]
 */
export function useScrollReveal(config = []) {
  const containerRef = useRef(null);
  const initialConfig = useRef(config);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Respetar preferencias de accesibilidad
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Fallback: si el navegador no soporta IntersectionObserver, mantener visible
    if (!('IntersectionObserver' in window)) {
      return;
    }

    const currentConfig = initialConfig.current;

    // 1. Establecer estado inicial oculto con suavidad
    currentConfig.forEach(({ selector, y = 35, blur = 6 }) => {
      const els = container.querySelectorAll(selector);
      if (els.length > 0) {
        gsap.set(els, {
          opacity: 0,
          y,
          filter: `blur(${blur}px)`,
          willChange: 'opacity, transform, filter'
        });
      }
    });

    // 2. Crear observadores de intersección independientes por grupo
    const observers = [];

    currentConfig.forEach(({
      trigger,
      selector,
      duration = 0.95,
      stagger = 0.12,
      delay = 0,
      rootMargin = '0px 0px -40px 0px'
    }) => {
      const triggerEl = container.querySelector(trigger || selector);
      if (!triggerEl) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const targets = container.querySelectorAll(selector);
              if (targets.length > 0) {
                gsap.to(targets, {
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  duration,
                  stagger,
                  delay,
                  ease: 'power3.out',
                  overwrite: 'auto',
                  clearProps: 'willChange'
                });
              }
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.05,
          rootMargin
        }
      );

      observer.observe(triggerEl);
      observers.push(observer);
    });

    // Limpieza al desmontar
    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  return containerRef;
}

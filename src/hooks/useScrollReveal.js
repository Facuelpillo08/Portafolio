import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Custom Hook para revelado editorial por scroll utilizando IntersectionObserver + GSAP.
 *
 * Características clave:
 * 1. Observación individual (`individual: true`) para que cada fila/tarjeta/ítem
 *    se anime conforme el usuario va haciendo scroll y entra en pantalla.
 * 2. Si un elemento ya está visible en el viewport al cargar la página, se anima inmediatamente.
 * 3. Animaciones de entrada fluidas (desplazamiento vertical, opacidad y micro-escala).
 * 4. Limpieza total de propiedades inline (`clearProps: 'all'`) para garantizar que
 *    los efectos hover (CSS), antialiasing y transformaciones nativas funcionen al 100%.
 * 5. Seguro frente a React 19 / StrictMode y cambios de renderizado.
 */
export function useScrollReveal(config = []) {
  const containerRef = useRef(null);
  const configRef = useRef(config);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const container = containerRef.current;
    if (!container) return;

    if (!('IntersectionObserver' in window)) {
      return;
    }

    const currentConfig = configRef.current;
    const observers = [];
    const animatedElements = new WeakSet();

    currentConfig.forEach(({
      trigger,
      selector,
      duration = 0.85,
      stagger = 0.1,
      y = 35,
      scale = 0.98,
      delay = 0,
      rootMargin = '0px 0px -40px 0px',
      individual = false,
      scaleX = false
    }) => {
      // Modo individual: cada elemento se observa y anima por separado al entrar en el viewport
      if (individual) {
        const items = container.querySelectorAll(selector);
        if (items.length === 0) return;

        items.forEach((item, index) => {
          if (scaleX) {
            gsap.set(item, {
              scaleX: 0,
              transformOrigin: 'left',
              willChange: 'transform'
            });
          } else {
            gsap.set(item, {
              opacity: 0,
              y,
              scale,
              willChange: 'opacity, transform'
            });
          }

          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting && !animatedElements.has(entry.target)) {
                  animatedElements.add(entry.target);
                  if (scaleX) {
                    gsap.fromTo(
                      entry.target,
                      { scaleX: 0 },
                      {
                        scaleX: 1,
                        duration,
                        delay: delay + (index % 3) * 0.05,
                        ease: 'power2.out',
                        clearProps: 'all'
                      }
                    );
                  } else {
                    gsap.fromTo(
                      entry.target,
                      { opacity: 0, y, scale },
                      {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration,
                        delay: delay + (index % 3) * 0.04,
                        ease: 'power3.out',
                        clearProps: 'all'
                      }
                    );
                  }
                  observer.unobserve(entry.target);
                }
              });
            },
            { threshold: 0.08, rootMargin }
          );

          observer.observe(item);
          observers.push(observer);
        });
      } else {
        // Modo grupo/bloque: el trigger anima el conjunto seleccionado
        const triggerEl = container.querySelector(trigger || selector);
        const targets = container.querySelectorAll(selector);
        if (!triggerEl || targets.length === 0) return;

        if (scaleX) {
          gsap.set(targets, {
            scaleX: 0,
            transformOrigin: 'left',
            willChange: 'transform'
          });
        } else {
          gsap.set(targets, {
            opacity: 0,
            y,
            scale,
            willChange: 'opacity, transform'
          });
        }

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && !animatedElements.has(entry.target)) {
                animatedElements.add(entry.target);
                if (scaleX) {
                  gsap.fromTo(
                    targets,
                    { scaleX: 0 },
                    {
                      scaleX: 1,
                      duration,
                      stagger,
                      delay,
                      ease: 'power2.out',
                      clearProps: 'all'
                    }
                  );
                } else {
                  gsap.fromTo(
                    targets,
                    { opacity: 0, y, scale },
                    {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      duration,
                      stagger,
                      delay,
                      ease: 'power3.out',
                      clearProps: 'all'
                    }
                  );
                }
                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.08, rootMargin }
        );

        observer.observe(triggerEl);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  return containerRef;
}

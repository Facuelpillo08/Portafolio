import { useEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SmoothScrollContext } from './scrollContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function SmoothScrollProvider({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Inicializar Lenis con configuración de inercia suave estilo Marcus Lorenzet
    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.3,
      infinite: false,
    });

    lenisRef.current = lenisInstance;
    window.__lenis = lenisInstance;

    // Sincronizar Lenis con GSAP ScrollTrigger
    lenisInstance.on('scroll', ScrollTrigger.update);

    const updateTicker = (time) => {
      lenisInstance.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(500, 33);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    return () => {
      clearTimeout(refreshTimer);
      gsap.ticker.remove(updateTicker);
      lenisInstance.destroy();
      window.__lenis = null;
      lenisRef.current = null;
    };
  }, []);

  const getLenis = useCallback(() => lenisRef.current, []);

  const scrollTo = useCallback((target, options = {}) => {
    if (!lenisRef.current) {
      if (typeof target === 'string') {
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' });
      }
      return;
    }

    lenisRef.current.scrollTo(target, {
      duration: options.duration ?? 1.25,
      easing: options.easing ?? ((t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))),
      offset: options.offset ?? 0,
      immediate: options.immediate ?? false,
      lock: options.lock ?? false,
    });
  }, []);

  const onScroll = useCallback((callback) => {
    if (!lenisRef.current) {
      const handleWindowScroll = () => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        callback({
          scroll: window.scrollY,
          progress: total > 0 ? window.scrollY / total : 0,
        });
      };
      window.addEventListener('scroll', handleWindowScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleWindowScroll);
    }

    return lenisRef.current.on('scroll', callback);
  }, []);

  return (
    <SmoothScrollContext.Provider value={{ getLenis, scrollTo, onScroll }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

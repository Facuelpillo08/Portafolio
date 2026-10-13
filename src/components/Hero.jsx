import { useEffect, useRef } from 'react';
import studioBg from '../assets/studio_background.webp';
import silhouetteImg from '../assets/silhouette.webp';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';

export default function Hero() {
  const containerRef = useRef(null);
  const zoomWrapperRef = useRef(null);
  const backTitleRef = useRef(null);
  const frontTitleRef = useRef(null);
  const bgRef = useRef(null);

  // Coordenadas objetivo (inmediatas) y actuales (interpoladas con inercia elástica)
  const targetMouse = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });
  const isTouching = useRef(false);
  const scrollYRef = useRef(0);

  // 1. ENTRADA CINEMATOGRÁFICA: CÁMARA EN RETROCESO (Zoom-out de 108% a 100% en 1.15s)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 });

      // Toda la escena del set retrocede con suavidad cinematográfica hacia su escala natural
      tl.fromTo(
        zoomWrapperRef.current,
        { scale: 1.08, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.15,
          ease: 'power2.out',
          force3D: true,
          clearProps: 'all'
        },
        0
      );

      // Enlaces de las 4 esquinas: escalonados con un sutil slide y fade
      tl.fromTo(
        '.hero-corner',
        { opacity: 0, y: -10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power2.out',
          clearProps: 'all'
        },
        0.25
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // 2. Escuchar scroll pasivo para alimentar el parallax multi-capa continuo
  useEffect(() => {
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3. FÍSICA Y PARALLAX MULTI-CAPA CONTINUO (0 Re-renders de React, 120 FPS Nativos)
  useEffect(() => {
    let animId;

    const updatePhysics = () => {
      const isMobile = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;

      // En móviles sin interacción táctil activa: oscilación pendular natural (~4s por ciclo)
      if (isMobile && !isTouching.current) {
        const time = performance.now() * 0.001;
        const angle = time * (Math.PI / 2);
        targetMouse.current.x = Math.sin(angle) * 0.65;
        targetMouse.current.y = Math.cos(angle) * 0.25;
      }

      // Interpolación lineal suave (inercia elástica para mouse)
      currentMouse.current.x += (targetMouse.current.x - currentMouse.current.x) * 0.055;
      currentMouse.current.y += (targetMouse.current.y - currentMouse.current.y) * 0.055;

      const mx = currentMouse.current.x;
      const my = currentMouse.current.y;
      const scrollY = scrollYRef.current;

      // Inclinación y traslación por cursor (física escultórica 3D)
      const tiltX = -my * 10;
      const tiltY = mx * 12;
      const shiftX = mx * 26;
      const shiftY = my * 18;

      // A) "FACUNDO ACOSTA" en capa trasera (z-10, 100% VISIBLE SIEMPRE)
      // Parallax multi-capa sutil con perspectiva 3D individual (evita colisiones de buffer Z)
      if (backTitleRef.current) {
        const backY = shiftY * 0.85 - scrollY * 0.22;
        backTitleRef.current.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translate3d(${shiftX * 0.85}px, ${backY}px, 0px)`;
      }

      // B) "DESARROLLADOR WEB" en capa delantera (z-30, 100% VISIBLE SIEMPRE)
      // Parallax multi-capa sutil en contrafase
      if (frontTitleRef.current) {
        const frontY = -shiftY * 0.55 + scrollY * 0.12;
        frontTitleRef.current.style.transform = `perspective(1000px) rotateX(${tiltX * 0.5}deg) rotateY(${tiltY * 0.5}deg) translate3d(${-shiftX * 0.55}px, ${frontY}px, 0px)`;
      }

      // C) Fondo de estudio en z-0: parallax suave hacia abajo
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${scrollY * 0.18}px)`;
      }

      animId = window.requestAnimationFrame(updatePhysics);
    };

    animId = window.requestAnimationFrame(updatePhysics);
    return () => window.cancelAnimationFrame(animId);
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    targetMouse.current = {
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2
    };
  };

  const handleMouseLeave = () => {
    targetMouse.current = { x: 0, y: 0 };
  };

  const handleTouchStart = (e) => {
    isTouching.current = true;
    if (!containerRef.current || !e.touches[0]) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    targetMouse.current = {
      x: ((touch.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((touch.clientY - rect.top) / rect.height - 0.5) * 2
    };
  };

  const handleTouchMove = (e) => {
    if (!containerRef.current || !e.touches[0]) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    targetMouse.current = {
      x: ((touch.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((touch.clientY - rect.top) / rect.height - 0.5) * 2
    };
  };

  const handleTouchEnd = () => {
    isTouching.current = false;
  };

  return (
    <section
      id="inicio"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      className="relative w-full h-screen min-h-screen flex items-center justify-center overflow-hidden bg-[#0c0c10] select-none"
      aria-label="Portada del portafolio de Facundo Acosta"
    >
      {/* WRAPPER GENERAL DE ZOOM-OUT CINEMATOGRÁFICO AL CARGAR */}
      <div
        ref={zoomWrapperRef}
        className="absolute inset-0 w-full h-full overflow-hidden will-change-transform"
      >
        {/* 1. FONDO DE ESTUDIO FOTOGRÁFICO EN CAPA INDEPENDIENTE (z-0) */}
        <div
          ref={bgRef}
          className="absolute inset-0 z-0 pointer-events-none will-change-transform"
          style={{
            transform: 'translateY(0px)'
          }}
        >
          <img
            src={studioBg}
            alt=""
            aria-hidden="true"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* 2. VIÑETA SUAVE (z-2) */}
        <div
          className="absolute inset-0 z-2 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0, 0, 0, 0.06) 75%, rgba(0, 0, 0, 0.25) 100%)'
          }}
        />

        {/* 3. FUSIÓN ATMOSFÉRICA SUAVE (z-5) - Fusión continua sin líneas ni costuras con el Manifiesto */}
        <div
          className="absolute inset-x-0 -bottom-1 h-72 pointer-events-none z-5"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(12, 12, 16, 0.35) 30%, rgba(12, 12, 16, 0.82) 58%, #0c0c10 78%, #0c0c10 100%)'
          }}
          aria-hidden="true"
        />

        {/* 4. CAPA TRASERA: "FACUNDO ACOSTA" (z-10) - Detrás de la silueta, delante del fondo */}
        <div
          ref={backTitleRef}
          className="hero-back-title absolute top-[20%] md:top-[16%] left-0 right-0 z-10 flex justify-center items-center pointer-events-none will-change-transform"
          style={{
            transform: 'translate3d(0px, 0px, 0px)'
          }}
        >
          <h1
            className="hero-back-text text-metallic-red-back text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase text-center leading-none px-4 select-none tracking-tight"
            aria-label="FACUNDO ACOSTA"
          >
            FACUNDO ACOSTA
          </h1>
        </div>

        {/* 5. SILUETA ÚNICA DE FACUNDO (z-20) - Capa GPU dedicada, inamovible, 100% visible siempre */}
        <div
          className="hero-silhouette-container absolute inset-0 z-20 flex items-end justify-center pointer-events-none pb-0"
          style={{
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        >
          <img
            src={silhouetteImg}
            alt="Facundo Acosta - Desarrollador Web"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
            width="720"
            height="960"
            className="hero-silhouette h-[88vh] sm:h-[82vh] md:h-[88vh] lg:h-[92vh] max-h-[960px] w-auto object-contain object-bottom drop-shadow-[0_25px_45px_rgba(0,0,0,0.5)] select-none opacity-100"
            style={{
              maskImage: 'linear-gradient(to bottom, black 84%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 84%, transparent 100%)',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            }}
          />
        </div>

        {/* 6. CAPA FRONTAL: "DESARROLLADOR WEB" (z-30) - Delante de la silueta */}
        <div
          ref={frontTitleRef}
          className="hero-front-title absolute bottom-[28%] md:bottom-[23%] left-0 right-0 z-30 flex justify-center items-center pointer-events-none will-change-transform"
          style={{
            transform: 'translate3d(0px, 0px, 0px)'
          }}
        >
          <div
            className="hero-front-text text-metallic-red-front text-lg sm:text-2xl md:text-3xl lg:text-5xl font-black tracking-[0.18em] sm:tracking-[0.26em] uppercase text-center leading-none px-4 select-none"
            aria-label="DESARROLLADOR WEB"
          >
            DESARROLLADOR WEB
          </div>
        </div>
      </div>

      {/* 7. ENLACES EDITORIALES EN LAS 4 ESQUINAS (z-40) - Fijos a los bordes de la pantalla */}
      {/* Esquina Superior Izquierda: Identidad */}
      <div className="hero-corner absolute top-8 left-8 md:top-10 md:left-12 z-40">
        <a
          href="#inicio"
          className="group flex flex-col font-mono text-xs uppercase tracking-widest transition-colors"
        >
          <span className="font-extrabold text-sm md:text-base font-sans tracking-tight text-stone-900 group-hover:text-red-600 transition-colors drop-shadow-xs">
            FACUNDO ACOSTA<span className="text-red-500">.</span>
          </span>
          <span className="text-[10px] text-stone-500 tracking-wider">PORTAFOLIO // 2026</span>
        </a>
      </div>

      {/* Esquina Superior Derecha: INFO */}
      <div className="hero-corner absolute top-8 right-8 md:top-10 md:right-12 z-40">
        <a
          href="#sobre-mi"
          className="group flex items-center gap-1.5 font-sans text-xs md:text-sm font-bold tracking-widest uppercase text-stone-800 hover:text-red-600 transition-all duration-200 px-3 py-1.5 rounded-full hover:bg-black/5"
        >
          <span className="text-stone-400 group-hover:text-red-500 font-mono text-[11px]">[ 01 ]</span>
          <span>INFO</span>
          <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-red-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>

      {/* Esquina Inferior Izquierda: PROYECTOS */}
      <div className="hero-corner absolute bottom-8 left-8 md:bottom-10 md:left-12 z-40">
        <a
          href="#proyectos"
          className="group flex items-center gap-1.5 font-sans text-xs md:text-sm font-bold tracking-widest uppercase text-stone-200 hover:text-red-400 transition-all duration-200 px-3 py-1.5 rounded-full hover:bg-white/10"
        >
          <span className="text-stone-400 group-hover:text-red-400 font-mono text-[11px]">[ 02 ]</span>
          <span>PROYECTOS</span>
          <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-red-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>

      {/* Esquina Inferior Derecha: CONTACTO */}
      <div className="hero-corner absolute bottom-8 right-8 md:bottom-10 md:right-12 z-40">
        <a
          href="#contacto"
          className="group flex items-center gap-1.5 font-sans text-xs md:text-sm font-bold tracking-widest uppercase text-stone-200 hover:text-red-400 transition-all duration-200 px-3 py-1.5 rounded-full hover:bg-white/10"
        >
          <span className="text-stone-400 group-hover:text-red-400 font-mono text-[11px]">[ 03 ]</span>
          <span>CONTACTO</span>
          <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-red-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>
    </section>
  );
}

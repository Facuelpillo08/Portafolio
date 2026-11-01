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
  const silhouetteContainerRef = useRef(null);

  // Coordenadas objetivo (inmediatas) y actuales (interpoladas con inercia elástica)
  const targetMouse = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });
  const isTouching = useRef(false);
  const scrollYRef = useRef(0);
  const isIntroComplete = useRef(false);

  // 1. ENTRADA CINEMATOGRÁFICA PERSONALIZADA (100% GPU / COMPOSITE-ONLY)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { force3D: true },
        onComplete: () => {
          isIntroComplete.current = true;
        }
      });

      // 1. Fondo de estudio: fundido suave inmediato
      tl.fromTo(
        bgRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power2.out' },
        0
      );

      // 2. PRIMERO LA SILUETA: Emerge con presencia protagónica
      tl.fromTo(
        '.hero-silhouette',
        { opacity: 0, y: 30, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: 'power3.out',
          clearProps: 'transform,opacity'
        },
        0.05
      );

      // 3. ENTRAN LAS LETRAS: Se arman con el efecto cromo activo (GPU-accelerated)
      tl.fromTo(
        '.hero-char',
        { opacity: 0, y: -24, scale: 1.1 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.36,
          stagger: 0.028,
          ease: 'power2.out',
          clearProps: 'transform,opacity'
        },
        0.42
      );

      // 4. DESTELLO METÁLICO CROMO (a los 0.90s): El haz cruza a toda velocidad
      tl.fromTo(
        '.hero-destello-beam',
        { xPercent: -130, opacity: 0 },
        { opacity: 1, duration: 0.04 },
        0.90
      );
      tl.to(
        '.hero-destello-beam',
        { xPercent: 250, duration: 0.42, ease: 'power2.inOut' },
        0.90
      );
      tl.to(
        '.hero-destello-beam',
        { opacity: 0, duration: 0.1 },
        1.22
      );

      // 5. VUELVE A LA NORMALIDAD: La capa metálica se desvanece suavemente
      // revelando el rojo esculpido original con transición 100% en opacidad GPU
      tl.to(
        '.hero-char-metallic',
        {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out'
        },
        1.05
      );

      // 6. "DESARROLLADOR WEB" en la capa frontal
      tl.fromTo(
        '.hero-front-char',
        { opacity: 0, y: 14, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.28,
          stagger: 0.016,
          ease: 'power2.out',
          clearProps: 'transform,opacity'
        },
        1.15
      );

      // Destello frontal
      tl.fromTo(
        '.hero-front-destello',
        { xPercent: -120, opacity: 0 },
        { opacity: 1, duration: 0.04 },
        1.44
      );
      tl.to(
        '.hero-front-destello',
        { xPercent: 240, duration: 0.35, ease: 'power2.inOut' },
        1.44
      );
      tl.to(
        '.hero-front-destello',
        { opacity: 0, duration: 0.08 },
        1.70
      );

      // Vuelve a la normalidad el subtítulo
      tl.to(
        '.hero-front-char-metallic',
        {
          opacity: 0,
          duration: 0.45,
          ease: 'power2.out'
        },
        1.50
      );

      // 7. Enlaces editoriales en las esquinas
      tl.fromTo(
        '.hero-corner',
        { opacity: 0, y: -6 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.03,
          ease: 'power2.out',
          clearProps: 'all'
        },
        1.65
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
    let lastMx = -999;
    let lastMy = -999;
    let lastScrollY = -999;

    // Cache DOM queries fuera del loop
    const corners = containerRef.current?.querySelectorAll('.hero-corner');
    const isMobile = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;

    const updatePhysics = () => {
      // En móviles sin interacción táctil activa: oscilación pendular natural (~4s por ciclo)
      if (isMobile && !isTouching.current) {
        const time = performance.now() * 0.001;
        const angle = time * (Math.PI / 2);
        targetMouse.current.x = Math.sin(angle) * 0.65;
        targetMouse.current.y = Math.cos(angle) * 0.25;
      }

      // Interpolación lineal suave (inercia elástica para mouse)
      currentMouse.current.x += (targetMouse.current.x - currentMouse.current.x) * 0.06;
      currentMouse.current.y += (targetMouse.current.y - currentMouse.current.y) * 0.06;

      const mx = currentMouse.current.x;
      const my = currentMouse.current.y;
      const scrollY = scrollYRef.current;

      // Omitir escrituras al DOM si el cambio es imperceptible para liberar la GPU
      if (
        Math.abs(mx - lastMx) > 0.0002 ||
        Math.abs(my - lastMy) > 0.0002 ||
        Math.abs(scrollY - lastScrollY) > 0.5
      ) {
        lastMx = mx;
        lastMy = my;
        lastScrollY = scrollY;

        // Inclinación y traslación por cursor (física escultórica 3D)
        const tiltX = -my * 10;
        const tiltY = mx * 12;
        const shiftX = mx * 26;
        const shiftY = my * 18;

        // ENFOQUE ÓPTICO UNIFICADO (100% GPU COMPOSITE-ONLY CON OPACITY & TRANSFORMS)
        const heroProgress = Math.min(1, Math.max(0, scrollY / (window.innerHeight * 0.95)));
        const opticalFadeProgress = Math.min(1, heroProgress / 0.85);

        // Opacidad progresiva hacia el negro de estudio (#0c0c10)
        const sceneOpacity = Math.max(0, 1 - Math.pow(opticalFadeProgress, 1.25)).toFixed(3);

        // Capa delantera "DESARROLLADOR WEB"
        const frontOpacity = Math.max(0, 1 - heroProgress * 2.8).toFixed(3);
        const frontShiftY = heroProgress * 60;

        // Esquinas
        const cornerOpacity = Math.max(0, 1 - heroProgress * 3.8).toFixed(3);

        // Fondo
        const bgOpacity = Math.max(0, 1 - heroProgress * 1.35).toFixed(3);

        // A) "FACUNDO ACOSTA"
        if (backTitleRef.current) {
          const backY = shiftY * 0.85 - scrollY * 0.22;
          backTitleRef.current.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translate3d(${(shiftX * 0.85).toFixed(1)}px, ${backY.toFixed(1)}px, 0px)`;
          backTitleRef.current.style.opacity = sceneOpacity;
        }

        // B) Silueta
        if (silhouetteContainerRef.current) {
          const silY = -scrollY * 0.16;
          silhouetteContainerRef.current.style.transform = `perspective(1000px) translate3d(0px, ${silY.toFixed(1)}px, 0px)`;
          silhouetteContainerRef.current.style.opacity = sceneOpacity;
        }

        // C) "DESARROLLADOR WEB"
        if (frontTitleRef.current) {
          const frontY = -shiftY * 0.55 + frontShiftY;
          frontTitleRef.current.style.transform = `perspective(1000px) rotateX(${(tiltX * 0.5).toFixed(2)}deg) rotateY(${(tiltY * 0.5).toFixed(2)}deg) translate3d(${(-shiftX * 0.55).toFixed(1)}px, ${frontY.toFixed(1)}px, 0px)`;
          frontTitleRef.current.style.opacity = frontOpacity;
        }

        // D) Fondo de estudio
        if (bgRef.current) {
          bgRef.current.style.transform = `translate3d(0px, ${(scrollY * 0.12).toFixed(1)}px, 0px)`;
          bgRef.current.style.opacity = bgOpacity;
        }

        // E) Esquinas del hero
        if (corners) {
          corners.forEach((corner) => {
            corner.style.opacity = cornerOpacity;
            corner.style.pointerEvents = heroProgress > 0.1 ? 'none' : 'auto';
          });
        }
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
      {/* WRAPPER GENERAL DEL SET CINEMATOGRÁFICO */}
      <div
        ref={zoomWrapperRef}
        className="absolute inset-0 w-full h-full overflow-hidden"
      >
        {/* 1. FONDO DE ESTUDIO FOTOGRÁFICO EN CAPA INDEPENDIENTE (z-0) */}
        <div
          ref={bgRef}
          className="absolute inset-0 z-0 pointer-events-none will-change-[transform,opacity]"
          style={{
            transform: 'translate3d(0px, 0px, 0px)'
          }}
        >
          <img
            src={studioBg}
            alt=""
            aria-hidden="true"
            loading="eager"
            fetchPriority="high"
            decoding="async"
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

        {/* 3. FUSIÓN ATMOSFÉRICA SUAVE (z-5) */}
        <div
          className="absolute inset-x-0 -bottom-1 h-[58vh] pointer-events-none z-5"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(12, 12, 16, 0.08) 20%, rgba(12, 12, 16, 0.35) 45%, rgba(12, 12, 16, 0.72) 70%, rgba(12, 12, 16, 0.94) 88%, #0c0c10 100%)'
          }}
          aria-hidden="true"
        />

        {/* 4. CAPA TRASERA: "FACUNDO ACOSTA" (z-10) */}
        <div
          ref={backTitleRef}
          className="hero-back-title absolute top-[20%] md:top-[16%] left-0 right-0 z-10 flex justify-center items-center pointer-events-none will-change-[transform,opacity]"
          style={{
            transform: 'translate3d(0px, 0px, 0px)'
          }}
        >
          {/* Rayo de destello metálico cromo (GPU Hardware Blend Mode) */}
          <div
            className="hero-destello-beam absolute top-1/2 left-0 w-52 sm:w-72 md:w-96 h-[240%] -translate-y-1/2 -skew-x-25 pointer-events-none opacity-0 z-30 flex items-center justify-center will-change-[transform,opacity]"
            style={{
              mixBlendMode: 'screen'
            }}
            aria-hidden="true"
          >
            <div
              className="w-full h-full"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.15) 20%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.15) 80%, transparent 100%)'
              }}
            />
            {/* Núcleo de alta luminiscencia */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-24 md:h-24 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,200,220,0.8) 30%, rgba(239,68,68,0.4) 60%, transparent 80%)'
              }}
            />
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] md:w-[750px] h-2 md:h-2.5 pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.9) 30%, #ffffff 50%, rgba(255,255,255,0.9) 70%, transparent 100%)'
              }}
            />
          </div>

          <h1
            className="hero-back-text drop-shadow-[0_12px_32px_rgba(220,38,38,0.35)] text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase text-center leading-none px-4 select-none tracking-tight flex justify-center items-center flex-wrap gap-x-4 sm:gap-x-6 md:gap-x-10"
            aria-label="FACUNDO ACOSTA"
          >
            <span className="inline-flex whitespace-nowrap">
              {"FACUNDO".split('').map((char, i) => (
                <span
                  key={`fn-${i}`}
                  className="hero-char relative inline-block will-change-transform"
                >
                  <span className="hero-char-normal inline-block text-metallic-red-back">
                    {char}
                  </span>
                  <span
                    className="hero-char-metallic absolute inset-0 inline-block text-metallic-chrome pointer-events-none select-none will-change-opacity"
                    aria-hidden="true"
                  >
                    {char}
                  </span>
                </span>
              ))}
            </span>
            <span className="inline-flex whitespace-nowrap">
              {"ACOSTA".split('').map((char, i) => (
                <span
                  key={`ln-${i}`}
                  className="hero-char relative inline-block will-change-transform"
                >
                  <span className="hero-char-normal inline-block text-metallic-red-back">
                    {char}
                  </span>
                  <span
                    className="hero-char-metallic absolute inset-0 inline-block text-metallic-chrome pointer-events-none select-none will-change-opacity"
                    aria-hidden="true"
                  >
                    {char}
                  </span>
                </span>
              ))}
            </span>
          </h1>
        </div>

        {/* 5. SILUETA ÚNICA DE FACUNDO (z-20) */}
        <div
          ref={silhouetteContainerRef}
          className="hero-silhouette-container absolute inset-0 z-20 flex items-end justify-center pointer-events-none pb-0 will-change-[transform,opacity]"
          style={{
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            maskImage: 'linear-gradient(to bottom, black 0%, black 80%, transparent 98%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 80%, transparent 98%)'
          }}
        >
          <img
            src={silhouetteImg}
            alt="Facundo Acosta - Desarrollador Web"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width="720"
            height="960"
            className="hero-silhouette h-[88vh] sm:h-[82vh] md:h-[88vh] lg:h-[92vh] max-h-[960px] w-auto object-contain object-bottom drop-shadow-[0_16px_30px_rgba(0,0,0,0.45)] select-none opacity-100 will-change-[transform,opacity]"
            style={{
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            }}
          />
        </div>

        {/* 6. CAPA FRONTAL: "DESARROLLADOR WEB" (z-30) */}
        <div
          ref={frontTitleRef}
          className="hero-front-title absolute bottom-[28%] md:bottom-[23%] left-0 right-0 z-30 flex justify-center items-center pointer-events-none will-change-[transform,opacity]"
          style={{
            transform: 'translate3d(0px, 0px, 0px)'
          }}
        >
          {/* Micro destello frontal metálico */}
          <div
            className="hero-front-destello absolute top-1/2 left-0 w-36 md:w-64 h-[200%] -translate-y-1/2 -skew-x-20 pointer-events-none opacity-0 z-35 flex items-center justify-center will-change-[transform,opacity]"
            style={{
              mixBlendMode: 'screen'
            }}
            aria-hidden="true"
          >
            <div
              className="w-full h-full"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.15) 20%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.15) 80%, transparent 100%)'
              }}
            />
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,200,220,0.8) 30%, rgba(239,68,68,0.4) 60%, transparent 80%)'
              }}
            />
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] md:w-[420px] h-1.5 pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.9) 30%, #ffffff 50%, rgba(255,255,255,0.9) 70%, transparent 100%)'
              }}
            />
          </div>

          <div
            className="hero-front-text drop-shadow-[0_8px_20px_rgba(225,29,72,0.4)] text-lg sm:text-2xl md:text-3xl lg:text-5xl font-black tracking-[0.18em] sm:tracking-[0.26em] uppercase text-center leading-none px-4 select-none flex justify-center items-center flex-wrap gap-x-3 sm:gap-x-4 md:gap-x-6"
            aria-label="DESARROLLADOR WEB"
          >
            <span className="inline-flex whitespace-nowrap">
              {"DESARROLLADOR".split('').map((char, i) => (
                <span
                  key={`sub1-${i}`}
                  className="hero-front-char relative inline-block will-change-transform"
                >
                  <span className="hero-front-normal inline-block text-metallic-red-front">
                    {char}
                  </span>
                  <span
                    className="hero-front-char-metallic absolute inset-0 inline-block text-metallic-front-chrome pointer-events-none select-none will-change-opacity"
                    aria-hidden="true"
                  >
                    {char}
                  </span>
                </span>
              ))}
            </span>
            <span className="inline-flex whitespace-nowrap">
              {"WEB".split('').map((char, i) => (
                <span
                  key={`sub2-${i}`}
                  className="hero-front-char relative inline-block will-change-transform"
                >
                  <span className="hero-front-normal inline-block text-metallic-red-front">
                    {char}
                  </span>
                  <span
                    className="hero-front-char-metallic absolute inset-0 inline-block text-metallic-front-chrome pointer-events-none select-none will-change-opacity"
                    aria-hidden="true"
                  >
                    {char}
                  </span>
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>

      {/* 7. ENLACES EDITORIALES EN LAS 4 ESQUINAS (z-40) */}
      {/* Esquina Superior Izquierda: Identidad */}
      <div className="hero-corner absolute top-8 left-8 md:top-10 md:left-12 z-40">
        <a
          href="#inicio"
          className="group flex flex-col font-mono text-xs uppercase tracking-widest transition-colors"
        >
          <span className="font-extrabold text-sm md:text-base font-sans tracking-tight text-stone-900 group-hover:text-red-600 transition-colors drop-shadow-xs">
            FACUNDO ACOSTA<span className="text-red-500">.</span>
          </span>
          <span className="text-[10px] text-stone-500 tracking-wider">PORTAFOLIO · 2026</span>
        </a>
      </div>

      {/* Esquina Superior Derecha: INFO */}
      <div className="hero-corner absolute top-8 right-8 md:top-10 md:right-12 z-40">
        <a
          href="#sobre-mi"
          className="group flex items-center gap-1.5 font-sans text-xs md:text-sm font-bold tracking-widest uppercase text-stone-800 hover:text-red-600 transition-colors duration-200 px-3 py-1.5 rounded-full hover:bg-black/5"
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
          className="group flex items-center gap-1.5 font-sans text-xs md:text-sm font-bold tracking-widest uppercase text-stone-200 hover:text-red-400 transition-colors duration-200 px-3 py-1.5 rounded-full hover:bg-white/10"
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
          className="group flex items-center gap-1.5 font-sans text-xs md:text-sm font-bold tracking-widest uppercase text-stone-200 hover:text-red-400 transition-colors duration-200 px-3 py-1.5 rounded-full hover:bg-white/10"
        >
          <span className="text-stone-400 group-hover:text-red-400 font-mono text-[11px]">[ 03 ]</span>
          <span>CONTACTO</span>
          <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-red-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>
    </section>
  );
}

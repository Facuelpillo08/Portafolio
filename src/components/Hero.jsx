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

  // 1. ENTRADA CINEMATOGRÁFICA PERSONALIZADA:
  // Silueta primero -> Letras se arman con efecto metálico cromo -> Destello final -> VUELVE A LA NORMALIDAD
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { force3D: true }
      });

      // 1. Fondo de estudio: atmósfera limpia y sobria
      tl.fromTo(
        bgRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.45, ease: 'power2.out' },
        0
      );

      // 2. PRIMERO LA SILUETA: Emerge con presencia protagónica en el set
      tl.fromTo(
        '.hero-silhouette',
        { opacity: 0, y: 35, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          ease: 'power3.out',
          clearProps: 'transform,opacity'
        },
        0.04
      );

      // 3. ENTRAN LAS LETRAS: Se van armando con el efecto METÁLICO CROMO activo
      // Durante el ensamblado, la capa metálica (.hero-char-metallic) tiene opacity: 1
      tl.fromTo(
        '.hero-char',
        {
          opacity: 0,
          y: -26,
          scale: 1.15
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.32,
          stagger: 0.035,
          ease: 'power3.out',
          clearProps: 'transform'
        },
        0.44
      );

      // 4. AL FINAL DEL ARMADO DE LAS LETRAS: DESTELLO METÁLICO (a los 0.95s)
      // A) Destello de sobrecarga en los biseles de la capa metálica
      tl.to(
        '.hero-char-metallic',
        {
          filter: 'brightness(2.6) contrast(1.6)',
          duration: 0.08,
          ease: 'power2.in'
        },
        0.95
      );

      // B) Haz de destello cromo que cruza horizontalmente las letras a gran velocidad
      tl.fromTo(
        '.hero-destello-beam',
        { xPercent: -130, opacity: 0 },
        { opacity: 1, duration: 0.04 },
        0.95
      );
      tl.to(
        '.hero-destello-beam',
        {
          xPercent: 240,
          duration: 0.42,
          ease: 'power2.inOut'
        },
        0.95
      );
      tl.to(
        '.hero-destello-beam',
        { opacity: 0, duration: 0.12 },
        1.25
      );

      // 5. VUELVE A LA NORMALIDAD:
      // La capa metálica se desvanece suavemente tras el destello, revelando el rojo limpio original
      tl.to(
        '.hero-char-metallic',
        {
          opacity: 0,
          filter: 'brightness(1) contrast(1)',
          duration: 0.55,
          ease: 'power2.out'
        },
        1.05
      );

      // 6. "DESARROLLADOR WEB" en la capa frontal (entra metálico, da destello y vuelve a la normalidad)
      tl.fromTo(
        '.hero-front-char',
        {
          opacity: 0,
          y: 16,
          scale: 0.88
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.26,
          stagger: 0.018,
          ease: 'power2.out',
          clearProps: 'transform'
        },
        1.18
      );

      // Destello frontal
      tl.to(
        '.hero-front-char-metallic',
        {
          filter: 'brightness(2.4) contrast(1.5)',
          duration: 0.06,
          ease: 'power2.in'
        },
        1.48
      );
      tl.fromTo(
        '.hero-front-destello',
        { xPercent: -120, opacity: 0 },
        { opacity: 1, duration: 0.04 },
        1.48
      );
      tl.to(
        '.hero-front-destello',
        { xPercent: 230, duration: 0.35, ease: 'power2.inOut' },
        1.48
      );
      tl.to(
        '.hero-front-destello',
        { opacity: 0, duration: 0.1 },
        1.72
      );

      // Vuelve a la normalidad el subtítulo
      tl.to(
        '.hero-front-char-metallic',
        {
          opacity: 0,
          filter: 'brightness(1) contrast(1)',
          duration: 0.45,
          ease: 'power2.out'
        },
        1.54
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
        1.70
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

        // A) "FACUNDO ACOSTA" en capa trasera (z-10, 100% VISIBLE SIEMPRE)
        if (backTitleRef.current) {
          const backY = shiftY * 0.85 - scrollY * 0.22;
          backTitleRef.current.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translate3d(${(shiftX * 0.85).toFixed(1)}px, ${backY.toFixed(1)}px, 0px)`;
        }

        // B) "DESARROLLADOR WEB" en capa delantera (z-30, 100% VISIBLE SIEMPRE)
        if (frontTitleRef.current) {
          const frontY = -shiftY * 0.55 + scrollY * 0.12;
          frontTitleRef.current.style.transform = `perspective(1000px) rotateX(${(tiltX * 0.5).toFixed(2)}deg) rotateY(${(tiltY * 0.5).toFixed(2)}deg) translate3d(${(-shiftX * 0.55).toFixed(1)}px, ${frontY.toFixed(1)}px, 0px)`;
        }

        // C) Fondo de estudio en z-0: parallax suave hacia abajo
        if (bgRef.current) {
          bgRef.current.style.transform = `translate3d(0px, ${(scrollY * 0.18).toFixed(1)}px, 0px)`;
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
          className="absolute inset-0 z-0 pointer-events-none will-change-transform"
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

        {/* 3. FUSIÓN ATMOSFÉRICA SUAVE (z-5) - Fusión continua sin líneas ni crestas con el Manifiesto */}
        <div
          className="absolute inset-x-0 -bottom-1 h-[58vh] pointer-events-none z-5"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(12, 12, 16, 0.08) 20%, rgba(12, 12, 16, 0.35) 45%, rgba(12, 12, 16, 0.72) 70%, rgba(12, 12, 16, 0.94) 88%, #0c0c10 100%)'
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
          {/* Rayo de destello metálico cromo que barre las letras */}
          <div
            className="hero-destello-beam absolute top-1/2 left-0 w-44 sm:w-64 md:w-80 h-[220%] -translate-y-1/2 -skew-x-25 pointer-events-none opacity-0 z-30 flex items-center justify-center will-change-[transform,opacity]"
            style={{
              mixBlendMode: 'screen',
              filter: 'drop-shadow(0 0 20px rgba(255,255,255,1)) drop-shadow(0 0 50px rgba(255,100,120,0.8))'
            }}
            aria-hidden="true"
          >
            <div
              className="w-full h-full"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 20%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.1) 80%, transparent 100%)'
              }}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-14 md:h-14 bg-white rounded-full blur-[1px] shadow-[0_0_35px_18px_#ffffff,0_0_70px_35px_rgba(255,60,90,0.8)]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[480px] md:w-[700px] h-1 md:h-1.5 bg-white blur-[0.5px] shadow-[0_0_18px_5px_#ffffff,0_0_35px_10px_rgba(255,80,100,0.7)]" />
          </div>

          <h1
            className="hero-back-text text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase text-center leading-none px-4 select-none tracking-tight flex justify-center items-center flex-wrap gap-x-4 sm:gap-x-6 md:gap-x-10"
            aria-label="FACUNDO ACOSTA"
          >
            <span className="inline-flex whitespace-nowrap">
              {"FACUNDO".split('').map((char, i) => (
                <span
                  key={`fn-${i}`}
                  className="hero-char relative inline-block will-change-[transform,opacity]"
                >
                  {/* Capa de estado normal: Rojo esculpido original */}
                  <span className="hero-char-normal inline-block text-metallic-red-back">
                    {char}
                  </span>
                  {/* Capa de efecto metálico cromo: Activa SOLO durante la entrada y destello */}
                  <span
                    className="hero-char-metallic absolute inset-0 inline-block text-metallic-chrome pointer-events-none select-none will-change-[opacity,filter]"
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
                  className="hero-char relative inline-block will-change-[transform,opacity]"
                >
                  {/* Capa de estado normal: Rojo esculpido original */}
                  <span className="hero-char-normal inline-block text-metallic-red-back">
                    {char}
                  </span>
                  {/* Capa de efecto metálico cromo: Activa SOLO durante la entrada y destello */}
                  <span
                    className="hero-char-metallic absolute inset-0 inline-block text-metallic-chrome pointer-events-none select-none will-change-[opacity,filter]"
                    aria-hidden="true"
                  >
                    {char}
                  </span>
                </span>
              ))}
            </span>
          </h1>
        </div>

        {/* 5. SILUETA ÚNICA DE FACUNDO (z-20) - Capa GPU dedicada, inamovible, 100% visible siempre */}
        <div
          className="hero-silhouette-container absolute inset-0 z-20 flex items-end justify-center pointer-events-none pb-0"
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

        {/* 6. CAPA FRONTAL: "DESARROLLADOR WEB" (z-30) - Delante de la silueta */}
        <div
          ref={frontTitleRef}
          className="hero-front-title absolute bottom-[28%] md:bottom-[23%] left-0 right-0 z-30 flex justify-center items-center pointer-events-none will-change-transform"
          style={{
            transform: 'translate3d(0px, 0px, 0px)'
          }}
        >
          {/* Micro destello frontal metálico */}
          <div
            className="hero-front-destello absolute top-1/2 left-0 w-32 md:w-56 h-[180%] -translate-y-1/2 -skew-x-20 pointer-events-none opacity-0 z-35 flex items-center justify-center will-change-[transform,opacity]"
            style={{
              mixBlendMode: 'screen',
              filter: 'drop-shadow(0 0 15px rgba(255,255,255,1)) drop-shadow(0 0 35px rgba(255,100,120,0.7))'
            }}
            aria-hidden="true"
          >
            <div
              className="w-full h-full"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 20%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.1) 80%, transparent 100%)'
              }}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 md:w-10 md:h-10 bg-white rounded-full blur-[1px] shadow-[0_0_25px_12px_#ffffff,0_0_50px_25px_rgba(255,60,90,0.8)]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] md:w-[400px] h-1 bg-white blur-[0.5px] shadow-[0_0_15px_4px_#ffffff,0_0_30px_8px_rgba(255,80,100,0.7)]" />
          </div>

          <div
            className="hero-front-text text-lg sm:text-2xl md:text-3xl lg:text-5xl font-black tracking-[0.18em] sm:tracking-[0.26em] uppercase text-center leading-none px-4 select-none flex justify-center items-center flex-wrap gap-x-3 sm:gap-x-4 md:gap-x-6"
            aria-label="DESARROLLADOR WEB"
          >
            <span className="inline-flex whitespace-nowrap">
              {"DESARROLLADOR".split('').map((char, i) => (
                <span
                  key={`sub1-${i}`}
                  className="hero-front-char relative inline-block will-change-[transform,opacity]"
                >
                  <span className="hero-front-normal inline-block text-metallic-red-front">
                    {char}
                  </span>
                  <span
                    className="hero-front-char-metallic absolute inset-0 inline-block text-metallic-front-chrome pointer-events-none select-none will-change-[opacity,filter]"
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
                  className="hero-front-char relative inline-block will-change-[transform,opacity]"
                >
                  <span className="hero-front-normal inline-block text-metallic-red-front">
                    {char}
                  </span>
                  <span
                    className="hero-front-char-metallic absolute inset-0 inline-block text-metallic-front-chrome pointer-events-none select-none will-change-[opacity,filter]"
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
          <span className="text-[10px] text-stone-500 tracking-wider">PORTAFOLIO · 2026</span>
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

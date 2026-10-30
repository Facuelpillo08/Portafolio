import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import gsap from 'gsap';

export default function NotFound() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const spotlightRef = useRef(null);
  const contentRef = useRef(null);
  const numberRef = useRef(null);
  const overlayRef = useRef(null);

  // Coordenadas del mouse (objetivo e interpoladas con inercia para fluidez Awwwards)
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
  });
  const [isExiting, setIsExiting] = useState(false);

  // Inicializar Spotlight y GSAP animations
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Actualizar título de pestaña
    const originalTitle = document.title;
    document.title = '404 // Hola perdida | Facundo Acosta';

    // Resetear scroll al montar la página de error
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
    }

    // Coordenadas iniciales en el centro de la pantalla
    const initX = window.innerWidth / 2;
    const initY = window.innerHeight * 0.42;
    targetPos.current = { x: initX, y: initY };
    currentPos.current = { x: initX, y: initY };

    // Animar entrada cinematográfica con GSAP
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 1. Fondo y número 404 emergen desde la penumbra
      tl.fromTo(
        numberRef.current,
        { opacity: 0, scale: 0.88, y: 30, filter: 'blur(10px)' },
        { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', duration: 1.1 },
        0
      );

      // 2. Textos y botón emergen en cascada
      tl.fromTo(
        '.reveal-item',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.85, stagger: 0.12 },
        0.3
      );

      // 3. Levitación suave y continua del número 404
      gsap.to(numberRef.current, {
        y: '-=12',
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, containerRef);

    // Ticker para interpolación de spotlight (lerp suave)
    const checkIsTouch = () =>
      window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;

    let animationFrameId;
    const updateSpotlight = () => {
      if (!checkIsTouch() && spotlightRef.current) {
        // Factor de inercia elástica (0.12)
        currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.12;
        currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.12;

        spotlightRef.current.style.background = `radial-gradient(650px circle at ${currentPos.current.x}px ${currentPos.current.y}px, rgba(255, 255, 255, 0.08) 0%, rgba(220, 38, 38, 0.22) 28%, rgba(220, 38, 38, 0.04) 55%, transparent 75%)`;
      }
      animationFrameId = requestAnimationFrame(updateSpotlight);
    };

    if (!checkIsTouch()) {
      animationFrameId = requestAnimationFrame(updateSpotlight);
    }

    const handleMouseMove = (e) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleResize = () => {
      setIsTouchDevice(checkIsTouch());
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      document.title = originalTitle;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      ctx.revert();
    };
  }, []);

  // Transición cinemática de salida al hacer clic en 'Volver al inicio'
  const handleReturnHome = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);

    const tl = gsap.timeline({
      onComplete: () => {
        // Reset de scroll inmediato para entrar al Home en la posición 0
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          if (window.__lenis) {
            window.__lenis.scrollTo(0, { immediate: true });
          }
        }
        navigate('/');
      },
    });

    // 1. Desvanecer y comprimir contenido suavemente
    tl.to(contentRef.current, {
      opacity: 0,
      scale: 0.94,
      y: -25,
      filter: 'blur(6px)',
      duration: 0.5,
      ease: 'power3.inOut',
    });

    // 2. Fundir cortina oscura cinematográfica
    tl.to(
      overlayRef.current,
      {
        opacity: 1,
        duration: 0.45,
        ease: 'power2.inOut',
      },
      0.15
    );
  }, [isExiting, navigate]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full bg-[#0c0c10] text-stone-100 flex flex-col items-center justify-center overflow-hidden select-none px-4 sm:px-6"
    >
      {/* CAPA 1: Grilla arquitectónica sutil */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
        aria-hidden="true"
      />

      {/* CAPA 2: Haz de luz / Spotlight interactivo */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={
          isTouchDevice
            ? {
                background:
                  'radial-gradient(520px circle at 50% 42%, rgba(255, 255, 255, 0.08) 0%, rgba(220, 38, 38, 0.24) 30%, rgba(220, 38, 38, 0.05) 60%, transparent 80%)',
              }
            : undefined
        }
        aria-hidden="true"
      />

      {/* CAPA 3: Glow ambiental de fondo (brillo rojo escultural central) */}
      <div
        className="absolute w-[340px] sm:w-[520px] md:w-[700px] h-[340px] sm:h-[520px] md:h-[700px] rounded-full bg-red-600/10 blur-[120px] pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      />

      {/* CONTENEDOR CENTRAL */}
      <div
        ref={contentRef}
        className="relative z-10 max-w-2xl w-full flex flex-col items-center text-center py-12"
      >
        {/* Etiqueta de coordenada / radar técnico */}
        <div className="reveal-item inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md mb-6 shadow-xl">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-stone-300">
            ERROR 404 // COORDENADA NO REGISTRADA
          </span>
        </div>

        {/* NÚMERO 404 MONUMENTAL ESCULPIDO */}
        <div
          ref={numberRef}
          className="relative my-2 select-none"
          aria-label="Código 404"
        >
          {/* Sombra proyectada profunda */}
          <span
            className="absolute inset-0 text-7xl sm:text-9xl md:text-[13rem] lg:text-[15rem] font-black font-display tracking-tighter text-black/60 blur-md select-none transform translate-y-3 pointer-events-none"
            aria-hidden="true"
          >
            404
          </span>

          {/* Letras 404 metálicas con reflejo escultural */}
          <span
            className="relative block text-7xl sm:text-9xl md:text-[13rem] lg:text-[15rem] font-black font-display tracking-tighter leading-none text-transparent bg-clip-text select-none drop-shadow-[0_20px_50px_rgba(220,38,38,0.3)]"
            style={{
              backgroundImage:
                'linear-gradient(180deg, #ffffff 0%, #d4d4d8 35%, #71717a 70%, #27272a 100%)',
            }}
          >
            404
          </span>
        </div>

        {/* TITULAR: "Hola perdida" */}
        <h1 className="reveal-item text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-display tracking-tight text-white mt-4 drop-shadow-lg">
          Hola perdida...
        </h1>

        {/* SUBTÍTULO DESCRIPTIVO */}
        <p className="reveal-item text-stone-300/90 text-sm sm:text-base md:text-lg max-w-lg mx-auto mt-4 px-2 font-light leading-relaxed">
          ¿Te perdiste en el camino o solo pasabas a saludar? Esta coordenada no
          existe en el estudio, pero el resto de las obras te están esperando.
        </p>

        {/* BOTÓN PROTAGONISTA: VOLVER AL INICIO */}
        <div className="reveal-item mt-8 sm:mt-10">
          <button
            type="button"
            onClick={handleReturnHome}
            disabled={isExiting}
            aria-label="Volver al inicio del portafolio"
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-stone-900/90 hover:bg-red-600 text-stone-100 hover:text-white font-medium text-sm sm:text-base border border-white/20 hover:border-red-500/80 shadow-[0_10px_35px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_40px_rgba(220,38,38,0.4)] backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Volver al inicio</span>
            <Compass className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:rotate-45 transition-all duration-300" />
          </button>
        </div>
      </div>

      {/* CORTINA CINEMATOGRÁFICA DE SALIDA */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-[#0c0c10] opacity-0 pointer-events-none z-50 transition-opacity"
        aria-hidden="true"
      />
    </div>
  );
}

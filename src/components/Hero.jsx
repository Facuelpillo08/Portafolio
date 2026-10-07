import { useEffect, useRef, useState } from 'react';
import studioBg from '../assets/studio_background.jpg';
import silhouetteImg from '../assets/silhouette.png';
import { ArrowUpRight } from 'lucide-react';

export default function Hero() {
  const containerRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  // Coordenadas objetivo (inmediatas) y actuales (interpoladas con inercia elástica)
  const targetMouse = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });
  const [springPos, setSpringPos] = useState({ x: 0, y: 0 });

  // Escuchar scroll para animar el parallax en Z de las capas de texto
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // FÍSICA ELÁSTICA CONTINUA CON INERCIA (LERP / Spring Physics a 60 FPS)
  useEffect(() => {
    let animId;

    const updatePhysics = () => {
      // Interpolación lineal suave: factor 0.055 da una inercia pesada y elegante
      currentMouse.current.x += (targetMouse.current.x - currentMouse.current.x) * 0.055;
      currentMouse.current.y += (targetMouse.current.y - currentMouse.current.y) * 0.055;

      setSpringPos({
        x: currentMouse.current.x,
        y: currentMouse.current.y
      });

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

  // Progreso de scroll normalizado (0 a 1)
  const scrollProgress = Math.min(scrollY / 650, 1.3);

  // Inclinación y traslación escultórica basada en la física de resorte (Spring)
  const tiltX = -springPos.y * 8 - scrollProgress * 10;
  const tiltY = springPos.x * 10;
  const shiftX = springPos.x * 18;
  const shiftY = springPos.y * 12;

  return (
    <section
      id="inicio"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-screen min-h-screen flex items-center justify-center overflow-hidden bg-[#e8e8ea] select-none perspective-container"
      aria-label="Portada del portafolio de Facundo Acosta"
    >
      {/* 1. FONDO DE ESTUDIO FOTOGRÁFICO */}
      <div
        className="absolute inset-0 z-0 pointer-events-none transition-transform duration-100 ease-out"
        style={{
          transform: `translateY(${scrollY * 0.12}px)`
        }}
      >
        <img
          src={studioBg}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* 2. VIÑETA SUAVE Y ELEGANTE EN LOS BORDES DE LA PANTALLA */}
      <div
        className="absolute inset-0 z-2 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0, 0, 0, 0.06) 75%, rgba(0, 0, 0, 0.25) 100%)'
        }}
      />
      {/* Suave degradado inferior para fundir con la sección oscura */}
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-b from-transparent via-[#0c0c10]/40 to-[#0c0c10] z-25 pointer-events-none" />

      {/* 3. ENLACES EDITORIALES EN LAS ESQUINAS DEL HERO */}
      {/* Esquina Superior Izquierda: Identidad */}
      <div className="absolute top-8 left-8 md:top-10 md:left-12 z-40">
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
      <div className="absolute top-8 right-8 md:top-10 md:right-12 z-40">
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
      <div className="absolute bottom-8 left-8 md:bottom-10 md:left-12 z-40">
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
      <div className="absolute bottom-8 right-8 md:bottom-10 md:right-12 z-40">
        <a
          href="#contacto"
          className="group flex items-center gap-1.5 font-sans text-xs md:text-sm font-bold tracking-widest uppercase text-stone-200 hover:text-red-400 transition-all duration-200 px-3 py-1.5 rounded-full hover:bg-white/10"
        >
          <span className="text-stone-400 group-hover:text-red-400 font-mono text-[11px]">[ 03 ]</span>
          <span>CONTACTO</span>
          <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-red-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>

      {/* 4. CAPA TRASERA: "FACUNDO ACOSTA" (Z-10) - Profundidad Cinemática Desacoplada (Depth Parallax) */}
      <div
        className="absolute top-[20%] md:top-[16%] left-0 right-0 z-10 flex justify-center items-center pointer-events-none preserve-3d"
        style={{
          transform: `translate3d(${shiftX * 0.85}px, ${shiftY * 0.85 - scrollProgress * 100}px, ${-90 - scrollProgress * 150}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          willChange: 'transform'
        }}
      >
        <h1
          className="text-metallic-red-back text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase text-center leading-none px-4"
          aria-label="FACUNDO ACOSTA"
        >
          FACUNDO ACOSTA
        </h1>
      </div>

      {/* 5. SILUETA ÚNICA DE FACUNDO (Z-20): 100% FIJA, ANCLADA EN EL PLANO MEDIO */}
      <div className="absolute inset-0 z-20 flex items-end justify-center pointer-events-none pb-0">
        <img
          src={silhouetteImg}
          alt="Facundo Acosta - Desarrollador Web"
          className="h-[78vh] sm:h-[82vh] md:h-[88vh] lg:h-[92vh] max-h-[960px] w-auto object-contain object-bottom drop-shadow-[0_25px_45px_rgba(0,0,0,0.5)] select-none"
        />
      </div>

      {/* 6. CAPA FRONTAL: "DESARROLLADOR WEB" (Z-30) - Capa Frontal Desacoplada en Contrafase */}
      <div
        className="absolute bottom-[28%] md:bottom-[23%] left-0 right-0 z-30 flex justify-center items-center pointer-events-none preserve-3d"
        style={{
          transform: `translate3d(${-shiftX * 0.45}px, ${-shiftY * 0.45 + scrollProgress * 55}px, ${65 + scrollProgress * 50}px) rotateX(${tiltX * 0.5}deg) rotateY(${tiltY * 0.5}deg)`,
          willChange: 'transform'
        }}
      >
        <div
          className="text-metallic-red-front text-lg sm:text-2xl md:text-3xl lg:text-5xl font-black tracking-[0.18em] sm:tracking-[0.26em] uppercase text-center leading-none px-4"
          aria-label="DESARROLLADOR WEB"
        >
          DESARROLLADOR WEB
        </div>
      </div>
    </section>
  );
}



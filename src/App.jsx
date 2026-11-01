import { useState, useEffect, useRef, useMemo } from 'react';
import { HashRouter, Routes, Route, useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import FeaturedProjects from './components/FeaturedProjects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import NotFound from './components/NotFound';
import { ChevronUp } from 'lucide-react';
import { SmoothScrollProvider } from './context/SmoothScrollContext';
import { useLenis } from './hooks/useLenis';
import { useSectionTransitions } from './hooks/useSectionTransitions';

function PortfolioPage() {
  const { onScroll, scrollTo } = useLenis();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const mainRef = useRef(null);

  // Referencias individuales para cada una de las 5 láminas escultóricas
  const heroPanelRef = useRef(null);
  const aboutPanelRef = useRef(null);
  const projectsPanelRef = useRef(null);
  const skillsPanelRef = useRef(null);
  const contactPanelRef = useRef(null);

  // Pares de transición Awwwards Stacked Layers 3D (Láminas Apilables en Cascada)
  const transitionPairs = useMemo(
    () => [
      { outgoing: heroPanelRef, incoming: aboutPanelRef },
      { outgoing: aboutPanelRef, incoming: projectsPanelRef },
      { outgoing: projectsPanelRef, incoming: skillsPanelRef },
      { outgoing: skillsPanelRef, incoming: contactPanelRef },
    ],
    []
  );

  // Hook que orquesta la transición Awwwards Curtain Reveal 3D entre secciones
  useSectionTransitions(transitionPairs, mainRef);

  // Escuchar scroll a través de Lenis para el botón flotante
  useEffect(() => {
    const unsubscribe = onScroll(({ scroll }) => {
      setShowScrollTop(scroll > 450);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [onScroll]);

  const scrollToTop = () => {
    scrollTo(0, { duration: 1.35 });
  };

  return (
    <div className="min-h-screen bg-[#0c0c10] text-stone-100 selection:bg-red-600 selection:text-white relative overflow-x-clip">
      {/* Navegación rápida flotante */}
      <Navbar />

      {/* CONTENIDO PRINCIPAL: LÁMINAS APILABLES (Z-10) */}
      <main
        ref={mainRef}
        className="relative z-10 bg-[#0c0c10] overflow-x-clip"
      >
        {/* PANEL 0: HERO (Z-10) - BASE DE ESTUDIO LUMINOSO */}
        <section
          ref={heroPanelRef}
          className="curtain-slab-panel relative z-10 w-full"
        >
          <Hero />
        </section>

        {/* PANEL 1: MANIFIESTO (SOBRE MÍ) (Z-20) - LÁMINA OSCURA ESCULPIDA */}
        <section
          ref={aboutPanelRef}
          className="curtain-slab-panel relative z-20 w-full rounded-t-[32px] sm:rounded-t-[40px] md:rounded-t-[48px] bg-[#0c0c10] curtain-slab-dark"
        >
          <About />
        </section>

        {/* PANEL 2: PROYECTOS DESTACADOS (Z-30) - LÁMINA BLANCA DE VIDRIO ESMERILADO CON PINNING 3D */}
        <FeaturedProjects containerRef={projectsPanelRef} />

        {/* PANEL 3: HABILIDADES & STACK (Z-40) - LÁMINA OSCURA ESCULPIDA */}
        <section
          ref={skillsPanelRef}
          className="curtain-slab-panel relative z-40 w-full rounded-t-[32px] sm:rounded-t-[40px] md:rounded-t-[48px] bg-[#0c0c10] curtain-slab-dark -mt-[100vh]"
        >
          <Skills />
        </section>

        {/* PANEL 4: CONTACTO (Z-50) - LÁMINA BLANCA RADIANTE (CIERRE FINAL) */}
        <section
          ref={contactPanelRef}
          className="curtain-slab-panel relative z-50 w-full rounded-t-[32px] sm:rounded-t-[40px] md:rounded-t-[48px] bg-[#f8f9fb] curtain-slab-light"
        >
          <Contact />
        </section>
      </main>

      {/* Botón flotante sutil para volver al inicio */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Volver al inicio"
        className={`fixed bottom-20 right-4 md:bottom-8 md:right-8 z-40 p-3 rounded-full bg-stone-900/95 hover:bg-red-600 text-white border border-white/20 shadow-2xl overflow-hidden hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer ${
          showScrollTop ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <ChevronUp className="w-5 h-5" />
      </button>
    </div>
  );
}

const VALID_SECTIONS = ['inicio', 'sobre-mi', 'proyectos', 'habilidades', 'contacto'];

function SectionRouteHandler() {
  const { section } = useParams();
  if (VALID_SECTIONS.includes(section)) {
    return <PortfolioPage />;
  }
  return <NotFound />;
}

export default function App() {
  return (
    <HashRouter>
      <SmoothScrollProvider>
        <Routes>
          <Route path="/" element={<PortfolioPage />} />
          <Route path="/:section" element={<SectionRouteHandler />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SmoothScrollProvider>
    </HashRouter>
  );
}

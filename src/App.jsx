import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import FeaturedProjects from './components/FeaturedProjects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { ChevronUp } from 'lucide-react';

export default function App() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollRatio, setScrollRatio] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollRatio(Math.min(1, Math.max(0, window.scrollY / totalScroll)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0c0c10] text-stone-100 selection:bg-red-600 selection:text-white">
      {/* Barra de progreso de lectura / scroll editorial superior */}
      <div
        className="fixed top-0 left-0 right-0 h-[2.5px] z-50 bg-gradient-to-r from-red-600 via-rose-500 to-red-600 shadow-[0_0_12px_rgba(239,68,68,0.85)] origin-left pointer-events-none transition-transform duration-75 ease-out"
        style={{ transform: `scaleX(${scrollRatio})` }}
        aria-hidden="true"
      />

      {/* Navegación rápida flotante (aparece al scrollear después del Hero) */}
      <Navbar />

      <main className="relative">
        <Hero />
        {/* El Manifiesto y las secciones siguientes fluyen con el scroll natural */}
        <div className="relative z-10 bg-[#0c0c10] -mt-px">
          <About />
          <FeaturedProjects />
          <Skills />
          <Contact />
        </div>
      </main>

      <Footer />

      {/* Botón flotante sutil para volver al inicio al bajar */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Volver al inicio"
        className={`fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 p-3 rounded-full bg-stone-900/95 hover:bg-red-600 text-white border border-white/20 shadow-2xl overflow-hidden hover:scale-110 active:scale-95 transition-all duration-300 ${
          showScrollTop ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <ChevronUp className="w-5 h-5" />
      </button>
    </div>
  );
}

import { useState, useEffect } from 'react';
import Hero from './components/Hero';
import About from './components/About';
import FeaturedProjects from './components/FeaturedProjects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { ChevronUp } from 'lucide-react';

export default function App() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0c0c10] text-stone-100 selection:bg-red-600 selection:text-white">
      <main>
        <Hero />
        <About />
        <FeaturedProjects />
        <Skills />
        <Contact />
      </main>

      <Footer />

      {/* Botón flotante sutil para volver al inicio al bajar */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Volver al inicio"
        className={`fixed bottom-6 right-6 z-50 p-3 rounded-full bg-stone-900/90 hover:bg-red-600 text-white backdrop-blur-md border border-white/20 shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 ${
          showScrollTop ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <ChevronUp className="w-5 h-5" />
      </button>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Layers } from 'lucide-react';

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('inicio');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
      const sections = ['inicio', 'sobre-mi', 'proyectos', 'habilidades', 'contacto'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <nav
        aria-label="Navegación principal"
        className={`max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between transition-all duration-300 ${
          scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-black/5' : 'bg-transparent'
        }`}
      >
        <div>
          <a
            href="#inicio"
            className="text-stone-900 font-extrabold tracking-widest text-sm md:text-base hover:text-red-600 transition-colors uppercase"
          >
            FA<span className="text-red-600">.</span>
          </a>
        </div>

        <ul className="flex items-center gap-6 md:gap-10 text-xs md:text-sm font-semibold tracking-wider uppercase text-stone-700">
          <li>
            <a
              href="#sobre-mi"
              className={`hover:text-red-600 transition-colors py-1 ${
                activeSection === 'sobre-mi' ? 'text-stone-950' : 'text-stone-600'
              }`}
            >
              Info
            </a>
          </li>
          <li>
            <a
              href="#proyectos"
              className={`relative flex items-center gap-1.5 hover:text-red-600 transition-colors py-1 ${
                activeSection === 'proyectos' ? 'text-stone-950 font-bold' : 'text-stone-600'
              }`}
            >
              <span>Proyectos</span>
              <Layers className="w-4 h-4 text-red-600" aria-hidden="true" />
              {activeSection === 'proyectos' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
              )}
            </a>
          </li>
          <li>
            <a
              href="#habilidades"
              className={`hidden sm:inline-block hover:text-red-600 transition-colors py-1 ${
                activeSection === 'habilidades' ? 'text-stone-950' : 'text-stone-600'
              }`}
            >
              Habilidades
            </a>
          </li>
          <li>
            <a
              href="#contacto"
              className={`hover:text-red-600 transition-colors py-1 ${
                activeSection === 'contacto' ? 'text-stone-950' : 'text-stone-600'
              }`}
            >
              Contacto
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

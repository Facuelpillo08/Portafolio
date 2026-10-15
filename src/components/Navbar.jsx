import { useState, useEffect, useRef } from 'react';
import { Home, User, FolderGit2, Code2, Mail } from 'lucide-react';

const SECTIONS = ['inicio', 'sobre-mi', 'proyectos', 'habilidades', 'contacto'];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      if (SECTIONS.includes(hash)) return hash;
    }
    return 'inicio';
  });

  const [visible, setVisible] = useState(false);
  const isLocked = useRef(false);
  const unlockTimer = useRef(null);

  // Navegación fluida y bloqueo temporal del espía mientras se ejecuta el smooth scroll
  const scrollToSection = (id) => {
    setActiveSection(id);
    isLocked.current = true;
    if (unlockTimer.current) clearTimeout(unlockTimer.current);

    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }

    if (window.history.pushState) {
      window.history.pushState(null, '', `#${id}`);
    }

    // Desbloquear cuando el scroll realmente termina
    let debounceTimer;
    const onScrollStop = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        isLocked.current = false;
        window.removeEventListener('scroll', onScrollStop);
        window.removeEventListener('scrollend', onScrollEnd);
      }, 150);
    };

    const onScrollEnd = () => {
      isLocked.current = false;
      clearTimeout(debounceTimer);
      window.removeEventListener('scroll', onScrollStop);
      window.removeEventListener('scrollend', onScrollEnd);
    };

    window.addEventListener('scroll', onScrollStop, { passive: true });
    if ('onscrollend' in window) {
      window.addEventListener('scrollend', onScrollEnd, { once: true });
    }

    // Seguro de escape: máximo 1800ms
    unlockTimer.current = setTimeout(onScrollEnd, 1800);
  };

  useEffect(() => {
    // 1. Interceptar clics en enlaces de sección de toda la aplicación (Hero, Nav, Footer, About)
    const handleDocumentClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const targetId = href.replace('#', '');
      if (SECTIONS.includes(targetId)) {
        e.preventDefault();
        scrollToSection(targetId);
      }
    };

    document.addEventListener('click', handleDocumentClick);

    // 2. Cálculo de visibilidad y sección activa por dominancia visual en el viewport
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        ticking = false;
        const scrollY = window.scrollY;
        setVisible(scrollY > 350);

        if (isLocked.current) return;

        // A. Zona de cabecera / inicio
        if (scrollY < 200) {
          setActiveSection('inicio');
          return;
        }

        // B. Final de página garantizado: contacto
        const isBottom = window.innerHeight + scrollY >= document.documentElement.scrollHeight - 80;
        if (isBottom) {
          setActiveSection('contacto');
          return;
        }

        // C. Puntuación de dominancia visual con ponderación de línea focal de lectura (42% del viewport)
        const vHeight = window.innerHeight;
        const focalLine = vHeight * 0.42;

        let bestSection = null;
        let maxScore = -Infinity;

        for (const id of SECTIONS) {
          const el = document.getElementById(id);
          if (!el) continue;

          const rect = el.getBoundingClientRect();
          const visibleTop = Math.max(0, rect.top);
          const visibleBottom = Math.min(vHeight, rect.bottom);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);

          if (visibleHeight <= 0) continue;

          // Bono fuerte si la sección intersecta la línea focal de lectura principal
          const hasFocal = rect.top <= focalLine && rect.bottom > focalLine;
          const score = visibleHeight + (hasFocal ? vHeight * 0.85 : 0);

          if (score > maxScore) {
            maxScore = score;
            bestSection = id;
          }
        }

        if (bestSection) {
          setActiveSection(bestSection);
        }
      });
    };

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (SECTIONS.includes(hash)) {
        scrollToSection(hash);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('hashchange', handleHashChange);
    handleScroll();

    return () => {
      document.removeEventListener('click', handleDocumentClick);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hashchange', handleHashChange);
      if (unlockTimer.current) clearTimeout(unlockTimer.current);
    };
  }, []);

  const navLinks = [
    { id: 'inicio', label: 'Inicio', tag: '00', icon: Home },
    { id: 'sobre-mi', label: 'Sobre mí', tag: '01', icon: User },
    { id: 'proyectos', label: 'Proyectos', tag: '02', icon: FolderGit2 },
    { id: 'habilidades', label: 'Habilidades', tag: '03', icon: Code2 },
    { id: 'contacto', label: 'Contacto', tag: '04', icon: Mail }
  ];

  return (
    <>
      {/* 1. DOCK VERTICAL LATERAL - SOLO EN PANTALLAS ULTRA-ANCHAS (>= 1380px) DONDE NO TAPA TEXTO */}
      <aside
        aria-label="Navegación lateral de sección"
        className={`hidden min-[1380px]:flex fixed right-6 2xl:right-8 top-1/2 -translate-y-1/2 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          visible
            ? 'opacity-100 translate-x-0 pointer-events-auto'
            : 'opacity-0 translate-x-10 pointer-events-none'
        }`}
      >
        <nav
          className="relative p-1.5 rounded-full bg-white/[0.04] backdrop-blur-2xl border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.22),0_20px_45px_rgba(0,0,0,0.65)]"
        >
          {/* Luz ambiental sutil dentro de la cápsula */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/[0.06] to-transparent pointer-events-none" />

          <ul className="relative flex flex-col items-center gap-1.5">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              const Icon = link.icon;

              return (
                <li key={link.id} className="relative">
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.id);
                    }}
                    aria-label={link.label}
                    className={`group/item relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-b from-red-500/25 to-rose-600/15 text-white border border-red-500/35 shadow-[0_0_18px_rgba(239,68,68,0.35),inset_0_1px_1px_rgba(255,255,255,0.2)] scale-105'
                        : 'text-stone-400 hover:text-white hover:bg-white/[0.07] hover:scale-105 border border-transparent'
                    }`}
                  >
                    <Icon className="w-4 h-4 stroke-[1.65] transition-transform duration-200 group-hover/item:scale-110" />

                    {/* Indicador de sección activa: punto sutil líquido */}
                    {isActive && (
                      <span
                        className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_8px_rgba(239,68,68,1)] animate-pulse"
                        aria-hidden="true"
                      />
                    )}

                    {/* Tooltip lateral flotante hacia la izquierda estilo Liquid Glass */}
                    <span
                      role="tooltip"
                      className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1.5 rounded-full bg-[#0c0c10]/85 backdrop-blur-xl border border-white/15 text-stone-200 font-mono text-[11px] uppercase tracking-wider shadow-[0_12px_35px_rgba(0,0,0,0.7)] opacity-0 translate-x-2 pointer-events-none group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-200 ease-out whitespace-nowrap flex items-center gap-2"
                    >
                      <span className="text-red-400 font-bold">[ {link.tag} ]</span>
                      <span>{link.label}</span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* 2. BARRA FLOTANTE INFERIOR - CÁPSULA LÍQUIDA (MÓVIL, TABLETS Y LAPTOPS < 1380px PARA NO TAPAR CONTENIDO) */}
      <header
        className={`min-[1380px]:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out ${
          visible
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-8 pointer-events-none'
        }`}
      >
        <nav
          aria-label="Navegación general"
          className="relative p-1.5 sm:p-2 rounded-full bg-white/[0.05] backdrop-blur-2xl border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_15px_35px_rgba(0,0,0,0.75)]"
        >
          <ul className="flex items-center gap-1.5 sm:gap-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              const Icon = link.icon;
              return (
                <li key={link.id} className="relative group/mob">
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.id);
                    }}
                    aria-label={link.label}
                    className={`flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-b from-red-500/30 to-rose-600/20 text-white border border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.35)]'
                        : 'text-stone-400 hover:text-white hover:bg-white/[0.06]'
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.65]" />
                  </a>

                  {/* Tooltip flotante superior para pantallas medianas (tablet/laptops pequeñas) */}
                  <span
                    role="tooltip"
                    className="hidden sm:flex absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 px-2.5 py-1 rounded-full bg-[#0c0c10]/95 backdrop-blur-md border border-white/15 text-stone-200 font-mono text-[10px] uppercase tracking-wider shadow-lg opacity-0 pointer-events-none group-hover/mob:opacity-100 transition-opacity duration-150 whitespace-nowrap"
                  >
                    {link.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>
    </>
  );
}

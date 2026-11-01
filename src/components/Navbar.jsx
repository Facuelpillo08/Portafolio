import { useState, useEffect, useRef, useCallback } from 'react';
import { Home, User, FolderGit2, Code2, Mail } from 'lucide-react';
import { useLenis } from '../hooks/useLenis';

const SECTIONS = ['inicio', 'sobre-mi', 'proyectos', 'habilidades', 'contacto'];

export default function Navbar() {
  const { scrollTo, onScroll } = useLenis();
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
  const initialScrollTimer = useRef(null);

  // Cálculo dinámico y milimétrico de la posición de scroll de cada lámina esculpida
  // Adaptado de forma 100% precisa a los pin-spacers de GSAP ScrollTrigger
  const getSectionTargetScroll = useCallback((id) => {
    if (id === 'inicio') return 0;

    const ST = typeof window !== 'undefined' ? window.ScrollTrigger : null;
    const allST = ST ? ST.getAll() : [];

    if (id === 'sobre-mi') {
      const heroPanel = document.querySelector('section.curtain-slab-panel:first-of-type');
      const heroST = allST.find(s => s.vars.pin && (s.trigger === heroPanel || (s.start <= 10 && s.end > 100)));
      return heroST ? Math.round(heroST.end) : Math.round(window.innerHeight);
    }

    if (id === 'proyectos') {
      const projST = allST.find(s => (s.trigger?.id === 'proyectos' || s.trigger?.querySelector?.('#proyectos')) && s.vars.pin);
      return projST ? Math.round(projST.start) : Math.round(window.innerHeight * 2);
    }

    if (id === 'habilidades') {
      const projST = allST.find(s => (s.trigger?.id === 'proyectos' || s.trigger?.querySelector?.('#proyectos')) && s.vars.pin);
      return projST ? Math.round(projST.end) : Math.round(window.innerHeight * 7);
    }

    if (id === 'contacto') {
      const skillsPanel = document.getElementById('habilidades')?.closest('.curtain-slab-panel');
      const skillsPin = allST.find(s => s.vars.pin && s.trigger === skillsPanel);
      return skillsPin ? Math.round(skillsPin.end) : Math.round(document.documentElement.scrollHeight - window.innerHeight);
    }

    return 0;
  }, []);

  // Navegación fluida y bloqueo temporal del espía mientras se ejecuta el smooth scroll con Lenis
  const scrollToSection = useCallback((id) => {
    setActiveSection(id);
    if (id === 'inicio') {
      setVisible(false);
    } else {
      setVisible(true);
    }
    isLocked.current = true;
    if (unlockTimer.current) clearTimeout(unlockTimer.current);

    const targetScroll = getSectionTargetScroll(id);
    scrollTo(targetScroll, {
      duration: 1.15,
    });

    // Activar destello focal visual al aterrizar en la sección de destino
    if (id !== 'inicio') {
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.classList.remove('section-focal-flash');
          void el.offsetWidth; // Forzar reflow para reiniciar la animación
          el.classList.add('section-focal-flash');
          setTimeout(() => {
            el.classList.remove('section-focal-flash');
          }, 1500);
        }
      }, 500);
    }

    if (window.history.pushState) {
      window.history.pushState(null, '', `#/${id}`);
    }

    unlockTimer.current = setTimeout(() => {
      isLocked.current = false;
    }, 1250);
  }, [getSectionTargetScroll, scrollTo]);

  useEffect(() => {
    // 1. Interceptar clics en enlaces de sección de toda la aplicación (Hero, Footer, About CTAs)
    const handleDocumentClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      // Si el enlace está dentro de la barra de navegación lateral o inferior, ya lo maneja su onClick con stopPropagation
      if (anchor.closest('aside[aria-label="Navegación lateral de sección"], header[aria-label="Navegación general"]')) {
        return;
      }

      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const targetId = href.replace(/^#[/]?/, '');
      if (SECTIONS.includes(targetId)) {
        e.preventDefault();
        scrollToSection(targetId);
      }
    };

    document.addEventListener('click', handleDocumentClick);

    // 2. Si la página se carga con un hash específico en la URL, desplazar suavemente tras la inicialización
    if (window.location.hash) {
      const initialHash = window.location.hash.replace(/^#[/]?/, '');
      if (SECTIONS.includes(initialHash) && initialHash !== 'inicio') {
        initialScrollTimer.current = setTimeout(() => {
          scrollToSection(initialHash);
        }, 600);
      }
    }

    // 3. Sincronización con Lenis para visibilidad del Navbar (oculto en Hero, visible al scrollear)
    const unsubscribeLenis = onScroll(({ scroll }) => {
      if (!isLocked.current) {
        setVisible(scroll > 180);
      }
    });

    // 4. Cálculo de visibilidad y sección activa por posición precisa de lámina
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        ticking = false;
        const scrollY = window.scrollY;

        if (!isLocked.current) {
          setVisible(scrollY > 180);
        }

        if (isLocked.current) return;

        // Final de página garantizado: contacto
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollY >= maxScroll - 60) {
          setActiveSection('contacto');
          return;
        }

        const sobreMiStart = getSectionTargetScroll('sobre-mi');
        const proyectosStart = getSectionTargetScroll('proyectos');
        const habilidadesStart = getSectionTargetScroll('habilidades');
        const contactoStart = getSectionTargetScroll('contacto');

        // Umbral de transición: cuando la siguiente lámina cubre al menos el 45% del viewport
        const threshold = window.innerHeight * 0.45;

        let currentSection = 'inicio';
        if (scrollY >= contactoStart - threshold) {
          currentSection = 'contacto';
        } else if (scrollY >= habilidadesStart - threshold) {
          currentSection = 'habilidades';
        } else if (scrollY >= proyectosStart - threshold) {
          currentSection = 'proyectos';
        } else if (scrollY >= sobreMiStart - threshold) {
          currentSection = 'sobre-mi';
        } else {
          currentSection = 'inicio';
        }

        setActiveSection(currentSection);
      });
    };

    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#[/]?/, '');
      if (SECTIONS.includes(hash)) {
        scrollToSection(hash);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('hashchange', handleHashChange);
    handleScroll();

    return () => {
      if (typeof unsubscribeLenis === 'function') unsubscribeLenis();
      document.removeEventListener('click', handleDocumentClick);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hashchange', handleHashChange);
      if (unlockTimer.current) clearTimeout(unlockTimer.current);
      if (initialScrollTimer.current) clearTimeout(initialScrollTimer.current);
    };
  }, [getSectionTargetScroll, scrollToSection, onScroll]);

  const navLinks = [
    { id: 'inicio', label: 'Inicio', tag: '00', icon: Home },
    { id: 'sobre-mi', label: 'Sobre mí', tag: '01', icon: User },
    { id: 'proyectos', label: 'Proyectos', tag: '02', icon: FolderGit2 },
    { id: 'habilidades', label: 'Habilidades', tag: '03', icon: Code2 },
    { id: 'contacto', label: 'Contacto', tag: '04', icon: Mail }
  ];

  return (
    <>
      {/* 1. DOCK VERTICAL LATERAL - SOLO EN PANTALLAS ULTRA-ANCHAS (>= 1360px) DONDE NO TAPA TEXTO */}
      <aside
        aria-label="Navegación lateral de sección"
        className={`nav-dock-desktop fixed right-6 2xl:right-8 top-1/2 -translate-y-1/2 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          visible
            ? 'opacity-100 translate-x-0 pointer-events-auto'
            : 'opacity-0 translate-x-10 pointer-events-none'
        }`}
      >
        <nav
          className="relative p-1.5 rounded-full bg-stone-900/80 backdrop-blur-2xl border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_20px_45px_rgba(0,0,0,0.55)]"
        >
          {/* Luz ambiental sutil dentro de la cápsula */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none" />

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
                      e.stopPropagation();
                      scrollToSection(link.id);
                    }}
                    aria-label={link.label}
                    className={`group/item relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-b from-red-500/35 to-rose-600/25 text-white border border-red-500/40 shadow-[0_0_18px_rgba(239,68,68,0.45),inset_0_1px_1px_rgba(255,255,255,0.3)] scale-105'
                        : 'text-stone-300 hover:text-white hover:bg-white/10 hover:scale-105 border border-transparent'
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
                      className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1.5 rounded-full bg-[#0c0c10]/90 backdrop-blur-xl border border-white/20 text-stone-100 font-mono text-[11px] uppercase tracking-wider shadow-[0_12px_35px_rgba(0,0,0,0.7)] opacity-0 translate-x-2 pointer-events-none group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-200 ease-out whitespace-nowrap flex items-center gap-2"
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

      {/* 2. BARRA FLOTANTE INFERIOR - CÁPSULA LÍQUIDA (MÓVIL, TABLETS Y LAPTOPS < 1360px PARA NO TAPAR CONTENIDO) */}
      <header
        aria-label="Navegación general"
        className={`nav-bar-mobile fixed bottom-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out ${
          visible
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-8 pointer-events-none'
        }`}
      >
        <nav
          className="relative p-1.5 sm:p-2 rounded-full bg-stone-900/85 backdrop-blur-2xl border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_15px_35px_rgba(0,0,0,0.65)]"
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
                      e.stopPropagation();
                      scrollToSection(link.id);
                    }}
                    aria-label={link.label}
                    className={`flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-b from-red-500/35 to-rose-600/25 text-white border border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                        : 'text-stone-300 hover:text-white hover:bg-white/10'
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

import { useState } from 'react';
import { Code2, HeartHandshake, CheckCircle2, Sparkles } from 'lucide-react';

export default function Skills() {
  const [activeTab, setActiveTab] = useState('hard');

  const hardSkills = [
    {
      index: '/01',
      title: 'React 19 & Ecosistema Moderno',
      tag: 'FRAMEWORK & STATE',
      description: 'Arquitectura modular de componentes, Custom Hooks de alto rendimiento, gestión de estado predecible y optimización de renderizado.',
      tools: ['React 19', 'Hooks', 'Context API', 'Vite']
    },
    {
      index: '/02',
      title: 'JavaScript (ES6+) & TypeScript',
      tag: 'CORE ENGINE',
      description: 'Dominio de asincronía (Promises, Async/Await), closures, manipulación nativa del DOM y contratos tipados libres de errores.',
      tools: ['ES6+', 'TypeScript', 'Web APIs', 'Fetch']
    },
    {
      index: '/03',
      title: 'Tailwind CSS v4 & Sistemas de Diseño',
      tag: 'DESIGN SYSTEMS',
      description: 'Creación de interfaces responsive píxel-perfect, tokens de diseño consistentes y micro-interacciones fluidas a 60 FPS.',
      tools: ['Tailwind v4', 'CSS Grid/Flexbox', 'Animaciones', 'Glassmorphism']
    },
    {
      index: '/04',
      title: 'HTML5 Semántico & Accesibilidad (WCAG 2.2)',
      tag: 'A11Y & SEO',
      description: 'Estructuración semántica nativa para máxima indexabilidad en motores de búsqueda y total compatibilidad con lectores de pantalla.',
      tools: ['HTML5 Semántico', 'ARIA Standards', 'Keyboard Nav', 'SEO On-Page']
    },
    {
      index: '/05',
      title: 'Core Web Vitals & Optimización Web',
      tag: 'PERFORMANCE',
      description: 'Auditoría y optimización de métricas de carga (LCP, FID/INP, CLS), lazy loading agresivo, compresión de assets y zero-layout-shift.',
      tools: ['Lighthouse 100', 'Code Splitting', 'Asset Minify', 'Cache']
    },
    {
      index: '/06',
      title: 'Git, GitHub & Flujos de Despliegue',
      tag: 'WORKFLOW & CI/CD',
      description: 'Control de versiones con conventional commits, branch management, code reviews rigurosas y despliegues automatizados en Vercel/Netlify.',
      tools: ['Git', 'GitHub', 'CI/CD Pipelines', 'Vercel']
    }
  ];

  const softSkills = [
    {
      index: '/01',
      title: 'Resolución Pragmática de Problemas',
      tag: 'PROBLEM SOLVING',
      description: 'Descomposición analítica de problemas complejos para crear soluciones técnicas simples, directas y libres de sobreingeniería.',
      tools: ['Análisis Crítico', 'Arquitectura Simple', 'Depuración Rápida']
    },
    {
      index: '/02',
      title: 'Atención Rigurosa al Detalle Píxel-Perfect',
      tag: 'CRAFT & QUALITY',
      description: 'Sensibilidad estética extrema para traducir diseños de Figma a código fiel, cuidando espaciados, jerarquías visuales y micro-interacciones.',
      tools: ['Figma to Code', 'Micro-animaciones', 'Consistencia Visual']
    },
    {
      index: '/03',
      title: 'Comunicación Asertiva y Trabajo en Equipo',
      tag: 'COLLABORATION',
      description: 'Transparencia constante en el progreso, comunicación clara de decisiones técnicas y colaboración fluida con diseñadores y líderes de producto.',
      tools: ['Sincronía Ágil', 'Feedback Constructivo', 'Documentación Clara']
    },
    {
      index: '/04',
      title: 'Pensamiento Crítico y Enfoque en UX',
      tag: 'USER EXPERIENCE',
      description: 'Evaluación de cada línea de código en función del impacto real en el usuario final: facilidad de uso, tiempos de respuesta y claridad mental.',
      tools: ['Ergonomía Digital', 'Empatía de Usuario', 'Testeo Continuo']
    },
    {
      index: '/05',
      title: 'Adaptabilidad & Aprendizaje Acelerado',
      tag: 'AGILITY',
      description: 'Capacidad de asimilar herramientas y paradigmas emergentes con rapidez, adaptándose a las necesidades dinámicas de cada proyecto.',
      tools: ['Curva de Aprendizaje Rápida', 'Resiliencia', 'Curiosidad Técnica']
    },
    {
      index: '/06',
      title: 'Autonomía y Compromiso con las Fechas',
      tag: 'OWNERSHIP',
      description: 'Gestión proactiva del tiempo, responsabilidad directa sobre los entregables y rigor para llevar funcionalidades a producción en fecha.',
      tools: ['Auto-organización', 'Priorización de Impacto', 'Entrega a Tiempo']
    }
  ];

  const currentList = activeTab === 'hard' ? hardSkills : softSkills;

  return (
    <section
      id="habilidades"
      aria-labelledby="skills-title"
      className="relative bg-[#0c0c10] text-stone-100 py-32 px-6 md:px-12 border-t border-white/10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* ENCABEZADO EDITORIAL */}
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3 text-red-500 font-mono text-xs uppercase tracking-widest mb-3">
              <span className="w-8 h-px bg-red-500 inline-block" />
              <span>[ 03 // CAPACIDADES & MAESTRÍA ]</span>
            </div>
            <h2
              id="skills-title"
              className="text-4xl sm:text-6xl md:text-7xl font-black font-display tracking-tight text-white uppercase"
            >
              STACK & <span className="inline-block whitespace-nowrap">HABILIDADES<span className="text-red-500">.</span></span>
            </h2>
          </div>

          <p className="text-stone-400 font-mono text-xs md:text-sm max-w-md uppercase tracking-wider leading-relaxed">
            COMBINACIÓN DE RIGOR TÉCNICO EN CÓDIGO FRONTEND Y METODOLOGÍA HUMANA ORIENTADA AL IMPACTO DE PRODUCTO.
          </p>
        </header>

        {/* SELECTOR DE PESTAÑAS EDITORIAL (TABS DE ALTA GAMA) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-3 md:gap-4 mb-16 border-b border-white/10 pb-6">
          <button
            type="button"
            onClick={() => setActiveTab('hard')}
            className={`group relative flex items-center gap-3 px-6 py-3.5 rounded-full font-mono text-xs md:text-sm tracking-wider uppercase transition-all duration-300 cursor-pointer ${
              activeTab === 'hard'
                ? 'bg-white text-black font-bold shadow-[0_4px_20px_rgba(255,255,255,0.15)]'
                : 'bg-white/[0.03] text-stone-400 hover:text-white hover:bg-white/[0.08] border border-white/10'
            }`}
          >
            <Code2 className={`w-4 h-4 ${activeTab === 'hard' ? 'text-red-600' : 'text-stone-500 group-hover:text-white'}`} />
            <span>[ 01 // HABILIDADES DURAS · HARD SKILLS ]</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${activeTab === 'hard' ? 'bg-black/10 text-stone-900' : 'bg-white/10 text-stone-400'}`}>
              06
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('soft')}
            className={`group relative flex items-center gap-3 px-6 py-3.5 rounded-full font-mono text-xs md:text-sm tracking-wider uppercase transition-all duration-300 cursor-pointer ${
              activeTab === 'soft'
                ? 'bg-white text-black font-bold shadow-[0_4px_20px_rgba(255,255,255,0.15)]'
                : 'bg-white/[0.03] text-stone-400 hover:text-white hover:bg-white/[0.08] border border-white/10'
            }`}
          >
            <HeartHandshake className={`w-4 h-4 ${activeTab === 'soft' ? 'text-red-600' : 'text-stone-500 group-hover:text-white'}`} />
            <span>[ 02 // HABILIDADES BLANDAS · SOFT SKILLS ]</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${activeTab === 'soft' ? 'bg-black/10 text-stone-900' : 'bg-white/10 text-stone-400'}`}>
              06
            </span>
          </button>
        </div>

        {/* LISTADO EDITORIAL ABIERTO CON HOVER REVEAL (SIN SIMPLES CARDS) */}
        <div className="divide-y divide-white/10 border-b border-white/10">
          {currentList.map((item) => (
            <div
              key={item.index + item.title}
              className="group relative py-7 md:py-9 px-4 sm:px-6 -mx-4 sm:-mx-6 rounded-xl transition-all duration-300 hover:bg-white/[0.025]"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                {/* Lado izquierdo: Índice + Título de gran escala con micro-desplazamiento */}
                <div className="flex items-baseline sm:items-center gap-4 sm:gap-6 min-w-0">
                  <span className="font-mono text-xs md:text-sm text-stone-500 group-hover:text-red-500 transition-colors">
                    {item.index}
                  </span>

                  <h3 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-stone-200 group-hover:text-white group-hover:translate-x-2 sm:group-hover:translate-x-3 transition-transform duration-300 uppercase">
                    {item.title}
                  </h3>
                </div>

                {/* Lado derecho: Tag de Especialidad */}
                <div className="flex items-center gap-3 sm:gap-4 self-start lg:self-auto flex-shrink-0">
                  <span className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase px-3 py-1 rounded-full bg-white/[0.04] group-hover:bg-red-500/10 text-stone-400 group-hover:text-red-400 border border-white/10 group-hover:border-red-500/30 transition-all duration-300">
                    {item.tag}
                  </span>
                </div>
              </div>

              {/* Revelado suave de descripción técnica y herramientas en la misma fila */}
              <div className="mt-4 pt-3 pl-8 sm:pl-12 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 text-stone-400 group-hover:text-stone-300 font-sans text-xs sm:text-sm leading-relaxed">
                <p className="max-w-3xl">
                  {item.description}
                </p>

                {/* Pills de herramientas asociadas */}
                <div className="flex flex-wrap items-center gap-2 self-start md:self-auto flex-shrink-0">
                  {item.tools.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-black/40 text-stone-400 border border-white/5 group-hover:border-white/20 transition-colors"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PIE DE SECCIÓN: MANIFIESTO DE RIGOR Y DISPONIBILIDAD */}
        <footer className="mt-16 p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-xs">
          <div className="flex items-center gap-3 text-stone-300">
            <CheckCircle2 className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span>DISPONIBILIDAD INMEDIATA // CÓDIGO LIMPIO, COMPROBADO Y ESCALABLE A PRODUCCIÓN.</span>
          </div>

          <div className="flex items-center gap-2 text-stone-400 uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-red-500" />
            <span>ESTÁNDARES EDITORIALES // 2026</span>
          </div>
        </footer>
      </div>
    </section>
  );
}

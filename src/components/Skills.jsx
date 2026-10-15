import { useState } from 'react';
import { Code2, HeartHandshake, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { hardSkills, softSkills } from '../data/skills';

export default function Skills() {
  const [activeTab, setActiveTab] = useState('hard');

  const sectionRef = useScrollReveal([
    {
      trigger: '.skills-header',
      selector: '.skills-header > *',
      duration: 0.85,
      stagger: 0.12,
      y: 35
    },
    {
      trigger: '.skills-tabs',
      selector: '.skills-tabs',
      duration: 0.8,
      y: 25
    },
    {
      selector: '.skill-item',
      individual: true,
      duration: 0.75,
      y: 25,
      scale: 0.98
    },
    {
      trigger: '.skills-footer',
      selector: '.skills-footer',
      duration: 0.8,
      y: 20
    }
  ]);

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    requestAnimationFrame(() => {
      gsap.fromTo(
        '.skill-item',
        { opacity: 0, y: 15, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.04, ease: 'power2.out', clearProps: 'all' }
      );
    });
  };

  const currentList = activeTab === 'hard' ? hardSkills : softSkills;

  return (
    <section
      id="habilidades"
      ref={sectionRef}
      aria-labelledby="skills-title"
      className="relative bg-[#0c0c10] text-stone-100 py-12 md:py-16 px-6 md:px-12 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* ENCABEZADO EDITORIAL */}
        <header className="skills-header mb-10 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3 text-red-500 font-mono text-xs uppercase tracking-widest mb-3">
              <span className="w-8 h-px bg-red-500 inline-block" />
              <span>[ 03 · HABILIDADES & TECNOLOGÍAS ]</span>
            </div>
            <h2
              id="skills-title"
              className="text-4xl sm:text-6xl md:text-7xl font-black font-display tracking-tight text-white uppercase"
            >
              STACK & <span className="inline-block whitespace-nowrap">HABILIDADES<span className="text-red-500">.</span></span>
            </h2>
          </div>

          <p className="text-stone-400 font-mono text-xs md:text-sm max-w-md uppercase tracking-wider leading-relaxed">
            TECNOLOGÍAS Y METODOLOGÍAS QUE APLICO PARA CREAR SITIOS Y APLICACIONES WEB COMPLETAS, RÁPIDAS Y ESCALABLES.
          </p>
        </header>

        {/* SELECTOR DE PESTAÑAS EDITORIAL (TABS DE ALTA GAMA) */}
        <div className="skills-tabs flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-3 md:gap-4 mb-8 md:mb-10 border-b border-white/10 pb-6">
          <button
            type="button"
            onClick={() => handleTabChange('hard')}
            className={`group relative flex items-center gap-3 px-6 py-3.5 rounded-full font-mono text-xs md:text-sm tracking-wider uppercase transition-all duration-300 cursor-pointer ${
              activeTab === 'hard'
                ? 'bg-white text-black font-bold shadow-[0_4px_20px_rgba(255,255,255,0.15)]'
                : 'bg-white/[0.03] text-stone-400 hover:text-white hover:bg-white/[0.08] border border-white/10'
            }`}
          >
            <Code2 className={`w-4 h-4 ${activeTab === 'hard' ? 'text-red-600' : 'text-stone-500 group-hover:text-white'}`} />
            <span>Habilidades Técnicas</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${activeTab === 'hard' ? 'bg-black/10 text-stone-900' : 'bg-white/10 text-stone-400'}`}>
              {String(hardSkills.length).padStart(2, '0')}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('soft')}
            className={`group relative flex items-center gap-3 px-6 py-3.5 rounded-full font-mono text-xs md:text-sm tracking-wider uppercase transition-all duration-300 cursor-pointer ${
              activeTab === 'soft'
                ? 'bg-white text-black font-bold shadow-[0_4px_20px_rgba(255,255,255,0.15)]'
                : 'bg-white/[0.03] text-stone-400 hover:text-white hover:bg-white/[0.08] border border-white/10'
            }`}
          >
            <HeartHandshake className={`w-4 h-4 ${activeTab === 'soft' ? 'text-red-600' : 'text-stone-500 group-hover:text-white'}`} />
            <span>Habilidades Profesionales</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${activeTab === 'soft' ? 'bg-black/10 text-stone-900' : 'bg-white/10 text-stone-400'}`}>
              {String(softSkills.length).padStart(2, '0')}
            </span>
          </button>
        </div>

        {/* LISTADO EDITORIAL ABIERTO CON HOVER REVEAL (SIN SIMPLES CARDS) */}
        <div className="skills-list divide-y divide-white/10 border-b border-white/10">
          {currentList.map((item) => (
            <div
              key={item.index + item.title}
              className="skill-item group relative py-7 md:py-9 px-4 sm:px-6 -mx-4 sm:-mx-6 rounded-xl transition-all duration-300 hover:bg-white/[0.025]"
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
        <footer className="skills-footer mt-10 md:mt-12 p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-center font-mono text-xs text-center">
          <div className="flex items-center gap-3 text-stone-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>Disponible para nuevos desafíos con código prolijo, mantenible y probado para producción.</span>
          </div>
        </footer>
      </div>
    </section>
  );
}

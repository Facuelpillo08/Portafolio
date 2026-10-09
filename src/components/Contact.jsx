import { useState, useEffect } from 'react';
import { ArrowUpRight, Copy, Check, Clock, Mail, Sparkles } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { socials } from '../data/socials';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [timeString, setTimeString] = useState('');

  const sectionRef = useScrollReveal([
    {
      trigger: '.contact-header',
      selector: '.contact-header > *',
      duration: 1.0,
      stagger: 0.14,
      y: 40,
      blur: 8
    },
    {
      trigger: '.contact-main-card',
      selector: '.contact-main-card',
      duration: 1.0,
      y: 45,
      blur: 8
    },
    {
      trigger: '.contact-subcards',
      selector: '.contact-subcards > *',
      duration: 0.9,
      stagger: 0.14,
      y: 35,
      blur: 6
    }
  ]);

  const emailData = socials.find((s) => s.name.toLowerCase() === 'email') || {
    url: 'mailto:facundo.acosta@ejemplo.com',
    display: 'facundo.acosta@ejemplo.com'
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailData.display);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  // Reloj en tiempo real para Buenos Aires (UTC-3)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        timeZone: 'America/Argentina/Buenos_Aires',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      setTimeString(new Intl.DateTimeFormat('es-AR', options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="contacto"
      ref={sectionRef}
      aria-labelledby="contact-title"
      className="relative bg-[#0c0c10] text-stone-100 pt-28 pb-32 px-6 md:px-12 border-t border-white/10 overflow-hidden"
    >
      {/* Resplandor ambiental de fondo */}
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-red-600/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ENCABEZADO EDITORIAL */}
        <header className="contact-header mb-16">
          <div className="flex items-center gap-3 text-red-500 font-mono text-xs uppercase tracking-widest mb-4">
            <span className="w-8 h-px bg-red-500 inline-block" />
            <span>[ 04 // CONTACTO ]</span>
          </div>

          <h2
            id="contact-title"
            className="text-4xl sm:text-6xl md:text-8xl font-black font-display tracking-tight text-white uppercase leading-[0.92]"
          >
            ¿TIENES UNA VISIÓN? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-white">
              HABLEMOS Y HAGÁMOSLA REALIDAD
            </span><span className="text-red-500">.</span>
          </h2>

          <p className="text-stone-400 font-mono text-xs md:text-sm mt-6 uppercase tracking-wider max-w-xl">
            DISPONIBLE PARA PROYECTOS FREELANCE SELECCIONADOS, ROLES FRONTEND Y COLABORACIONES CREATIVAS.
          </p>
        </header>

        {/* BLOQUE PRINCIPAL: EMAIL DE GRAN FORMATO INTERACTIVO */}
        <div className="contact-main-card my-14 p-8 sm:p-12 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-red-500/40 backdrop-blur-xl transition-all duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500 block mb-2">
                Canal de Contacto Directo
              </span>
              <a
                href={emailData.url}
                className="font-display text-2xl sm:text-4xl md:text-5xl font-black text-white hover:text-red-500 transition-colors break-all"
              >
                {emailData.display}
              </a>
            </div>

            {/* Botones de acción rápida: Copiar y Enviar */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleCopyEmail}
                className={`flex items-center gap-2 px-6 py-3.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider border transition-all duration-200 ${
                  copied
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-white/5 hover:bg-white/10 text-stone-200 border-white/15'
                }`}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? '¡Copiado!' : 'Copiar Email'}</span>
              </button>

              <a
                href={emailData.url}
                className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-red-600 hover:bg-red-500 active:scale-95 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-lg shadow-red-900/30"
              >
                <Mail className="w-4 h-4" />
                <span>Escribir Ahora</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* ENLACES A REDES Y TELEMETRÍA EN VIVO */}
        <div className="contact-subcards grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch pt-4">
          {/* Canales Sociales Editorial (7 cols) */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="https://linkedin.com/in/facundoacosta"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-red-500/40 flex items-center justify-between transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-red-600/20 text-stone-300 group-hover:text-red-400 flex items-center justify-center transition-colors">
                  <LinkedinIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-display font-bold text-lg text-white group-hover:text-red-400 transition-colors block">
                    LinkedIn
                  </span>
                  <span className="text-[11px] font-mono text-stone-500">Conectar perfil</span>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-stone-500 group-hover:text-red-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>

            <a
              href="https://github.com/facundoacosta"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-red-500/40 flex items-center justify-between transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-red-600/20 text-stone-300 group-hover:text-red-400 flex items-center justify-center transition-colors">
                  <GithubIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-display font-bold text-lg text-white group-hover:text-red-400 transition-colors block">
                    GitHub
                  </span>
                  <span className="text-[11px] font-mono text-stone-500">Código & repositorios</span>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-stone-500 group-hover:text-red-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>

          {/* Tarjeta de Telemetría: Hora Local & Disponibilidad (5 cols) */}
          <div className="md:col-span-5 p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-between font-mono text-xs">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-stone-500 uppercase tracking-widest text-[10px]">
                TELEMETRÍA LOCAL // BSAS
              </span>
              <div className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>ACTIVO</span>
              </div>
            </div>

            <div className="my-4">
              <div className="flex items-center gap-2 text-stone-400 mb-1">
                <Clock className="w-4 h-4 text-red-500" />
                <span className="text-stone-300">Buenos Aires, Argentina (UTC-3)</span>
              </div>
              <div className="font-display text-2xl sm:text-3xl font-black text-white tracking-wider">
                {timeString || '--:--:--'}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 text-[11px] text-stone-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
              <span>Respuesta habitual dentro de las 24 horas hábiles.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


import { useState, useEffect } from 'react';
import { ArrowUpRight, Copy, Check, Clock, Mail, Sparkles, Send, FileText, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { socials } from '../data/socials';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [timeString, setTimeString] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionState, setSubmissionState] = useState({
    sent: false,
    method: '', // 'web3forms' | 'gmail'
    gmailUrl: '',
    mailtoUrl: ''
  });

  const sectionRef = useScrollReveal([
    {
      trigger: '.contact-header',
      selector: '.contact-header > *',
      duration: 0.85,
      stagger: 0.1,
      y: 35
    },
    {
      trigger: '.contact-main-card',
      selector: '.contact-main-card',
      duration: 0.85,
      y: 35,
      scale: 0.98
    },
    {
      trigger: '.contact-form-card',
      selector: '.contact-form-card',
      duration: 0.85,
      y: 35,
      scale: 0.98
    },
    {
      trigger: '.contact-subcards',
      selector: '.contact-subcards > *',
      duration: 0.8,
      stagger: 0.1,
      y: 25
    }
  ]);

  const emailData = socials.find((s) => s.name.toLowerCase() === 'email') || {
    url: 'mailto:acostafacu30@gmail.com',
    display: 'acostafacu30@gmail.com'
  };

  const [emailUser, emailDomain] = emailData.display.includes('@')
    ? emailData.display.split('@')
    : [emailData.display, ''];

  const getGmailComposeUrl = (subject = '', body = '') => {
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailData.display)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleCopyEmail = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(emailData.display);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = emailData.display;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setErrorMessage('');
    const web3formsKey = (import.meta.env.VITE_WEB3FORMS_KEY || 'bfd1fb3e-ca8f-42fb-ae68-c358666dc82a').trim();

    // 1. Envío directo por API si hay Access Key de Web3Forms
    if (web3formsKey !== '') {
      setIsSubmitting(true);
      try {
        const fd = new FormData();
        fd.append('access_key', web3formsKey);
        fd.append('name', formData.name);
        fd.append('email', formData.email);
        fd.append('message', formData.message);
        fd.append('from_name', formData.name);
        fd.append('subject', `Nuevo contacto en portafolio de ${formData.name}`);

        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: fd
        });

        const data = await response.json();
        if (data.success) {
          setSubmissionState({
            sent: true,
            method: 'web3forms',
            gmailUrl: '',
            mailtoUrl: ''
          });
          setFormData({ name: '', email: '', message: '' });
          setIsSubmitting(false);
          return;
        } else {
          console.warn('Web3Forms returned failure:', data);
          setErrorMessage(data.message || 'No se pudo enviar automáticamente.');
        }
      } catch (err) {
        console.warn('Web3Forms falló por error de red:', err);
        setErrorMessage('Hubo un inconveniente de red al conectar con el servidor.');
      }
      setIsSubmitting(false);
    }

    // 2. Fallback automático y garantizado: Abre Gmail Web con los datos completados
    const subject = `Contacto Portafolio - ${formData.name}`;
    const body = `Hola Facundo,\n\nSoy ${formData.name} (${formData.email}).\n\n${formData.message}`;
    const gmailUrl = getGmailComposeUrl(subject, body);
    const mailtoUrl = `mailto:${emailData.display}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.open(gmailUrl, '_blank');

    setSubmissionState({
      sent: true,
      method: 'gmail',
      gmailUrl,
      mailtoUrl
    });
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
      className="relative bg-[#0c0c10] text-stone-100 pt-12 md:pt-16 pb-20 md:pb-24 px-6 md:px-12 overflow-hidden"
    >
      {/* Resplandor ambiental de fondo (centrado verticalmente, sin corte brusco en el borde inferior) */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[400px] bg-red-600/[0.04] rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ENCABEZADO EDITORIAL */}
        <header className="contact-header mb-10 md:mb-12">
          <div className="flex items-center gap-3 text-red-500 font-mono text-xs uppercase tracking-widest mb-4">
            <span className="w-8 h-px bg-red-500 inline-block" />
            <span>[ 04 · CONTACTO ]</span>
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

        {/* GRID DE DOS COLUMNAS: EMAIL DIRECTO + FORMULARIO INTERACTIVO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 md:my-10 items-start">
          {/* Tarjeta de Contacto Directo (5 cols) */}
          <div className="contact-main-card lg:col-span-5 p-8 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-red-500/40 backdrop-blur-xl overflow-hidden transition-all duration-300 flex flex-col justify-between h-full space-y-8">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500 block mb-3">
                Canal de Contacto Directo
              </span>
              <a
                href={emailData.url}
                className="font-display text-lg sm:text-xl md:text-2xl lg:text-[1.32rem] xl:text-[1.65rem] font-black text-white hover:text-red-500 transition-colors tracking-tight leading-snug inline-block"
              >
                <span className="whitespace-nowrap">{emailUser}</span>
                {emailDomain && <span className="whitespace-nowrap">@{emailDomain}</span>}
              </a>
              <p className="text-stone-400 font-sans text-xs sm:text-sm mt-4 leading-relaxed">
                Respondé directamente con tu propuesta o consulta. Los mensajes son leídos y respondidos de forma personalizada en menos de 24 horas.
              </p>
            </div>

            {/* Acciones directas: Copiar y Abrir Correo */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={handleCopyEmail}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider border transition-all duration-200 cursor-pointer ${
                  copied
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-white/5 hover:bg-white/10 text-stone-200 border-white/15'
                }`}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? '¡Email Copiado!' : 'Copiar Email'}</span>
              </button>

              <a
                href={getGmailComposeUrl('Contacto desde el Portafolio', 'Hola Facundo,\n\n')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 active:scale-98 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-lg shadow-red-900/30"
              >
                <Mail className="w-4 h-4" />
                <span>Abrir Gmail</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Formulario de Mensaje Rápido (7 cols) */}
          <div className="contact-form-card lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-red-500/40 backdrop-blur-xl overflow-hidden transition-all duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-2 font-mono text-xs text-stone-300 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-red-500" />
                <span>Mensaje Directo</span>
              </div>
              <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest">
                Sin intermediarios
              </span>
            </div>

            {submissionState.sent ? (
              submissionState.method === 'web3forms' ? (
                <div className="py-10 text-center space-y-4 font-mono">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <Check className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display text-2xl font-black text-white uppercase tracking-tight">
                      ¡Mensaje Enviado con Éxito!
                    </h3>
                    <p className="text-xs text-stone-400 max-w-md mx-auto font-sans leading-relaxed">
                      El mensaje fue recibido correctamente en mi casilla de correo. Te responderé en menos de 24 horas hábiles.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSubmissionState({ sent: false, method: '', gmailUrl: '', mailtoUrl: '' })}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-stone-300 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Enviar otro mensaje</span>
                  </button>
                </div>
              ) : (
                <div className="py-8 text-center space-y-4 font-mono">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <Check className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display text-2xl font-black text-white uppercase tracking-tight">
                      ¡Mensaje Preparado!
                    </h3>
                    <p className="text-xs text-stone-400 max-w-md mx-auto font-sans leading-relaxed">
                      Se abrió Gmail Web en una nueva pestaña con tu mensaje listo para enviar con un solo clic. Si tu navegador bloqueó la ventana emergente, podés usar los accesos directos:
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <a
                      href={submissionState.gmailUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-lg shadow-red-900/30"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Abrir en Gmail Web</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                    <a
                      href={submissionState.mailtoUrl}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-stone-300 text-xs font-mono uppercase tracking-wider transition-colors"
                    >
                      <span>App de Correo (Outlook/Mail)</span>
                    </a>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setSubmissionState({ sent: false, method: '', gmailUrl: '', mailtoUrl: '' })}
                      className="inline-flex items-center gap-1.5 text-stone-500 hover:text-stone-300 text-[11px] font-mono transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Volver al formulario</span>
                    </button>
                  </div>
                </div>
              )
            ) : (
              <form onSubmit={handleSubmitForm} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-stone-400 uppercase tracking-wider text-[11px] mb-1.5">
                      Nombre / Organización *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="Ej. Martín Gómez"
                      value={formData.name}
                      disabled={isSubmitting}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/15 focus:border-red-500 focus:outline-hidden text-stone-100 placeholder:text-stone-600 transition-colors disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-stone-400 uppercase tracking-wider text-[11px] mb-1.5">
                      Email de contacto *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="nombre@ejemplo.com"
                      value={formData.email}
                      disabled={isSubmitting}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/15 focus:border-red-500 focus:outline-hidden text-stone-100 placeholder:text-stone-600 transition-colors disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-msg" className="block text-stone-400 uppercase tracking-wider text-[11px] mb-1.5">
                    Mensaje o Propuesta *
                  </label>
                  <textarea
                    id="contact-msg"
                    required
                    rows={4}
                    placeholder="Contame brevemente sobre tu proyecto, objetivos o la vacante a cubrir..."
                    value={formData.message}
                    disabled={isSubmitting}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/15 focus:border-red-500 focus:outline-hidden text-stone-100 placeholder:text-stone-600 transition-colors resize-none disabled:opacity-50"
                  />
                </div>

                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                    <a
                      href={getGmailComposeUrl(`Contacto Portafolio - ${formData.name}`, `Hola Facundo,\n\nSoy ${formData.name} (${formData.email}).\n\n${formData.message}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-stone-200 hover:text-white font-bold ml-6 sm:ml-0 whitespace-nowrap"
                    >
                      Abrir en Gmail Web
                    </a>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/[0.05] hover:bg-red-600 text-stone-200 hover:text-white border border-white/15 hover:border-red-500 uppercase tracking-wider font-bold transition-all duration-200 cursor-pointer active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                      <span>Enviando mensaje...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Enviar Mensaje</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ENLACES A REDES Y TELEMETRÍA EN VIVO */}
        <div className="contact-subcards grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-stretch pt-4">
          {/* Canales Sociales & CV: Botones más grandes y destacados (8 cols) */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            <a
              href="https://www.linkedin.com/in/facu-acosta-51b0b7364/"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 sm:p-7 rounded-2xl bg-white/[0.025] hover:bg-white/[0.06] border border-white/10 hover:border-red-500/50 flex flex-col justify-between transition-all duration-300 shadow-lg hover:shadow-red-950/20 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 group-hover:bg-red-600/20 text-stone-300 group-hover:text-red-400 flex items-center justify-center transition-all duration-300 border border-white/10 group-hover:border-red-500/30">
                  <LinkedinIcon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-stone-500 group-hover:text-red-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <div>
                <span className="font-display font-bold text-lg sm:text-xl text-white group-hover:text-red-400 transition-colors block">
                  LinkedIn
                </span>
                <span className="text-xs font-mono text-stone-400 group-hover:text-stone-300 transition-colors mt-0.5 block">
                  Conectar perfil
                </span>
              </div>
            </a>

            <a
              href="https://github.com/Facuelpillo08"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 sm:p-7 rounded-2xl bg-white/[0.025] hover:bg-white/[0.06] border border-white/10 hover:border-red-500/50 flex flex-col justify-between transition-all duration-300 shadow-lg hover:shadow-red-950/20 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 group-hover:bg-red-600/20 text-stone-300 group-hover:text-red-400 flex items-center justify-center transition-all duration-300 border border-white/10 group-hover:border-red-500/30">
                  <GithubIcon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-stone-500 group-hover:text-red-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <div>
                <span className="font-display font-bold text-lg sm:text-xl text-white group-hover:text-red-400 transition-colors block">
                  GitHub
                </span>
                <span className="text-xs font-mono text-stone-400 group-hover:text-stone-300 transition-colors mt-0.5 block">
                  Repositorios
                </span>
              </div>
            </a>

            <a
              href="/cv-facundo-acosta.pdf"
              download="CV_Facundo_Acosta.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 sm:p-7 rounded-2xl bg-white/[0.025] hover:bg-white/[0.06] border border-white/10 hover:border-red-500/50 flex flex-col justify-between transition-all duration-300 shadow-lg hover:shadow-red-950/20 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 group-hover:bg-red-600/20 text-stone-300 group-hover:text-red-400 flex items-center justify-center transition-all duration-300 border border-white/10 group-hover:border-red-500/30">
                  <FileText className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-stone-500 group-hover:text-red-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <div>
                <span className="font-display font-bold text-lg sm:text-xl text-white group-hover:text-red-400 transition-colors block">
                  Curriculum
                </span>
                <span className="text-xs font-mono text-stone-400 group-hover:text-stone-300 transition-colors mt-0.5 block">
                  Descargar PDF
                </span>
              </div>
            </a>
          </div>

          {/* Tarjeta de Zona Horaria / Disponibilidad (4 cols) */}
          <div className="md:col-span-4 p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-between font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-stone-500 uppercase tracking-widest text-[10px]">
                HORA LOCAL · BUENOS AIRES
              </span>
              <div className="flex items-center gap-1.5 text-emerald-400 text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>DISPONIBLE</span>
              </div>
            </div>

            <div className="my-3">
              <div className="flex items-center gap-1.5 text-stone-400 text-[11px] mb-1">
                <Clock className="w-3.5 h-3.5 text-red-500" />
                <span className="text-stone-300">Buenos Aires (UTC-3)</span>
              </div>
              <div className="font-display text-xl sm:text-2xl font-black text-white tracking-wider">
                {timeString || '--:--:--'}
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 text-[10px] text-stone-400 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-red-400 flex-shrink-0" />
              <span>Respuesta en menos de 24 hs hábiles.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

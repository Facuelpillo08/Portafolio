import { useState, useEffect } from 'react';
import { ArrowUpRight, Copy, Check, Clock, Mail, Sparkles, Send, FileText, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { socials } from '../data/socials';
import { useScrollReveal } from '../hooks/useScrollReveal';

const CURRENT_YEAR = new Date().getFullYear();

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
      className="relative bg-[#f8f9fb] text-stone-900 pt-14 md:pt-20 pb-8 md:pb-12 px-6 md:px-12 overflow-hidden"
    >


      {/* Resplandores ambientales sobre blanco */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[700px] h-[450px] bg-red-600/[0.035] rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-[500px] h-[350px] bg-rose-500/[0.03] rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ENCABEZADO EDITORIAL DE CONTACTO EN BLANCO */}
        <header className="contact-header mb-8 md:mb-10">
          <div className="flex items-center gap-2.5 text-red-600 font-mono text-xs uppercase tracking-widest mb-3 font-semibold">
            <span className="w-2 h-2 rounded-full bg-red-600 inline-block shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            <span>[ 04 · CONTACTO ]</span>
          </div>

          <h2
            id="contact-title"
            className="text-4xl sm:text-6xl md:text-8xl font-black font-display tracking-tight text-stone-950 uppercase leading-[0.92]"
          >
            ¿TIENES UNA VISIÓN? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-500 to-stone-900">
              HABLEMOS Y HAGÁMOSLA REALIDAD
            </span><span className="text-red-600">.</span>
          </h2>

          <p className="text-stone-600 font-mono text-xs md:text-sm mt-4 uppercase tracking-wider max-w-xl font-medium">
            DISPONIBLE PARA PROYECTOS FREELANCE SELECCIONADOS, ROLES FRONTEND Y COLABORACIONES CREATIVAS.
          </p>
        </header>

        {/* GRID DE DOS COLUMNAS: EMAIL DIRECTO + FORMULARIO INTERACTIVO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 my-5 md:my-7 items-start">
          {/* Tarjeta de Contacto Directo (5 cols) */}
          <div className="contact-main-card lg:col-span-5 p-8 sm:p-10 rounded-3xl bg-white/85 border border-stone-200/90 hover:border-red-500/40 backdrop-blur-xl shadow-xl shadow-stone-200/50 overflow-hidden transition-all duration-300 flex flex-col justify-between h-full space-y-8">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500 block mb-3 font-semibold">
                Canal de Contacto Directo
              </span>
              <a
                href={emailData.url}
                className="font-display text-lg sm:text-xl md:text-2xl lg:text-[1.32rem] xl:text-[1.65rem] font-black text-stone-950 hover:text-red-600 transition-colors tracking-tight leading-snug inline-block"
              >
                <span className="whitespace-nowrap">{emailUser}</span>
                {emailDomain && <span className="whitespace-nowrap">@{emailDomain}</span>}
              </a>
              <p className="text-stone-600 font-sans text-xs sm:text-sm mt-4 leading-relaxed">
                Respondé directamente con tu propuesta o consulta. Los mensajes son leídos y respondidos de forma personalizada en menos de 24 horas.
              </p>
            </div>

            {/* Acciones directas: Copiar y Abrir Correo */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-stone-200">
              <button
                type="button"
                onClick={handleCopyEmail}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider border transition-all duration-200 cursor-pointer ${
                  copied
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-stone-100 hover:bg-stone-200/80 text-stone-800 border-stone-200/90'
                }`}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? '¡Email Copiado!' : 'Copiar Email'}</span>
              </button>

              <a
                href={getGmailComposeUrl('Contacto desde el Portafolio', 'Hola Facundo,\n\n')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 active:scale-98 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-lg shadow-red-600/30"
              >
                <Mail className="w-4 h-4" />
                <span>Abrir Gmail</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Formulario de Mensaje Rápido (7 cols) */}
          <div className="contact-form-card lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-white/85 border border-stone-200/90 hover:border-red-500/40 backdrop-blur-xl shadow-xl shadow-stone-200/50 overflow-hidden transition-all duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
              <div className="flex items-center gap-2 font-mono text-xs text-stone-800 uppercase tracking-wider font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-red-600" />
                <span>Mensaje Directo</span>
              </div>
              <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest font-semibold">
                Sin intermediarios
              </span>
            </div>

            {submissionState.sent ? (
              submissionState.method === 'web3forms' ? (
                <div className="py-10 text-center space-y-4 font-mono">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                    <Check className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display text-2xl font-black text-stone-950 uppercase tracking-tight">
                      ¡Mensaje Enviado con Éxito!
                    </h3>
                    <p className="text-xs text-stone-600 max-w-md mx-auto font-sans leading-relaxed">
                      El mensaje fue recibido correctamente en mi casilla de correo. Te responderé en menos de 24 horas hábiles.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSubmissionState({ sent: false, method: '', gmailUrl: '', mailtoUrl: '' })}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer border border-stone-300"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Enviar otro mensaje</span>
                  </button>
                </div>
              ) : (
                <div className="py-8 text-center space-y-4 font-mono">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                    <Check className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display text-2xl font-black text-stone-950 uppercase tracking-tight">
                      ¡Mensaje Preparado!
                    </h3>
                    <p className="text-xs text-stone-600 max-w-md mx-auto font-sans leading-relaxed">
                      Se abrió Gmail Web en una nueva pestaña con tu mensaje listo para enviar con un solo clic. Si tu navegador bloqueó la ventana emergente, podés usar los accesos directos:
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <a
                      href={submissionState.gmailUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-lg shadow-red-600/30"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Abrir en Gmail Web</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                    <a
                      href={submissionState.mailtoUrl}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 text-xs font-mono uppercase tracking-wider transition-colors"
                    >
                      <span>App de Correo (Outlook/Mail)</span>
                    </a>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setSubmissionState({ sent: false, method: '', gmailUrl: '', mailtoUrl: '' })}
                      className="inline-flex items-center gap-1.5 text-stone-500 hover:text-stone-800 text-[11px] font-mono transition-colors cursor-pointer"
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
                    <label htmlFor="contact-name" className="block text-stone-700 uppercase tracking-wider text-[11px] font-semibold mb-1.5">
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
                      className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-300/80 focus:border-red-600 focus:bg-white focus:outline-hidden text-stone-900 placeholder:text-stone-400 transition-colors disabled:opacity-50 shadow-inner"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-stone-700 uppercase tracking-wider text-[11px] font-semibold mb-1.5">
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
                      className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-300/80 focus:border-red-600 focus:bg-white focus:outline-hidden text-stone-900 placeholder:text-stone-400 transition-colors disabled:opacity-50 shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-msg" className="block text-stone-700 uppercase tracking-wider text-[11px] font-semibold mb-1.5">
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
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-300/80 focus:border-red-600 focus:bg-white focus:outline-hidden text-stone-900 placeholder:text-stone-400 transition-colors resize-none disabled:opacity-50 shadow-inner"
                  />
                </div>

                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                    <a
                      href={getGmailComposeUrl(`Contacto Portafolio - ${formData.name}`, `Hola Facundo,\n\nSoy ${formData.name} (${formData.email}).\n\n${formData.message}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-red-700 hover:text-red-900 font-bold ml-6 sm:ml-0 whitespace-nowrap"
                    >
                      Abrir en Gmail Web
                    </a>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-stone-900 hover:bg-red-600 text-white border border-stone-900 hover:border-red-600 uppercase tracking-wider font-bold transition-all duration-200 cursor-pointer active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
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
              className="group p-6 sm:p-7 rounded-2xl bg-white/85 hover:bg-white border border-stone-200/90 hover:border-red-500/50 flex flex-col justify-between transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-red-950/5 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-stone-100 group-hover:bg-red-50 text-stone-700 group-hover:text-red-600 flex items-center justify-center transition-all duration-300 border border-stone-200/80 group-hover:border-red-200">
                  <LinkedinIcon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-stone-400 group-hover:text-red-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <div>
                <span className="font-display font-bold text-lg sm:text-xl text-stone-950 group-hover:text-red-600 transition-colors block">
                  LinkedIn
                </span>
                <span className="text-xs font-mono text-stone-500 group-hover:text-stone-700 transition-colors mt-0.5 block">
                  Conectar perfil
                </span>
              </div>
            </a>

            <a
              href="https://github.com/Facuelpillo08"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 sm:p-7 rounded-2xl bg-white/85 hover:bg-white border border-stone-200/90 hover:border-red-500/50 flex flex-col justify-between transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-red-950/5 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-stone-100 group-hover:bg-red-50 text-stone-700 group-hover:text-red-600 flex items-center justify-center transition-all duration-300 border border-stone-200/80 group-hover:border-red-200">
                  <GithubIcon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-stone-400 group-hover:text-red-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <div>
                <span className="font-display font-bold text-lg sm:text-xl text-stone-950 group-hover:text-red-600 transition-colors block">
                  GitHub
                </span>
                <span className="text-xs font-mono text-stone-500 group-hover:text-stone-700 transition-colors mt-0.5 block">
                  Repositorios
                </span>
              </div>
            </a>

            <a
              href="/cv-facundo-acosta.pdf"
              download="CV_Facundo_Acosta.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 sm:p-7 rounded-2xl bg-white/85 hover:bg-white border border-stone-200/90 hover:border-red-500/50 flex flex-col justify-between transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-red-950/5 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-stone-100 group-hover:bg-red-50 text-stone-700 group-hover:text-red-600 flex items-center justify-center transition-all duration-300 border border-stone-200/80 group-hover:border-red-200">
                  <FileText className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-stone-400 group-hover:text-red-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <div>
                <span className="font-display font-bold text-lg sm:text-xl text-stone-950 group-hover:text-red-600 transition-colors block">
                  Curriculum
                </span>
                <span className="text-xs font-mono text-stone-500 group-hover:text-stone-700 transition-colors mt-0.5 block">
                  Descargar PDF
                </span>
              </div>
            </a>
          </div>

          {/* Tarjeta de Zona Horaria / Disponibilidad (4 cols) */}
          <div className="md:col-span-4 p-5 sm:p-6 rounded-2xl bg-white/85 border border-stone-200/90 shadow-md flex flex-col justify-between font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <span className="text-stone-500 uppercase tracking-widest text-[10px] font-semibold">
                HORA LOCAL · BUENOS AIRES
              </span>
              <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>DISPONIBLE</span>
              </div>
            </div>

            <div className="my-3">
              <div className="flex items-center gap-1.5 text-stone-600 text-[11px] mb-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-red-600" />
                <span>Buenos Aires (UTC-3)</span>
              </div>
              <div className="font-display text-xl sm:text-2xl font-black text-stone-950 tracking-wider">
                {timeString || '--:--:--'}
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 text-[10px] text-stone-500 flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3 h-3 text-red-500 flex-shrink-0" />
              <span>Respuesta en menos de 24 hs hábiles.</span>
            </div>
          </div>
        </div>

        {/* Pie de página integrado con firma y derechos */}
        <div className="mt-8 sm:mt-10 pt-4 border-t border-stone-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs font-mono text-stone-500">
          <p>
            &copy; {CURRENT_YEAR} Facundo Acosta
          </p>
          <div className="flex items-center gap-4 text-stone-400">
            <span>Buenos Aires, Argentina</span>
            <span>·</span>
            <span className="text-stone-600 font-semibold uppercase tracking-wider text-[11px]">
              Portfolio 2026
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

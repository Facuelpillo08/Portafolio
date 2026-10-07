import { socials } from '../data/socials';
import { Mail, ArrowUp } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const getSocialIcon = (name) => {
    switch (name.toLowerCase()) {
      case 'github':
        return <GithubIcon className="w-4 h-4" />;
      case 'linkedin':
        return <LinkedinIcon className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/10 bg-[#08080b] text-stone-300 py-16 px-6 md:px-12 font-mono text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        <div>
          <a
            href="#inicio"
            className="text-white font-black font-display tracking-tight text-xl hover:text-red-500 transition-colors uppercase inline-block mb-1"
          >
            FACUNDO ACOSTA<span className="text-red-500">.</span>
          </a>
          <p className="text-stone-500 text-[11px] uppercase tracking-wider">
            PORTAFOLIO EDITORIAL // EDICIÓN 2026
          </p>
        </div>

        {/* Canales y volver arriba */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <ul className="flex items-center justify-center gap-3" aria-label="Canales de contacto">
            {socials.map((social) => (
              <li key={social.name}>
                <a
                  href={social.url}
                  target={social.url.startsWith('mailto:') ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-red-600 text-stone-300 hover:text-white border border-white/10 hover:border-red-500 flex items-center justify-center transition-all duration-200"
                >
                  {getSocialIcon(social.name)}
                </a>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Volver arriba"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-white/10 uppercase tracking-wider text-[11px] transition-colors"
          >
            <span>Arriba</span>
            <ArrowUp className="w-3.5 h-3.5 text-red-400" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/5 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-stone-500">
        <p>&copy; {currentYear} Facundo Acosta. Todos los derechos reservados.</p>
        <p className="tracking-widest uppercase">DISEÑO & DESARROLLO INSPIRADO EN ESTÁNDARES AWWWARDS</p>
      </div>
    </footer>
  );
}


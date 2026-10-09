const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#08080b] text-stone-300 py-12 px-6 md:px-12 font-mono text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
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

        <div className="flex flex-col sm:items-end gap-1 text-[11px] text-stone-500">
          <p>&copy; {currentYear} Facundo Acosta. Todos los derechos reservados.</p>
          <p className="tracking-widest uppercase">DISEÑO & DESARROLLO INSPIRADO EN ESTÁNDARES AWWWARDS</p>
        </div>
      </div>
    </footer>
  );
}


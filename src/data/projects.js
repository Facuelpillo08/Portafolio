import hexaImg from '../assets/projects/hexa.webp';
import kntxImg from '../assets/projects/kntx.webp';
import vandalImg from '../assets/projects/vandal.webp';

export const projects = [
  {
    id: 'hexa-custom',
    number: '01',
    year: '2026',
    title: 'HEXA // CUSTOM',
    category: 'Configurador 3D / Hardware Modular',
    description: 'Personalizador 3D interactivo en tiempo real para el teclado mecánico modular KX-75 en aluminio CNC 6063. Selector de switches mecánicos, pruebas acústicas y arquitectura de ensamblado gasket mount.',
    tags: ['Three.js', 'React', 'WebGL', '3D Configurator'],
    demoUrl: 'https://hexa-ten-fawn.vercel.app/',
    repoUrl: 'https://github.com/Facuelpillo08/hexa',
    image: hexaImg
  },
  {
    id: 'kntx-lab',
    number: '02',
    year: '2025',
    title: 'KNTX LAB',
    category: 'E-commerce / Moda Técnica Urbana',
    description: 'E-commerce y catálogo interactivo de indumentaria técnica urbana (DROP 004). Incluye selector y calculadora dinámica de talles, filtrado reactivo de prendas y carrito interactivo.',
    tags: ['React', 'Tailwind CSS', 'E-Commerce', 'UI/UX Design'],
    demoUrl: 'https://kntx-chi.vercel.app/',
    repoUrl: 'https://github.com/Facuelpillo08/KNTX',
    image: kntxImg
  },
  {
    id: 'vandal-club',
    number: '03',
    year: '2026',
    title: 'VANDAL // CLUB',
    category: 'Barbería de Autor & Tatuajes',
    description: 'Estudio híbrido de barbería y arte permanente. Plataforma web inmersiva de alto impacto visual con diseño editorial oscuro, cotizador online, agenda de turnos y archivo de obras.',
    tags: ['React', 'Tailwind CSS', 'Dark Aesthetic', 'Branding'],
    demoUrl: 'https://vandal-khaki.vercel.app/',
    repoUrl: 'https://github.com/Facuelpillo08/vandal',
    image: vandalImg
  }
];

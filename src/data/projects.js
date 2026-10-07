import ecommerceImg from '../assets/projects/ecommerce.jpg';
import taskflowImg from '../assets/projects/taskflow.jpg';
import weatherImg from '../assets/projects/weather.jpg';

export const projects = [
  {
    id: 'e-commerce-dashboard',
    number: '01',
    year: '2025',
    title: 'E-commerce Admin Analytics',
    category: 'Arquitectura Frontend / SaaS',
    description: 'Panel de administración integral con analíticas en tiempo real, gestión de productos, inventario y métricas de conversión optimizadas.',
    tags: ['React', 'JavaScript', 'Tailwind CSS', 'REST API'],
    demoUrl: 'https://ejemplo-ecommerce.com',
    repoUrl: 'https://github.com/facundoacosta/ecommerce-dashboard',
    image: ecommerceImg
  },
  {
    id: 'task-flow-app',
    number: '02',
    year: '2025',
    title: 'TaskFlow Workspace',
    category: 'Productividad & Workflow',
    description: 'Aplicación para productividad y gestión de proyectos colaborativos con soporte para drag and drop, persistencia local y filtros avanzados.',
    tags: ['React', 'Context API', 'Local Storage', 'HTML5'],
    demoUrl: 'https://ejemplo-taskflow.com',
    repoUrl: 'https://github.com/facundoacosta/taskflow-app',
    image: taskflowImg
  },
  {
    id: 'weather-analytics',
    number: '03',
    year: '2024',
    title: 'Aether Climate Telemetry',
    category: 'Web APIs / Visualización',
    description: 'Plataforma web para consulta de pronósticos climáticos con geolocalización, gráficos interactivos de temperatura y telemetría atmosférica.',
    tags: ['React', 'Fetch API', 'Web APIs', 'JavaScript'],
    demoUrl: 'https://ejemplo-clima.com',
    repoUrl: 'https://github.com/facundoacosta/weather-analytics',
    image: weatherImg
  }
];


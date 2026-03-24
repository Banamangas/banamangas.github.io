export interface TimelineEntry {
  year: string;
  title: string;
  location: string;
  description: string;
  color?: 'green' | 'cyan' | 'purple' | 'orange';
}

export const timeline: TimelineEntry[] = [
  {
    year: '10-2025 - 11-2025',
    title: 'Data Scientist (Freelance) @ Agence Française de Développement',
    location: 'Paris, France',
    description: 'Development of a complete RAG pipeline, implementation of an optimized FAISS index, optimization of the retrieval pipeline. Creation of a web application enabling search by text or document upload, with enriched metadata display and external project database lookup',
    color: 'green',
  },
  {
    year: '06-2025 - 09-2025',
    title: '10-week Data Science Bootcamp @ Le Wagon',
    location: 'Paris, France',
    description: 'Intensive 400-hour program covering the complete data science pipeline, including machine learning, data analysis, and data visualization.',
    color: 'cyan',
  },
  {
    year: '04-2021 - 01-2025',
    title: 'Data & Web specialist @ Extens Consulting',
    location: 'Paris, France',
    description: 'Website development and maintenance (SEO, Data analytics, server maintenance), data analysis and visualization, and project management.',
    color: 'orange',
  },
  {
    year: '09-2019 - 04-2021',
    title: 'Master in Digital Marketing @ IAE Angers',
    location: 'Angers, France',
    description: 'Master in Digital Marketing, specializing in SEO, SEM, social media marketing, and web analytics. Emphasis on Customer Relationship Management (CRM) and Customer Experience (CX).',
    color: 'purple',
  },
  {
    year: '09-2018 - 06-2019',
    title: 'Master in International Management @ Università de Modena e Reggio Emilia',
    location: 'Modena, Italy',
    description: 'Master in International Management, specializing in Marketing.',
    color: 'purple',
  },
  {
    year: '09-2017 - 06-2018',
    title: 'Bachelor in International Management @ IAE Angers',
    location: 'Angers, France',
    description: 'Bachelor in Business Administration, specializing in Marketing, Finance, and Business Strategy.',
    color: 'purple',
  },
  {
    year: '09-2015 - 06-2017',
    title: 'Technical Degree in International Trade @ Lycée Antoine de Saint-Exupéry',
    location: 'La Rochelle, France',
    description: 'Technical Degree in International Trade, specializing in supply chain management and logistics.',
    color: 'purple',
  },
];

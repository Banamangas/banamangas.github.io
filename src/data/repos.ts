// TODO: Replace with your actual repos before going live

export interface Repo {
  name: string;
  description: string;
  href: string;
  language: string;
  stars?: number;
}

export const repos: Repo[] = [
  {
    name: 'FoE-Buildings-Database',
    description: 'Streamlit web app for analyzing and comparing buildings in the browser game Forge of Empires. Connected to a REST API for automatic daily updates.',
    href: 'https://github.com/Banamangas/FoE-Buildings-Database',
    language: 'Python',
    stars: 1,
  },
];

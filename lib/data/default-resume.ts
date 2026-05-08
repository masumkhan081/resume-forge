import type { ResumeDraft } from '@/lib/types/resume';

export const sampleResume: ResumeDraft = {
  basics: {
    fullName: 'Masum Khan',
    professionalTitle: 'Full Stack Developer',
    email: 'masum@example.com',
    phone: '+880 1833 347848',
    location: 'Sylhet, Bangladesh',
    website: 'https://portfolio.example.com',
    github: 'https://github.com/masumkhan081',
    linkedin: 'https://linkedin.com/in/masumkhan081',
    summary:
      'Full-stack developer focused on building practical products with clean interfaces, useful backend logic, and maintainable architecture. Interested in product-minded engineering and small tools that feel complete.',
  },
  skills: {
    frontend: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    backend: ['Node.js', 'Express', 'REST APIs'],
    database: ['MongoDB', 'Firebase'],
    soft: ['Problem solving', 'Ownership', 'Clear communication'],
  },
  education: [
    {
      institution: 'North East University Bangladesh',
      degree: 'BSc in Computer Science & Engineering',
      year: '2018',
    },
  ],
  experience: [
    {
      company: 'Freelance / Personal Projects',
      role: 'Full Stack Developer',
      start: '2023',
      end: 'Present',
      current: true,
      summary:
        'Built product-facing web apps, integrated form systems, handled Stripe flows, and shipped responsive interfaces with practical business requirements.',
    },
  ],
  projects: [
    {
      title: 'Resume Forge',
      description: 'Multi-step resume builder with typed UI flow and PDF export.',
      link: 'https://example.com',
      technologies: ['Next.js', 'TypeScript', 'React PDF'],
    },
  ],
  extras: {
    interests: ['Product engineering', 'AI integration', 'System design'],
    hobbies: ['Trekking', 'Adventure travel', 'Reading'],
  },
};

export function emptyResume(): ResumeDraft {
  return {
    basics: {
      fullName: '',
      professionalTitle: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      github: '',
      linkedin: '',
      summary: '',
    },
    skills: { frontend: [], backend: [], database: [], soft: [] },
    education: [{ institution: '', degree: '', year: '' }],
    experience: [],
    projects: [{ title: '', description: '', link: '', technologies: [] }],
    extras: { interests: [], hobbies: [] },
  };
}

export type ProjectSize = 'small' | 'medium' | 'large'

export interface Project {
  id: string
  title: string
  description: string
  category: string
  image: {
    src: string
    alt: string
  }
  dominantColor: string
  technologies: string[]
  stats: {
    label: string
    value: string
  }[]
  size: ProjectSize
  featured?: boolean
}

export const projects: Project[] = [
  {
    id: 'vr-nextgen',
    title: 'VR NextGEN Solutions',
    description: 'Consultancy firm website blending cinematic motion with crisp case-study flows.',
    category: 'Consultancy Website',
    image: {
      src: '/work-vr-nextgen.png',
      alt: 'VR NextGEN Solutions website mock',
    },
    dominantColor: '#9b5de5',
    technologies: ['Next.js', 'GSAP', 'Framer Motion'],
    stats: [
      { label: 'Pages', value: '6' },
      { label: 'Turnaround', value: '3 wks' },
    ],
    size: 'large',
  },
  {
    id: 'ganpat-bus-tracker',
    title: 'Ganpat University Bus Tracker',
    description: 'Realtime fleet tracking web app with telemetry overlays for 40+ daily routes.',
    category: 'Web Application',
    image: {
      src: '/work-bus-tracker.png',
      alt: 'Ganpat University bus tracker dashboard',
    },
    dominantColor: '#00bbf9',
    technologies: ['React', 'Supabase', 'Mapbox'],
    stats: [
      { label: 'Live Vehicles', value: '48' },
      { label: 'Latency', value: '2s' },
    ],
    size: 'medium',
  },
  {
    id: 'rudri-dave',
    title: 'Rudri Dave — Portfolio',
    description: 'Minimalist writer’s portfolio with encrypted blog drops and long-form typography.',
    category: 'Portfolio Experience',
    image: {
      src: '/work-rudri-portfolio.png',
      alt: 'Rudri Dave personal site preview',
    },
    dominantColor: '#ff9770',
    technologies: ['Next.js', 'Tailwind CSS', 'MDX'],
    stats: [
      { label: 'Articles', value: '24+' },
      { label: 'Bounce Rate', value: '-32%' },
    ],
    size: 'small',
  },
]


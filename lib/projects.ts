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
  video?: string // Optional video cover
  url?: string // Optional live demo URL
  repo?: string // Optional repository URL
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
    url: 'https://vrnextgensolutions.com/',
    dominantColor: '#9b5de5',
    technologies: ['Next.js', 'GSAP', 'Framer Motion'],
    stats: [
      { label: 'Pages', value: '6' },
      { label: 'Turnaround', value: '3 wks' },
    ],
    size: 'large',
  },
  {
    id: 'unitrack',
    title: 'UniTrack',
    description: 'Real-time transit tracking PWA with live map, admin dashboard for routes & schedules, and modular React-style components.',
    category: 'Web Application',
    image: {
      src: '/work-bus-tracker.png',
      alt: 'UniTrack live bus tracking dashboard',
    },
    video: '/unitrack-demo.mp4',
    url: 'https://university-bus-tracker-app.web.app/',
    repo: 'https://github.com/Tir25/BTS',
    dominantColor: '#00bbf9',
    technologies: ['JavaScript', 'Vite', 'React', 'Firestore', 'Mapbox'],
    stats: [
      { label: 'Live Vehicles', value: '48' },
      { label: 'Latency', value: '2s' },
    ],
    size: 'medium',
    featured: true,
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


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
    id: 'aura-clothing',
    title: 'AURA',
    description: 'Luxury e-commerce clothing storefront showcasing premium animations, high-fidelity UI layouts, and a seamless shopping pipeline.',
    category: 'E-commerce Website',
    image: {
      src: '/work-aura.png',
      alt: 'AURA Premium Clothing Store landing page',
    },
    video: '/aura-demo.mp4',
    url: 'https://6a43d648dfaf361b06ab60d3--aura-e-commerce27.netlify.app/',
    dominantColor: '#a855f7',
    technologies: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion'],
    stats: [
      { label: 'Conversion', value: '+24%' },
      { label: 'Load Time', value: '0.8s' },
    ],
    size: 'large',
    featured: true,
  },
  {
    id: 'whispering-vine',
    title: 'The Whispering Vine',
    description: 'Botanical cafe website featuring immersive visual layouts, fluid scroll animation layers, and custom menu navigation details.',
    category: 'Cafe Website',
    image: {
      src: '/work-whispering-vine.png',
      alt: 'The Whispering Vine botanical cafe landing page',
    },
    video: '/whispering-vine-demo.mp4',
    url: 'https://lovely-phoenix-4646df.netlify.app/',
    dominantColor: '#4d9078',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'AOS'],
    stats: [
      { label: 'Visits', value: '1.2K+' },
      { label: 'Score', value: '98%' },
    ],
    size: 'large',
    featured: true,
  },
  {
    id: 'vr-nextgen',
    title: 'VR NextGEN Solutions',
    description: 'Consultancy firm website blending cinematic motion with crisp case-study flows.',
    category: 'Consultancy Website',
    image: {
      src: '/work-vr-nextgen.png',
      alt: 'VR NextGEN Solutions website mock',
    },
    video: '/vr-nextgen-thumb.mp4',
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

]


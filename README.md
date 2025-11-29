# Mantro - Premium Digital Creation Agency

A premium digital creation agency website built with Next.js 15, featuring an "Ethereal Industrialism" design philosophy with cutting-edge web technologies.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **Resend API Key** (for contact form functionality)
- Modern browser with WebGL support

## 🛠️ Tech Stack

### Core Framework
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **React 19** - Latest React features

### Styling & Design
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Custom Design System** - Ethereal Industrialism theme

### 3D & Graphics
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for R3F
- **@react-three/postprocessing** - Post-processing effects

### Forms & Validation
- **React Hook Form** - Performant form management
- **Zod** - Schema validation
- **Resend** - Email delivery service

### Performance & UX
- **Lenis** - Smooth scrolling
- **Service Worker** - Offline support and caching
- **Next.js Image Optimization** - Automatic image optimization

## 🎨 Design Philosophy

**Ethereal Industrialism** - A dark mode design system that combines:

- **Void** (#030304) - Deep black background
- **Cyber Violet** (#7B2CBF) - Primary accent color
- **Cyan** (#4CC9F0) - Highlight and interactive elements

## 📁 Project Structure

```
MANTRO/
├── app/                    # Next.js App Router
│   ├── actions/           # Server actions (email sending)
│   ├── contact/           # Contact page
│   ├── about/             # About page
│   ├── services/          # Services page
│   ├── projects/         # Projects page
│   └── layout.tsx        # Root layout
├── components/
│   ├── ui/               # Reusable UI components
│   ├── effects/          # Heavy effects (WebGL, Canvas)
│   ├── contact/          # Contact form components
│   └── layout/           # Layout components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and helpers
│   ├── validators/       # Zod schemas
│   └── utils.ts          # Common utilities
├── public/               # Static assets
└── docs/                 # Documentation
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Resend API Key (Required for contact form)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Contact Form Configuration
CONTACT_EMAIL=tirthraval27@gmail.com
RESEND_FROM_EMAIL=onboarding@resend.dev

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://mantro.agency
NEXT_PUBLIC_CONTACT_EMAIL=tirthraval27@gmail.com

# Social Media Links
NEXT_PUBLIC_TWITTER_URL=https://x.com/your-handle
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/your-handle
NEXT_PUBLIC_LINKEDIN_URL=https://www.linkedin.com/company/your-company
NEXT_PUBLIC_GITHUB_URL=https://github.com/your-org
```

See [docs/SETUP.md](./docs/SETUP.md) for detailed setup instructions.

## 📚 Documentation

- **[Setup Guide](./docs/SETUP.md)** - Complete setup and configuration
- **[Contact Form](./docs/CONTACT_FORM.md)** - Contact form implementation and configuration
- **[Architecture](./docs/ARCHITECTURE.md)** - Project architecture and design patterns
- **[Performance](./docs/PERFORMANCE.md)** - Performance optimizations and best practices
- **[Deployment](./docs/DEPLOYMENT.md)** - Deployment guide for production

## 🎯 Key Features

### ✅ Implemented

- **Responsive Design** - Mobile-first, works on all devices
- **Contact Form** - Fully functional with email delivery via Resend
- **3D Graphics** - Interactive WebGL scenes and effects
- **Smooth Animations** - Framer Motion animations throughout
- **Performance Optimized** - Lazy loading, code splitting, image optimization
- **SEO Optimized** - Metadata, sitemap, robots.txt
- **Error Handling** - Error boundaries and graceful fallbacks
- **Toast Notifications** - User feedback system

### 🚧 Future Enhancements

- Blog/News section
- Client portal
- Advanced analytics
- Multi-language support

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run analyze      # Analyze bundle size
```

### Coding Principles

1. **Atomic Design** - Small, reusable components
2. **Strict Typing** - No `any` types, all props defined
3. **Error Isolation** - Major sections wrapped in Error Boundaries
4. **Performance First** - Heavy effects lazy-loaded
5. **Consistent Styling** - Use `cn()` utility, no inline styles

### Component Guidelines

#### UI Components (`@/components/ui`)
Small, reusable atomic components:
- Button, Card, Input, Typography
- Always typed with TypeScript interfaces

#### Effect Components (`@/components/effects`)
Heavy effects that should be lazy-loaded:
- WebGL scenes, Canvas animations, Three.js components

Always use dynamic import:
```tsx
const WebGLScene = dynamic(() => import('@/components/effects/WebGLScene'), {
  ssr: false,
})
```

## 🐛 Troubleshooting

### Contact Form Not Working
- Verify `RESEND_API_KEY` is set in `.env.local`
- Restart dev server after adding environment variables
- Check Resend dashboard for API key status
- See [Contact Form Documentation](./docs/CONTACT_FORM.md)

### Build Errors
- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version (requires 18+)

### Performance Issues
- Check browser console for errors
- Use `npm run analyze` to check bundle size
- See [Performance Documentation](./docs/PERFORMANCE.md)

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. For questions or issues, contact the development team.

## 📞 Support

For technical support or questions:
- Email: tirthraval27@gmail.com
- Check documentation in `/docs` folder

---

**Built with ❤️ by Mantro**

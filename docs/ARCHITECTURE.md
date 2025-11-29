# Architecture Documentation

Comprehensive guide to the Mantro project architecture, design patterns, and code organization.

## Overview

Mantro is built with Next.js 15 using the App Router, following modern React patterns and best practices for performance, maintainability, and scalability.

## Technology Stack

### Core Framework
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **React 19** - Latest React features and improvements

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Custom Design System** - Ethereal Industrialism theme

### 3D & Graphics
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers and abstractions

### Forms & Validation
- **React Hook Form** - Performant form management
- **Zod** - Schema validation
- **Resend** - Email delivery service

## Project Structure

```
MANTRO/
├── app/                      # Next.js App Router
│   ├── actions/             # Server actions
│   │   └── send-email.ts    # Email sending action
│   ├── contact/             # Contact page route
│   ├── about/               # About page route
│   ├── services/            # Services page route
│   ├── projects/            # Projects page route
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # Reusable UI components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ToastProvider.tsx
│   ├── effects/             # Heavy effects (WebGL, Canvas)
│   │   ├── ParticleBrain.tsx
│   │   └── HeroScene.tsx
│   ├── contact/             # Contact-specific components
│   │   ├── GlassContactForm.tsx
│   │   └── HulyLaserBackground.tsx
│   └── layout/              # Layout components
│       └── AppLoader.tsx
├── hooks/                   # Custom React hooks
│   ├── useContactForm.ts
│   └── useToast.ts
├── lib/                     # Utilities and helpers
│   ├── validators/          # Zod schemas
│   │   └── contact.ts
│   ├── utils.ts             # Common utilities
│   └── constants.ts         # App constants
├── public/                  # Static assets
│   ├── images/
│   └── icons/
└── docs/                    # Documentation
```

## Design Patterns

### 1. Atomic Design

Components are organized by complexity:

- **UI Components** (`components/ui/`) - Small, reusable atoms
- **Feature Components** (`components/contact/`) - Feature-specific components
- **Effect Components** (`components/effects/`) - Heavy visual effects

### 2. Server Actions

Next.js Server Actions for server-side operations:

```typescript
// app/actions/send-email.ts
'use server'

export async function sendEmail(data: ContactFormValues) {
  // Server-side logic
}
```

### 3. Custom Hooks

Reusable logic extracted into custom hooks:

```typescript
// hooks/useContactForm.ts
export function useContactForm() {
  // Form logic
  return { register, handleSubmit, onSubmit, ... }
}
```

### 4. Error Boundaries

Major sections wrapped in Error Boundaries for graceful error handling:

```tsx
<ErrorBoundary fallback={<ErrorFallback />}>
  <HeavyComponent />
</ErrorBoundary>
```

## Component Architecture

### UI Components

Located in `components/ui/`, these are small, reusable components:

- **Header** - Navigation and branding
- **Footer** - Site footer with links
- **ToastProvider** - Toast notification system

**Principles**:
- Single responsibility
- Fully typed with TypeScript
- Styled with Tailwind CSS
- No side effects

### Effect Components

Located in `components/effects/`, these are heavy visual effects:

- **ParticleBrain** - 3D particle system
- **HeroScene** - WebGL hero scene
- **SmoothScroll** - Smooth scrolling wrapper

**Principles**:
- Always lazy-loaded with `dynamic()`
- `ssr: false` for client-only rendering
- Performance optimized
- Error boundaries for fallbacks

### Page Components

Located in `app/`, these are route components:

- **page.tsx** - Home page
- **contact/page.tsx** - Contact page
- **about/page.tsx** - About page

**Principles**:
- Server components by default
- Client components marked with `'use client'`
- Metadata exported for SEO
- Error handling with error.tsx

## State Management

### Local State

React `useState` for component-local state:

```typescript
const [isOpen, setIsOpen] = useState(false)
```

### Form State

React Hook Form for form state management:

```typescript
const { register, handleSubmit, formState } = useForm()
```

### Global State

Context API for global state (toast notifications):

```typescript
const { success, error } = useToastContext()
```

## Data Flow

### Client-Side

```
User Action → Component → Hook → State Update → Re-render
```

### Server Actions

```
Form Submit → Server Action → Validation → API Call → Response → Toast
```

## Performance Optimizations

### Code Splitting

- Route-based code splitting (automatic with App Router)
- Component lazy loading for heavy effects
- Dynamic imports for conditional components

### Image Optimization

- Next.js Image component with automatic optimization
- WebP/AVIF format conversion
- Responsive image sizing
- Lazy loading

### Bundle Optimization

- Tree shaking (automatic)
- Minification (production builds)
- Bundle analysis with `npm run analyze`

## Security

### Environment Variables

- Sensitive data in `.env.local` (not committed)
- Server-only variables (no `NEXT_PUBLIC_` prefix)
- Client-accessible variables (with `NEXT_PUBLIC_` prefix)

### Input Validation

- Client-side validation (React Hook Form + Zod)
- Server-side validation (Zod in server actions)
- Input sanitization

### API Security

- API keys stored in environment variables
- Server-side API calls (not exposed to client)
- HTTPS required for production

## Styling Architecture

### Tailwind CSS

Utility-first CSS with custom configuration:

```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      void: '#030304',
      'cyber-violet': '#7B2CBF',
      cyan: '#4CC9F0',
    }
  }
}
```

### Design System

Ethereal Industrialism theme:
- **Void** - Deep black backgrounds
- **Cyber Violet** - Primary accent
- **Cyan** - Highlights and interactions

### Utility Functions

`cn()` utility for conditional classes:

```typescript
import { cn } from '@/lib/utils'

className={cn('base-class', condition && 'conditional-class')}
```

## Testing Strategy

### Manual Testing

- Browser testing (Chrome, Firefox, Safari)
- Mobile device testing
- Form submission testing
- Email delivery verification

### Performance Testing

- Lighthouse audits
- Bundle size analysis
- Network performance monitoring

## Deployment Architecture

### Build Process

1. **Type Checking** - TypeScript compilation
2. **Linting** - ESLint validation
3. **Building** - Next.js production build
4. **Optimization** - Code splitting, minification

### Production Considerations

- Environment variables in hosting platform
- Domain verification for email
- CDN for static assets
- Monitoring and error tracking

## Best Practices

### Code Organization

1. **Single Responsibility** - Each component has one job
2. **DRY Principle** - Don't repeat yourself
3. **Type Safety** - No `any` types
4. **Error Handling** - Graceful error boundaries

### Performance

1. **Lazy Loading** - Heavy components loaded on demand
2. **Code Splitting** - Route-based and component-based
3. **Image Optimization** - Always use Next.js Image
4. **Bundle Size** - Monitor and optimize

### Maintainability

1. **Documentation** - Code comments and docs
2. **Consistent Patterns** - Follow established patterns
3. **TypeScript** - Leverage type system
4. **Testing** - Manual and automated testing

## Future Considerations

### Scalability

- Component library expansion
- Feature flag system
- Analytics integration
- A/B testing framework

### Performance

- Service worker enhancements
- Advanced caching strategies
- CDN integration
- Edge computing

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)


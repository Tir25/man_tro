# Image Optimization Guide

Complete guide to image optimization in the Mantro project.

## Overview

All images in the Mantro project are automatically optimized using Next.js Image component, providing significant performance improvements with zero configuration.

## Automatic Optimizations

### 1. Format Conversion
- **WebP/AVIF**: Modern formats automatically served when supported
- **Fallback**: PNG/JPEG for older browsers
- **Impact**: 70-90% file size reduction

### 2. Responsive Sizing
- **Device-specific**: Different sizes for mobile, tablet, desktop
- **Viewport-based**: Images sized based on screen size
- **Impact**: Mobile users download smaller images

### 3. Lazy Loading
- **On-demand**: Images load when entering viewport
- **Performance**: Reduces initial page load
- **Impact**: Faster First Contentful Paint

### 4. Blur Placeholders
- **Perceived Performance**: Shows placeholder while loading
- **Smooth Transition**: Blur-to-sharp effect
- **Impact**: Better user experience

### 5. Caching
- **Long-term**: Optimized images cached for 1 year
- **Immutable**: Cache headers set correctly
- **Impact**: Faster repeat visits

## Usage

### Basic Image Component

```tsx
import Image from 'next/image'

<Image
  src="/image.png"
  alt="Description"
  width={1920}
  height={1080}
  quality={60}
  placeholder="blur"
/>
```

### Props

| Prop | Type | Description | Default |
|------|------|-------------|---------|
| `src` | string | Image path | Required |
| `alt` | string | Alt text | Required |
| `width` | number | Image width | Required |
| `height` | number | Image height | Required |
| `quality` | number | Quality (1-100) | 75 |
| `placeholder` | string | Placeholder type | - |
| `priority` | boolean | Load immediately | false |

### Priority Images

For above-the-fold images, use `priority`:

```tsx
<Image
  src="/hero-image.png"
  alt="Hero"
  width={1920}
  height={1080}
  priority
/>
```

## Current Image Assets

### Service Card Images

Located in `/public`:
- `digital-strategy-service.png`: ~6.8 MB (source)
- `ui-ux-service.png`: ~6.22 MB (source)
- `web-development-service.png`: ~6.49 MB (source)
- `android-development-service.png`: ~5.98 MB (source)
- `ai-agent-development-service.png`: ~6.25 MB (source)

**Note**: Source sizes shown. Next.js serves optimized versions (70-90% smaller).

### Optimized Sizes

- **Mobile**: ~200-400 KB per image
- **Desktop**: ~400-800 KB per image
- **Total**: ~1-2 MB for all 5 service images (vs ~32 MB unoptimized)

## Best Practices

### 1. Use Appropriate Dimensions

Always provide `width` and `height`:

```tsx
// ✅ Good
<Image src="/image.png" width={1920} height={1080} alt="..." />

// ❌ Bad
<Image src="/image.png" alt="..." />
```

### 2. Optimize Source Images

Before adding images:

1. **Resize** to maximum needed size (e.g., 1920px width)
2. **Compress** using tools like:
   - [Squoosh](https://squoosh.app/)
   - [TinyPNG](https://tinypng.com/)
   - [ImageOptim](https://imageoptim.com/)

3. **Recommended Settings**:
   - Max width: 1920px
   - Quality: 70-80% for PNG
   - Format: PNG for transparency, JPEG for photos

### 3. Use Correct Quality Settings

```tsx
// Background images (with overlays)
quality={60}

// Hero images
quality={85}

// Thumbnails
quality={50}
```

### 4. Lazy Load Below-the-Fold Images

```tsx
// ✅ Good (default behavior)
<Image src="/image.png" width={800} height={600} alt="..." />

// For above-the-fold
<Image src="/hero.png" width={1920} height={1080} priority alt="..." />
```

## Monitoring

### Check Optimized Sizes

1. **Build Output**: Check `.next/cache/images/` after build
2. **Network Tab**: Use Chrome DevTools to see actual loaded sizes
3. **Lighthouse**: Measure performance impact

### Performance Metrics

Monitor these metrics:
- **LCP**: Largest Contentful Paint (should be < 2.5s)
- **Image Load Time**: Check Network tab
- **Total Image Size**: Sum of all images loaded

## Advanced Configuration

### Custom Image Loader

For CDN integration, see [PERFORMANCE.md](./PERFORMANCE.md#cdn-configuration).

### Image Domains

If using external images, configure in `next.config.js`:

```javascript
images: {
  domains: ['example.com'],
  // or
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**.example.com',
    },
  ],
}
```

## Troubleshooting

### Images Not Loading

- Check image path is correct
- Verify image exists in `/public`
- Check browser console for errors

### Large File Sizes

- Pre-optimize source images
- Use appropriate quality settings
- Consider using WebP format for source images

### Slow Image Loading

- Use `priority` for above-the-fold images
- Check network connection
- Verify CDN is configured (if using)

## Additional Resources

- [Next.js Image Documentation](https://nextjs.org/docs/app/api-reference/components/image)
- [Web.dev Image Optimization](https://web.dev/fast/#optimize-your-images)
- [Squoosh Image Optimizer](https://squoosh.app/)



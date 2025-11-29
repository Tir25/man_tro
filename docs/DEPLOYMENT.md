# Deployment Guide

Complete guide for deploying the Mantro project to production.

## Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All environment variables are configured
- [ ] Resend API key is set up
- [ ] Domain is verified in Resend (for production emails)
- [ ] All tests pass
- [ ] Build completes without errors
- [ ] Performance metrics meet targets

## Environment Variables

### Required Variables

Set these in your hosting platform:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
CONTACT_EMAIL=your-email@example.com
RESEND_FROM_EMAIL=contact@yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_CONTACT_EMAIL=your-email@example.com
```

### Optional Variables

```env
NEXT_PUBLIC_TWITTER_URL=https://x.com/your-handle
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/your-handle
NEXT_PUBLIC_LINKEDIN_URL=https://www.linkedin.com/company/your-company
NEXT_PUBLIC_GITHUB_URL=https://github.com/your-org
```

## Deployment Platforms

### Vercel (Recommended)

Vercel is the recommended platform for Next.js applications.

#### Setup Steps

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy via Dashboard**:
   - Go to [vercel.com](https://vercel.com)
   - Import your Git repository
   - Configure build settings (auto-detected for Next.js)
   - Add environment variables
   - Deploy

3. **Deploy via CLI**:
   ```bash
   vercel
   ```

#### Environment Variables

Add in Vercel Dashboard:
- Project Settings → Environment Variables
- Add all required variables
- Set for Production, Preview, and Development

#### Custom Domain

1. Add domain in Vercel Dashboard
2. Configure DNS records as instructed
3. SSL certificate auto-provisioned

### Netlify

#### Setup Steps

1. **Install Netlify CLI**:
   ```bash
   npm i -g netlify-cli
   ```

2. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

#### Build Settings

- **Build command**: `npm run build`
- **Publish directory**: `.next`

#### Environment Variables

Add in Netlify Dashboard:
- Site Settings → Environment Variables
- Add all required variables

### Other Platforms

#### Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
RUN npm install --production

EXPOSE 3000
CMD ["npm", "start"]
```

#### Traditional Hosting

1. Build the application:
   ```bash
   npm run build
   ```

2. Upload `.next` folder and `package.json`

3. Install dependencies:
   ```bash
   npm install --production
   ```

4. Start server:
   ```bash
   npm start
   ```

## Post-Deployment

### Verification

1. **Check Homepage**
   - Verify site loads correctly
   - Check all pages are accessible

2. **Test Contact Form**
   - Submit test form
   - Verify email is received
   - Check email formatting

3. **Performance Check**
   - Run Lighthouse audit
   - Verify Core Web Vitals
   - Check bundle sizes

4. **SEO Verification**
   - Check meta tags
   - Verify sitemap.xml
   - Check robots.txt

### Monitoring

#### Error Tracking

Set up error tracking:
- Sentry
- LogRocket
- Custom error logging

#### Analytics

Add analytics:
- Google Analytics
- Plausible
- Custom analytics

#### Uptime Monitoring

Set up uptime monitoring:
- UptimeRobot
- Pingdom
- Custom monitoring

## Email Configuration

### Domain Verification

For production, verify your domain in Resend:

1. **Add Domain** in Resend dashboard
2. **Add DNS Records**:
   - SPF record
   - DKIM records
3. **Verify** domain status
4. **Update** `RESEND_FROM_EMAIL` to use verified domain

### Email Deliverability

To improve deliverability:

- Use verified domain
- Set up SPF/DKIM records correctly
- Monitor bounce rates
- Keep sender reputation high

## SSL/HTTPS

### Automatic (Vercel/Netlify)

SSL certificates are automatically provisioned

### Manual Setup

If using custom hosting:

1. Obtain SSL certificate (Let's Encrypt)
2. Configure web server (Nginx/Apache)
3. Redirect HTTP to HTTPS

## Performance Optimization

### CDN Configuration

Configure CDN for static assets:
- Cloudflare
- AWS CloudFront
- Custom CDN

### Caching

Configure caching headers:
- Static assets: 1 year
- HTML: No cache
- API routes: Appropriate TTL

## Troubleshooting

### Build Failures

**Issue**: Build fails in production

**Solutions**:
- Check Node.js version (18+)
- Verify all dependencies are installed
- Check for TypeScript errors
- Review build logs

### Environment Variables Not Loading

**Issue**: Variables not available in production

**Solutions**:
- Verify variables are set in hosting platform
- Check variable names (case-sensitive)
- Restart deployment after adding variables
- Verify `NEXT_PUBLIC_` prefix for client variables

### Email Not Sending

**Issue**: Contact form not sending emails

**Solutions**:
- Verify `RESEND_API_KEY` is set
- Check Resend dashboard for errors
- Verify domain is verified (production)
- Check email logs in Resend dashboard

### Performance Issues

**Issue**: Slow performance in production

**Solutions**:
- Check CDN configuration
- Verify image optimization is working
- Check bundle sizes
- Review server resources

## Rollback Strategy

### Vercel

1. Go to Deployments
2. Find previous deployment
3. Click "Promote to Production"

### Netlify

1. Go to Deploys
2. Find previous deployment
3. Click "Publish deploy"

### Git-Based

1. Revert to previous commit
2. Redeploy

## Maintenance

### Regular Updates

- Update dependencies monthly
- Monitor security advisories
- Update Next.js regularly
- Test after updates

### Monitoring

- Check error rates daily
- Monitor performance weekly
- Review analytics monthly
- Update documentation as needed

## Additional Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Resend Production Guide](https://resend.com/docs)


# Environment Variables Reference

Complete reference for all environment variables used in the Mantro project.

> **Note**: For setup instructions, see [SETUP.md](./SETUP.md). For contact form configuration, see [CONTACT_FORM.md](./CONTACT_FORM.md).

## Required Variables

### `RESEND_API_KEY`
**Required**: Yes  
**Type**: Server-only  
**Description**: Resend API key for sending emails via contact form  
**Format**: `re_xxxxxxxxxxxxx`  
**How to get**: Sign up at [resend.com](https://resend.com) and create an API key

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

## Contact Form Variables

### `CONTACT_EMAIL`
**Required**: No (defaults to `tirthraval27@gmail.com`)  
**Type**: Server-only  
**Description**: Email address where contact form submissions are sent

```env
CONTACT_EMAIL=tirthraval27@gmail.com
```

### `RESEND_FROM_EMAIL`
**Required**: No (defaults to `onboarding@resend.dev`)  
**Type**: Server-only  
**Description**: Email address used as sender  
**Format**: `"Display Name <email@domain.com>"` or `"email@domain.com"`  
**Note**: For production, use a verified domain to improve deliverability

```env
# Testing (no verification needed)
RESEND_FROM_EMAIL=onboarding@resend.dev

# Production (requires domain verification)
RESEND_FROM_EMAIL=Contact <contact@yourdomain.com>
```

### `NEXT_PUBLIC_CONTACT_EMAIL`
**Required**: No  
**Type**: Client-accessible  
**Description**: Email address displayed in UI (contact page, mailto links)

```env
NEXT_PUBLIC_CONTACT_EMAIL=tirthraval27@gmail.com
```

## Site Configuration

### `NEXT_PUBLIC_SITE_URL`
**Required**: No (defaults to `https://mantro.agency`)  
**Type**: Client-accessible  
**Description**: Base URL of the site, used for metadata, sitemap, and robots.txt

```env
NEXT_PUBLIC_SITE_URL=https://mantro.agency
```

## Social Media Links

### `NEXT_PUBLIC_TWITTER_URL`
**Required**: No  
**Type**: Client-accessible  
**Description**: Twitter/X profile URL

```env
NEXT_PUBLIC_TWITTER_URL=https://x.com/your-handle
```

### `NEXT_PUBLIC_INSTAGRAM_URL`
**Required**: No  
**Type**: Client-accessible  
**Description**: Instagram profile URL

```env
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/your-handle
```

### `NEXT_PUBLIC_LINKEDIN_URL`
**Required**: No  
**Type**: Client-accessible  
**Description**: LinkedIn company/profile URL

```env
NEXT_PUBLIC_LINKEDIN_URL=https://www.linkedin.com/company/your-company
```

### `NEXT_PUBLIC_GITHUB_URL`
**Required**: No  
**Type**: Client-accessible  
**Description**: GitHub organization/profile URL

```env
NEXT_PUBLIC_GITHUB_URL=https://github.com/your-org
```

## Variable Types

### Server-Only Variables
Variables without `NEXT_PUBLIC_` prefix are only available on the server:
- `RESEND_API_KEY`
- `CONTACT_EMAIL`
- `RESEND_FROM_EMAIL`

These are **never** exposed to the client and are safe for sensitive data.

### Client-Accessible Variables
Variables with `NEXT_PUBLIC_` prefix are available in the browser:
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_CONTACT_EMAIL`
- `NEXT_PUBLIC_*_URL` (social media links)

These are **exposed** to the client, so never include sensitive data.

## Complete Example

```env
# Required
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Contact Form
CONTACT_EMAIL=tirthraval27@gmail.com
RESEND_FROM_EMAIL=onboarding@resend.dev
NEXT_PUBLIC_CONTACT_EMAIL=tirthraval27@gmail.com

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://mantro.agency

# Social Media
NEXT_PUBLIC_TWITTER_URL=https://x.com/your-handle
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/your-handle
NEXT_PUBLIC_LINKEDIN_URL=https://www.linkedin.com/company/your-company
NEXT_PUBLIC_GITHUB_URL=https://github.com/your-org
```

## Security Notes

1. **Never commit** `.env.local` to version control
2. **Use server-only variables** for sensitive data (API keys, secrets)
3. **Client variables** are exposed in the browser bundle
4. **Rotate API keys** regularly in production
5. **Use different keys** for development and production

## Troubleshooting

See [SETUP.md](./SETUP.md#troubleshooting) for common issues and solutions.


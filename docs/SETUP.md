# Setup Guide

Complete guide for setting up and configuring the Mantro project.

## Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.0 or higher
- **npm** 9.0 or higher (comes with Node.js)
- **Git** (for version control)
- A modern code editor (VS Code recommended)

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd MANTRO
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`.

### 3. Environment Configuration

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local  # If .env.example exists
# Or create manually
touch .env.local
```

### 4. Configure Environment Variables

Edit `.env.local` with the following required variables:

```env
# Resend API Key (Required for contact form)
# Get your key from https://resend.com/api-keys
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Contact Form Configuration
CONTACT_EMAIL=tirthraval27@gmail.com
RESEND_FROM_EMAIL=onboarding@resend.dev

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://mantro.agency
NEXT_PUBLIC_CONTACT_EMAIL=tirthraval27@gmail.com

# Social Media Links (Optional)
NEXT_PUBLIC_TWITTER_URL=https://x.com/your-handle
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/your-handle
NEXT_PUBLIC_LINKEDIN_URL=https://www.linkedin.com/company/your-company
NEXT_PUBLIC_GITHUB_URL=https://github.com/your-org
```

## Getting a Resend API Key

The contact form requires a Resend API key to send emails:

1. **Sign up** at [resend.com](https://resend.com)
2. **Navigate** to API Keys section in dashboard
3. **Create** a new API key
4. **Copy** the key (starts with `re_`)
5. **Add** it to `.env.local` as `RESEND_API_KEY`

> ⚠️ **Important**: Never commit `.env.local` to version control. It's already in `.gitignore`.

## Running the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Hot Reload

Next.js automatically reloads when you make changes to files. No need to manually restart the server.

## Building for Production

### 1. Build the Application

```bash
npm run build
```

This creates an optimized production build in the `.next` directory.

### 2. Start Production Server

```bash
npm start
```

The production server will run on [http://localhost:3000](http://localhost:3000).

## Verification Checklist

After setup, verify everything works:

- [ ] Dependencies installed successfully
- [ ] `.env.local` file created with all required variables
- [ ] Development server starts without errors
- [ ] Homepage loads correctly
- [ ] Contact form is accessible at `/contact`
- [ ] Contact form submission works (check email inbox)

## Common Setup Issues

### Issue: "Module not found" errors

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Port 3000 already in use"

**Solution:**
- Kill the process using port 3000
- Or use a different port: `PORT=3001 npm run dev`

### Issue: Environment variables not loading

**Solution:**
- Ensure `.env.local` is in the project root (not in a subdirectory)
- Restart the development server after adding/changing variables
- Check for typos in variable names
- Ensure no spaces around the `=` sign

### Issue: Contact form shows "Email service not configured"

**Solution:**
- Verify `RESEND_API_KEY` is set in `.env.local`
- Ensure the API key starts with `re_`
- Restart the dev server after adding the key
- Check Resend dashboard to ensure the key is active

## Next Steps

After successful setup:

1. Read the [Architecture Guide](./ARCHITECTURE.md) to understand the project structure
2. Review [Contact Form Documentation](./CONTACT_FORM.md) for form configuration
3. Check [Performance Guide](./PERFORMANCE.md) for optimization tips
4. See [Deployment Guide](./DEPLOYMENT.md) when ready to deploy

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Resend Documentation](https://resend.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)


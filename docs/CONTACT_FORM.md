# Contact Form Documentation

Complete guide to the contact form implementation, configuration, and troubleshooting.

## Overview

The contact form is a fully functional, production-ready implementation that sends emails via Resend. It features:

- ✅ Client-side validation with React Hook Form
- ✅ Server-side validation with Zod
- ✅ Beautiful glassmorphic UI design
- ✅ Toast notifications for user feedback
- ✅ Error handling and graceful fallbacks
- ✅ Form reset after successful submission
- ✅ Loading states and animations

## Architecture

### Components

```
components/contact/
├── GlassContactForm.tsx    # Main form component
└── HulyLaserBackground.tsx # Background effect

hooks/
└── useContactForm.ts       # Form logic hook

app/actions/
└── send-email.ts           # Server action for email sending

lib/validators/
└── contact.ts              # Zod validation schema
```

### Data Flow

1. **User fills form** → React Hook Form manages state
2. **User submits** → Client-side validation (Zod)
3. **Validation passes** → Server action called (`sendEmail`)
4. **Server validates** → Additional server-side validation
5. **Email sent** → Resend API sends email
6. **Success/Error** → Toast notification shown to user

## Configuration

### Required Environment Variables

```env
# Resend API Key (Required)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Contact Form Recipient
CONTACT_EMAIL=tirthraval27@gmail.com

# From Email Address
RESEND_FROM_EMAIL=onboarding@resend.dev
```

### Form Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Name | text | Yes | Min 2 characters |
| Email | email | Yes | Valid email format |
| Company | text | No | Optional |
| Project Type | text | No | Optional |
| Message | textarea | Yes | Min 10 characters |

## Email Configuration

### Testing (Default)

For development and testing, use Resend's default domain:

```env
RESEND_FROM_EMAIL=onboarding@resend.dev
```

This works without domain verification but emails may go to spam.

### Production

For production, verify your domain in Resend:

1. **Add Domain** in Resend dashboard
2. **Verify DNS Records** (SPF, DKIM)
3. **Update Environment Variable**:
   ```env
   RESEND_FROM_EMAIL=Contact <contact@yourdomain.com>
   ```

This improves deliverability and prevents emails from going to spam.

## Customization

### Changing Recipient Email

Update `.env.local`:

```env
CONTACT_EMAIL=your-email@example.com
```

### Customizing Email Template

Edit `app/actions/send-email.ts`:

```typescript
html: `
  <h2>New Contact Form Submission</h2>
  <p><strong>Name:</strong> ${name}</p>
  <p><strong>Email:</strong> ${email}</p>
  <!-- Customize HTML template here -->
`,
```

### Styling the Form

The form uses Tailwind CSS. Customize in `components/contact/GlassContactForm.tsx`:

```tsx
className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/5..."
```

## Testing

### Manual Testing

1. Navigate to `/contact`
2. Fill out the form with valid data
3. Submit and verify:
   - Success toast appears
   - Form resets
   - Email received in inbox

### Testing Validation

- **Empty form**: Should show validation errors
- **Invalid email**: Should show email format error
- **Short message**: Should show minimum length error
- **Valid submission**: Should send email successfully

### Testing Email Delivery

1. Submit form with test data
2. Check recipient inbox (`CONTACT_EMAIL`)
3. Verify email content is correct
4. Check spam folder if not received

## Troubleshooting

### "Email service is not configured"

**Cause**: `RESEND_API_KEY` is missing or incorrect

**Solution**:
- Verify `.env.local` exists in project root
- Check `RESEND_API_KEY` is set correctly
- Ensure API key starts with `re_`
- Restart dev server after adding key

### "Failed to send email"

**Possible Causes**:
- Invalid API key
- Resend account issue
- Rate limit exceeded (100 emails/day on free tier)
- Invalid recipient email

**Solution**:
- Verify API key in Resend dashboard
- Check Resend account status
- Verify recipient email format
- Check Resend logs for detailed error

### Emails Going to Spam

**Cause**: Using unverified domain (`onboarding@resend.dev`)

**Solution**:
- Verify your domain in Resend
- Update `RESEND_FROM_EMAIL` to use verified domain
- Ensure SPF/DKIM records are correct

### Form Not Submitting

**Possible Causes**:
- JavaScript errors in console
- Network issues
- Server action error

**Solution**:
- Check browser console for errors
- Verify network tab shows POST request
- Check server logs for errors
- Ensure all required fields are filled

### Validation Errors Not Showing

**Cause**: Form validation not working

**Solution**:
- Check React Hook Form is properly initialized
- Verify Zod schema is correct
- Check browser console for errors
- Ensure form is properly connected to hook

## Security Considerations

### Current Implementation

- ✅ Server-side validation (prevents bypassing client validation)
- ✅ Input sanitization (removes special characters)
- ✅ Environment variables for sensitive data
- ✅ HTTPS required for production

### Recommended Additions

- **Rate Limiting**: Prevent spam submissions
- **Honeypot Field**: Additional spam protection
- **reCAPTCHA**: For high-traffic sites
- **CSRF Protection**: Next.js provides this automatically

## Monitoring

### Resend Dashboard

Monitor email delivery in Resend dashboard:
- Delivery rates
- Bounce rates
- Open rates (if tracking enabled)
- API usage

### Application Logs

Check server logs for:
- Email sending errors
- Validation failures
- API errors

## Best Practices

1. **Always validate** on both client and server
2. **Use environment variables** for sensitive data
3. **Test thoroughly** before deploying
4. **Monitor email delivery** rates
5. **Keep dependencies updated**
6. **Use verified domains** in production

## API Reference

### Server Action: `sendEmail`

```typescript
async function sendEmail(data: ContactFormValues): Promise<{
  success?: boolean;
  error?: string;
  data?: EmailData;
}>
```

**Parameters**:
- `data`: Form data object with name, email, company, projectType, message

**Returns**:
- `{ success: true, data: EmailData }` on success
- `{ error: string }` on failure

## Additional Resources

- [Resend Documentation](https://resend.com/docs)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)


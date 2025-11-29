'use server'

import { Resend } from 'resend'
import { contactFormSchema, ContactFormValues } from '@/lib/validators/contact'

// Get email configuration from environment variables with fallbacks
const getEmailConfig = () => {
  const recipientEmail = process.env.CONTACT_EMAIL || 'tirthraval27@gmail.com'
  // Use Resend's default email for testing (no domain verification needed)
  // Format: "Display Name <email@domain.com>" or just "email@domain.com"
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
  
  return { recipientEmail, fromEmail }
}

const sanitizeText = (value?: string | null) =>
  (value ?? '')
    .normalize('NFKD')
    .replace(/[^\x00-\x7F]/g, '')

const sanitizePayload = (data: ContactFormValues) => ({
  name: sanitizeText(data.name),
  email: sanitizeText(data.email),
  company: sanitizeText(data.company),
  projectType: sanitizeText(data.projectType),
  message: sanitizeText(data.message),
})

export async function sendEmail(data: ContactFormValues) {
    const result = contactFormSchema.safeParse(data)

    if (!result.success) {
        return { error: 'Invalid form data' }
    }

    const { name, email, company, projectType, message } = sanitizePayload(result.data)

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
        return { 
            error: 'Email service is not configured. Please contact support directly at tirthraval27@gmail.com' 
        }
    }

    // Initialize Resend client only when needed (inside the function)
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { recipientEmail, fromEmail } = getEmailConfig()

    try {
        const { data: emailData, error } = await resend.emails.send({
            from: fromEmail,
            to: [recipientEmail],
            subject: `New Contact Form Submission from ${name}`,
            text: `
        Name: ${name}
        Email: ${email}
        Company: ${company || 'N/A'}
        Project Type: ${projectType || 'N/A'}
        
        Message:
        ${message}
      `,
            // You can also add an HTML version here if you want it to look nicer
            html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || 'N/A'}</p>
        <p><strong>Project Type:</strong> ${projectType || 'N/A'}</p>
        <br/>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br/>')}</p>
      `,
        })

        if (error) {
            console.error('Resend error:', error)
            // Log full error details for debugging
            console.error('Resend error details:', JSON.stringify(error, null, 2))
            
            // Provide more specific error messages
            const errorMessage = error.message || String(error)
            
            if (errorMessage.includes('API key') || errorMessage.includes('Unauthorized')) {
                return { error: 'Email service configuration error. Please check your API key.' }
            }
            
            if (errorMessage.includes('domain') || errorMessage.includes('not verified') || errorMessage.includes('unverified')) {
                return { 
                    error: 'Email domain not verified. Please use "onboarding@resend.dev" for testing, or verify your domain in Resend dashboard.' 
                }
            }
            
            if (errorMessage.includes('rate limit') || errorMessage.includes('too many')) {
                return { error: 'Email rate limit exceeded. Please try again later.' }
            }
            
            // Return the actual error message if available, otherwise generic message
            return { 
                error: errorMessage || 'Failed to send email. Please try again later.' 
            }
        }

        return { success: true, data: emailData }
    } catch (error) {
        console.error('Server error:', error)
        return { error: 'Something went wrong. Please try again.' }
    }
}

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { sendEmail } from '@/app/actions/send-email'
import { useToastContext } from '@/components/ui/ToastProvider'
import { contactFormSchema, ContactFormValues } from '@/lib/validators/contact'

export function useContactForm() {
    const [submitted, setSubmitted] = useState(false)
    const { success, error: showError } = useToastContext()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ContactFormValues>({
        resolver: zodResolver(contactFormSchema),
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: {
            name: '',
            email: '',
            company: '',
            projectType: '',
            message: '',
        },
    })

    async function onSubmit(data: ContactFormValues) {
        try {
            const result = await sendEmail(data)

            if (result.error) {
                console.error('Form submission error:', result.error)
                showError(result.error, 6000)
                return
            }

            if (result.success) {
                setSubmitted(true)
                reset()
                success('Message sent successfully! We\'ll get back to you within 24 hours.', 5000)
                // Reset submitted state after 3 seconds
                setTimeout(() => setSubmitted(false), 3000)
            }
        } catch (error) {
            console.error('Submission error:', error)
            const errorMessage = error instanceof Error 
                ? error.message 
                : 'Something went wrong. Please try again.'
            showError(errorMessage, 6000)
        }
    }

    return {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        onSubmit,
        submitted,
    }
}

'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Typography } from '@/components/ui/Typography'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // In production, send to error reporting service (e.g., Sentry)
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error(error)
        }
        // errorReportingService.captureException(error)
    }, [error])

    return (
        <html lang="en">
            <body className="bg-void text-white flex items-center justify-center min-h-screen">
                <div className="text-center space-y-6 p-8 max-w-md">
                    <Typography variant="h2" className="text-red-500">
                        Something went wrong!
                    </Typography>
                    <Typography variant="body" className="text-gray-400">
                        We apologize for the inconvenience. A critical error has occurred.
                    </Typography>
                    <Button onClick={() => reset()} variant="primary">
                        Try again
                    </Button>
                </div>
            </body>
        </html>
    )
}

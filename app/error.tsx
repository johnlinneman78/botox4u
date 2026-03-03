'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-2xl font-bold font-display">Something went wrong!</h2>
            <p className="max-w-md text-[#3D2B1F]/50">
                We apologize for the inconvenience. An unexpected error has occurred.
            </p>
            <Button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
            >
                Try again
            </Button>
        </div>
    )
}

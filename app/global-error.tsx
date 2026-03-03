'use client'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html>
            <body>
                <div className="flex bg-white h-screen flex-col items-center justify-center gap-4 text-center">
                    <h2 className="text-2xl font-bold font-display text-gray-900">Critical Application Error</h2>
                    <p className="max-w-md text-[#3D2B1F]/50">
                        A critical error occurred while loading the application.
                    </p>
                    <button
                        className="bg-primary hover:bg-primary/90 text-[#3D2B1F] font-bold py-2 px-4 rounded"
                        onClick={() => reset()}
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    )
}

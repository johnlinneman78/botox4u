export function SkeletonCard() {
    return (
        <div
            className="rounded-lg p-6"
            style={{
                background: 'white',
                border: '1px solid var(--color-border)',
            }}
        >
            {/* Avatar + Badge row */}
            <div className="flex items-start justify-between mb-4">
                <div
                    className="skeleton-shimmer rounded-full"
                    style={{ width: 72, height: 72 }}
                />
                <div className="flex flex-col items-center gap-1">
                    <div
                        className="skeleton-shimmer rounded-full"
                        style={{ width: 56, height: 56 }}
                    />
                    <div
                        className="skeleton-shimmer rounded"
                        style={{ width: 64, height: 8 }}
                    />
                </div>
            </div>

            {/* Name */}
            <div
                className="skeleton-shimmer rounded"
                style={{ width: '70%', height: 22, marginBottom: 8 }}
            />

            {/* Credentials */}
            <div
                className="skeleton-shimmer rounded"
                style={{ width: '45%', height: 12, marginBottom: 16 }}
            />

            {/* Tags row */}
            <div className="flex gap-2 mb-4">
                <div className="skeleton-shimmer rounded-pill" style={{ width: 72, height: 24 }} />
                <div className="skeleton-shimmer rounded-pill" style={{ width: 88, height: 24 }} />
                <div className="skeleton-shimmer rounded-pill" style={{ width: 64, height: 24 }} />
            </div>

            {/* Divider */}
            <div
                className="skeleton-shimmer rounded"
                style={{ width: '100%', height: 1, marginBottom: 16 }}
            />

            {/* Location + Rating */}
            <div className="flex justify-between">
                <div className="skeleton-shimmer rounded" style={{ width: '40%', height: 14 }} />
                <div className="skeleton-shimmer rounded" style={{ width: '20%', height: 14 }} />
            </div>

            {/* CTA */}
            <div
                className="skeleton-shimmer rounded mt-4"
                style={{ width: '55%', height: 14 }}
            />
        </div>
    )
}

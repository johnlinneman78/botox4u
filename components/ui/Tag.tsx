import { cn } from '@/lib/utils'

interface TagProps {
    children: React.ReactNode
    className?: string
}

export function Tag({ children, className }: TagProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-pill px-2.5 py-1 font-body',
                className
            )}
            style={{
                fontSize: '11px',
                background: 'var(--color-surface)',
                color: 'var(--color-espresso)',
            }}
        >
            {children}
        </span>
    )
}

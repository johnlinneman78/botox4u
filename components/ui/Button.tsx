'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost' | 'link'
    size?: 'sm' | 'md' | 'lg'
}

const resolveVariant = (v: ButtonProps['variant']): 'primary' | 'secondary' | 'tertiary' => {
    if (v === 'outline' || v === 'ghost' || v === 'link') return 'secondary'
    return v || 'primary'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
        const v = resolveVariant(variant)
        return (
            <button
                className={cn(
                    'inline-flex items-center justify-center font-medium transition-all cursor-pointer',
                    'focus-visible:outline-none focus-visible:shadow-focus',
                    'disabled:pointer-events-none disabled:opacity-50',
                    {
                        // Primary: espresso gradient, linen text, pill
                        'bg-espresso text-linen rounded-pill shadow-md hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0':
                            v === 'primary',
                        // Secondary: transparent, espresso border, pill
                        'bg-transparent border-[1.5px] border-espresso text-espresso rounded-pill hover:bg-surface active:bg-border/30':
                            v === 'secondary',
                        // Tertiary: no bg, no border, underline slide
                        'bg-transparent text-espresso underline-slide p-0 hover:opacity-80':
                            v === 'tertiary',
                    },
                    {
                        'px-6 py-2.5 text-sm': size === 'sm',
                        'px-8 py-3.5 text-[14px]': size === 'md',
                        'px-10 py-4 text-base': size === 'lg',
                    },
                    className
                )}
                ref={ref}
                style={{
                    transitionDuration: v === 'primary' ? 'var(--duration-fast)' : 'var(--duration-med)',
                    transitionTimingFunction: 'var(--ease)',
                }}
                {...props}
            >
                {children}
                {v === 'tertiary' && (
                    <span className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
                )}
            </button>
        )
    }
)

Button.displayName = 'Button'

export { Button }
export type { ButtonProps }

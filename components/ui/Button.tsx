import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
        return (
            <button
                className={cn(
                    'inline-flex items-center justify-center rounded-xl font-bold transition-all duration-300',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                    'disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
                    {
                        'bg-[#1a2332] text-white hover:bg-slate-800 focus-visible:ring-[#1a2332] shadow-lg shadow-[#1a2332]/10': variant === 'primary',
                        'bg-[#d4af37] text-[#1a2332] hover:bg-[#c0a030] focus-visible:ring-[#d4af37] shadow-lg shadow-[#d4af37]/10': variant === 'secondary',
                        'border-2 border-slate-200 text-[#1a2332] hover:border-[#d4af37] hover:text-[#d4af37] bg-white': variant === 'outline',
                        'text-slate-500 hover:text-[#1a2332] hover:bg-slate-50': variant === 'ghost',
                    },
                    {
                        'px-4 py-2 text-sm': size === 'sm',
                        'px-6 py-2.5 text-base': size === 'md',
                        'px-8 py-3.5 text-lg': size === 'lg',
                    },
                    className
                )}
                ref={ref}
                {...props}
            >
                {children}
            </button>
        )
    }
)

Button.displayName = 'Button'

export { Button }

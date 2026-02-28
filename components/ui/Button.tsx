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
                        'bg-white/10 text-white hover:bg-white/20': variant === 'primary',
                        'bg-[#d4af37] text-black hover:bg-[#c0a030]': variant === 'secondary',
                        'border border-white/10 text-white hover:bg-white/5 bg-transparent': variant === 'outline',
                        'text-gray-400 hover:text-white hover:bg-white/5': variant === 'ghost',
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

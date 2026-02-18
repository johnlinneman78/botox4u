import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
    value: number[]
    max: number
    step: number
    onValueChange: (value: number[]) => void
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
    ({ className, value, max, step, onValueChange, ...props }, ref) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            onValueChange([parseFloat(e.target.value)])
        }

        return (
            <div className="relative flex w-full touch-none select-none items-center">
                <input
                    type="range"
                    min={0}
                    max={max}
                    step={step}
                    value={value[0]}
                    onChange={handleChange}
                    className={cn(
                        "h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-primary",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
            </div>
        )
    }
)
Slider.displayName = "Slider"

export { Slider }

import type { Config } from "tailwindcss";

export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: 'var(--color-bg)',
                surface: 'var(--color-surface)',
                border: 'var(--color-border)',
                blush: 'var(--color-blush)',
                espresso: 'var(--color-espresso)',
                sage: 'var(--color-sage)',
                stone: 'var(--color-stone)',
                taupe: 'var(--color-taupe)',
                deep: 'var(--color-deep)',
                gold: 'var(--color-gold)',
                error: 'var(--color-error)',
                success: 'var(--color-success)',
                linen: 'var(--color-linen)',
                champagne: 'var(--color-champagne)',
            },
            fontFamily: {
                display: ['var(--font-cormorant)', 'Georgia', 'serif'],
                body: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
                sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                sm: 'var(--radius-sm)',
                md: 'var(--radius-md)',
                lg: 'var(--radius-lg)',
                xl: 'var(--radius-xl)',
                pill: 'var(--radius-pill)',
            },
            boxShadow: {
                sm: 'var(--shadow-sm)',
                md: 'var(--shadow-md)',
                lg: 'var(--shadow-lg)',
                xl: 'var(--shadow-xl)',
                focus: 'var(--shadow-focus)',
            },
            spacing: {
                'xs': '0.5rem',
                'sm-space': '1rem',
                'md-space': '1.5rem',
                'lg-space': '3rem',
                'xl-space': '5rem',
                '2xl-space': '8rem',
                'nav': '72px',
            },
            maxWidth: {
                'content': '1200px',
                'reading': '680px',
                'grid': '1440px',
            },
            transitionTimingFunction: {
                'luxe': 'cubic-bezier(0.4, 0, 0.2, 1)',
            },
        },
    },
    plugins: [],
} satisfies Config;

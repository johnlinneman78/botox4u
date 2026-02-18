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
                primary: '#1a2332',
                secondary: '#d4af37',
                accent: '#c0a030', // Slightly darker gold for hover states
                background: '#fafaf8',
                success: '#6b8e7f',
                error: '#c94d4d',
                navy: '#1a2332',
                gold: '#d4af37',
            },
            fontFamily: {
                display: ['var(--font-display)', 'serif'],
                sans: ['var(--font-sans)', 'sans-serif'],
                mono: ['var(--font-mono)', 'monospace'],
            },
        },
    },
    plugins: [],
} satisfies Config;

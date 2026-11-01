/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
                ink: {
                    950: '#0b0a09',
                    900: '#121110',
                    850: '#161413',
                    800: '#1c1917',
                    700: '#2a2522',
                    600: '#3b342e',
                },
                brass: {
                    200: '#f8e7c9',
                    300: '#f0d3a4',
                    400: '#e5b878',
                    500: '#d69f55',
                    600: '#bd8238',
                },
                cream: '#f4eee3',
                muted: '#a49a8c',
            },
            fontFamily: {
                display: ['Fraunces', 'Georgia', 'Cambria', 'serif'],
                sans: ['Inter', 'system-ui', 'Segoe UI', 'sans-serif'],
            },
            boxShadow: {
                glow: '0 18px 60px -24px rgba(214, 159, 85, 0.45)',
                card: '0 24px 60px -30px rgba(0, 0, 0, 0.9)',
            },
            keyframes: {
                'spin-slow': {
                    to: { transform: 'rotate(360deg)' },
                },
                'fade-up': {
                    from: { opacity: '0', transform: 'translateY(10px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
            },
            animation: {
                'spin-slow': 'spin-slow 24s linear infinite',
                'fade-up': 'fade-up 0.4s ease-out both',
            },
        },
    },
    plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: {
                    DEFAULT: '#dbe4ee',
                    card: '#ffffff',
                    hover: '#f1f5f9',
                    elevated: '#f8fafc',
                },
                accent: {
                    DEFAULT: '#9b1c1c',
                    hover: '#7f1d1d',
                    light: 'rgba(155, 28, 28, 0.08)',
                },
                'sidebar-red': '#9b1c1c',
                chart: {
                    programming: '#9b1c1c',
                    design: '#ffb703',
                    editing: '#219ebc',
                    marketing: '#8e44ad',
                },
                text: {
                    primary: '#1e293b',
                    secondary: '#64748b',
                    muted: '#94a3b8',
                },
                border: {
                    DEFAULT: '#e2e8f0',
                    hover: '#cbd5e1',
                },
                success: {
                    DEFAULT: '#059669',
                    light: 'rgba(5, 150, 105, 0.1)',
                },
                warning: {
                    DEFAULT: '#d97706',
                    light: 'rgba(217, 119, 6, 0.1)',
                },
                danger: {
                    DEFAULT: '#dc2626',
                    light: 'rgba(220, 38, 38, 0.1)',
                },
                accent3: {
                    DEFAULT: '#2563eb',
                    light: 'rgba(37, 99, 235, 0.1)',
                },
            },
            fontFamily: {
                heading: ['Syne', 'sans-serif'],
                body: ['Inter', 'Poppins', 'sans-serif'],
            },
            borderRadius: {
                'xl': '12px',
                '2xl': '16px',
                '3xl': '24px',
                '4xl': '32px',
            },
            boxShadow: {
                'card': '0 10px 30px rgba(0, 0, 0, 0.03), 0 1px 8px rgba(0, 0, 0, 0.02)',
                'card-hover': '0 20px 40px rgba(0, 0, 0, 0.06), 0 1px 10px rgba(0, 0, 0, 0.03)',
                'sidebar': '4px 0 20px rgba(0,0,0,0.02)',
                'glow': '0 0 20px rgba(230, 57, 70, 0.12)',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'fade-in': 'fadeIn 0.3s ease-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-in': 'slideIn 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideIn: {
                    '0%': { opacity: '0', transform: 'translateX(-10px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
            },
            transitionTimingFunction: {
                'sidebar': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            },
        },
    },
    plugins: [],
}

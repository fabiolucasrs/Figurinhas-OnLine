/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
    './contexts/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
        mono: ['Space Grotesk', 'monospace'],
      },
      colors: {
        brand: {
          'green-dark': '#1B5E20',
          'green-medium': '#2E7D32',
          'green-light': '#4CAF50',
          amber: '#F9A825',
          yellow: '#FFEB3B',
          gold: '#FFD600',
        },
      },
      animation: {
        shimmer: 'shimmer 2.5s infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}

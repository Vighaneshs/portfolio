/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      keyframes: {
        bounceX: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(5px)' },
        }
      },
      animation: {
        'bounce-x': 'bounceX 1s infinite alternate',
      }
    },
  },
  plugins: [],
}


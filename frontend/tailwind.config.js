/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#101820',
          800: '#15222E',
          700: '#1E2E3D',
        },
        teal: {
          900: '#0B2328',
          800: '#123C43',
          700: '#1B545D',
        },
        cyan: {
          DEFAULT: '#18D5D0',
          400: '#18D5D0',
          300: '#4CE4E0',
          500: '#0EB8B3',
        },
        lime: {
          DEFAULT: '#A8E63D',
          400: '#A8E63D',
          300: '#C0F068',
          500: '#8DC927',
        },
        sky: {
          DEFAULT: '#63B8FF',
          400: '#63B8FF',
          300: '#8CD0FF',
        },
        offwhite: '#F7F9F8',
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 10px 30px rgba(16, 24, 32, 0.04)',
        'card-hover': '0 20px 40px rgba(16, 24, 32, 0.08)',
        'glow-cyan': '0 0 25px rgba(24, 213, 208, 0.25)',
        'glow-lime': '0 0 25px rgba(168, 230, 61, 0.25)',
      },
    },
  },
  plugins: [],
}


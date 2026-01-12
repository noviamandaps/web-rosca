/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#000000',
          dark: '#1A1A1A',
          gray: '#8C8C8C',
          light: '#F4F4F4',
          border: '#E5E5E5',
          white: '#FFFFFF',
        },
        ui: {
          success: '#2E2E2E',
          error: '#FF4D4D',
          accent: '#000000',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
        'display': ['4rem', { lineHeight: '0.9', letterSpacing: '-0.02em' }],
      },
      letterSpacing: {
        widest: '0.1em',
      },
      borderRadius: {
        none: '0',
        sm: '0',
        DEFAULT: '0',
        md: '0',
        lg: '0',
        full: '9999px',
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#140D09',
        text: '#FFFFFF',
        secondary: '#D4C4B5',
        muted: '#9E8878',
        gold: {
          DEFAULT: '#C89A68',
          hover: '#DFB180',
          light: '#F0DFD0',
          dark: '#A27546',
        },
        camel: {
          DEFAULT: '#B58D69',
          light: '#C7A381',
          dark: '#9A724E',
        },
        surface: {
          DEFAULT: '#1F150F',
          elevated: '#2A1D15',
          card: '#241811',
        },
        border: '#382419',
        success: '#2E7D32',
        error: '#C0392B',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.4)',
        'gold-soft': '0 4px 25px -4px rgba(200, 154, 104, 0.3)',
        'premium': '0 10px 30px -5px rgba(0, 0, 0, 0.5), 0 4px 10px -2px rgba(0, 0, 0, 0.3)',
        'luxury': '0 20px 40px -10px rgba(0, 0, 0, 0.7), 0 0 30px -5px rgba(181, 141, 105, 0.15)',
      },
    },
  },
  plugins: [],
};

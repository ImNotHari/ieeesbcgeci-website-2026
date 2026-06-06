/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0A0E1A',
        card: '#1A1F3A',
        inner: '#0F1425',
        border: '#2A2E4A',
        text: {
          primary: '#FFFFFF',
          secondary: '#B8B8B8',
          muted: '#7A7A8E'
        },
        accent: {
          cyan: '#00D9FF',
          yellow: '#FFD700'
        }
      },
      fontFamily: {
        sans: ['Arial', 'Helvetica', 'sans-serif'],
        mono: ['"Courier New"', 'monospace'],
      },
      fontWeight: {
        regular: '400',
        semibold: '600',
        bold: '700',
      },
      borderRadius: {
        none: '16px', // Disable 0px by making none 16px to prevent its use
        sm: '8px',
        DEFAULT: '8px',
        md: '8px',
        lg: '16px',
        full: '50%',
      },
      boxShadow: {
        'glow-cyan': '0 0 16px rgba(0, 217, 255, 0.4)',
        'glow-yellow': '0 0 16px rgba(255, 215, 0, 0.4)',
        'card-hover': '0 8px 24px rgba(0,217,255,0.1)',
        'focus-cyan': '0 0 12px rgba(0,217,255,0.8)',
      },
    },
  },
  plugins: [],
}

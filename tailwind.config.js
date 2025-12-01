/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',   // Indigo 500 (Lebih terang)
        secondary: '#a855f7', // Purple 500
        accent: '#ec4899',    // Pink 500 (Untuk aksen warna-warni)
        dark: '#0f172a',      // Slate 900
        darkLight: '#1e293b', // Slate 800
        light: '#f8fafc',     // Slate 50
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      // Menambahkan Animasi Kustom
      animation: {
        'gradient-x': 'gradient-x 3s ease infinite',
        'blob': 'blob 7s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        'blob': {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
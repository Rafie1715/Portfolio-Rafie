/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // <--- TAMBAHKAN BARIS INI
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        secondary: '#8B5CF6',
        dark: '#0F172A',      // Slate 900
        darkLight: '#1E293B', // Slate 800 (Untuk kartu saat dark mode)
        light: '#F8FAFC',     // Slate 50
        accent: '#06B6D4',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
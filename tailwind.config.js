/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ganti warna ini agar tidak terlihat seperti Bootstrap
        primary: '#4F46E5',   // Indigo 600 (Warna Utama: Lebih modern & vibrant)
        secondary: '#8B5CF6', // Violet 500 (Warna Kedua: Untuk gradasi)
        dark: '#0F172A',      // Slate 900 (Background Gelap: Lebih elegan dari hitam biasa)
        darkLight: '#1E293B', // Slate 800 (Untuk kartu/card di mode gelap)
        light: '#F8FAFC',     // Slate 50 (Background Terang)
        accent: '#06B6D4',    // Cyan 500 (Aksen tambahan)
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
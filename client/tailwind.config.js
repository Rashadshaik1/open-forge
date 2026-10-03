/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E53E24',
        'primary-hover': '#CB321A',
        accent: '#F97316',
        surface: '#FFFFFF',
        'surface-dark': '#111827',
        'bg-dark': '#0B0F17',
        'soft-peach': '#FFF7ED',
        'text-dark': '#111827',
        'text-muted': '#4B5563',
      },
    },
  },
  plugins: [],
};

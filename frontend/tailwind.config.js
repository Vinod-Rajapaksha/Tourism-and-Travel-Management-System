/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'tw-',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        calendar: {
          primary: '#3b82f6',
          secondary: '#64748b',
          today: '#ef4444',
          event: {
            blue: '#3b82f6',
            green: '#10b981',
            purple: '#8b5cf6',
            orange: '#f59e0b',
            red: '#ef4444',
            pink: '#ec4899'
          }
        }
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Disable Tailwind's base styles to prevent conflicts
  },
};
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#1e40af', // blue-800
        'brand-secondary': '#3b82f6', // blue-500
        'base-100': '#1f2937', // gray-800
        'base-200': '#374151', // gray-700
        'base-300': '#4b5563', // gray-600
        'text-primary': '#f3f4f6', // gray-100
        'text-secondary': '#d1d5db', // gray-300
      },
    },
  },
  plugins: [],
}

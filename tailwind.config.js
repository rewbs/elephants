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
        'nonmetal': '#8BC3E0',
        'noble-gas': '#AB82FF',
        'alkali-metal': '#FFA07A',
        'alkaline-earth-metal': '#FFD700',
        'metalloid': '#9CC95C',
        'post-transition-metal': '#CCCCCC',
        'transition-metal': '#ABABAB',
        'halogen': '#ADD8E6',
        'actinide': '#FF77FF',
        'lanthanide': '#FFAED7'
      }
    },
  },
  plugins: [],
  safelist: [
    'bg-nonmetal',
    'bg-noble-gas',
    'bg-alkali-metal',
    'bg-alkaline-earth-metal',
    'bg-metalloid',
    'bg-post-transition-metal',
    'bg-transition-metal',
    'bg-halogen',
    'bg-actinide',
    'bg-lanthanide'
  ]
}
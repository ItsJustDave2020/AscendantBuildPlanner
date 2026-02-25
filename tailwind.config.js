/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/renderer/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        eq: {
          bg: '#0a0e1a',
          panel: '#111827',
          panel2: '#1a2236',
          surface: '#1e293b',
          border: '#2a3a52',
          gold: '#d4a843',
          blue: '#4a9eff',
          green: '#4ade80',
          red: '#ef4444',
          purple: '#a855f7',
          cyan: '#22d3ee',
          muted: '#8892a8',
          text: '#e2e8f0',
          // Tier colors
          greater: '#4ade80',
          exalted: '#4a9eff',
          ascendant: '#d4a843',
        }
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        body: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

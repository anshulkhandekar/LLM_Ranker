/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Instrument Sans"', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.06), 0 18px 60px rgba(0,0,0,0.35)',
      },
      keyframes: {
        pulseGlow: {
          '0%': { boxShadow: '0 0 0 0 rgba(250, 204, 21, 0.28)' },
          '100%': { boxShadow: '0 0 0 18px rgba(250, 204, 21, 0)' },
        },
      },
      animation: {
        'pulse-glow': 'pulseGlow 900ms ease-out',
      },
    },
  },
  plugins: [],
};

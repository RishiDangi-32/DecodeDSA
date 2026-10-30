/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        18: '4.5rem',
      },
      colors: {
        brand: {
          bg: {
            primary: "#071A26",
            secondary: "#0D2538",
          },
          card: "rgba(17, 32, 48, 0.7)",
          border: "rgba(0, 255, 255, 0.15)",
          cyan: "#00E5FF",
          blue: "#3B82F6",
          purple: "#8B5CF6",
          green: "#22C55E",
          yellow: "#FACC15",
          text: {
            white: "#F8FAFC",
            muted: "#94A3B8",
          }
        }
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Poppins", "sans-serif"],
        serif: ["Newsreader", "Lora", "Playfair Display", "Georgia", "serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      boxShadow: {
        'cyan-glow': '0 0 15px rgba(0, 229, 255, 0.25)',
        'cyan-glow-intense': '0 0 25px rgba(0, 229, 255, 0.5)',
        'blue-glow': '0 0 15px rgba(59, 130, 246, 0.25)',
        'purple-glow': '0 0 15px rgba(139, 92, 246, 0.25)',
        'card-glow': '0 8px 32px 0 rgba(0, 229, 255, 0.08)',
      },
      backgroundImage: {
        'gradient-cyan-blue': 'linear-gradient(90deg, #22D3EE 0%, #38BDF8 35%, #3B82F6 70%, #6366F1 100%)',
        'gradient-radial-glow': 'radial-gradient(circle at center, rgba(0, 229, 255, 0.15) 0%, transparent 70%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'float-medium': 'float 4s ease-in-out infinite',
        'float-fast': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}

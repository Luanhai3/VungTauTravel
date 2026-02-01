import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: "#e6f7fa",
          100: "#b3e6f0",
          200: "#80d5e6",
          300: "#4dc4dc",
          400: "#26b8d4",
          500: "#0da5c9",
          600: "#0b8fa8",
          700: "#097987",
          800: "#076366",
          900: "#054d45",
          950: "#023329",
        },
        glass: {
          DEFAULT: "rgba(255, 255, 255, 0.08)",
          border: "rgba(255, 255, 255, 0.12)",
          strong: "rgba(255, 255, 255, 0.15)",
        },
      },
      backgroundImage: {
        "gradient-ocean":
          "linear-gradient(135deg, #0da5c9 0%, #054d45 50%, #023329 100%)",
        "glass-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)",
      },
      backdropBlur: {
        xs: "2px",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

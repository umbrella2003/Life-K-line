import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0f1115",
        "ink-soft": "#14171d",
        gold: "#c9a24a",
        "gold-soft": "#e0bc6b",
        jade: "#3a6b57",
        "jade-soft": "#4f8a70",
        cinnabar: "#a3352c",
      },
      fontFamily: {
        serif: ["'Noto Serif SC'", "'Songti SC'", "STSong", "SimSun", "serif"],
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "'PingFang SC'",
          "'Microsoft YaHei'",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 8px 30px -12px rgba(0,0,0,0.55)",
        "card-lg": "0 20px 50px -20px rgba(0,0,0,0.6)",
        "glow-gold": "0 0 32px -8px rgba(201,162,74,0.4)",
        "glow-amber": "0 0 32px -8px rgba(252,211,77,0.4)",
        "glow-cyan": "0 0 32px -8px rgba(34,211,238,0.4)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) both",
        "fade-up-sm": "fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both",
        "fade-in": "fadeIn 0.35s ease-out both",
        "scale-in": "scaleIn 0.22s cubic-bezier(0.16,1,0.3,1) both",
        shimmer: "shimmer 1.8s ease-in-out infinite",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.16,1,0.3,1)",
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        retim: {
          navy: "#1a2332",
          anthracite: "#2d3748",
          orange: "#e85d04",
          "orange-dark": "#c44d00",
          gray: "#f4f5f7",
          "gray-dark": "#e2e4e8",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(26, 35, 50, 0.08)",
        lift: "0 12px 40px -12px rgba(26, 35, 50, 0.18)",
        glow: "0 0 40px -8px rgba(232, 93, 4, 0.35)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideRight: {
          "0%": { transform: "translateX(-12px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        heroGlow: {
          "0%, 100%": { opacity: "0.35", transform: "scale(1)" },
          "50%": { opacity: "0.55", transform: "scale(1.05)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        countPulse: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.04)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-right": "slideRight 0.5s ease-out forwards",
        "hero-glow": "heroGlow 10s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        "count-pulse": "countPulse 0.4s ease-out",
        marquee: "marquee 45s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;

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
        paper: {
          bg: "#FAF8F5", // Warm Craft Paper
          sheet: "#F4F0EA", // Sheet Neutral
          card: "#FFFFFF", // Card Paper
          crease: "#E2DCD5", // Muted Stroke / Crease Gray
          creaseDark: "#DDD6CE", // Shadow Crease Gray
          dark: "#3B3A36",
        },
        origami: {
          yellow: "#F4D06F", // Canary Fold Yellow
          yellowDark: "#E5B942",
          terracotta: "#E76F51", // Terracotta Red
          terracottaDark: "#D6593A",
          teal: "#2A9D8F", // Paper Crease Teal
          tealDark: "#21867A",
          slate: "#264653", // Deep Slate
          slateLight: "#355B6C",
        },
      },
      boxShadow: {
        paper: "2px 3px 0px rgba(38, 70, 83, 0.12)",
        "paper-lg": "3px 5px 0px rgba(38, 70, 83, 0.16)",
        "paper-xl": "5px 7px 0px rgba(38, 70, 83, 0.20)",
        "paper-flat": "1px 1px 0px rgba(38, 70, 83, 0.18)",
        "paper-inset": "inset 1px 1px 0px rgba(255,255,255,0.7), inset -1px -1px 0px rgba(38,70,83,0.1)",
        "paper-pressed": "1px 1px 0px rgba(38, 70, 83, 0.2)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      keyframes: {
        unfold: {
          "0%": { transform: "rotateX(-20deg) scale(0.96)", opacity: "0" },
          "100%": { transform: "rotateX(0deg) scale(1)", opacity: "1" },
        },
        paperFloat: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-4px) rotate(1deg)" },
        },
        flyIn: {
          "0%": { transform: "translate(-20px, -20px) scale(0.7) rotate(-15deg)", opacity: "0" },
          "100%": { transform: "translate(0, 0) scale(1) rotate(0deg)", opacity: "1" },
        },
        pingCrease: {
          "0%": { transform: "scale(0.95)", opacity: "0.8" },
          "50%": { transform: "scale(1.05)", opacity: "1" },
          "100%": { transform: "scale(0.95)", opacity: "0.8" },
        },
      },
      animation: {
        unfold: "unfold 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        paperFloat: "paperFloat 4s ease-in-out infinite",
        flyIn: "flyIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
        pingCrease: "pingCrease 2s infinite ease-in-out",
      },
    },
  },
  plugins: [],
};

export default config;

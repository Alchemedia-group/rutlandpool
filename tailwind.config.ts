import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        felt: {
          DEFAULT: "#1B6B4A",
          dark: "#123D2A",
        },
        gold: {
          DEFAULT: "#B08432",
        },
        cream: {
          DEFAULT: "#FFFDF8",
          card: "#F0EADB",
        },
        ink: "#1B1815",
        win: "#1B6B4A",
        loss: "#8F3B2E",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        sans: ["var(--font-body)"],
      },
    },
  },
  plugins: [],
};

export default config;

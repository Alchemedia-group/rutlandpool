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
          DEFAULT: "#0b5d3b",
          dark: "#083f28",
        },
        gold: {
          DEFAULT: "#c9a227",
        },
      },
    },
  },
  plugins: [],
};

export default config;

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
        navy: {
          900: "#0D1B2A",
          800: "#112436",
          700: "#1a3550",
          600: "#1e3d5c",
        },
        green: {
          600: "#16a34a",
          500: "#22c55e",
          400: "#4ade80",
        },
        gold: "#d4a017",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

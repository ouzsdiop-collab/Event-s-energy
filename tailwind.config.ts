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
        forest: {
          900: "#0f2d1f",
          800: "#163d2a",
          700: "#1e5238",
          600: "#246444",
          500: "#2d7a4f",
        },
        gold: {
          600: "#a07828",
          500: "#c49a30",
          400: "#d4aa3a",
          300: "#e8c96a",
        },
        sage: {
          100: "#f0f5f2",
          50:  "#f7faf8",
        },
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

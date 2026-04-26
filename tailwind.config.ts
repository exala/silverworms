import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        silver: {
          50: "#fafbfc",
          100: "#f3f5f7",
          200: "#e5e9ee",
          300: "#cfd6de",
          400: "#a2adba",
          500: "#7d8793",
          600: "#626c77",
          700: "#4b535c",
          800: "#31363d",
          900: "#181b20",
        },
      },
      boxShadow: {
        haze: "0 24px 80px rgba(37, 43, 52, 0.12)",
        float: "0 14px 36px rgba(37, 43, 52, 0.10)",
      },
      fontFamily: {
        sans: ["Aptos", "Segoe UI Variable", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
      },
      backgroundImage: {
        "silver-grid":
          "radial-gradient(circle at top left, rgba(160,169,180,.20), transparent 24%), radial-gradient(circle at top right, rgba(215,220,227,.26), transparent 28%), linear-gradient(180deg, #fcfcfd 0%, #f1f3f6 100%)",
      },
    },
  },
  plugins: [],
};

export default config;

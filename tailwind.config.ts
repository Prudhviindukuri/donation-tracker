import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: "#B85C00",
        ivory: "#FDF6EC",
        "card-border": "#E8D5B7",
        text: "#2C1810",
        gold: "#D4A017",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Georgia", "serif"],
        telugu: ["var(--font-telugu)", "Noto Sans Telugu", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

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
        primary: "#372212",
        "primary-button": "#03635D",
        secondary: "#B55341",
        "secondary-button": "#B7AD98",
        rating: "#E87402",
        background: "#F4F1EA",
      },
      fontFamily: {
        lato: ["var(--font-lato)"],
        merriweather: ["var(--font-merriweather)"],
      },
    },
  },
  plugins: [],
};

export default config;

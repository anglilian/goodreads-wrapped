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
      animation: {
        'fade-in-up': 'fade-in-up 1s ease-in',
        'fade-in-down': 'fade-in-down 0.5s ease-out',
        'count-up': 'count-up 1s ease-out',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'count-up': {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

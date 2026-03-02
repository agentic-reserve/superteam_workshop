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
        dark: {
          bg: '#000000',        // Vanta black background
          card: '#0A0A0A',      // Slightly lighter black for cards
          lighter: '#1A1A1A',   // Borders and dividers
          text: '#EEEEEE',      // Main text color
        },
        primary: {
          DEFAULT: '#50A0B4',   // Teal/cyan accent (RGB 80, 160, 180)
          light: '#6BB8CC',     // Lighter teal for hover
        },
      },
    },
  },
  plugins: [],
};
export default config;

// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        nevera: ['"Nevera"', "system-ui", "sans-serif"],
        excon: ['"Excon"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
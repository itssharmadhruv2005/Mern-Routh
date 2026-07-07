/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Space Grotesk'", "Inter", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "'SF Mono'", "monospace"],
      },
      colors: {
        navy: { 950: "#0a1120", 900: "#101a2e", 800: "#182643" },
        brand: { DEFAULT: "#0f9d8f", dark: "#0b7a70", soft: "#e3f5f2" },
        accent: { DEFAULT: "#6366f1", soft: "#eef0fd" },
        ink: { DEFAULT: "#131a2a", soft: "#5b6478", faint: "#8b93a7" },
      },
    },
  },
  plugins: [],
};

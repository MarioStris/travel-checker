/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        category: {
          solo: "#3b82f6",
          couple: "#ec4899",
          family: "#22c55e",
          backpacker: "#f97316",
          luxury: "#eab308",
          "digital-nomad": "#a855f7",
          adventure: "#ef4444",
          cultural: "#14b8a6",
          group: "#6366f1",
          business: "#6b7280",
        },
      },
      fontFamily: {
        sans: ["System"],
      },
      borderRadius: {
        card: "16px",
      },
    },
  },
  plugins: [],
};

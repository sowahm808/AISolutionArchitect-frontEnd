/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        architect: {
          50: "#eef6ff",
          100: "#d9ebff",
          500: "#2563eb",
          600: "#1d4ed8",
          950: "#0b1220",
        },
      },
    },
  },
  plugins: [],
};

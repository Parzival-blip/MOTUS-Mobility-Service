/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        navy: "#06111f",
        midnight: "#0b1b33",
        slatecore: "#111827",
        electric: "#2f7df6",
        cyanops: "#20d3ee",
        emeraldops: "#1fc77e",
        graphite: "#334155"
      },
      fontFamily: {
        sans: ["Inter", "Geist", "SF Pro Display", "Segoe UI", "Arial", "sans-serif"]
      },
      boxShadow: {
        command: "0 24px 80px rgba(2, 8, 23, 0.22)"
      }
    }
  },
  plugins: []
};

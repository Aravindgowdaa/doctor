/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#eff8ff",
          100: "#dbeefe",
          500: "#1d7ff2",
          600: "#1165d6",
          700: "#0e51ab",
          900: "#102a43",
        },
        accent: "#17b26a",
        sand: "#fff8ed",
      },
      boxShadow: {
        soft: "0 15px 45px rgba(16, 42, 67, 0.08)",
      },
      backgroundImage: {
        hero: "radial-gradient(circle at top left, rgba(29, 127, 242, 0.18), transparent 35%), linear-gradient(135deg, #ffffff 0%, #eff8ff 50%, #f0fdf4 100%)",
      },
    },
  },
  plugins: [],
};

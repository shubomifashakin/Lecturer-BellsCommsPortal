/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: { sans: ['"Poppins", sans-serif'] },
    extend: {
      animation: {
        flash: "flash .5s ease-in-out",
        flasInfinite: "flash2 1.25s ease-in-out infinite",
      },

      keyframes: {
        flash: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        flash2: {
          "0%": { opacity: 0.6 },
          "50%": { opacity: 0.4 },
          "100%": { opacity: 0.6 },
        },
      },
      colors: {
        primaryBgColor: "#F7F4EA",
        bellsBlue: "#011638",
        hoverBellsBlue: "#0E3B43",
        tableEven: "#d2e9fb",
        tableOdd: "#eaf5fd",
        hoverYellow: "#FCFC62",
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryOrange: "var(--primary-color)",
        smoke: "#f0f2f7",
        titleColor: "#0C0B31",
        lightOrange: "#F4EDE8",
        grayText: "#979797",
      },
      width: {
        width_sm: "98%",
        width_md: "90%",
        width_lg: "90%",
        width_xl: "90%",
        width_2xl: "90%",
      },
    },
  },
  plugins: [],
};

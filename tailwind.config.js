/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        bubble: "rise 20s linear infinite",
        gradient: "gradientBG 15s ease infinite",
        floatCode: "floatCode 8s ease-in-out infinite",
      },
      keyframes: {
        rise: {
          "0%": { transform: "translateY(0) scale(1)", opacity: "0.8" },
          "100%": { transform: "translateY(-1600px) scale(1.4)", opacity: "0" },
        },
        gradientBG: {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        },
        floatCode: {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-20px) translateX(10px)" },
        },
      },
      backgroundImage: {
        asphalt: "url('https://transparenttextures.com/patterns/asfalt-light.png')",
      },
    },
  },
  plugins: [],
};

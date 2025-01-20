// filepath: /c:/Users/Wolphen/Desktop/HarmonyBanque/front/tailwind.config.js
const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js",
    flowbite.content(),
  ],
  theme: {
    extend: {},
  },
  plugins: [require("flowbite/plugin"), flowbite.plugin()],
};

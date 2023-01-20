/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
	"./src/**/*.{js,ts,jsx,tsx}",
	"./node_modules/flowbite-react/**/*.js",
],
  theme: {
    extend: {},
	fontFamily: {
		display: ["Jura", "Roboto"],
	},
  },
  plugins: [
	require("flowbite/plugin")
  ],
};

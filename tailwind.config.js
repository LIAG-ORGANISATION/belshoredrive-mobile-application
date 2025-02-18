/** @type {import('tailwindcss').Config} */

module.exports = {
	darkMode: "media",
	content: ["src/**/*.{tsx,jsx,ts,js}", "src/components/**/*.{tsx,jsx,ts,js}"],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
			colors: {
				primary: "#4aa8ba",
			},
		},
	},
	plugins: [],
};

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
			fontFamily: {
				sans: ["Poppins", "sans-serif"],
				serif: ["Poppins", "serif"],
				pins: ["Poppins", "sans-serif"],
				"pins-bold": ["PoppinsBold", "sans-serif"],
				"pins-semibold": ["PoppinsSemiBold", "sans-serif"],
				"pins-medium": ["PoppinsMedium", "sans-serif"],
			},
		},
	},
	plugins: [],
};

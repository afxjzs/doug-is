/**
 * Tailwind CSS v4 Configuration for Next.js 15
 *
 * - This is a minimal configuration since most theme settings now live in CSS
 * - In Tailwind v4, theme customization is done via @theme directive in CSS
 * - This file only specifies content paths and plugins
 * - The content array tells Tailwind which files to scan for classes
 * - TypeScript configuration is fully compatible with Node 20+
 */
import type { Config } from "tailwindcss"
import tailwindcssAnimate from "tailwindcss-animate"

const config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
		},
	},
	plugins: [tailwindcssAnimate],
	future: {
		hoverOnlyWhenSupported: true,
	},
} satisfies Config

export default config

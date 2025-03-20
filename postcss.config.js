/**
 * PostCSS Configuration for Next.js 15 with Tailwind CSS v4
 *
 * In Tailwind CSS v4, the PostCSS plugin has moved to @tailwindcss/postcss
 * This is different from Tailwind v3 which used 'tailwindcss' directly
 */
module.exports = {
	plugins: {
		"@tailwindcss/postcss": {}, // The new plugin location for Tailwind CSS v4
	},
}

/**
 * PostCSS Configuration for Next.js 15 with Tailwind CSS v4
 *
 * In Tailwind CSS v4, the PostCSS plugin has moved to @tailwindcss/postcss
 * This is different from Tailwind v3 which used 'tailwindcss' directly
 *
 * Note: We're using CommonJS module.exports format for better compatibility
 * with Next.js build system rather than ESM export default
 */
module.exports = {
	plugins: {
		"@tailwindcss/postcss": {}, // The new plugin location for Tailwind CSS v4
	},
}

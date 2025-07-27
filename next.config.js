/** @type {import('next').NextConfig} */
const nextConfig = {
	// Stable features (formerly experimental)
	serverExternalPackages: ["sharp"], // Add packages that should be bundled separately

	// Router cache configuration
	experimental: {
		staleTimes: {
			dynamic: 30,
			static: 180,
		},
		// CSS optimization configuration
		optimizeCss: {
			// This ensures critters works correctly
			cssModules: true,
			fontLoaders: [{ loader: "next-font-loader" }],
		},
		optimizeServerReact: true,
		webpackBuildWorker: true,
		// Add memory optimization
		memoryBasedWorkersCount: true,
	},

	// Force build and dev server to use file-system cache
	onDemandEntries: {
		// Keep the build running when there are errors
		maxInactiveAge: 25 * 1000,
		pagesBufferLength: 2,
	},

	// Image configuration
	images: {
		formats: ["image/avif", "image/webp"],
		dangerouslyAllowSVG: true,
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
		remotePatterns: [
			{
				protocol: "https",
				hostname: "tzffjzocrazemvtgqavg.supabase.co",
				pathname: "/storage/v1/object/public/**",
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
				pathname: "**",
			},
			{
				protocol: "https",
				hostname: "plus.unsplash.com",
				pathname: "**",
			},
			{
				protocol: "https",
				hostname: "unsplash.com",
				pathname: "**",
			},
			{
				protocol: "https",
				hostname: "fillmurray.lucidinternets.com",
				pathname: "**",
			},
			{
				protocol: "https",
				hostname: "fonts.googleapis.com",
				pathname: "**",
			},
			{
				protocol: "https",
				hostname: "fonts.gstatic.com",
				pathname: "**",
			},
			{
				protocol: "https",
				hostname: "placehold.co",
				pathname: "**",
			},
		],
		// Don't disable optimization
		unoptimized: process.env.NODE_ENV === "development",
	},

	// Increase timeout for builds
	staticPageGenerationTimeout: 180, // 3 minutes

	// Disable source maps in production to improve performance
	productionBrowserSourceMaps: false,

	// Handle TypeScript and ESLint errors
	typescript: {
		// Enable TypeScript errors to catch hydration issues
		ignoreBuildErrors: false,
	},

	eslint: {
		// Enable ESLint errors to catch hydration issues
		ignoreDuringBuilds: false,
	},

	// Enable output file tracing for serverless functions
	output: "standalone",

	// Enable React strict mode to catch hydration issues
	reactStrictMode: true,

	// Reduce the amount of information logged during development
	logging: {
		level: process.env.NODE_ENV === "development" ? "warn" : "info",
		fetches: {
			// Don't log fetch requests during build for cleaner output
			fullUrl: process.env.NODE_ENV === "development",
		},
	},
}

// Disable telemetry
process.env.NEXT_TELEMETRY_DISABLED = "1"

module.exports = nextConfig

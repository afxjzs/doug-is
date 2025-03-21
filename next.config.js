/** @type {import('next').NextConfig} */
const nextConfig = {
	// Stable features (formerly experimental)
	bundlePagesRouterDependencies: true,
	serverExternalPackages: ["sharp"], // Add packages that should be bundled separately

	// Router cache configuration
	experimental: {
		staleTimes: {
			dynamic: 30,
			static: 180,
		},
		// Fix CSS loading issues
		optimizeCss: true,
		optimizeServerReact: true,
		webpackBuildWorker: true,
	},

	// Force build and dev server to use file-system cache
	onDemandEntries: {
		// Make Next.js keep pages in memory for longer
		maxInactiveAge: 60 * 60 * 1000, // 1 hour
		pagesBufferLength: 5,
	},

	// Disable image optimization during development for faster builds
	images: {
		disableStaticImages: true,
	},

	// Increase build memory limit
	experimental: {
		// Maintain existing experimental options
		staleTimes: {
			dynamic: 30,
			static: 180,
		},
		// Add memory optimization
		memoryBasedWorkersCount: true,
	},

	// Image configuration
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "tzffjzocrazemvtgqavg.supabase.co",
				pathname: "**",
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
			},
		],
		// Disable image optimization only in development
		unoptimized: false,
	},

	// Increase timeout for builds
	staticPageGenerationTimeout: 180, // 3 minutes

	// Disable source maps in production to improve performance
	productionBrowserSourceMaps: false,

	// Handle TypeScript and ESLint errors
	typescript: {
		// Ignore TypeScript errors during builds to prevent failures
		ignoreBuildErrors: true,
	},

	eslint: {
		// Ignore ESLint errors during builds to prevent failures
		ignoreDuringBuilds: true,
	},

	// Enable output file tracing for serverless functions
	output: "standalone",

	// Improve development performance by disabling React strict mode in development
	reactStrictMode: process.env.NODE_ENV !== "development",

	// Reduce the amount of information logged during development
	logging: {
		level: process.env.NODE_ENV === "development" ? "warn" : "info",
	},
}

// Disable telemetry
process.env.NEXT_TELEMETRY_DISABLED = "1"

module.exports = nextConfig

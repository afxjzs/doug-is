/** @type {import('next').NextConfig} */
const nextConfig = {
	// Configure external packages for server components
	serverExternalPackages: ["gray-matter", "remark-gfm"],

	experimental: {
		// Add optimizations to improve build performance
		optimizePackageImports: ["react", "react-dom", "lucide-react"],
		// Performance optimization for page caching
		staleTimes: {
			dynamic: 30, // Cache dynamic pages for 30 seconds
			static: 180, // Cache static pages for 3 minutes
		},
		// Use only in development
		webpackBuildWorker: process.env.NODE_ENV === "development",
		// Reduce memory usage during builds
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

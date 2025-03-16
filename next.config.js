/** @type {import('next').NextConfig} */
const nextConfig = {
	// Configure external packages for server components
	experimental: {
		serverComponentsExternalPackages: ["gray-matter", "remark-gfm"],
		// Add optimizations to improve build performance
		optimizePackageImports: ["react", "react-dom", "lucide-react"],
		// Improve development performance
		webpackBuildWorker: process.env.NODE_ENV === "development",
		// Turbopack is faster but may have compatibility issues
		// turbo: process.env.NODE_ENV === "development",
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
		],
		// Disable image optimization only in development
		unoptimized: process.env.NODE_ENV === "development",
	},

	// Increase timeout for builds
	staticPageGenerationTimeout: 180, // 3 minutes

	// Disable source maps in production to improve performance
	productionBrowserSourceMaps: false,

	// Disable these only in development
	typescript: {
		// Only ignore TypeScript errors in development
		ignoreBuildErrors: process.env.NODE_ENV === "development",
	},

	eslint: {
		// Only ignore ESLint errors in development
		ignoreDuringBuilds: process.env.NODE_ENV === "development",
	},

	// Enable output file tracing for serverless functions
	output: "standalone",

	// Improve development performance by disabling React strict mode in development
	reactStrictMode: process.env.NODE_ENV !== "development",

	// Reduce the amount of information logged during development
	logging: {
		level: process.env.NODE_ENV === "development" ? "warn" : "info",
	},

	// Optimize font loading
	optimizeFonts: true,
}

// Disable telemetry - this is the correct way to do it
process.env.NEXT_TELEMETRY_DISABLED = "1"

module.exports = nextConfig

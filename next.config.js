/** @type {import('next').NextConfig} */
const nextConfig = {
	// Configure external packages for server components
	experimental: {
		serverComponentsExternalPackages: ["gray-matter", "remark-gfm"],
		// Add optimizations to improve build performance
		optimizePackageImports: ["react", "react-dom", "lucide-react"],
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
		],
		// Disable image optimization in development for faster builds
		unoptimized: process.env.NODE_ENV === "development",
	},

	// Increase timeout for builds
	staticPageGenerationTimeout: 180, // 3 minutes

	// Disable source maps in production to improve performance
	productionBrowserSourceMaps: false,

	// Reduce the impact of type checking during development
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		ignoreBuildErrors: process.env.NODE_ENV === "development",
	},

	// Disable ESLint during development for faster builds
	eslint: {
		// Only run ESLint on build in production
		ignoreDuringBuilds: process.env.NODE_ENV === "development",
	},
}

module.exports = nextConfig

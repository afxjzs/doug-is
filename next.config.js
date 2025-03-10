/** @type {import('next').NextConfig} */
const nextConfig = {
	// Configure external packages for server components
	experimental: {
		serverComponentsExternalPackages: ["gray-matter", "remark-gfm"],
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
		],
	},
}

module.exports = nextConfig

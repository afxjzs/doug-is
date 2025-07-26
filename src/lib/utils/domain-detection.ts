/**
 * Domain Detection Utilities
 *
 * Provides dynamic domain detection for metadata and URL generation.
 * Supports environment variables, request headers, and fallback mechanisms.
 */

/**
 * Get the site URL with dynamic domain detection
 *
 * Priority:
 * 1. NEXT_PUBLIC_SITE_URL environment variable
 * 2. Fallback to localhost for development
 */
export function getSiteUrl(): string {
	const envUrl = process.env.NEXT_PUBLIC_SITE_URL

	if (envUrl) {
		// Remove trailing slash if present
		return envUrl.replace(/\/$/, "")
	}

	// Fallback for development
	return "http://localhost:3000"
}

/**
 * Generate a canonical URL with dynamic domain
 *
 * @param path - The path to make canonical (with or without leading slash)
 * @returns The full canonical URL
 */
export function getCanonicalUrl(path: string): string {
	const siteUrl = getSiteUrl()

	// Handle root path and empty path
	if (!path || path === "/") {
		return `${siteUrl}/`
	}

	const cleanPath = path.startsWith("/") ? path : `/${path}`
	return `${siteUrl}${cleanPath}`
}

/**
 * Generate a social image URL with dynamic domain
 *
 * @param imagePath - The image path (relative or absolute)
 * @returns The full image URL
 */
export function getSocialImageUrl(imagePath: string): string {
	// If it's already an absolute URL, return as-is
	if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
		return imagePath
	}

	const siteUrl = getSiteUrl()
	const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`

	return `${siteUrl}${cleanPath}`
}

/**
 * Get the site name for metadata
 *
 * @returns The site name (currently hardcoded, could be made configurable)
 */
export function getSiteName(): string {
	return "Doug.is"
}

/**
 * Get the site description for metadata
 *
 * @returns The default site description
 */
export function getSiteDescription(): string {
	return "Douglas E. Rogers - Developer, Investor, Entrepreneur"
}

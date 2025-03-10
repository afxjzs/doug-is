import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

/**
 * Combines class names with Tailwind CSS
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

/**
 * Formats a date string
 */
export function formatDate(
	date: string | Date,
	formatString: string = "MMMM dd, yyyy"
): string {
	return format(new Date(date), formatString)
}

/**
 * Truncates text to a specified length
 */
export function truncateText(text: string, maxLength: number = 150): string {
	if (text.length <= maxLength) return text
	return text.slice(0, maxLength).trim() + "..."
}

/**
 * Generates a URL-friendly slug from a string
 */
export function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, "")
		.replace(/[\s_-]+/g, "-")
		.replace(/^-+|-+$/g, "")
}

/**
 * Checks if a URL is external
 */
export function isExternalUrl(url: string): boolean {
	return url.startsWith("http://") || url.startsWith("https://")
}

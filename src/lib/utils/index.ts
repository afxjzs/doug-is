import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from "date-fns"
import { enUS } from "date-fns/locale"

/**
 * Combines class names with Tailwind CSS classes
 * Uses clsx for conditional classes and twMerge for Tailwind-specific merging
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

/**
 * Formats a date string into a human-readable format
 * @param dateString ISO date string
 * @param formatStr Date format string (default: 'MMMM d, yyyy')
 * @returns Formatted date string
 */
export function formatDate(
	dateString: string,
	formatStr = "MMMM d, yyyy"
): string {
	if (!dateString) return ""

	try {
		const date = parseISO(dateString)
		return format(date, formatStr, { locale: enUS })
	} catch (error) {
		console.error("Error formatting date:", error)
		return dateString
	}
}

/**
 * Truncates a string to a specified length and adds ellipsis
 * @param str String to truncate
 * @param length Maximum length (default: 100)
 * @returns Truncated string
 */
export function truncateString(str: string, length = 100): string {
	if (!str) return ""
	if (str.length <= length) return str

	return str.slice(0, length).trim() + "..."
}

/**
 * Generates a slug from a string
 * @param str String to convert to slug
 * @returns URL-friendly slug
 */
export function slugify(str: string): string {
	return str
		.toLowerCase()
		.replace(/[^\w\s-]/g, "")
		.replace(/[\s_-]+/g, "-")
		.replace(/^-+|-+$/g, "")
}

/**
 * Debounces a function call
 * @param fn Function to debounce
 * @param delay Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
	fn: T,
	delay: number
): (...args: Parameters<T>) => void {
	let timeoutId: NodeJS.Timeout

	return function (...args: Parameters<T>) {
		clearTimeout(timeoutId)
		timeoutId = setTimeout(() => fn(...args), delay)
	}
}

/**
 * Checks if a URL is external
 */
export function isExternalUrl(url: string): boolean {
	return url.startsWith("http://") || url.startsWith("https://")
}

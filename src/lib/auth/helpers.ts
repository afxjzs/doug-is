import { User } from "@supabase/supabase-js"

/**
 * Allowed admin emails - only these users have admin access
 */
export const ALLOWED_ADMIN_EMAILS = ["douglas.rogers@gmail.com"]

/**
 * Check if a user has admin privileges
 * @param user Supabase user object
 * @returns boolean indicating if user has admin privileges
 */
export function isAdminUser(user: User | null): boolean {
	if (!user || !user.email) {
		return false
	}

	return ALLOWED_ADMIN_EMAILS.includes(user.email.toLowerCase())
}

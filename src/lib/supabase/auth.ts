import { createClient } from "@/lib/auth/supabase-server"
import { isAdmin } from "@/lib/auth/supabase"
import { User } from "@supabase/supabase-js"

/**
 * Gets the current authenticated user from the server context
 * @returns The current user or null if not authenticated
 */
export async function getCurrentUser(): Promise<User | null> {
	try {
		const supabase = await createClient()

		const {
			data: { user },
			error,
		} = await supabase.auth.getUser()

		if (error) {
			console.error("Error getting current user:", error)
			return null
		}

		return user
	} catch (error) {
		console.error("Error in getCurrentUser:", error)
		return null
	}
}

/**
 * Checks if the current user has admin permissions
 * @returns True if user is authenticated and has admin role, false otherwise
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
	const user = await getCurrentUser()
	return user ? isAdmin(user.email) : false
}

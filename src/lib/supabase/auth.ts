import { createServerComponentClient } from "@/lib/supabase/serverClient"
import { User } from "@supabase/supabase-js"

/**
 * Gets the current authenticated user from the server context
 * @returns The current user or null if not authenticated
 */
export async function getCurrentUser(): Promise<User | null> {
	try {
		const supabase = await createServerComponentClient()

		const {
			data: { user },
			error,
		} = await supabase.auth.getUser()

		if (error || !user) {
			return null
		}

		return user
	} catch (error) {
		console.error("Error getting current user:", error)
		return null
	}
}

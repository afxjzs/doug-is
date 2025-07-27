/**
 * Simple Auth Server
 *
 * Server-side authentication utilities for admin routes.
 * Provides functions for user authentication and admin role checking.
 */

import { createClient } from "@/lib/auth/supabase-server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

/**
 * Create a Supabase client for server-side operations
 */
const createAuthServerClient = async () => {
	return await createClient()
}

/**
 * Get the current authenticated user
 */
const getCurrentUser = async () => {
	try {
		const supabase = await createAuthServerClient()
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
 * Check if the current user has admin privileges
 */
const isCurrentUserAdmin = async () => {
	try {
		const user = await getCurrentUser()

		if (!user) {
			return false
		}

		// Check if user has admin role in user_metadata
		const userRole = user.user_metadata?.role
		if (userRole === "admin") {
			return true
		}

		// Fallback: check if user email is in admin list
		const adminEmails = process.env.ADMIN_EMAILS?.split(",") || []
		if (adminEmails.includes(user.email || "")) {
			return true
		}

		return false
	} catch (error) {
		console.error("Error in isCurrentUserAdmin:", error)
		return false
	}
}

export { createAuthServerClient, getCurrentUser, isCurrentUserAdmin }

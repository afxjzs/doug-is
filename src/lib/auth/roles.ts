/**
 * User roles and permissions management
 *
 * This file handles role-based access control for the application,
 * distinguishing between regular users and administrators.
 */

import { createClient } from "@supabase/supabase-js"
import type { User } from "@supabase/supabase-js"
import type { Database } from "../types/supabase"

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

// Admin email addresses - these users will always have admin privileges
const ADMIN_EMAILS = ["douglas.rogers@gmail.com"]

// User role types
export type UserRole = "member" | "admin"

/**
 * Creates a Supabase admin client with service role key
 * This bypasses RLS and should only be used in secure server contexts
 */
const createAdminClient = () => {
	return createClient<Database>(supabaseUrl, supabaseServiceKey, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	})
}

/**
 * Get user role from the database, or create if it doesn't exist
 */
export async function getUserRole(user: User | null): Promise<UserRole | null> {
	if (!user) return null

	// Hardcoded admin emails always have admin access
	if (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) {
		return "admin"
	}

	// For other users, check the user_roles table
	try {
		const supabase = createAdminClient()

		// Check if user has a role entry
		const { data: roleData, error: fetchError } = await supabase
			.from("user_roles")
			.select("role")
			.eq("user_id", user.id)
			.single()

		if (fetchError && fetchError.code !== "PGSQL_ERROR_NO_DATA_FOUND") {
			console.error("Error fetching user role:", fetchError)
			return null
		}

		// If role exists, return it
		if (roleData) {
			return roleData.role as UserRole
		}

		// If no role exists, create as 'member' by default
		const { error: insertError } = await supabase.from("user_roles").insert({
			user_id: user.id,
			role: "member",
			email: user.email,
		})

		if (insertError) {
			console.error("Error creating user role:", insertError)
			return null
		}

		return "member"
	} catch (error) {
		console.error("Error in getUserRole:", error)
		return null
	}
}

/**
 * Check if user has admin role
 */
export async function isAdmin(user: User | null): Promise<boolean> {
	if (!user) return false

	// Hardcoded admin check
	if (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) {
		return true
	}

	// Database role check
	const role = await getUserRole(user)
	return role === "admin"
}

/**
 * Set a user's role - requires admin access
 */
export async function setUserRole(
	userId: string,
	role: UserRole,
	adminUser: User | null
): Promise<boolean> {
	// Only admins can change roles
	if (!(await isAdmin(adminUser))) {
		return false
	}

	try {
		const supabase = createAdminClient()

		const { error } = await supabase.from("user_roles").upsert(
			{
				user_id: userId,
				role: role,
				updated_at: new Date().toISOString(),
			},
			{ onConflict: "user_id" }
		)

		if (error) {
			console.error("Error setting user role:", error)
			return false
		}

		return true
	} catch (error) {
		console.error("Error in setUserRole:", error)
		return false
	}
}

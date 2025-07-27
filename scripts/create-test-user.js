/**
 * Create Test User Script
 *
 * Creates a test user account for admin login testing.
 */

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
	console.error("Missing environment variables")
	process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
	auth: {
		autoRefreshToken: false,
		persistSession: false,
	},
})

async function createTestUser() {
	try {
		console.log("Creating test user...")

		// Create user with email and password
		const { data, error } = await supabase.auth.admin.createUser({
			email: "test@example.com",
			password: "password123",
			email_confirm: true,
			user_metadata: {
				name: "Test User",
			},
		})

		if (error) {
			console.error("Error creating user:", error)
			return
		}

		console.log("Test user created successfully:", data.user.email)
		console.log("User ID:", data.user.id)
	} catch (error) {
		console.error("Script error:", error)
	}
}

createTestUser()

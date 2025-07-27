/**
 * Setup Test User Password Script
 *
 * Sets up a password for the existing test user account.
 */

require("dotenv").config({ path: ".env.local" })
const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
	console.error("Missing environment variables")
	console.error("NEXT_PUBLIC_SUPABASE_URL:", !!supabaseUrl)
	console.error("SUPABASE_SERVICE_ROLE_KEY:", !!supabaseServiceKey)
	process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
	auth: {
		autoRefreshToken: false,
		persistSession: false,
	},
})

async function setupTestUserPassword() {
	try {
		console.log("Setting up password for test user...")

		// Update the existing user with a password
		const { data, error } = await supabase.auth.admin.updateUserById(
			"ffe0242e-2fde-4d5f-ace8-720a1502d9dd", // User ID from the database
			{
				password: "password123",
				email_confirm: true,
			}
		)

		if (error) {
			console.error("Error updating user:", error)
			return
		}

		console.log("Test user password set successfully:", data.user.email)
		console.log("User ID:", data.user.id)
		console.log("You can now log in with:")
		console.log("Email: test@testing.com")
		console.log("Password: password123")
	} catch (error) {
		console.error("Script error:", error)
	}
}

setupTestUserPassword()

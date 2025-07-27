/**
 * Setup Test User Password Script
 *
 * Sets up a password for the existing test user account using credentials from .env.test
 * and Supabase connection from .env.local
 */

// Load Supabase credentials from .env.local
require("dotenv").config({ path: ".env.local" })
// Also load test credentials from .env.test
require("dotenv").config({ path: ".env.test" })

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const testEmail = process.env.TEST_ADMIN_EMAIL
const testPassword = process.env.TEST_ADMIN_PASSWORD

if (!supabaseUrl || !supabaseServiceKey) {
	console.error("Missing Supabase environment variables from .env.local")
	console.error("NEXT_PUBLIC_SUPABASE_URL:", !!supabaseUrl)
	console.error("SUPABASE_SERVICE_ROLE_KEY:", !!supabaseServiceKey)
	console.error("Make sure .env.local contains your Supabase credentials")
	process.exit(1)
}

if (!testEmail || !testPassword) {
	console.error("Missing test credentials from .env.test")
	console.error("TEST_ADMIN_EMAIL:", !!testEmail)
	console.error("TEST_ADMIN_PASSWORD:", !!testPassword)
	console.error(
		"Make sure .env.test contains TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD"
	)
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
		console.log(`Setting up test user with email: ${testEmail}...`)

		// First, try to find existing user by email
		const { data: existingUsers, error: listError } =
			await supabase.auth.admin.listUsers()

		if (listError) {
			console.error("Error listing users:", listError)
			return
		}

		const existingUser = existingUsers.users.find(
			(user) => user.email === testEmail
		)

		if (existingUser) {
			console.log(`Found existing user with ID: ${existingUser.id}`)

			// Update the existing user with the test password
			const { data, error } = await supabase.auth.admin.updateUserById(
				existingUser.id,
				{
					password: testPassword,
					email_confirm: true,
				}
			)

			if (error) {
				console.error("Error updating existing user:", error)
				return
			}

			console.log("✅ Successfully updated existing test user password")
		} else {
			console.log("No existing user found, creating new test user...")

			// Create new user with test credentials
			const { data, error } = await supabase.auth.admin.createUser({
				email: testEmail,
				password: testPassword,
				email_confirm: true,
			})

			if (error) {
				console.error("Error creating new user:", error)
				return
			}

			console.log("✅ Successfully created new test user")
			console.log(`User ID: ${data.user.id}`)
		}

		console.log(`Test user ready with email: ${testEmail}`)
	} catch (error) {
		console.error("Script error:", error)
	}
}

setupTestUserPassword()

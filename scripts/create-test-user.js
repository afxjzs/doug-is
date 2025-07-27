/**
 * Create Test User Script
 *
 * Creates a test user account for admin login testing using credentials from .env.test
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

async function createTestUser() {
	try {
		console.log(`Creating test user with email: ${testEmail}...`)

		// Check if user already exists
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
			console.log(`❌ User with email ${testEmail} already exists`)
			console.log(`User ID: ${existingUser.id}`)
			console.log(
				"Use the setup-test-user-password.js script to update their password if needed"
			)
			return
		}

		// Create user with test credentials from .env.test
		const { data, error } = await supabase.auth.admin.createUser({
			email: testEmail,
			password: testPassword,
			email_confirm: true,
			user_metadata: {
				name: "Test User",
			},
		})

		if (error) {
			console.error("Error creating user:", error)
			return
		}

		console.log("✅ Test user created successfully:", data.user.email)
		console.log("User ID:", data.user.id)
		console.log(`Test credentials: ${testEmail} / ${testPassword}`)
	} catch (error) {
		console.error("Script error:", error)
	}
}

createTestUser()

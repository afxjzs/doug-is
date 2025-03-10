#!/usr/bin/env node

// scripts/setup-supabase.js
const { createClient } = require("@supabase/supabase-js")
const fs = require("fs")
const path = require("path")
require("dotenv").config({ path: ".env.local" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
	console.error(
		"❌ Missing Supabase credentials. Please check your .env.local file."
	)
	process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function setupDatabase() {
	try {
		console.log("🔄 Setting up Supabase database...")

		// Read SQL file
		const sqlFilePath = path.join(__dirname, "create-posts-table.sql")
		const sqlContent = fs.readFileSync(sqlFilePath, "utf8")

		// Execute SQL
		const { error } = await supabase.rpc("exec", { query: sqlContent })

		if (error) {
			if (error.message.includes('function "exec" does not exist')) {
				console.warn(
					'⚠️ The "exec" function is not available in your Supabase project.'
				)
				console.log(
					"ℹ️ Please run the SQL script manually in the Supabase SQL Editor:"
				)
				console.log(`1. Go to your Supabase dashboard: ${supabaseUrl}`)
				console.log("2. Navigate to the SQL Editor")
				console.log(`3. Copy the contents of ${sqlFilePath}`)
				console.log("4. Paste and run the SQL in the Supabase SQL Editor")
			} else {
				console.error("❌ Error setting up database:", error.message)
			}
			return false
		}

		console.log("✅ Database setup completed successfully!")
		return true
	} catch (err) {
		console.error("❌ Error setting up database:", err.message)
		return false
	}
}

// Run the setup
setupDatabase().then((success) => {
	if (!success) {
		console.log(
			"ℹ️ You can still run the application, but you may need to set up the database manually."
		)
	}
})

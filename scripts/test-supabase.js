// scripts/test-supabase.js
require("dotenv").config({ path: ".env.local" })
const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
	console.error("Missing Supabase credentials")
	process.exit(1)
}

console.log(`Connecting to Supabase at ${supabaseUrl.substring(0, 20)}...`)
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
	try {
		console.log("Testing connection...")
		const { data, error } = await supabase.from("posts").select("id").limit(1)

		if (error) {
			console.error("Connection error:", error)
			return false
		}

		console.log("Connection successful, data:", data)
		return true
	} catch (err) {
		console.error("Failed to connect:", err)
		return false
	}
}

async function fetchPosts() {
	try {
		console.log("Fetching posts...")
		const { data, error } = await supabase
			.from("posts")
			.select("*")
			.order("published_at", { ascending: false })

		if (error) {
			console.error("Error fetching posts:", error)
			return
		}

		console.log(`Successfully fetched ${data.length} posts`)
		console.log("First post:", data[0])
	} catch (err) {
		console.error("Error fetching posts:", err)
	}
}

async function main() {
	const connected = await testConnection()
	if (connected) {
		await fetchPosts()
	}
}

main()

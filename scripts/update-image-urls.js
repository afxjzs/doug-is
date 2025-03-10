#!/usr/bin/env node

// scripts/update-image-urls.js
const { createClient } = require("@supabase/supabase-js")
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

async function updateImageUrls() {
	try {
		console.log("🔄 Updating broken image URLs in the database...")

		// First, get posts with the broken image URL
		const { data: postsToUpdate, error: fetchError } = await supabase
			.from("posts")
			.select("id, title, featured_image")
			.eq(
				"featured_image",
				"https://images.unsplash.com/photo-1677442135136-760c813a743d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80"
			)

		if (fetchError) {
			console.error("❌ Error fetching posts:", fetchError.message)
			return false
		}

		console.log(
			`Found ${postsToUpdate?.length || 0} posts with broken image URLs`
		)

		if (!postsToUpdate || postsToUpdate.length === 0) {
			console.log("✅ No posts need updating")
			return true
		}

		// Update each post with a new image URL
		const newImageUrl =
			"https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80"

		const { error: updateError } = await supabase
			.from("posts")
			.update({ featured_image: newImageUrl })
			.eq(
				"featured_image",
				"https://images.unsplash.com/photo-1677442135136-760c813a743d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80"
			)

		if (updateError) {
			console.error("❌ Error updating posts:", updateError.message)
			return false
		}

		console.log("✅ Successfully updated image URLs")
		return true
	} catch (err) {
		console.error("❌ Error updating image URLs:", err.message)
		return false
	}
}

// Run the update
updateImageUrls().then((success) => {
	if (success) {
		console.log("✅ Image URL update completed successfully!")
	} else {
		console.log("❌ Image URL update failed")
	}
	process.exit(success ? 0 : 1)
})

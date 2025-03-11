require("dotenv").config({ path: ".env.local" })
const { createClient } = require("@supabase/supabase-js")

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
	console.error("Missing Supabase credentials")
	process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function updateImages() {
	console.log("Fetching posts from Supabase...")

	// Get all posts
	const { data: posts, error } = await supabase.from("posts").select("*")

	if (error) {
		console.error("Error fetching posts:", error)
		process.exit(1)
	}

	console.log(`Found ${posts.length} posts to update`)

	// Process each post
	for (const post of posts) {
		if (post.featured_image && post.featured_image.includes("unsplash.com")) {
			console.log(`Updating image for post: ${post.title}`)

			// Extract dimensions from the URL if possible, or use defaults
			const dimensions =
				post.featured_image.match(/w=(\d+).*?h=(\d+)/) ||
				post.featured_image.match(/w=(\d+)/) ||
				[]

			const width = dimensions[1] ? parseInt(dimensions[1]) : 800
			const height = dimensions[2] ? parseInt(dimensions[2]) : 600

			// Create a Fill Murray URL with appropriate dimensions
			const newImageUrl = `https://fillmurray.lucidinternets.com/${width}/${height}`

			// Update the post
			const { error: updateError } = await supabase
				.from("posts")
				.update({ featured_image: newImageUrl })
				.eq("id", post.id)

			if (updateError) {
				console.error(`Error updating post ${post.id}:`, updateError)
			} else {
				console.log(`✅ Updated image for post: ${post.title}`)
			}
		} else {
			console.log(`Skipping post with no Unsplash image: ${post.title}`)
		}
	}

	console.log("Image update complete!")
}

updateImages().catch((err) => {
	console.error("Script error:", err)
	process.exit(1)
})

import fs from "fs"
import path from "path"
import matter from "gray-matter"

const postsDirectory = path.join(process.cwd(), "src/content/posts")

export interface MarkdownPost {
	slug: string
	title: string
	date: string
	excerpt: string
	content: string
	category: string
	featured_image?: string
}

export function getPostSlugs(): string[] {
	try {
		return fs.readdirSync(postsDirectory).filter((file) => file.endsWith(".md"))
	} catch (error) {
		console.error("Error reading post directory:", error)
		return []
	}
}

export function getPostBySlug(slug: string): MarkdownPost | null {
	try {
		const realSlug = slug.replace(/\.md$/, "")
		const fullPath = path.join(postsDirectory, `${realSlug}.md`)

		if (!fs.existsSync(fullPath)) {
			return null
		}

		const fileContents = fs.readFileSync(fullPath, "utf8")
		const { data, content } = matter(fileContents)

		return {
			slug: realSlug,
			title: data.title,
			date: data.date,
			excerpt: data.excerpt || "",
			content,
			category: data.category || "uncategorized",
			featured_image: data.featured_image,
		}
	} catch (error) {
		console.error(`Error getting post by slug ${slug}:`, error)
		return null
	}
}

export function getAllPosts(category?: string): MarkdownPost[] {
	try {
		const slugs = getPostSlugs()
		const posts = slugs
			.map((slug) => getPostBySlug(slug))
			.filter((post): post is MarkdownPost => post !== null)

		// Filter by category if provided
		const filteredPosts = category
			? posts.filter((post) => post.category === category)
			: posts

		// Sort posts by date in descending order
		return filteredPosts.sort((post1, post2) => {
			return new Date(post2.date).getTime() - new Date(post1.date).getTime()
		})
	} catch (error) {
		console.error("Error getting all posts:", error)
		return []
	}
}

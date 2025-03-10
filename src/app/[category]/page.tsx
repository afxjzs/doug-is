import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getPostsByCategory } from "@/lib/supabase/client"
import type { Metadata } from "next"

// Define valid categories
const validCategories = ["investing", "advisory", "general"]

// Generate metadata for the page
export async function generateMetadata({
	params,
}: {
	params: { category: string }
}): Promise<Metadata> {
	// Check if category is valid
	if (!validCategories.includes(params.category)) {
		return {
			title: "Category Not Found | Doug.is",
			description: "The requested category could not be found.",
		}
	}

	const categoryName =
		params.category.charAt(0).toUpperCase() + params.category.slice(1)

	return {
		title: `${categoryName} | Doug.is`,
		description: `Articles and insights about ${params.category}.`,
	}
}

export default async function CategoryPage({
	params,
}: {
	params: { category: string }
}) {
	// Check if category is valid
	if (!validCategories.includes(params.category)) {
		notFound()
	}

	const posts = await getPostsByCategory(params.category)
	const categoryName =
		params.category.charAt(0).toUpperCase() + params.category.slice(1)

	// Define gradient based on category
	let gradient = "from-pink-500 via-purple-500 to-cyan-500"
	if (params.category === "investing") {
		gradient = "from-blue-500 via-indigo-500 to-purple-500"
	} else if (params.category === "advisory") {
		gradient = "from-purple-500 via-pink-500 to-red-500"
	}

	return (
		<div className="space-y-12">
			{/* Header */}
			<div className="relative py-16 text-center">
				<div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl -z-10"></div>
				<h1 className="text-4xl md:text-5xl font-bold mb-4 relative inline-block">
					<span
						className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
					>
						{categoryName}
					</span>
					<span
						className={`absolute -inset-1 bg-gradient-to-r ${gradient} opacity-30 blur-lg`}
					></span>
				</h1>
				<p className="text-xl text-white/80 max-w-2xl mx-auto">
					{params.category === "investing"
						? "Insights and strategies for modern investing approaches."
						: params.category === "advisory"
						? "Professional guidance and consulting perspectives."
						: "Thoughts and explorations on various topics."}
				</p>
			</div>

			{/* Posts Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{posts.length === 0 ? (
					<div className="col-span-full text-center py-12">
						<p className="text-white/70 text-lg">
							No posts found in this category.
						</p>
					</div>
				) : (
					posts.map((post) => (
						<Link
							key={post.id}
							href={`/blog/${post.slug}`}
							className="group block bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-colors"
						>
							<div className="relative h-48">
								{post.featured_image ? (
									<Image
										src={post.featured_image}
										alt={post.title}
										fill
										className="object-cover"
									/>
								) : (
									<div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30"></div>
								)}
							</div>
							<div className="p-6">
								<div className="text-xs text-white/60 uppercase tracking-wider mb-2">
									{post.category}
								</div>
								<h2 className="text-xl font-bold mb-2 text-white group-hover:text-pink-300 transition-colors">
									{post.title}
								</h2>
								<p className="text-white/70 mb-4">{post.excerpt}</p>
								<div className="text-sm text-white/60">
									{new Date(post.published_at || "").toLocaleDateString(
										"en-US",
										{
											year: "numeric",
											month: "long",
											day: "numeric",
										}
									)}
								</div>
							</div>
						</Link>
					))
				)}
			</div>
		</div>
	)
}

import Link from "next/link"
import { Metadata } from "next"
import { getPostsByCategory } from "@/lib/supabase/data"
import { formatDate } from "@/lib/utils"
import Image from "next/image"
import { notFound } from "next/navigation"

export async function generateMetadata({
	params,
}: {
	params: Promise<{ category: string }>
}): Promise<Metadata> {
	const resolvedParams = await params
	// Capitalize the first letter of each word in the category
	const formattedCategory = resolvedParams.category
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ")

	return {
		title: `${formattedCategory} | doug.is Thinking`,
		description: `Thoughts, ideas, and insights on ${formattedCategory.toLowerCase()}.`,
	}
}

export default async function ThinkingCategoryPage({
	params,
}: {
	params: Promise<{ category: string }>
}) {
	const resolvedParams = await params
	// Make sure category is always in proper format
	const category = resolvedParams.category.toLowerCase()
	console.log(`Rendering category page for: '${category}'`)

	const posts = await getPostsByCategory(category)

	if (!posts || posts.length === 0) {
		console.log(`No posts found for category: ${category}`)
		notFound()
	}

	// Capitalize the first letter of each word in the category for display
	const formattedCategory = category
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ")

	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-12">
				<Link
					href="/thinking"
					className="inline-flex items-center text-[rgba(var(--color-foreground),0.6)] hover:text-[rgba(var(--color-foreground),1)] mb-6 transition-colors"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-4 w-4 mr-2"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 19l-7-7 7-7"
						/>
					</svg>
					Back to All Thinking
				</Link>

				<h1 className="text-4xl font-bold gradient-heading mb-4">
					{formattedCategory}
				</h1>
				<p className="text-xl text-[rgba(var(--color-foreground),0.8)]">
					Thoughts, ideas, and insights on {formattedCategory.toLowerCase()}.
				</p>
			</div>

			<div className="space-y-8">
				{posts.map((post) => (
					<article
						key={post.id}
						className="flex flex-col overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-[rgba(var(--color-background-alt),0.5)] border border-[rgba(var(--color-foreground),0.1)]"
					>
						<div className="group">
							{post.featured_image ? (
								<Link
									href={`/thinking/about/${post.category.toLowerCase()}/${
										post.slug
									}`}
									className="block relative w-full h-64 overflow-hidden"
								>
									<Image
										src={post.featured_image}
										alt={post.title}
										fill
										priority
										sizes="(max-width: 768px) 100vw, 800px"
										className="object-cover group-hover:scale-105 transition-transform duration-500"
										unoptimized={post.featured_image.includes("supabase")}
									/>
								</Link>
							) : (
								<div className="relative h-64 w-full bg-gradient-to-br from-[rgba(var(--color-violet),0.2)] to-[rgba(var(--color-cyan),0.2)]"></div>
							)}
							<div className="p-6">
								<div className="flex items-center mb-3">
									<Link
										href={`/thinking/about/${post.category.toLowerCase()}`}
										className="text-xs font-medium px-2.5 py-1 rounded-full bg-[rgba(var(--color-violet),0.1)] text-[rgba(var(--color-violet),0.8)] hover:bg-[rgba(var(--color-violet),0.2)] transition-colors"
									>
										{post.category}
									</Link>
									<span className="mx-2 text-[rgba(var(--color-foreground),0.3)]">
										•
									</span>
									<time className="text-sm text-[rgba(var(--color-foreground),0.6)]">
										{post.published_at ? formatDate(post.published_at) : ""}
									</time>
								</div>
								<Link
									href={`/thinking/about/${post.category.toLowerCase()}/${
										post.slug
									}`}
									className="block"
								>
									<h2 className="text-2xl font-bold text-[rgba(var(--color-foreground),0.9)] mb-3 group-hover:text-[rgb(var(--color-violet))] transition-colors">
										{post.title}
									</h2>
									<p className="text-[rgba(var(--color-foreground),0.7)] mb-4">
										{post.excerpt}
									</p>
									<div className="neon-link inline-flex items-center">
										Read more
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
								</Link>
							</div>
						</div>
					</article>
				))}
			</div>
		</div>
	)
}

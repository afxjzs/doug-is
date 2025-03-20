import Link from "next/link"
import { Metadata } from "next"
import { getPostsByCategory } from "@/lib/supabase/client"
import { formatDate } from "@/lib/utils"
import SafeImage from "@/components/SafeImage"
import { notFound } from "next/navigation"

export async function generateMetadata({
	params,
}: {
	params: Promise<{ primary_category: string }>
}): Promise<Metadata> {
	const resolvedParams = await params
	// Capitalize the first letter of each word in the category
	const formattedCategory = resolvedParams.primary_category
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ")

	return {
		title: `${formattedCategory} | Doug.is Thinking`,
		description: `Thoughts, ideas, and insights on ${formattedCategory.toLowerCase()}.`,
	}
}

export default async function ThinkingCategoryPage({
	params,
}: {
	params: Promise<{ primary_category: string }>
}) {
	const resolvedParams = await params
	const category = resolvedParams.primary_category
	const posts = await getPostsByCategory(category)

	if (!posts || posts.length === 0) {
		notFound()
	}

	// Capitalize the first letter of each word in the category
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

			<div className="space-y-12">
				{posts.map((post) => (
					<article
						key={post.id}
						className="border-b border-[rgba(var(--color-foreground),0.1)] pb-12 last:border-0"
					>
						<Link href={`/thinking/${category}/${post.slug}`}>
							<div className="group">
								{post.featured_image && (
									<div className="relative h-64 w-full mb-6 overflow-hidden rounded-lg">
										<SafeImage
											src={post.featured_image}
											alt={post.title}
											fill
											className="object-cover group-hover:scale-105 transition-transform duration-300"
										/>
									</div>
								)}
								<div>
									<p className="text-sm text-[rgba(var(--color-foreground),0.6)] mb-2">
										{post.published_at ? formatDate(post.published_at) : ""}
									</p>
									<h2 className="text-2xl font-bold text-[rgba(var(--color-foreground),0.9)] mb-3 group-hover:text-[rgb(var(--color-violet))] transition-colors">
										{post.title}
									</h2>
									<p className="text-[rgba(var(--color-foreground),0.7)] mb-4">
										{post.excerpt}
									</p>
									<span className="neon-link">
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
									</span>
								</div>
							</div>
						</Link>
					</article>
				))}
			</div>
		</div>
	)
}

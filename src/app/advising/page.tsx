import Link from "next/link"
import Image from "next/image"
import { Metadata } from "next"
import { getPosts } from "@/lib/supabase/client"
import { getAllPosts } from "@/lib/utils/markdown"
import { formatDate } from "@/lib/utils"

export const metadata: Metadata = {
	title: "Advisory Services | Doug.is",
	description: "Professional advisory services for businesses and startups.",
}

export default async function AdvisingPage() {
	// Get posts from both Supabase and markdown files with category "advisory"
	const supabasePosts = await getPosts("advisory")
	const markdownPosts = getAllPosts("advisory")

	// Convert markdown posts to the same format as Supabase posts
	const convertedMarkdownPosts = markdownPosts.map((post) => ({
		id: post.slug,
		title: post.title,
		slug: post.slug,
		content: post.content,
		excerpt: post.excerpt,
		published_at: post.date,
		category: post.category,
		featured_image: post.featured_image,
	}))

	// Combine and sort all posts by date
	const advisoryPosts = [...supabasePosts, ...convertedMarkdownPosts].sort(
		(a, b) =>
			new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
	)

	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-12">
				<h1 className="text-4xl font-bold text-gray-900 mb-4">
					Advisory Services
				</h1>
				<p className="text-xl text-gray-600">
					Professional guidance and strategic advice for businesses and
					startups.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
				<div>
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						How I Can Help
					</h2>
					<p className="text-gray-600 mb-6">
						With years of experience in the industry, I provide strategic
						advisory services to help businesses navigate challenges and
						capitalize on opportunities.
					</p>
					<ul className="space-y-3">
						<li className="flex items-start">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6 text-blue-500 mr-2 flex-shrink-0"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span>Strategic planning and business development</span>
						</li>
						<li className="flex items-start">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6 text-blue-500 mr-2 flex-shrink-0"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span>Market analysis and competitive positioning</span>
						</li>
						<li className="flex items-start">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6 text-blue-500 mr-2 flex-shrink-0"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span>Product strategy and roadmap development</span>
						</li>
						<li className="flex items-start">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6 text-blue-500 mr-2 flex-shrink-0"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span>Fundraising and investor relations</span>
						</li>
					</ul>
				</div>
				<div className="relative h-80 rounded-lg overflow-hidden">
					<Image
						src="/images/advisory-services.jpg"
						alt="Advisory Services"
						fill
						className="object-cover"
					/>
				</div>
			</div>

			<div className="bg-gray-50 p-8 rounded-lg mb-16">
				<h2 className="text-2xl font-semibold text-gray-900 mb-6">
					Work With Me
				</h2>
				<p className="text-gray-600 mb-6">
					I offer flexible advisory arrangements tailored to your specific
					needs:
				</p>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="bg-white p-6 rounded-lg shadow-sm">
						<h3 className="text-xl font-semibold text-gray-900 mb-3">
							One-time Consultation
						</h3>
						<p className="text-gray-600 mb-4">
							A focused session to address specific challenges or questions.
						</p>
					</div>
					<div className="bg-white p-6 rounded-lg shadow-sm">
						<h3 className="text-xl font-semibold text-gray-900 mb-3">
							Monthly Retainer
						</h3>
						<p className="text-gray-600 mb-4">
							Ongoing support with regular check-ins and strategic guidance.
						</p>
					</div>
					<div className="bg-white p-6 rounded-lg shadow-sm">
						<h3 className="text-xl font-semibold text-gray-900 mb-3">
							Project-based
						</h3>
						<p className="text-gray-600 mb-4">
							Dedicated support for specific initiatives or projects.
						</p>
					</div>
				</div>
				<div className="mt-8 text-center">
					<Link
						href="/around-here-somehwere"
						className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
					>
						Get in Touch
					</Link>
				</div>
			</div>

			{advisoryPosts.length > 0 && (
				<div>
					<h2 className="text-2xl font-semibold text-gray-900 mb-6">
						Advisory Insights
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{advisoryPosts.map((post) => (
							<Link key={post.id} href={`/writing/${post.slug}`}>
								<div className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
									{post.featured_image && (
										<div className="relative h-48 w-full">
											<Image
												src={post.featured_image}
												alt={post.title}
												fill
												className="object-cover group-hover:scale-105 transition-transform duration-300"
											/>
										</div>
									)}
									<div className="p-6">
										<p className="text-sm text-gray-500 mb-2">
											{formatDate(post.published_at)}
										</p>
										<h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
											{post.title}
										</h3>
										<p className="text-gray-600">{post.excerpt}</p>
									</div>
								</div>
							</Link>
						))}
					</div>
					<div className="mt-8 text-center">
						<Link
							href="/writing"
							className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
						>
							View all posts
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 ml-1"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
									clipRule="evenodd"
								/>
							</svg>
						</Link>
					</div>
				</div>
			)}
		</div>
	)
}

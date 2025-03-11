import Link from "next/link"
import Image from "next/image"
import { Metadata } from "next"
import { getPostsByCategory } from "@/lib/supabase/client"
import { formatDate } from "@/lib/utils"

export const metadata: Metadata = {
	title: "Startup Advisory | Doug.is",
	description:
		"Startup advisory services from a YC and Techstars alum specializing in B2B startups and accelerator programs.",
}

export default async function AdvisingPage() {
	// Get posts from Supabase with category "advisory"
	const posts = await getPostsByCategory("advisory")

	// Sort posts by date
	const sortedPosts = [...posts].sort(
		(a, b) =>
			new Date(b.published_at || "").getTime() -
			new Date(a.published_at || "").getTime()
	)

	return (
		<div className="max-w-4xl mx-auto">
			{/* Hero Section */}
			<div className="mb-16 relative">
				<div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-cyan-900/20 rounded-lg -z-10 blur-xl"></div>
				<div className="relative z-10 py-16 px-8 border border-[rgba(var(--color-foreground),0.05)] rounded-lg bg-[rgba(var(--color-background),0.8)] backdrop-blur-sm">
					<h1 className="text-4xl md:text-5xl font-bold gradient-heading mb-6 text-center">
						Startup Advisory
					</h1>
					<p className="text-xl text-[rgba(var(--color-foreground),0.8)] mb-8 text-center max-w-2xl mx-auto">
						Strategic guidance for B2B startups from a YC and Techstars alum
						with extensive accelerator experience.
					</p>
					<div className="flex flex-wrap justify-center gap-4 mb-6">
						<div className="px-4 py-2 bg-[rgba(var(--color-foreground),0.05)] rounded-full border border-[rgba(var(--color-foreground),0.1)]">
							<span className="text-sm font-medium">Y Combinator Alum</span>
						</div>
						<div className="px-4 py-2 bg-[rgba(var(--color-foreground),0.05)] rounded-full border border-[rgba(var(--color-foreground),0.1)]">
							<span className="text-sm font-medium">Techstars Alum</span>
						</div>
						<div className="px-4 py-2 bg-[rgba(var(--color-foreground),0.05)] rounded-full border border-[rgba(var(--color-foreground),0.1)]">
							<span className="text-sm font-medium">Director of Pilots</span>
						</div>
					</div>
				</div>
			</div>

			{/* Experience Section */}
			<div className="mb-16">
				<h2 className="text-3xl font-bold gradient-heading mb-8">
					Accelerator Experience
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
					<div className="dark-card">
						<div className="flex items-center mb-4">
							<div className="w-12 h-12 mr-4 flex-shrink-0 bg-[rgba(var(--color-foreground),0.05)] rounded-lg flex items-center justify-center">
								<span className="text-2xl">🚀</span>
							</div>
							<h3 className="text-xl font-semibold gradient-text-cyan">
								Y Combinator Alumni
							</h3>
						</div>
						<p className="text-[rgba(var(--color-foreground),0.7)] mb-4">
							As a YC alum, I've experienced firsthand what it takes to build a
							successful startup in the world's premier accelerator program. I
							can help you navigate the challenges of rapid growth, fundraising,
							and product-market fit.
						</p>
					</div>

					<div className="dark-card">
						<div className="flex items-center mb-4">
							<div className="w-12 h-12 mr-4 flex-shrink-0 bg-[rgba(var(--color-foreground),0.05)] rounded-lg flex items-center justify-center">
								<span className="text-2xl">⭐</span>
							</div>
							<h3 className="text-xl font-semibold gradient-text-magenta">
								Techstars Alumni
							</h3>
						</div>
						<p className="text-[rgba(var(--color-foreground),0.7)] mb-4">
							My experience with Techstars has given me deep insights into
							building networks, leveraging mentorship, and creating sustainable
							growth strategies for early-stage startups.
						</p>
					</div>
				</div>

				<div className="dark-card mb-8">
					<div className="flex items-center mb-4">
						<div className="w-12 h-12 mr-4 flex-shrink-0 bg-[rgba(var(--color-foreground),0.05)] rounded-lg flex items-center justify-center">
							<span className="text-2xl">🛠️</span>
						</div>
						<h3 className="text-xl font-semibold gradient-text-violet">
							Director of Pilots
						</h3>
					</div>
					<p className="text-[rgba(var(--color-foreground),0.7)] mb-4">
						In my current role as Director of Pilots at a startup accelerator, I
						manage pilot programs that connect startups with enterprise
						customers. This gives me unique insights into what makes B2B
						partnerships successful and how to navigate enterprise sales cycles.
					</p>
					<ul className="space-y-2 mb-4">
						<li className="flex items-start">
							<span className="check-mark mr-2">✓</span>
							<span>Enterprise pilot program design and execution</span>
						</li>
						<li className="flex items-start">
							<span className="check-mark mr-2">✓</span>
							<span>B2B partnership development strategies</span>
						</li>
						<li className="flex items-start">
							<span className="check-mark mr-2">✓</span>
							<span>Startup-enterprise collaboration frameworks</span>
						</li>
					</ul>
				</div>
			</div>

			{/* Services Section */}
			<div className="mb-16">
				<h2 className="text-3xl font-bold gradient-heading mb-8">
					How I Can Help
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					<div className="dark-card">
						<h3 className="text-xl font-semibold mb-4 gradient-text-cyan">
							B2B Go-to-Market Strategy
						</h3>
						<p className="text-[rgba(var(--color-foreground),0.7)] mb-4">
							Develop effective go-to-market strategies specifically for B2B
							startups, with a focus on enterprise sales cycles, pilot programs,
							and partnership development.
						</p>
						<ul className="space-y-2 mb-4">
							<li className="flex items-start">
								<span className="check-mark mr-2">✓</span>
								<span>Enterprise sales strategy</span>
							</li>
							<li className="flex items-start">
								<span className="check-mark mr-2">✓</span>
								<span>Pilot program design</span>
							</li>
							<li className="flex items-start">
								<span className="check-mark mr-2">✓</span>
								<span>B2B pricing and packaging</span>
							</li>
						</ul>
					</div>

					<div className="dark-card">
						<h3 className="text-xl font-semibold mb-4 gradient-text-magenta">
							Accelerator Preparation
						</h3>
						<p className="text-[rgba(var(--color-foreground),0.7)] mb-4">
							Get your startup ready for top accelerator programs like Y
							Combinator and Techstars with application guidance, pitch
							preparation, and strategic planning.
						</p>
						<ul className="space-y-2 mb-4">
							<li className="flex items-start">
								<span className="check-mark mr-2">✓</span>
								<span>Application and interview preparation</span>
							</li>
							<li className="flex items-start">
								<span className="check-mark mr-2">✓</span>
								<span>Pitch deck optimization</span>
							</li>
							<li className="flex items-start">
								<span className="check-mark mr-2">✓</span>
								<span>Pre-accelerator growth strategy</span>
							</li>
						</ul>
					</div>

					<div className="dark-card">
						<h3 className="text-xl font-semibold mb-4 gradient-text-violet">
							Product-Market Fit
						</h3>
						<p className="text-[rgba(var(--color-foreground),0.7)] mb-4">
							Navigate the critical journey to product-market fit with
							frameworks for customer discovery, validation, and iterative
							product development.
						</p>
						<ul className="space-y-2 mb-4">
							<li className="flex items-start">
								<span className="check-mark mr-2">✓</span>
								<span>Customer discovery frameworks</span>
							</li>
							<li className="flex items-start">
								<span className="check-mark mr-2">✓</span>
								<span>MVP strategy and validation</span>
							</li>
							<li className="flex items-start">
								<span className="check-mark mr-2">✓</span>
								<span>Iterative product development</span>
							</li>
						</ul>
					</div>

					<div className="dark-card">
						<h3 className="text-xl font-semibold mb-4 gradient-text-cyan">
							Fundraising Strategy
						</h3>
						<p className="text-[rgba(var(--color-foreground),0.7)] mb-4">
							Develop a compelling fundraising strategy with guidance on
							investor targeting, pitch preparation, and deal structuring based
							on real-world experience.
						</p>
						<ul className="space-y-2 mb-4">
							<li className="flex items-start">
								<span className="check-mark mr-2">✓</span>
								<span>Investor pitch preparation</span>
							</li>
							<li className="flex items-start">
								<span className="check-mark mr-2">✓</span>
								<span>Fundraising materials development</span>
							</li>
							<li className="flex items-start">
								<span className="check-mark mr-2">✓</span>
								<span>Term sheet and deal negotiation</span>
							</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Engagement Models */}
			<div className="mb-16">
				<h2 className="text-3xl font-bold gradient-heading mb-8">
					Engagement Models
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div className="dark-card">
						<h3 className="text-xl font-semibold mb-4 gradient-text-violet">
							One-Time Strategy Session
						</h3>
						<p className="text-[rgba(var(--color-foreground),0.7)] mb-4">
							A focused 90-minute session to tackle a specific challenge or
							opportunity your startup is facing.
						</p>
						<div className="mt-auto">
							<Link href="/contact" className="neon-button block text-center">
								Book a Session
							</Link>
						</div>
					</div>

					<div className="dark-card">
						<h3 className="text-xl font-semibold mb-4 gradient-text-cyan">
							Monthly Advisory
						</h3>
						<p className="text-[rgba(var(--color-foreground),0.7)] mb-4">
							Ongoing strategic guidance with regular sessions and email support
							to help navigate your startup journey.
						</p>
						<div className="mt-auto">
							<Link href="/contact" className="neon-button block text-center">
								Discuss Options
							</Link>
						</div>
					</div>

					<div className="dark-card">
						<h3 className="text-xl font-semibold mb-4 gradient-text-magenta">
							Custom Engagement
						</h3>
						<p className="text-[rgba(var(--color-foreground),0.7)] mb-4">
							Tailored advisory packages for specific needs such as accelerator
							preparation, fundraising, or pilot program design.
						</p>
						<div className="mt-auto">
							<Link href="/contact" className="neon-button block text-center">
								Get in Touch
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* Insights Section */}
			{sortedPosts.length > 0 && (
				<div className="mb-16">
					<h2 className="text-3xl font-bold gradient-heading mb-8">
						Advisory Insights
					</h2>

					<div className="space-y-8">
						{sortedPosts.slice(0, 3).map((post) => (
							<article
								key={post.id}
								className="border border-[rgba(var(--color-foreground),0.05)] rounded-lg overflow-hidden bg-[rgba(var(--color-foreground),0.02)] hover:bg-[rgba(var(--color-foreground),0.04)] transition-all duration-300"
							>
								<Link href={`/thinking/advisory/${post.slug}`}>
									<div className="p-6">
										<p className="text-sm text-[rgba(var(--color-foreground),0.6)] mb-2">
											{post.published_at ? formatDate(post.published_at) : ""}
										</p>
										<h3 className="text-xl font-bold mb-2 text-[rgba(var(--color-foreground),0.9)]">
											{post.title}
										</h3>
										<p className="text-[rgba(var(--color-foreground),0.7)] mb-4">
											{post.excerpt}
										</p>
										<span className="neon-link">Read More →</span>
									</div>
								</Link>
							</article>
						))}
					</div>
				</div>
			)}

			{/* CTA Section */}
			<div className="mb-16">
				<div className="relative z-10 py-16 px-8 border border-[rgba(var(--color-foreground),0.05)] rounded-lg bg-[rgba(var(--color-background),0.8)] backdrop-blur-sm">
					<h2 className="text-3xl font-bold gradient-heading mb-6 text-center">
						Ready to Accelerate Your Startup?
					</h2>
					<p className="text-xl text-[rgba(var(--color-foreground),0.8)] mb-8 text-center max-w-2xl mx-auto">
						Let's discuss how my experience with YC, Techstars, and enterprise
						pilot programs can help your B2B startup reach its goals.
					</p>
					<div className="flex justify-center">
						<Link href="/contact" className="neon-button-lg">
							Get in Touch
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}

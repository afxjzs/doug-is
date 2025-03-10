import Link from "next/link"
import Image from "next/image"
import { Metadata } from "next"
import { getPostsByCategory } from "@/lib/supabase/client"
import { formatDate } from "@/lib/utils"

export const metadata: Metadata = {
	title: "Advisory Services | Doug.is",
	description: "Professional advisory services for businesses and startups.",
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
						Advisory Services
					</h1>
					<p className="text-xl text-[rgba(var(--color-foreground),0.8)] mb-8 text-center max-w-2xl mx-auto">
						Strategic guidance for businesses and startups navigating the
						digital landscape.
					</p>
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
							Technology Strategy
						</h3>
						<p className="text-[rgba(var(--color-foreground),0.7)] mb-4">
							Navigate complex technology decisions with confidence. I provide
							guidance on tech stack selection, architecture planning, and
							digital transformation initiatives.
						</p>
						<ul className="space-y-2 mb-4">
							<li className="flex items-start">
								<span className="check-mark mr-2">✓</span>
								<span>Tech stack evaluation and selection</span>
							</li>
							<li className="flex items-start">
								<span className="check-mark mr-2">✓</span>
								<span>Architecture planning and review</span>
							</li>
							<li className="flex items-start">
								<span className="check-mark mr-2">✓</span>
								<span>Digital transformation roadmapping</span>
							</li>
						</ul>
					</div>

					<div className="dark-card">
						<h3 className="text-xl font-semibold mb-4 gradient-text-magenta">
							Product Development
						</h3>
						<p className="text-[rgba(var(--color-foreground),0.7)] mb-4">
							Turn your vision into reality with strategic product development
							guidance. From concept to launch, I help navigate the complexities
							of building successful digital products.
						</p>
						<ul className="space-y-2 mb-4">
							<li className="flex items-start">
								<span className="check-mark mr-2">✓</span>
								<span>Product strategy and roadmapping</span>
							</li>
							<li className="flex items-start">
								<span className="check-mark mr-2">✓</span>
								<span>MVP definition and development planning</span>
							</li>
							<li className="flex items-start">
								<span className="check-mark mr-2">✓</span>
								<span>Feature prioritization frameworks</span>
							</li>
						</ul>
					</div>

					<div className="dark-card">
						<h3 className="text-xl font-semibold mb-4 gradient-text-violet">
							Startup Guidance
						</h3>
						<p className="text-[rgba(var(--color-foreground),0.7)] mb-4">
							Navigate the challenges of early-stage growth with experienced
							guidance. I help founders make informed decisions about
							technology, product, and go-to-market strategies.
						</p>
						<ul className="space-y-2 mb-4">
							<li className="flex items-start">
								<span className="check-mark mr-2">✓</span>
								<span>Technical co-founder consultation</span>
							</li>
							<li className="flex items-start">
								<span className="check-mark mr-2">✓</span>
								<span>MVP strategy and execution</span>
							</li>
							<li className="flex items-start">
								<span className="check-mark mr-2">✓</span>
								<span>Technology investment planning</span>
							</li>
						</ul>
					</div>

					<div className="dark-card">
						<h3 className="text-xl font-semibold mb-4 gradient-text-cyan">
							Team Building
						</h3>
						<p className="text-[rgba(var(--color-foreground),0.7)] mb-4">
							Build high-performing technical teams that deliver results. I
							provide guidance on hiring, team structure, and creating a culture
							of innovation and excellence.
						</p>
						<ul className="space-y-2 mb-4">
							<li className="flex items-start">
								<span className="check-mark mr-2">✓</span>
								<span>Technical hiring strategy</span>
							</li>
							<li className="flex items-start">
								<span className="check-mark mr-2">✓</span>
								<span>Team structure optimization</span>
							</li>
							<li className="flex items-start">
								<span className="check-mark mr-2">✓</span>
								<span>Engineering culture development</span>
							</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Process Section */}
			<div className="mb-16">
				<h2 className="text-3xl font-bold gradient-heading mb-8">
					My Approach
				</h2>

				<div className="space-y-8">
					<div className="flex flex-col md:flex-row gap-6 items-start">
						<div className="flex-shrink-0 w-16 h-16 rounded-full bg-[rgba(var(--color-violet),0.1)] flex items-center justify-center border border-[rgba(var(--color-violet),0.2)]">
							<span className="text-2xl font-bold gradient-text-violet">1</span>
						</div>
						<div>
							<h3 className="text-xl font-semibold mb-2 gradient-text-violet">
								Discovery
							</h3>
							<p className="text-[rgba(var(--color-foreground),0.7)]">
								I begin by deeply understanding your business, goals, and
								challenges. This involves stakeholder interviews, reviewing
								existing systems, and identifying key opportunities and
								constraints.
							</p>
						</div>
					</div>

					<div className="flex flex-col md:flex-row gap-6 items-start">
						<div className="flex-shrink-0 w-16 h-16 rounded-full bg-[rgba(var(--color-cyan),0.1)] flex items-center justify-center border border-[rgba(var(--color-cyan),0.2)]">
							<span className="text-2xl font-bold gradient-text-cyan">2</span>
						</div>
						<div>
							<h3 className="text-xl font-semibold mb-2 gradient-text-cyan">
								Strategy Development
							</h3>
							<p className="text-[rgba(var(--color-foreground),0.7)]">
								Based on discovery insights, I develop a tailored strategy that
								aligns technology decisions with your business objectives. This
								includes specific recommendations, roadmaps, and implementation
								plans.
							</p>
						</div>
					</div>

					<div className="flex flex-col md:flex-row gap-6 items-start">
						<div className="flex-shrink-0 w-16 h-16 rounded-full bg-[rgba(var(--color-magenta),0.1)] flex items-center justify-center border border-[rgba(var(--color-magenta),0.2)]">
							<span className="text-2xl font-bold gradient-text-magenta">
								3
							</span>
						</div>
						<div>
							<h3 className="text-xl font-semibold mb-2 gradient-text-magenta">
								Implementation Support
							</h3>
							<p className="text-[rgba(var(--color-foreground),0.7)]">
								I provide ongoing guidance during the implementation phase,
								helping navigate challenges, make adjustments, and ensure the
								strategy delivers the intended outcomes.
							</p>
						</div>
					</div>

					<div className="flex flex-col md:flex-row gap-6 items-start">
						<div className="flex-shrink-0 w-16 h-16 rounded-full bg-[rgba(var(--color-violet),0.1)] flex items-center justify-center border border-[rgba(var(--color-violet),0.2)]">
							<span className="text-2xl font-bold gradient-text-violet">4</span>
						</div>
						<div>
							<h3 className="text-xl font-semibold mb-2 gradient-text-violet">
								Continuous Improvement
							</h3>
							<p className="text-[rgba(var(--color-foreground),0.7)]">
								Technology and markets evolve rapidly. I help establish
								frameworks for continuous evaluation and improvement, ensuring
								your technology strategy remains effective and aligned with
								changing business needs.
							</p>
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
								</Link>
							</article>
						))}
					</div>

					{sortedPosts.length > 3 && (
						<div className="mt-8 text-center">
							<Link
								href="/thinking/advisory"
								className="neon-button-violet inline-block"
							>
								View All Advisory Insights
							</Link>
						</div>
					)}
				</div>
			)}

			{/* CTA Section */}
			<div className="relative">
				<div className="absolute inset-0 bg-gradient-to-r from-violet-900/20 to-cyan-900/20 rounded-lg -z-10 blur-xl"></div>
				<div className="relative z-10 p-8 border border-[rgba(var(--color-foreground),0.05)] rounded-lg bg-[rgba(var(--color-background),0.8)] backdrop-blur-sm text-center">
					<h2 className="text-2xl font-semibold gradient-heading mb-4">
						Let&apos;s Work Together
					</h2>
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-6 max-w-2xl mx-auto">
						Interested in advisory services? I&apos;m available for consulting
						engagements, workshops, and ongoing advisory roles.
					</p>
					<Link href="mailto:hello@doug.is" className="neon-button-cyan">
						Get in Touch
					</Link>
				</div>
			</div>
		</div>
	)
}

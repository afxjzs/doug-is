import Link from "next/link"
import Image from "next/image"
import { Metadata } from "next"
// import { getPostsByCategory } from "@/lib/supabase/client"
// import { formatDate } from "@/lib/utils"
import ConnectCta from "@/components/ConnectCta"

export const metadata: Metadata = {
	title: "Startup Advisory | Doug.is",
	description:
		"Startup advisory services from a YC and Techstars alum specializing in B2B startups and accelerator programs.",
}

export default async function AdvisingPage() {
	// Get posts from Supabase with category "advisory"
	// const posts = await getPostsByCategory("advisory")

	// // Sort posts by date
	// const sortedPosts = [...posts].sort(
	// 	(a, b) =>
	// 		new Date(b.published_at || "").getTime() -
	// 		new Date(a.published_at || "").getTime()
	// )

	return (
		<div className="max-w-5xl mx-auto">
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

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
					{/* Y Combinator */}
					<div className="relative overflow-hidden rounded-lg border border-[rgba(var(--color-foreground),0.05)] transition-all duration-300 hover:border-orange-500/30 hover:shadow-[0_0_15px_rgba(249,115,22,0.15)]">
						<div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 to-orange-800/5 opacity-50 hover:opacity-70 transition-opacity duration-300"></div>
						<div className="relative p-8 flex flex-col h-full">
							<div className="mb-6 flex justify-center">
								<div className="h-20 flex items-center justify-center">
									<Image
										src="/images/yc-logo-white.png"
										alt="Y Combinator Logo"
										width={180}
										height={36}
										className="object-contain"
									/>
								</div>
							</div>
							<h3 className="text-xl font-semibold gradient-heading mb-4 text-center">
								Y Combinator Alumni
							</h3>
							<p className="text-[rgba(var(--color-foreground),0.7)] mb-4">
								I was part of the W15 batch with Pretty Instant (acquired by{" "}
								<Link
									href="https://www.prnewswire.com/news-releases/snappr-acquires-pretty-instant-301347884.html"
									target="_blank"
									rel="noopener noreferrer"
									className="text-orange-400 hover:text-orange-300"
								>
									Snappr
								</Link>{" "}
								in 2021). As Co-Founder and CTO, I helped navigate the
								challenges of rapid growth, fundraising, and product-market fit.
								The YC network and mentorship were instrumental in shaping our
								go-to-market strategy and developing key enterprise
								partnerships.
							</p>
						</div>
					</div>

					{/* Techstars */}
					<div className="relative overflow-hidden rounded-lg border border-[rgba(var(--color-foreground),0.05)] transition-all duration-300 hover:border-emerald-500/30 hover:shadow-[0_0_15px_rgba(80,200,120,0.15)]">
						<div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-emerald-800/5 opacity-50 hover:opacity-70 transition-opacity duration-300"></div>
						<div className="relative p-8 flex flex-col h-full">
							<div className="mb-6 flex justify-center">
								<div className="h-20 flex items-center justify-center">
									<Image
										src="/images/techstars-logo-white.png"
										alt="Techstars Logo"
										width={180}
										height={36}
										className="object-contain"
									/>
								</div>
							</div>
							<h3 className="text-xl font-semibold gradient-heading mb-4 text-center">
								Techstars Alumni
							</h3>
							<p className="text-[rgba(var(--color-foreground),0.7)] mb-4">
								I went through the JP Morgan/Oakland 2024 batch with{" "}
								<Link
									href="https://dubprime.com"
									target="_blank"
									rel="noopener noreferrer"
									className="text-emerald-400 hover:text-emerald-300"
								>
									DubPrime
								</Link>
								. I currently serve as Co-Founder, CTO, and CPO, building
								innovative solutions and leveraging mentorship to create
								sustainable growth strategies for enterprise fintech.
							</p>
						</div>
					</div>

					{/* VentureBuilder */}
					<div className="relative overflow-hidden rounded-lg border border-[rgba(var(--color-foreground),0.05)] transition-all duration-300 hover:border-red-500/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.15)]">
						<div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-red-800/5 opacity-50 hover:opacity-70 transition-opacity duration-300"></div>
						<div className="relative p-8 flex flex-col h-full">
							<div className="mb-6 flex justify-center">
								<div className="h-20 flex items-center justify-center">
									<Image
										src="/images/venture-builder-logo-white.png"
										alt="VentureBuilder Logo"
										width={180}
										height={36}
										className="object-contain"
									/>
								</div>
							</div>
							<h3 className="text-xl font-semibold gradient-heading mb-4 text-center">
								VentureBuilder
							</h3>
							<p className="text-[rgba(var(--color-foreground),0.7)] mb-4">
								I am currently Director of Pilot Programs at{" "}
								<Link
									href="https://venturebuilder.vc/nov"
									target="_blank"
									rel="noopener noreferrer"
									className="text-red-400 hover:text-red-300"
								>
									VentureBuilder
								</Link>
								, managing the pilots for the Supernova Accelerator in
								partnership with{" "}
								<Link
									href="https://nov.com"
									target="_blank"
									rel="noopener noreferrer"
									className="text-red-400 hover:text-red-300"
								>
									NOV
								</Link>
								. This role gives me unique insights into what makes B2B
								partnerships successful and how to navigate enterprise sales
								cycles.
							</p>
						</div>
					</div>
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

			{/* B2B Services Section */}
			<div className="mb-16">
				<h2 className="text-3xl font-bold gradient-heading mb-8">
					B2B Startup Services
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
					<div className="relative overflow-hidden rounded-lg border border-[rgba(var(--color-foreground),0.05)] transition-all duration-300 hover:border-violet-500/30 hover:shadow-[0_0_15px_rgba(139,92,246,0.15)]">
						<div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 to-violet-800/5 opacity-50 hover:opacity-70 transition-opacity duration-300"></div>
						<div className="relative p-8 flex flex-col h-full">
							<h3 className="text-xl font-semibold gradient-text-violet mb-4">
								One-Time Strategy Session
							</h3>
							<p className="text-[rgba(var(--color-foreground),0.7)] mb-6">
								A focused 90-minute session to tackle a specific challenge or
								opportunity your startup is facing.
							</p>
							<div className="mt-auto">
								<Link
									href="https://cal.com/afxjzs/startups"
									target="_blank"
									rel="noopener noreferrer"
									className="neon-button-violet block text-center"
								>
									Book a Free Consultation
								</Link>
							</div>
						</div>
					</div>

					<div className="relative overflow-hidden rounded-lg border border-[rgba(var(--color-foreground),0.05)] transition-all duration-300 hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.15)]">
						<div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-cyan-800/5 opacity-50 hover:opacity-70 transition-opacity duration-300"></div>
						<div className="relative p-8 flex flex-col h-full">
							<h3 className="text-xl font-semibold gradient-text-cyan mb-4">
								Monthly Advisory
							</h3>
							<p className="text-[rgba(var(--color-foreground),0.7)] mb-6">
								Ongoing strategic guidance with regular sessions and email
								support to help navigate your startup journey.
							</p>
							<div className="mt-auto">
								<Link
									href="https://cal.com/afxjzs/startups"
									target="_blank"
									rel="noopener noreferrer"
									className="neon-button-cyan block text-center"
								>
									Book a Free Consultation
								</Link>
							</div>
						</div>
					</div>

					<div className="relative overflow-hidden rounded-lg border border-[rgba(var(--color-foreground),0.05)] transition-all duration-300 hover:border-pink-500/30 hover:shadow-[0_0_15px_rgba(236,72,153,0.15)]">
						<div className="absolute inset-0 bg-gradient-to-br from-pink-900/20 to-pink-800/5 opacity-50 hover:opacity-70 transition-opacity duration-300"></div>
						<div className="relative p-8 flex flex-col h-full">
							<h3 className="text-xl font-semibold gradient-text-magenta mb-4">
								Custom Engagement
							</h3>
							<p className="text-[rgba(var(--color-foreground),0.7)] mb-6">
								Tailored advisory packages for specific needs such as
								accelerator preparation, fundraising, or pilot program design.
							</p>
							<div className="mt-auto">
								<Link
									href="/connecting"
									className="neon-button-magenta block text-center"
								>
									Get in Touch
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Insights Section */}
			{/* {sortedPosts.length > 0 && (
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
			)} */}

			{/* CTA Section */}
			<div className="mb-16">
				<ConnectCta
					title="Ready to Accelerate Your Startup?"
					description="Let's discuss how my experience with YC, Techstars, and enterprise pilot programs can help your B2B startup reach its goals."
					buttonText="Get in Touch"
				/>
			</div>
		</div>
	)
}

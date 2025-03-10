import { Metadata } from "next"
import Link from "next/link"
import SafeImage from "@/components/SafeImage"
import { getPosts } from "@/lib/supabase/client"

export const metadata: Metadata = {
	title: "Investing | Doug.is",
	description: "Investment philosophy, strategies, and insights",
}

export default async function InvestingPage() {
	// Get posts with the "investing" category
	const allPosts = await getPosts()
	const posts = allPosts.filter((post) => post.category === "investing")

	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-12">
				<h1 className="text-4xl font-bold gradient-heading mb-4">
					doug.is/investing
				</h1>
				<p className="text-xl text-[rgba(var(--color-foreground),0.8)]">
					My investment philosophy, strategies, and insights.
				</p>
			</div>

			<div className="mb-16">
				<div className="relative rounded-lg overflow-hidden mb-8">
					<div className="absolute inset-0 bg-gradient-to-r from-[rgba(var(--color-violet),0.2)] to-[rgba(var(--color-cyan),0.2)] -z-10"></div>
					<div className="relative z-10 p-8 border border-[rgba(var(--color-foreground),0.05)] rounded-lg bg-[rgba(var(--color-background),0.8)] backdrop-blur-sm">
						<h2 className="text-2xl font-semibold gradient-heading mb-6">
							Investment Philosophy
						</h2>
						<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
							My investment approach is centered around long-term value
							creation, focusing on companies and assets with strong
							fundamentals, sustainable competitive advantages, and alignment
							with major technological and societal trends.
						</p>
						<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
							I believe in a balanced portfolio that combines established
							blue-chip investments with carefully selected growth opportunities
							and alternative assets. This approach aims to provide both
							stability and potential for significant returns.
						</p>
						<p className="text-[rgba(var(--color-foreground),0.8)]">
							Risk management is a core component of my strategy, with careful
							consideration given to position sizing, diversification across
							sectors and asset classes, and regular portfolio rebalancing.
						</p>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
					<div className="dark-card">
						<h3 className="text-xl font-semibold gradient-text-cyan mb-4">
							Public Markets
						</h3>
						<ul className="space-y-2 text-[rgba(var(--color-foreground),0.7)]">
							<li className="flex items-center">
								<span className="check-mark mr-2">✓</span>
								Value Investing
							</li>
							<li className="flex items-center">
								<span className="check-mark mr-2">✓</span>
								Growth at Reasonable Price
							</li>
							<li className="flex items-center">
								<span className="check-mark mr-2">✓</span>
								Dividend Growth
							</li>
							<li className="flex items-center">
								<span className="check-mark mr-2">✓</span>
								Index Funds
							</li>
							<li className="flex items-center">
								<span className="check-mark mr-2">✓</span>
								Thematic ETFs
							</li>
						</ul>
					</div>

					<div className="dark-card">
						<h3 className="text-xl font-semibold gradient-text-magenta mb-4">
							Private Investments
						</h3>
						<ul className="space-y-2 text-[rgba(var(--color-foreground),0.7)]">
							<li className="flex items-center">
								<span className="check-mark mr-2">✓</span>
								Early-Stage Startups
							</li>
							<li className="flex items-center">
								<span className="check-mark mr-2">✓</span>
								Angel Investing
							</li>
							<li className="flex items-center">
								<span className="check-mark mr-2">✓</span>
								Venture Capital
							</li>
							<li className="flex items-center">
								<span className="check-mark mr-2">✓</span>
								Private Equity
							</li>
							<li className="flex items-center">
								<span className="check-mark mr-2">✓</span>
								Real Estate
							</li>
						</ul>
					</div>

					<div className="dark-card">
						<h3 className="text-xl font-semibold gradient-text-violet mb-4">
							Alternative Assets
						</h3>
						<ul className="space-y-2 text-[rgba(var(--color-foreground),0.7)]">
							<li className="flex items-center">
								<span className="check-mark mr-2">✓</span>
								Digital Assets
							</li>
							<li className="flex items-center">
								<span className="check-mark mr-2">✓</span>
								Commodities
							</li>
							<li className="flex items-center">
								<span className="check-mark mr-2">✓</span>
								Collectibles
							</li>
							<li className="flex items-center">
								<span className="check-mark mr-2">✓</span>
								Art & Culture
							</li>
							<li className="flex items-center">
								<span className="check-mark mr-2">✓</span>
								Intellectual Property
							</li>
						</ul>
					</div>
				</div>
			</div>

			<div className="mb-16">
				<h2 className="text-2xl font-semibold gradient-heading mb-6">
					Investment Insights
				</h2>

				{posts.length > 0 ? (
					<div className="grid grid-cols-1 gap-8">
						{posts.map((post) => (
							<Link
								key={post.id}
								href={`/thinking/${post.slug}`}
								className="dark-card group hover:border-[rgba(var(--color-violet),0.2)]"
							>
								<div className="flex flex-col md:flex-row gap-6">
									{post.featured_image && (
										<div className="relative h-48 md:w-1/3 rounded-lg overflow-hidden">
											<SafeImage
												src={post.featured_image}
												alt={post.title}
												fill
												className="object-cover transition-transform duration-500 group-hover:scale-105"
											/>
										</div>
									)}
									<div className={post.featured_image ? "md:w-2/3" : ""}>
										<div className="text-xs text-[rgba(var(--color-foreground),0.6)] uppercase tracking-wider mb-2">
											{post.category}
										</div>
										<h3 className="text-xl font-bold mb-2 text-[rgba(var(--color-foreground),0.9)] group-hover:text-[rgba(var(--color-violet),1)] transition-colors">
											{post.title}
										</h3>
										<p className="text-[rgba(var(--color-foreground),0.7)] mb-4">
											{post.excerpt}
										</p>
										<div className="text-sm text-[rgba(var(--color-foreground),0.6)]">
											{post.published_at
												? new Date(post.published_at).toLocaleDateString(
														"en-US",
														{
															year: "numeric",
															month: "long",
															day: "numeric",
														}
												  )
												: ""}
										</div>
									</div>
								</div>
							</Link>
						))}
					</div>
				) : (
					<div className="dark-card">
						<p className="text-[rgba(var(--color-foreground),0.8)] text-center py-8">
							No investment articles available at the moment. Check back soon!
						</p>
					</div>
				)}
			</div>

			<div className="mb-16">
				<h2 className="text-2xl font-semibold gradient-heading mb-6">
					Investment Resources
				</h2>
				<div className="dark-card">
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-6">
						Here are some resources I recommend for those interested in learning
						more about investing:
					</p>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<h3 className="text-lg font-semibold text-[rgba(var(--color-foreground),0.9)] mb-3">
								Books
							</h3>
							<ul className="list-disc pl-6 space-y-2 text-[rgba(var(--color-foreground),0.8)]">
								<li>The Intelligent Investor by Benjamin Graham</li>
								<li>Common Stocks and Uncommon Profits by Philip Fisher</li>
								<li>The Psychology of Money by Morgan Housel</li>
								<li>A Random Walk Down Wall Street by Burton Malkiel</li>
								<li>
									The Little Book of Common Sense Investing by John C. Bogle
								</li>
							</ul>
						</div>
						<div>
							<h3 className="text-lg font-semibold text-[rgba(var(--color-foreground),0.9)] mb-3">
								Websites & Newsletters
							</h3>
							<ul className="list-disc pl-6 space-y-2 text-[rgba(var(--color-foreground),0.8)]">
								<li>The Motley Fool</li>
								<li>Morningstar</li>
								<li>Seeking Alpha</li>
								<li>The Wall Street Journal</li>
								<li>Bloomberg</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			<div className="flex justify-center">
				<Link href="/thinking" className="neon-button-magenta">
					Explore All Articles
				</Link>
			</div>
		</div>
	)
}

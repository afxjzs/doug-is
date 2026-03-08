import Link from "next/link"
import Image from "next/image"
import { getPostsStatic } from "@/lib/supabase/data"
import { formatDate } from "@/lib/utils/index"

/**
 * Home 1 — "The Architect"
 *
 * Full-bleed hero with the NYC silhouette photo.
 * Geometric grid layout below. Monochrome + accent color.
 * Feels like a portfolio site for someone who builds things.
 */

/* Regular hexagon (pointy-top): viewBox="0 0 86.6 100", all sides equal */
const HEX_VB = "0 0 86.6 100"
const HEX_PTS = "43.3,0 86.6,25 86.6,75 43.3,100 0,75 0,25"

export default async function Home1() {
	const latestPosts = await getPostsStatic(3)
	const latestPost = latestPosts?.[0] ?? null

	return (
		<div>
			{/* Hero — true full bleed with NYC photo */}
			<section
				className="relative flex items-end overflow-hidden -mt-28"
				style={{
					marginLeft: "calc(-50vw + 50%)",
					marginRight: "calc(-50vw + 50%)",
					width: "100vw",
					height: "min(100vh, 800px)",
				}}
			>
				<div className="absolute inset-0">
					<Image
						src="/images/doug-nyc.jpg"
						alt="Doug Rogers silhouette against NYC skyline"
						fill
						className="object-cover object-center"
						priority
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-[rgb(14,14,16)] via-[rgba(14,14,16,0.4)] to-transparent" />
				</div>

				<div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-20">
					<p className="text-sm tracking-[0.3em] uppercase text-white/50 mb-4">
						Engineer / Advisor / Investor
					</p>
					<h1
						className="text-6xl md:text-8xl lg:text-9xl font-bold leading-[0.9] mb-6 text-white"
						style={{ fontFamily: "var(--font-display)" }}
					>
						Doug
						<br />
						Rogers
					</h1>
					<p className="text-lg md:text-xl text-white/70 max-w-lg">
						Been building things my whole life.
						<br />
						Now I help others build with AI.
					</p>

					{/* Scroll indicator */}
					<div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
						<span className="text-xs tracking-widest uppercase text-white/30">
							scroll
						</span>
						<div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
					</div>
				</div>
			</section>

			{/* What I Do — home-2 style cards */}
			<section className="py-24 px-6">
				<div className="max-w-6xl mx-auto">
					<h2 className="text-sm font-mono tracking-[0.3em] uppercase text-[rgba(var(--color-foreground),0.3)] mb-12">
						What I do
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-0">
						{[
							{
								title: "Advising",
								href: "/advising",
								desc: "YC and Techstars alum. I help founders avoid the mistakes I already made.",
								num: "01",
							},
							{
								title: "Building",
								href: "/building",
								desc: "Fintech, venture studios, side projects. Code is how I think.",
								num: "02",
							},
							{
								title: "Investing",
								href: "/investing",
								desc: "Founder-focused checks. I care about revenue, not pitch decks.",
								num: "03",
							},
						].map((item, i) => (
							<Link
								key={item.num}
								href={item.href}
								className={`group p-8 md:p-10 border border-[rgba(var(--color-foreground),0.06)] hover:bg-[rgba(var(--color-foreground),0.03)] transition-all duration-300 ${
									i === 0
										? "md:rounded-l-lg"
										: i === 2
											? "md:rounded-r-lg"
											: ""
								}`}
							>
								<span className="font-mono text-xs text-[rgba(var(--color-accent),0.5)] mb-4 block">
									{item.num}
								</span>
								<h3 className="text-2xl font-semibold mb-3 group-hover:text-[rgb(var(--color-accent))] transition-colors">
									{item.title}
								</h3>
								<p className="text-sm text-[rgba(var(--color-foreground),0.5)] leading-relaxed mb-6">
									{item.desc}
								</p>
								<span className="inline-flex items-center text-xs font-mono text-[rgba(var(--color-accent),0.7)] group-hover:translate-x-1 transition-transform">
									explore
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-3 w-3 ml-2"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
											clipRule="evenodd"
										/>
									</svg>
								</span>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* About strip */}
			<section className="px-6 pb-24">
				<div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
					<div className="relative aspect-square max-w-md overflow-hidden">
						<Image
							src="/images/doug-casual.jpg"
							alt="Doug Rogers"
							fill
							className="object-cover grayscale"
						/>
						{/* Geometric overlay */}
						<div className="absolute inset-0 bg-gradient-to-tr from-[rgba(var(--color-accent),0.15)] to-transparent mix-blend-overlay" />
						<svg
							className="absolute bottom-4 right-4 w-16 h-16 text-[rgba(var(--color-accent),0.3)]"
							viewBox={HEX_VB}
						>
							<polygon
								points={HEX_PTS}
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							/>
						</svg>
					</div>

					<div>
						<h2
							className="text-3xl md:text-4xl font-bold mb-6 leading-tight"
							style={{ fontFamily: "var(--font-display)" }}
						>
							I started coding before
							<br />
							startups were cool.
						</h2>
						<p className="text-[rgba(var(--color-foreground),0.7)] mb-4 leading-relaxed">
							Multiple startups, two exits, accelerators including YC and
							Techstars, a fintech company on stage at TechCrunch Disrupt.
							I've been writing code since before any of that.
						</p>
						<p className="text-[rgba(var(--color-foreground),0.7)] mb-8 leading-relaxed">
							Whatever mistake you're making at your startup right now, I
							probably made it years ago. It's not about how many mistakes
							you make. It's how many you don't make twice.
						</p>
						<Link
							href="/hustling"
							className="inline-flex items-center text-[rgb(var(--color-accent))] hover:underline"
						>
							More about me
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-4 w-4 ml-2"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
									clipRule="evenodd"
								/>
							</svg>
						</Link>
					</div>
				</div>
			</section>

			{/* Featured writing — card layout like home-2 */}
			{latestPost && (
				<section className="px-6 pb-24">
					<div className="max-w-6xl mx-auto">
						<div className="flex items-baseline justify-between mb-12">
							<h2
								className="text-3xl font-bold"
								style={{ fontFamily: "var(--font-display)" }}
							>
								Latest writing
							</h2>
							<Link
								href="/thinking"
								className="text-sm text-[rgba(var(--color-foreground),0.4)] hover:text-[rgb(var(--color-accent))] transition-colors"
							>
								View all
							</Link>
						</div>

						<div className="border border-[rgba(var(--color-foreground),0.06)] rounded-lg overflow-hidden">
							<div className="grid grid-cols-1 md:grid-cols-2">
								{latestPost.featured_image && (
									<div className="relative aspect-[16/10] md:aspect-auto">
										<Image
											src={latestPost.featured_image}
											alt={latestPost.title}
											fill
											className="object-cover"
											unoptimized
										/>
									</div>
								)}
								<div className="p-8 md:p-12 flex flex-col justify-center">
									<span className="text-xs font-mono text-[rgba(var(--color-accent),0.6)] mb-3 block">
										Latest post
									</span>
									<h3 className="text-2xl font-bold mb-3">
										{latestPost.title}
									</h3>
									{latestPost.excerpt && (
										<p className="text-sm text-[rgba(var(--color-foreground),0.5)] mb-6 line-clamp-3">
											{latestPost.excerpt}
										</p>
									)}
									<Link
										href={`/thinking/about/${latestPost.category.toLowerCase()}/${latestPost.slug}`}
										className="inline-flex items-center text-sm text-[rgb(var(--color-accent))] hover:underline"
									>
										Read post
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4 ml-1"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
												clipRule="evenodd"
											/>
										</svg>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</section>
			)}

			{/* CTA */}
			<section className="py-24 px-6">
				<div className="max-w-2xl mx-auto text-center">
					<h2
						className="text-3xl md:text-4xl font-bold mb-4"
						style={{ fontFamily: "var(--font-display)" }}
					>
						Let's talk.
					</h2>
					<p className="text-[rgba(var(--color-foreground),0.5)] mb-8">
						Building something? Got a question? Just want to compare notes?
						I'm around.
					</p>
					<Link href="/connecting" className="btn-primary inline-block">
						Get in Touch
					</Link>
				</div>
			</section>
		</div>
	)
}

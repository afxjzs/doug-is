import Link from "next/link"
import Image from "next/image"
import { getPostsStatic } from "@/lib/supabase/data"
import { formatDate } from "@/lib/utils/index"

/**
 * Home 2 — "The Terminal"
 *
 * Developer-first aesthetic. Monospace accents, code-like layout cues.
 * Geometric hexagon motif throughout.
 * Inspired by chaseai.io's clean-but-not-boring approach.
 */

/* Regular hexagon (pointy-top): viewBox="0 0 86.6 100", all sides equal */
const HEX_VB = "0 0 86.6 100"
const HEX_PTS = "43.3,0 86.6,25 86.6,75 43.3,100 0,75 0,25"

export default async function Home2() {
	const latestPosts = await getPostsStatic(3)

	return (
		<div>
			{/* Hero — split layout with B&W headshot */}
			<section className="min-h-screen flex items-center px-6 -mt-28 pt-28">
				<div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
					{/* Left — text */}
					<div>
						<div className="flex items-center gap-3 mb-8">
							<svg
								className="w-8 h-8 text-[rgb(var(--color-accent))]"
								viewBox={HEX_VB}
							>
								<polygon
									points={HEX_PTS}
									fill="none"
									stroke="currentColor"
									strokeWidth="3"
								/>
							</svg>
							<span className="text-sm font-mono text-[rgba(var(--color-foreground),0.4)] tracking-wider">
								doug.is
							</span>
						</div>

						<h1
							className="text-5xl md:text-7xl font-bold leading-[0.95] mb-6"
							style={{ fontFamily: "var(--font-display)" }}
						>
							I build things.
							<br />
							<span className="text-[rgba(var(--color-foreground),0.3)]">
								Then I help
							</span>
							<br />
							<span className="text-[rgba(var(--color-foreground),0.3)]">
								you build.
							</span>
						</h1>

						<p className="text-[rgba(var(--color-foreground),0.6)] max-w-md mb-8 leading-relaxed">
							25 years as an engineer, multiple startups with two exits,
							and now I advise the next ones. If you're building with AI
							or figuring out what to build next, we should talk.
						</p>

						<div className="flex flex-wrap gap-4">
							<Link href="/connecting" className="btn-primary">
								Get in Touch
							</Link>
							<Link href="/thinking" className="btn-secondary">
								Read My Writing
							</Link>
						</div>
					</div>

					{/* Right — B&W headshot with geometric frame */}
					<div className="relative">
						<div className="relative aspect-[3/4] max-w-md mx-auto overflow-hidden">
							<Image
								src="/images/doug-2024-cropped-compr.png"
								alt="Doug Rogers"
								fill
								className="object-cover grayscale"
								priority
							/>
						</div>
						{/* Decorative hexagons — proper proportions */}
						<svg
							className="absolute -top-6 -right-6 w-20 h-24 text-[rgba(var(--color-accent),0.2)]"
							viewBox={HEX_VB}
						>
							<polygon
								points={HEX_PTS}
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
							/>
						</svg>
						<svg
							className="absolute -bottom-4 -left-4 w-14 h-16 text-[rgba(var(--color-accent),0.15)]"
							viewBox={HEX_VB}
						>
							<polygon
								points={HEX_PTS}
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							/>
						</svg>
						<svg
							className="absolute top-1/2 -right-8 w-10 h-12 text-[rgba(var(--color-foreground),0.06)]"
							viewBox={HEX_VB}
						>
							<polygon points={HEX_PTS} fill="currentColor" />
						</svg>
					</div>
				</div>
			</section>

			{/* Credentials strip — centered */}
			<section className="border-y border-[rgba(var(--color-foreground),0.06)] py-6 px-6">
				<div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-x-2 gap-y-3 text-sm font-mono text-[rgba(var(--color-foreground),0.35)]">
					{[
						"YC Alum",
						"Techstars '24",
						"TechCrunch Disrupt",
						"2 Exits",
						"25+ Years Building",
						"Accelerator Director",
					].map((label, i, arr) => (
						<span
							key={label}
							className="whitespace-nowrap flex items-center gap-2"
						>
							{label}
							{i < arr.length - 1 && (
								<svg
									className="w-3 h-3.5 text-[rgb(var(--color-accent))] ml-1"
									viewBox={HEX_VB}
								>
									<polygon points={HEX_PTS} fill="currentColor" />
								</svg>
							)}
						</span>
					))}
				</div>
			</section>

			{/* Three pillars */}
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
								desc: "Working with founders on product, go-to-market, and enterprise sales. I've sat in the meetings you're about to have.",
								num: "01",
							},
							{
								title: "Building",
								href: "/building",
								desc: "DubPrime (fintech, Techstars '24), VentureBuilder (venture studio), and side projects when I can't sleep.",
								num: "02",
							},
							{
								title: "Investing",
								href: "/investing",
								desc: "Small checks into founders with real revenue. I've been on both sides of the table.",
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

			{/* Writing — card style */}
			{latestPosts.length > 0 && (
				<section className="px-6 pb-24">
					<div className="max-w-6xl mx-auto">
						<div className="flex items-baseline justify-between mb-10">
							<h2
								className="text-2xl font-bold"
								style={{ fontFamily: "var(--font-display)" }}
							>
								Writing
							</h2>
							<Link
								href="/thinking"
								className="font-mono text-xs text-[rgba(var(--color-foreground),0.3)] hover:text-[rgb(var(--color-accent))] transition-colors tracking-wider"
							>
								ALL POSTS
							</Link>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{latestPosts.map((post) => (
								<Link
									key={post.id}
									href={`/thinking/about/${post.category.toLowerCase()}/${post.slug}`}
									className="group rounded-lg border border-[rgba(var(--color-foreground),0.06)] overflow-hidden hover:border-[rgba(var(--color-foreground),0.12)] transition-all duration-300"
								>
									{post.featured_image && (
										<div className="w-full h-48 overflow-hidden">
											<Image
												src={post.featured_image}
												alt={post.title}
												width={400}
												height={200}
												className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
												unoptimized
											/>
										</div>
									)}
									<div className="p-5">
										<div className="flex items-center gap-3 mb-3">
											<span className="font-mono text-xs text-[rgba(var(--color-foreground),0.2)] uppercase tracking-wider">
												{post.category}
											</span>
											<span className="text-[rgba(var(--color-foreground),0.15)]">·</span>
											<time className="font-mono text-xs text-[rgba(var(--color-foreground),0.3)]">
												{post.published_at ? formatDate(post.published_at) : ""}
											</time>
										</div>
										<h3 className="text-lg font-semibold group-hover:text-[rgb(var(--color-accent))] transition-colors leading-snug">
											{post.title}
										</h3>
									</div>
								</Link>
							))}
						</div>
					</div>
				</section>
			)}

			{/* Bottom CTA with hexagon pattern background */}
			<section className="relative py-24 px-6 overflow-hidden">
				{/* Hexagon pattern background — more visible */}
				<div className="absolute inset-0 opacity-[0.08]">
					<svg
						className="w-full h-full text-[rgb(var(--color-accent))]"
						xmlns="http://www.w3.org/2000/svg"
					>
						<defs>
							<pattern
								id="hex-pattern-2"
								x="0"
								y="0"
								width="52"
								height="60"
								patternUnits="userSpaceOnUse"
							>
								<polygon
									points="26,0 52,15 52,45 26,60 0,45 0,15"
									fill="none"
									stroke="currentColor"
									strokeWidth="1"
								/>
							</pattern>
						</defs>
						<rect
							width="100%"
							height="100%"
							fill="url(#hex-pattern-2)"
						/>
					</svg>
				</div>

				<div className="relative z-10 max-w-2xl mx-auto text-center">
					<svg
						className="w-10 h-12 mx-auto mb-6 text-[rgba(var(--color-accent),0.4)]"
						viewBox={HEX_VB}
					>
						<polygon
							points={HEX_PTS}
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						/>
					</svg>
					<h2
						className="text-3xl font-bold mb-4"
						style={{ fontFamily: "var(--font-display)" }}
					>
						Let's connect.
					</h2>
					<p className="text-[rgba(var(--color-foreground),0.5)] mb-8">
						Building something? Thinking about it? I'm around.
					</p>
					<Link href="/connecting" className="btn-primary inline-block">
						Get in Touch
					</Link>
				</div>
			</section>
		</div>
	)
}

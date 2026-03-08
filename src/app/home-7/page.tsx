import Link from "next/link"
import Image from "next/image"
import { getPostsStatic } from "@/lib/supabase/data"
import { formatDate } from "@/lib/utils/index"
import { ParallaxHexagons } from "@/components/ParallaxHexagons"

/**
 * Home 7 — "The Split"
 *
 * Horizontal split-screen: left side is fixed dark panel with name/nav,
 * right side scrolls with content. Think portfolio meets personal site.
 * Uses CSS sticky positioning for the left panel effect.
 * B&W photos throughout, accent color sparingly.
 */

const HEX_VB = "0 0 86.6 100"
const HEX_PTS = "43.3,0 86.6,25 86.6,75 43.3,100 0,75 0,25"

export default async function Home7() {
	const latestPosts = await getPostsStatic(3)

	return (
		<div className="-mt-28">
			<ParallaxHexagons />

			<div className="lg:grid lg:grid-cols-5 min-h-screen relative z-10">
				{/* Left panel — sticky on desktop */}
				<div className="lg:col-span-2 lg:sticky lg:top-0 lg:h-screen flex flex-col justify-between p-8 md:p-12 lg:p-16 pt-28 lg:pt-16 border-r border-[rgba(var(--color-foreground),0.06)]">
					<div>
						<div className="relative w-24 h-24 overflow-hidden rounded-full mb-8 border border-[rgba(var(--color-foreground),0.1)]">
							<Image
								src="/images/doug-2024-cropped-compr.png"
								alt="Doug Rogers"
								fill
								className="object-cover grayscale"
								priority
							/>
						</div>

						<h1
							className="text-4xl lg:text-5xl font-bold leading-[0.95] mb-4"
							style={{ fontFamily: "var(--font-display)" }}
						>
							Doug
							<br />
							Rogers
						</h1>

						<p className="text-[rgba(var(--color-foreground),0.5)] mb-8 leading-relaxed max-w-xs">
							Engineer, advisor, investor. 25 years turning ideas into products
							that people actually use.
						</p>

						<nav className="flex flex-row lg:flex-col gap-4 mb-8">
							{[
								{ label: "Advising", href: "/advising" },
								{ label: "Building", href: "/building" },
								{ label: "Investing", href: "/investing" },
								{ label: "Writing", href: "/thinking" },
							].map((item) => (
								<Link
									key={item.label}
									href={item.href}
									className="text-sm text-[rgba(var(--color-foreground),0.4)] hover:text-[rgb(var(--color-accent))] transition-colors flex items-center gap-2"
								>
									<svg className="w-2.5 h-3 text-[rgb(var(--color-accent))]" viewBox={HEX_VB}>
										<polygon points={HEX_PTS} fill="currentColor" />
									</svg>
									{item.label}
								</Link>
							))}
						</nav>
					</div>

					<div className="hidden lg:block">
						<Link
							href="/connecting"
							className="btn-primary inline-block text-sm"
						>
							Get in Touch
						</Link>
						<p className="text-xs text-[rgba(var(--color-foreground),0.3)] mt-4">
							East Bay, CA
						</p>
					</div>
				</div>

				{/* Right panel — scrolls */}
				<div className="lg:col-span-3 pt-8 lg:pt-28">
					{/* Hero statement */}
					<section className="px-8 md:px-12 pb-24 border-b border-[rgba(var(--color-foreground),0.06)]">
						<h2
							className="text-3xl md:text-5xl font-bold leading-[1.05] mb-8"
							style={{ fontFamily: "var(--font-display)" }}
						>
							I've been on both sides
							<br />
							of every startup table.
							<br />
							<span className="text-[rgb(var(--color-accent))]">
								Yours isn't that different.
							</span>
						</h2>

						<div className="relative aspect-[2/1] overflow-hidden rounded-lg mb-8">
							<Image
								src="/images/doug-nyc.jpg"
								alt="NYC skyline"
								fill
								className="object-cover"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.4)] to-transparent" />
						</div>

						<div className="grid grid-cols-3 gap-6 text-center">
							{[
								{ num: "2", label: "Exits" },
								{ num: "25+", label: "Years building" },
								{ num: "YC", label: "+ Techstars" },
							].map((stat) => (
								<div key={stat.label}>
									<span className="text-3xl font-bold text-[rgb(var(--color-accent))]">
										{stat.num}
									</span>
									<p className="text-xs text-[rgba(var(--color-foreground),0.4)] mt-1">
										{stat.label}
									</p>
								</div>
							))}
						</div>
					</section>

					{/* What I do */}
					<section className="px-8 md:px-12 py-24 border-b border-[rgba(var(--color-foreground),0.06)]">
						<h3 className="text-sm font-mono tracking-[0.3em] uppercase text-[rgba(var(--color-foreground),0.3)] mb-10">
							What I do
						</h3>

						{[
							{
								title: "Advising",
								href: "/advising",
								desc: "Working with founders on enterprise sales, corporate partnerships, and the operational stuff that nobody warns you about.",
							},
							{
								title: "Building",
								href: "/building",
								desc: "Co-founder at DubPrime (fintech, Techstars '24). Director at VentureBuilder. I excel at taking an idea from zero to a product customers pay for.",
							},
							{
								title: "Investing",
								href: "/investing",
								desc: "Founder checks. I write small, get involved, and care more about whether you have paying customers than how your deck looks.",
							},
						].map((item, i) => (
							<Link
								key={item.title}
								href={item.href}
								className="group block py-8 border-b border-[rgba(var(--color-foreground),0.04)] last:border-0"
							>
								<div className="flex items-start gap-4">
									<span className="font-mono text-xs text-[rgba(var(--color-accent),0.5)] mt-2">
										0{i + 1}
									</span>
									<div>
										<h4 className="text-2xl font-bold mb-2 group-hover:text-[rgb(var(--color-accent))] transition-colors" style={{ fontFamily: "var(--font-display)" }}>
											{item.title}
										</h4>
										<p className="text-sm text-[rgba(var(--color-foreground),0.5)] leading-relaxed max-w-lg">
											{item.desc}
										</p>
									</div>
								</div>
							</Link>
						))}
					</section>

					{/* Writing */}
					{latestPosts.length > 0 && (
						<section className="px-8 md:px-12 py-24 border-b border-[rgba(var(--color-foreground),0.06)]">
							<div className="flex items-baseline justify-between mb-10">
								<h3 className="text-sm font-mono tracking-[0.3em] uppercase text-[rgba(var(--color-foreground),0.3)]">
									Writing
								</h3>
								<Link href="/thinking" className="font-mono text-xs text-[rgba(var(--color-foreground),0.3)] hover:text-[rgb(var(--color-accent))] transition-colors tracking-wider">
									ALL ARTICLES
								</Link>
							</div>

							<div className="space-y-8">
								{latestPosts.map((post) => (
									<Link
										key={post.id}
										href={`/thinking/about/${post.category.toLowerCase()}/${post.slug}`}
										className="group block"
									>
										{post.featured_image && (
											<div className="relative aspect-[2.5/1] overflow-hidden rounded-lg mb-4">
												<Image
													src={post.featured_image}
													alt={post.title}
													fill
													className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
													unoptimized
												/>
											</div>
										)}
										<div className="flex items-center gap-4 mb-2">
											<time className="font-mono text-xs text-[rgba(var(--color-foreground),0.3)]">
												{post.published_at ? formatDate(post.published_at) : ""}
											</time>
											<span className="font-mono text-xs text-[rgba(var(--color-foreground),0.2)] uppercase tracking-wider">
												{post.category}
											</span>
										</div>
										<h4 className="text-xl font-semibold group-hover:text-[rgb(var(--color-accent))] transition-colors">
											{post.title}
										</h4>
										{post.excerpt && (
											<p className="text-sm text-[rgba(var(--color-foreground),0.4)] mt-2 line-clamp-2">
												{post.excerpt}
											</p>
										)}
									</Link>
								))}
							</div>
						</section>
					)}

					{/* Quote */}
					<section className="px-8 md:px-12 py-24">
						<blockquote
							className="text-2xl md:text-3xl font-bold leading-snug text-[rgba(var(--color-foreground),0.7)] mb-4"
							style={{ fontFamily: "var(--font-display)" }}
						>
							"It's not how many mistakes you make.
							It's how many you don't make twice."
						</blockquote>
						<div className="flex items-center gap-3">
							<div className="w-8 h-px bg-[rgba(var(--color-accent),0.3)]" />
							<span className="text-xs text-[rgba(var(--color-foreground),0.3)]">
								Something I keep telling myself
							</span>
						</div>
					</section>

					{/* Mobile CTA */}
					<section className="lg:hidden px-8 md:px-12 py-12 border-t border-[rgba(var(--color-foreground),0.06)]">
						<Link href="/connecting" className="btn-primary inline-block">
							Get in Touch
						</Link>
					</section>
				</div>
			</div>
		</div>
	)
}

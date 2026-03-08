import Link from "next/link"
import Image from "next/image"
import { getPostsStatic } from "@/lib/supabase/data"
import { formatDate } from "@/lib/utils/index"

/**
 * Home 3 — "The Manifesto"
 *
 * Bold, editorial, opinionated. Big type. Statement-driven.
 * NYC skyline as visible background texture.
 * Asymmetric layout. Magazine cover energy.
 */

const HEX_VB = "0 0 86.6 100"
const HEX_PTS = "43.3,0 86.6,25 86.6,75 43.3,100 0,75 0,25"

export default async function Home3() {
	const latestPosts = await getPostsStatic(3)

	return (
		<div>
			{/* Hero — full-bleed NYC photo */}
			<section
				className="relative flex flex-col justify-end overflow-hidden -mt-28"
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
						alt=""
						fill
						className="object-cover"
						priority
						aria-hidden="true"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-[rgb(14,14,16)] via-[rgba(14,14,16,0.5)] to-transparent" />
				</div>

				<div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-20">
					<p className="text-sm tracking-[0.3em] uppercase text-white/50 mb-4">
						Engineer / Advisor / Investor
					</p>
					<h1
						className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-6 text-white"
						style={{ fontFamily: "var(--font-display)" }}
					>
						Doug Rogers
					</h1>
					<p className="text-lg md:text-xl text-white/70 max-w-lg mb-8">
						I turn half-formed ideas into working products. I've done it
						for myself and now I help other founders do the same.
					</p>
					<div className="flex gap-4">
						<Link href="/advising" className="btn-primary">
							Work with Me
						</Link>
						<Link href="/thinking" className="btn-secondary">
							Read My Writing
						</Link>
					</div>
				</div>
			</section>

			{/* Photo + quote band */}
			<section className="bg-[rgba(var(--color-foreground),0.02)] border-y border-[rgba(var(--color-foreground),0.05)]">
				<div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5">
					<div className="md:col-span-2 relative min-h-[400px]">
						<Image
							src="/images/doug-casual.jpg"
							alt="Doug Rogers"
							fill
							className="object-cover"
						/>
					</div>

					<div className="md:col-span-3 p-10 md:p-16 flex flex-col justify-center">
						<blockquote
							className="text-xl md:text-2xl leading-relaxed mb-6 text-[rgba(var(--color-foreground),0.8)]"
							style={{ fontFamily: "var(--font-display)" }}
						>
							"It's not how many mistakes you make. It's how many you
							don't make twice."
						</blockquote>
					</div>
				</div>
			</section>

			{/* What I do — asymmetric cards */}
			<section className="py-24 px-6">
				<div className="max-w-6xl mx-auto">
					<div className="grid grid-cols-12 gap-6">
						<Link
							href="/advising"
							className="col-span-12 md:col-span-5 group border border-[rgba(var(--color-foreground),0.06)] rounded-lg p-8 md:p-10 hover:border-[rgba(var(--color-accent),0.2)] transition-all duration-300 flex flex-col"
						>
							<div className="flex items-center gap-3 mb-auto">
								<svg
									className="w-5 h-6 text-[rgba(var(--color-accent),0.4)]"
									viewBox={HEX_VB}
								>
									<polygon
										points={HEX_PTS}
										fill="none"
										stroke="currentColor"
										strokeWidth="3"
									/>
								</svg>
								<span className="font-mono text-xs text-[rgba(var(--color-foreground),0.3)]">
									01
								</span>
							</div>
							<div className="mt-12">
								<h3
									className="text-3xl font-bold mb-3 group-hover:text-[rgb(var(--color-accent))] transition-colors"
									style={{ fontFamily: "var(--font-display)" }}
								>
									Advising
								</h3>
								<p className="text-[rgba(var(--color-foreground),0.5)] leading-relaxed">
									I work with founders on the stuff nobody teaches you:
									enterprise sales, navigating corporate partners, when
									to raise vs. bootstrap, and how to not lose your mind
									in the process.
								</p>
							</div>
						</Link>

						<div className="col-span-12 md:col-span-7 flex flex-col gap-6">
							<Link
								href="/building"
								className="group border border-[rgba(var(--color-foreground),0.06)] rounded-lg p-8 md:p-10 hover:border-[rgba(var(--color-accent),0.2)] transition-all duration-300"
							>
								<div className="flex items-center gap-3 mb-6">
									<svg
										className="w-5 h-6 text-[rgba(var(--color-accent),0.4)]"
										viewBox={HEX_VB}
									>
										<polygon
											points={HEX_PTS}
											fill="none"
											stroke="currentColor"
											strokeWidth="3"
										/>
									</svg>
									<span className="font-mono text-xs text-[rgba(var(--color-foreground),0.3)]">
										02
									</span>
								</div>
								<h3
									className="text-3xl font-bold mb-3 group-hover:text-[rgb(var(--color-accent))] transition-colors"
									style={{ fontFamily: "var(--font-display)" }}
								>
									Building
								</h3>
								<p className="text-[rgba(var(--color-foreground),0.5)] leading-relaxed">
									Co-founder and CTO at DubPrime (fintech, Techstars
									'24). Director of Pilots at VentureBuilder. Plus a
									handful of side projects because I can't help myself.
								</p>
							</Link>

							<Link
								href="/investing"
								className="group border border-[rgba(var(--color-foreground),0.06)] rounded-lg p-8 md:p-10 hover:border-[rgba(var(--color-accent),0.2)] transition-all duration-300"
							>
								<div className="flex items-center gap-3 mb-6">
									<svg
										className="w-5 h-6 text-[rgba(var(--color-accent),0.4)]"
										viewBox={HEX_VB}
									>
										<polygon
											points={HEX_PTS}
											fill="none"
											stroke="currentColor"
											strokeWidth="3"
										/>
									</svg>
									<span className="font-mono text-xs text-[rgba(var(--color-foreground),0.3)]">
										03
									</span>
								</div>
								<h3
									className="text-3xl font-bold mb-3 group-hover:text-[rgb(var(--color-accent))] transition-colors"
									style={{ fontFamily: "var(--font-display)" }}
								>
									Investing
								</h3>
								<p className="text-[rgba(var(--color-foreground),0.5)] leading-relaxed">
									Founder checks. I write small, get involved, and care
									more about whether you have customers than how good
									your deck looks.
								</p>
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Latest writing — card style */}
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
								ALL ARTICLES
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

			{/* CTA — minimal */}
			<section className="border-t border-[rgba(var(--color-foreground),0.06)] py-20 px-6">
				<div className="max-w-6xl mx-auto grid grid-cols-12">
					<div className="col-span-12 md:col-start-3 md:col-span-8 flex flex-col md:flex-row items-center justify-between gap-6">
						<div>
							<h2
								className="text-2xl font-bold mb-1"
								style={{ fontFamily: "var(--font-display)" }}
							>
								Want to talk?
							</h2>
							<p className="text-sm text-[rgba(var(--color-foreground),0.4)]">
								I'm in the East Bay. Mostly async, always responsive.
							</p>
						</div>
						<Link
							href="/connecting"
							className="btn-primary whitespace-nowrap"
						>
							Get in Touch
						</Link>
					</div>
				</div>
			</section>
		</div>
	)
}

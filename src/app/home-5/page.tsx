import Link from "next/link"
import Image from "next/image"
import { getPostsStatic } from "@/lib/supabase/data"
import { formatDate } from "@/lib/utils/index"
import { ParallaxHexagons } from "@/components/ParallaxHexagons"

/**
 * Home 5 — "Low Poly"
 *
 * Geometric low-poly SVG background (not fixed — contained).
 * Glassmorphism cards. Parallax hexagons.
 * Card-style article section with B&W photos.
 */

const HEX_VB = "0 0 86.6 100"
const HEX_PTS = "43.3,0 86.6,25 86.6,75 43.3,100 0,75 0,25"

function LowPolyBg() {
	return (
		<svg
			className="absolute inset-0 w-full h-full"
			viewBox="0 0 1200 800"
			preserveAspectRatio="xMidYMid slice"
			xmlns="http://www.w3.org/2000/svg"
		>
			<polygon points="0,0 200,0 100,120" fill="rgba(20,20,28,1)" />
			<polygon points="200,0 400,0 300,100" fill="rgba(22,22,32,1)" />
			<polygon points="400,0 600,0 500,130" fill="rgba(18,18,26,1)" />
			<polygon points="600,0 800,0 700,110" fill="rgba(24,24,34,1)" />
			<polygon points="800,0 1000,0 900,120" fill="rgba(20,20,30,1)" />
			<polygon points="1000,0 1200,0 1100,100" fill="rgba(22,22,28,1)" />
			<polygon points="0,0 100,120 0,200" fill="rgba(24,24,35,1)" />
			<polygon points="200,0 100,120 300,100" fill="rgba(18,22,35,1)" />
			<polygon points="400,0 300,100 500,130" fill="rgba(22,22,38,1)" />
			<polygon points="600,0 500,130 700,110" fill="rgba(20,24,36,1)" />
			<polygon points="800,0 700,110 900,120" fill="rgba(24,20,32,1)" />
			<polygon points="1000,0 900,120 1100,100" fill="rgba(18,18,30,1)" />
			<polygon points="1200,0 1100,100 1200,180" fill="rgba(22,24,34,1)" />
			<polygon points="0,200 100,120 200,250" fill="rgba(22,26,40,1)" />
			<polygon points="100,120 300,100 200,250" fill="rgba(26,28,42,1)" />
			<polygon points="300,100 500,130 400,280" fill="rgba(20,24,38,1)" />
			<polygon points="500,130 700,110 600,300" fill="rgba(24,28,44,1)" />
			<polygon points="700,110 900,120 800,290" fill="rgba(22,22,36,1)" />
			<polygon points="900,120 1100,100 1000,260" fill="rgba(26,24,38,1)" />
			<polygon points="1100,100 1200,180 1200,300" fill="rgba(20,22,34,1)" />
			<polygon points="0,200 200,250 100,400" fill="rgba(24,30,46,1)" />
			<polygon points="200,250 400,280 300,420" fill="rgba(28,32,48,1)" />
			<polygon points="400,280 600,300 500,440" fill="rgba(22,28,44,1)" />
			<polygon points="600,300 800,290 700,450" fill="rgba(26,30,50,1)" />
			<polygon points="800,290 1000,260 900,430" fill="rgba(24,26,42,1)" />
			<polygon points="1000,260 1200,300 1100,400" fill="rgba(28,28,44,1)" />
			<polygon points="0,400 100,400 0,550" fill="rgba(26,32,50,1)" />
			<polygon points="100,400 300,420 200,540" fill="rgba(22,28,46,1)" />
			<polygon points="300,420 500,440 400,560" fill="rgba(28,34,52,1)" />
			<polygon points="500,440 700,450 600,580" fill="rgba(24,30,48,1)" />
			<polygon points="700,450 900,430 800,570" fill="rgba(26,28,44,1)" />
			<polygon points="900,430 1100,400 1000,550" fill="rgba(22,26,42,1)" />
			<polygon points="1100,400 1200,300 1200,520" fill="rgba(28,30,46,1)" />
			<polygon points="0,550 200,540 100,700" fill="rgba(20,26,42,1)" />
			<polygon points="200,540 400,560 300,700" fill="rgba(24,28,44,1)" />
			<polygon points="400,560 600,580 500,720" fill="rgba(22,30,48,1)" />
			<polygon points="600,580 800,570 700,730" fill="rgba(26,32,50,1)" />
			<polygon points="800,570 1000,550 900,710" fill="rgba(20,24,40,1)" />
			<polygon points="1000,550 1200,520 1100,690" fill="rgba(24,28,44,1)" />
			<polygon points="0,550 0,800 100,700" fill="rgba(18,22,36,1)" />
			<polygon points="100,700 300,700 200,800" fill="rgba(22,26,40,1)" />
			<polygon points="300,700 500,720 400,800" fill="rgba(20,24,38,1)" />
			<polygon points="500,720 700,730 600,800" fill="rgba(24,28,42,1)" />
			<polygon points="700,730 900,710 800,800" fill="rgba(18,22,36,1)" />
			<polygon points="900,710 1100,690 1000,800" fill="rgba(22,26,40,1)" />
			<polygon points="1100,690 1200,520 1200,800" fill="rgba(20,24,38,1)" />
			<line x1="100" y1="120" x2="300" y2="100" stroke="rgba(74,158,229,0.08)" strokeWidth="1" />
			<line x1="500" y1="130" x2="700" y2="110" stroke="rgba(74,158,229,0.06)" strokeWidth="1" />
			<line x1="600" y1="300" x2="800" y2="290" stroke="rgba(74,158,229,0.07)" strokeWidth="1" />
		</svg>
	)
}

function GlassCard({
	children,
	className = "",
	href,
}: {
	children: React.ReactNode
	className?: string
	href?: string
}) {
	const inner = (
		<div
			className={`rounded-2xl border border-[rgba(255,255,255,0.06)] p-8 transition-all duration-300 ${className}`}
			style={{
				background: "rgba(255,255,255,0.03)",
				backdropFilter: "blur(12px)",
				WebkitBackdropFilter: "blur(12px)",
			}}
		>
			{children}
		</div>
	)
	if (href) {
		return (
			<Link href={href} className="group block">
				{inner}
			</Link>
		)
	}
	return inner
}

export default async function Home5() {
	const latestPosts = await getPostsStatic(3)
	const latestPost = latestPosts?.[0] ?? null

	return (
		<div className="-mt-28 relative min-h-screen">
			{/* Low-poly background — full width, absolute */}
			<div
				className="absolute top-0 left-0 right-0 -z-10 overflow-hidden"
				style={{
					marginLeft: "calc(-50vw + 50%)",
					marginRight: "calc(-50vw + 50%)",
					width: "100vw",
					height: "100%",
				}}
			>
				<LowPolyBg />
			</div>

			<ParallaxHexagons />

			{/* Hero */}
			<section className="min-h-screen flex items-center px-6 pt-28 relative z-10">
				<div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
					<div>
						<div className="flex items-center gap-3 mb-8">
							<svg className="w-8 h-10 text-[rgb(var(--color-accent))]" viewBox={HEX_VB}>
								<polygon points={HEX_PTS} fill="none" stroke="currentColor" strokeWidth="3" />
							</svg>
							<span className="text-sm font-mono text-[rgba(var(--color-foreground),0.4)] tracking-wider">
								DOUG ROGERS
							</span>
						</div>

						<h1
							className="text-5xl md:text-7xl font-bold leading-[0.95] mb-6"
							style={{ fontFamily: "var(--font-display)" }}
						>
							Ideas to products.
							<br />
							<span className="text-[rgb(var(--color-accent))]">
								Zero to one.
							</span>
						</h1>

						<p className="text-[rgba(var(--color-foreground),0.5)] max-w-md mb-8 leading-relaxed">
							25 years turning ideas into working products. Multiple
							startups, two exits, YC and Techstars. I help founders who
							need someone in their corner who's already been through it.
						</p>

						<div className="flex flex-wrap gap-4">
							<Link
								href="/connecting"
								className="px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-[rgba(74,158,229,0.2)]"
								style={{ background: "rgba(74,158,229,0.9)", backdropFilter: "blur(8px)" }}
							>
								Get in Touch
							</Link>
							<Link
								href="/thinking"
								className="px-6 py-3 rounded-xl font-medium transition-all duration-300"
								style={{
									background: "rgba(255,255,255,0.05)",
									backdropFilter: "blur(8px)",
									border: "1px solid rgba(255,255,255,0.1)",
									color: "rgba(var(--color-foreground),0.7)",
								}}
							>
								Read My Writing
							</Link>
						</div>
					</div>

					{/* Photo in glass frame */}
					<div className="relative">
						<div
							className="relative aspect-[3/4] max-w-md mx-auto overflow-hidden rounded-2xl"
							style={{ border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}
						>
							<Image src="/images/doug-nyc.jpg" alt="Doug Rogers — NYC skyline" fill className="object-cover" priority />
							<div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.5)] to-transparent" />
							<div className="absolute bottom-6 left-6 right-6">
								<p className="text-white text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>
									"It's not how many mistakes you make. It's how many you don't make twice."
								</p>
							</div>
						</div>
						<div
							className="absolute -top-4 -right-4 w-20 h-24 rounded-xl flex items-center justify-center"
							style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.08)" }}
						>
							<svg className="w-10 h-12 text-[rgba(74,158,229,0.4)]" viewBox={HEX_VB}>
								<polygon points={HEX_PTS} fill="none" stroke="currentColor" strokeWidth="2" />
							</svg>
						</div>
					</div>
				</div>
			</section>

			{/* What I Do — glass cards */}
			<section className="py-24 px-6 relative z-10">
				<div className="max-w-6xl mx-auto">
					<h2 className="text-sm font-mono tracking-[0.3em] uppercase text-[rgba(var(--color-foreground),0.3)] mb-12">
						What I do
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{[
							{ title: "Advising", href: "/advising", desc: "Enterprise sales, corporate partnerships, when to raise vs. bootstrap. The stuff they don't teach you.", num: "01" },
							{ title: "Building", href: "/building", desc: "DubPrime (fintech), VentureBuilder (venture studio), and whatever side project is keeping me up this week.", num: "02" },
							{ title: "Investing", href: "/investing", desc: "Small checks into founders with paying customers. I've been on both sides of that table.", num: "03" },
						].map((item) => (
							<GlassCard key={item.num} href={item.href} className="hover:border-[rgba(74,158,229,0.15)] hover:bg-[rgba(255,255,255,0.05)]">
								<div className="flex items-center gap-3 mb-6">
									<svg className="w-5 h-6 text-[rgba(var(--color-accent),0.5)]" viewBox={HEX_VB}>
										<polygon points={HEX_PTS} fill="none" stroke="currentColor" strokeWidth="3" />
									</svg>
									<span className="font-mono text-xs text-[rgba(var(--color-foreground),0.3)]">{item.num}</span>
								</div>
								<h3 className="text-2xl font-bold mb-3 group-hover:text-[rgb(var(--color-accent))] transition-colors" style={{ fontFamily: "var(--font-display)" }}>
									{item.title}
								</h3>
								<p className="text-sm text-[rgba(var(--color-foreground),0.5)] leading-relaxed">{item.desc}</p>
							</GlassCard>
						))}
					</div>
				</div>
			</section>

			{/* Writing — card layout with B&W featured image */}
			{latestPost && (
				<section className="px-6 pb-24 relative z-10">
					<div className="max-w-6xl mx-auto">
						<div className="flex items-baseline justify-between mb-10">
							<h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Writing</h2>
							<Link href="/thinking" className="font-mono text-xs text-[rgba(var(--color-foreground),0.3)] hover:text-[rgb(var(--color-accent))] transition-colors tracking-wider">
								ALL ARTICLES
							</Link>
						</div>

						<GlassCard>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
								{latestPost.featured_image && (
									<div className="relative aspect-[16/10] overflow-hidden rounded-xl">
										<Image src={latestPost.featured_image} alt={latestPost.title} fill className="object-cover grayscale" unoptimized />
									</div>
								)}
								<div className="flex flex-col justify-center">
									<span className="text-xs font-mono text-[rgba(var(--color-accent),0.6)] mb-3 block">Latest article</span>
									<h3 className="text-2xl font-bold mb-3">{latestPost.title}</h3>
									{latestPost.excerpt && (
										<p className="text-sm text-[rgba(var(--color-foreground),0.5)] mb-6 line-clamp-3">{latestPost.excerpt}</p>
									)}
									<Link
										href={`/thinking/about/${latestPost.category.toLowerCase()}/${latestPost.slug}`}
										className="inline-flex items-center text-sm text-[rgb(var(--color-accent))] hover:underline"
									>
										Read article
										<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
											<path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
										</svg>
									</Link>
								</div>
							</div>
						</GlassCard>
					</div>
				</section>
			)}

			{/* CTA */}
			<section className="px-6 pb-24 relative z-10">
				<div className="max-w-2xl mx-auto text-center">
					<GlassCard>
						<svg className="w-10 h-12 mx-auto mb-6 text-[rgba(var(--color-accent),0.3)]" viewBox={HEX_VB}>
							<polygon points={HEX_PTS} fill="none" stroke="currentColor" strokeWidth="2" />
						</svg>
						<h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Let's connect.</h2>
						<p className="text-[rgba(var(--color-foreground),0.5)] mb-8">Building something? Thinking about it? I'm around.</p>
						<Link
							href="/connecting"
							className="px-6 py-3 rounded-xl font-semibold text-white inline-block transition-all duration-300 hover:shadow-lg hover:shadow-[rgba(74,158,229,0.2)]"
							style={{ background: "rgba(74,158,229,0.9)", backdropFilter: "blur(8px)" }}
						>
							Get in Touch
						</Link>
					</GlassCard>
				</div>
			</section>
		</div>
	)
}

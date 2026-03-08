"use client"

import Link from "next/link"
import Image from "next/image"
import { ParallaxHexagons } from "@/components/ParallaxHexagons"

/**
 * Home 6 — "The Marquee"
 *
 * Infinite-scrolling credential ticker, clip-path hero image,
 * mix-blend-mode text overlay. CSS-only marquee animation.
 * Bold, editorial, a bit confrontational in a good way.
 */

const HEX_VB = "0 0 86.6 100"
const HEX_PTS = "43.3,0 86.6,25 86.6,75 43.3,100 0,75 0,25"

const CREDENTIALS = [
	"YC Alum",
	"Techstars '24",
	"2 Exits",
	"TechCrunch Disrupt",
	"25+ Years Building",
	"Accelerator Director",
	"Fintech",
	"Venture Studio",
	"Enterprise Sales",
	"0 → 1 Specialist",
]

export default function Home6() {
	return (
		<div className="-mt-28">
			<ParallaxHexagons />

			<style
				dangerouslySetInnerHTML={{
					__html: `
				@keyframes marquee {
					0% { transform: translateX(0); }
					100% { transform: translateX(-50%); }
				}
				@keyframes marquee-reverse {
					0% { transform: translateX(-50%); }
					100% { transform: translateX(0); }
				}
				.marquee-track { animation: marquee 30s linear infinite; }
				.marquee-track-reverse { animation: marquee-reverse 35s linear infinite; }
				@keyframes reveal-up {
					from { opacity: 0; transform: translateY(40px); }
					to { opacity: 1; transform: translateY(0); }
				}
				.reveal { animation: reveal-up 0.8s ease-out both; }
				.reveal-delay-1 { animation-delay: 0.15s; }
				.reveal-delay-2 { animation-delay: 0.3s; }
				.reveal-delay-3 { animation-delay: 0.45s; }
			`,
				}}
			/>

			{/* Hero — NYC image with clip-path diagonal and text overlay */}
			<section className="relative min-h-screen flex items-center overflow-hidden">
				{/* Background image with diagonal clip */}
				<div
					className="absolute inset-0"
					style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)" }}
				>
					<Image
						src="/images/doug-nyc.jpg"
						alt="NYC skyline"
						fill
						className="object-cover"
						priority
					/>
					<div className="absolute inset-0 bg-[rgba(14,14,16,0.65)]" />
				</div>

				<div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 w-full">
					<div className="max-w-3xl reveal">
						<h1
							className="text-6xl md:text-8xl lg:text-[9rem] font-bold leading-[0.85] mb-8 text-white"
							style={{ fontFamily: "var(--font-display)" }}
						>
							Doug
							<br />
							Rogers
						</h1>
					</div>
					<div className="max-w-lg reveal reveal-delay-1">
						<p className="text-xl md:text-2xl text-white/70 mb-8 leading-relaxed">
							I turn half-formed ideas into working products.
							I've done it for myself and now I help other founders do the same.
						</p>
					</div>
					<div className="flex flex-wrap gap-4 reveal reveal-delay-2">
						<Link
							href="/connecting"
							className="px-8 py-4 text-lg font-semibold text-[rgb(14,14,16)] bg-white rounded-none hover:bg-white/90 transition-colors"
						>
							Get in Touch
						</Link>
						<Link
							href="/thinking"
							className="px-8 py-4 text-lg font-medium text-white border-2 border-white/30 rounded-none hover:border-white/60 transition-colors"
						>
							Read My Writing
						</Link>
					</div>
				</div>
			</section>

			{/* Marquee credential ticker — two rows, opposite directions */}
			<section className="py-8 overflow-hidden border-y border-[rgba(var(--color-foreground),0.06)] relative z-10 bg-[rgb(var(--color-background))]">
				<div className="flex whitespace-nowrap mb-4">
					<div className="marquee-track flex gap-8 items-center">
						{[...CREDENTIALS, ...CREDENTIALS].map((cred, i) => (
							<span
								key={i}
								className="flex items-center gap-3 text-sm font-mono text-[rgba(var(--color-foreground),0.4)]"
							>
								<svg className="w-3 h-3.5 text-[rgb(var(--color-accent))]" viewBox={HEX_VB}>
									<polygon points={HEX_PTS} fill="currentColor" />
								</svg>
								{cred}
							</span>
						))}
					</div>
				</div>
				<div className="flex whitespace-nowrap">
					<div className="marquee-track-reverse flex gap-8 items-center">
						{[...CREDENTIALS.slice().reverse(), ...CREDENTIALS.slice().reverse()].map(
							(cred, i) => (
								<span
									key={i}
									className="flex items-center gap-3 text-sm font-mono text-[rgba(var(--color-foreground),0.25)]"
								>
									<svg className="w-3 h-3.5 text-[rgba(var(--color-accent),0.5)]" viewBox={HEX_VB}>
										<polygon points={HEX_PTS} fill="currentColor" />
									</svg>
									{cred}
								</span>
							)
						)}
					</div>
				</div>
			</section>

			{/* What I do — big text left, cards right */}
			<section className="py-24 px-6 relative z-10">
				<div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
					<div className="flex flex-col justify-center">
						<h2
							className="text-4xl md:text-6xl font-bold leading-[1] mb-6"
							style={{ fontFamily: "var(--font-display)" }}
						>
							Whatever you're
							<br />
							struggling with,
							<br />
							<span className="text-[rgb(var(--color-accent))]">
								I've been there.
							</span>
						</h2>
						<p className="text-[rgba(var(--color-foreground),0.5)] max-w-md leading-relaxed">
							I'm not a theoretical advisor. I've raised money, lost money,
							pivoted, shipped, sold. I excel at taking a raw idea and
							turning it into something customers actually pay for.
						</p>
					</div>

					<div className="flex flex-col gap-4">
						{[
							{
								title: "Advising",
								href: "/advising",
								desc: "Enterprise sales, corporate partners, go-to-market. The stuff that actually kills startups.",
							},
							{
								title: "Building",
								href: "/building",
								desc: "DubPrime (fintech), VentureBuilder (venture studio). 0-to-1 is where I live.",
							},
							{
								title: "Investing",
								href: "/investing",
								desc: "Small checks, real involvement. Show me customers, not slide decks.",
							},
						].map((item) => (
							<Link
								key={item.title}
								href={item.href}
								className="group p-8 border border-[rgba(var(--color-foreground),0.06)] hover:border-[rgba(var(--color-accent),0.2)] rounded-lg transition-all duration-300"
							>
								<h3 className="text-2xl font-bold mb-2 group-hover:text-[rgb(var(--color-accent))] transition-colors" style={{ fontFamily: "var(--font-display)" }}>
									{item.title}
								</h3>
								<p className="text-sm text-[rgba(var(--color-foreground),0.5)] leading-relaxed">
									{item.desc}
								</p>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* Photo + quote */}
			<section className="px-6 pb-24 relative z-10">
				<div className="max-w-6xl mx-auto">
					<div className="relative overflow-hidden rounded-lg" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 95%)" }}>
						<div className="relative h-[400px]">
							<Image src="/images/doug-casual.jpg" alt="Doug Rogers" fill className="object-cover" />
							<div className="absolute inset-0 bg-gradient-to-r from-[rgba(0,0,0,0.8)] via-[rgba(0,0,0,0.4)] to-transparent" />
						</div>
						<div className="absolute inset-0 flex items-center px-10 md:px-16">
							<p
								className="text-3xl md:text-4xl text-white font-bold max-w-lg leading-snug"
								style={{ fontFamily: "var(--font-display)" }}
							>
								"It's not how many mistakes you make. It's how many you don't make twice."
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="py-20 px-6 border-t border-[rgba(var(--color-foreground),0.06)] relative z-10">
				<div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
					<div>
						<h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
							Want to talk?
						</h2>
						<p className="text-[rgba(var(--color-foreground),0.4)]">
							I'm in the East Bay. Building something? Let's compare notes.
						</p>
					</div>
					<Link
						href="/connecting"
						className="px-8 py-4 text-lg font-semibold bg-[rgb(var(--color-accent))] text-white hover:opacity-90 transition-opacity"
					>
						Get in Touch
					</Link>
				</div>
			</section>
		</div>
	)
}

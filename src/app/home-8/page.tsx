"use client"

import Link from "next/link"
import Image from "next/image"
import { ParallaxHexagons } from "@/components/ParallaxHexagons"

/**
 * Home 8 — "The Brutalist"
 *
 * Anti-design. Oversized type. Harsh grid lines. Monospace everywhere.
 * Intentionally raw and asymmetric. No rounded corners.
 * Uses CSS Grid named areas for an intentionally "broken" layout.
 * Mix-blend-mode text over images. High contrast.
 */

const HEX_VB = "0 0 86.6 100"
const HEX_PTS = "43.3,0 86.6,25 86.6,75 43.3,100 0,75 0,25"

export default function Home8() {
	return (
		<div className="-mt-28">
			<ParallaxHexagons />

			<style
				dangerouslySetInnerHTML={{
					__html: `
				@keyframes ticker {
					0% { transform: translateX(0); }
					100% { transform: translateX(-50%); }
				}
				.ticker { animation: ticker 20s linear infinite; }
				@keyframes blink {
					0%, 100% { opacity: 1; }
					50% { opacity: 0; }
				}
				.blink { animation: blink 1s step-end infinite; }
			`,
				}}
			/>

			{/* Hero — brutalist oversized type */}
			<section className="min-h-screen flex flex-col justify-end px-6 pt-28 pb-12 relative z-10">
				{/* Background — hexagon grid pattern, full width */}
				<div
					className="absolute inset-0 opacity-[0.06]"
					style={{
						marginLeft: "calc(-50vw + 50%)",
						marginRight: "calc(-50vw + 50%)",
						width: "100vw",
					}}
				>
					<svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
						<defs>
							<pattern
								id="hex-brutalist"
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
						<rect width="100%" height="100%" fill="url(#hex-brutalist)" className="text-[rgb(var(--color-foreground))]" />
					</svg>
				</div>

				<div className="relative z-10 max-w-6xl mx-auto w-full">
					{/* Terminal-style intro */}
					<div className="font-mono text-xs text-[rgba(var(--color-foreground),0.3)] mb-8">
						<span className="text-[rgb(var(--color-accent))]">$</span> whoami
						<br />
						<span className="text-[rgba(var(--color-foreground),0.5)]">
							doug rogers — engineer, advisor, investor
						</span>
						<span className="blink">_</span>
					</div>

					<h1
						className="text-7xl md:text-[10rem] lg:text-[12rem] font-bold leading-[0.8] tracking-tight mb-12"
						style={{ fontFamily: "var(--font-display)" }}
					>
						DOUG
						<br />
						<span className="text-[rgb(var(--color-accent))]">.</span>
						ROGERS
					</h1>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
						<p className="text-[rgba(var(--color-foreground),0.5)] leading-relaxed">
							I'm good at one thing: taking a raw idea and turning it into
							a product that works. I've done it for 25 years, across
							multiple startups, with two exits.
						</p>
						<p className="text-[rgba(var(--color-foreground),0.5)] leading-relaxed">
							Now I help other founders do the same. Customer empathy, idea
							validation, 0-to-1 builds. The part before the scaling
							playbook kicks in.
						</p>
					</div>

					<div className="flex gap-4 mt-8">
						<Link
							href="/connecting"
							className="px-8 py-4 font-mono text-sm font-bold bg-[rgb(var(--color-foreground))] text-[rgb(var(--color-background))] hover:bg-[rgb(var(--color-accent))] transition-colors"
						>
							CONTACT
						</Link>
						<Link
							href="/thinking"
							className="px-8 py-4 font-mono text-sm font-bold border-2 border-[rgba(var(--color-foreground),0.2)] text-[rgba(var(--color-foreground),0.6)] hover:border-[rgb(var(--color-accent))] hover:text-[rgb(var(--color-accent))] transition-colors"
						>
							WRITING
						</Link>
					</div>
				</div>
			</section>

			{/* Ticker strip */}
			<section className="py-4 border-y-2 border-[rgba(var(--color-foreground),0.1)] overflow-hidden relative z-10 bg-[rgb(var(--color-background))]">
				<div className="flex whitespace-nowrap ticker">
					{Array(4)
						.fill(null)
						.map((_, setIndex) => (
							<span
								key={setIndex}
								className="font-mono text-lg md:text-xl font-bold tracking-wider text-[rgba(var(--color-foreground),0.08)] mx-4"
							>
								YC &mdash; TECHSTARS &mdash; 2 EXITS &mdash; TECHCRUNCH
								DISRUPT &mdash; 25+ YEARS &mdash; FINTECH &mdash; VENTURE
								STUDIO &mdash; 0→1 &mdash;{" "}
							</span>
						))}
				</div>
			</section>

			{/* Grid of services — harsh lines, no border-radius */}
			<section className="relative z-10">
				<div className="max-w-6xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-3">
						{[
							{
								title: "ADV",
								full: "Advising",
								href: "/advising",
								desc: "Enterprise sales. Corporate partners. Go-to-market. The stuff that actually kills startups when you get it wrong.",
							},
							{
								title: "BLD",
								full: "Building",
								href: "/building",
								desc: "DubPrime. VentureBuilder. Side projects at 2am. Ideas become MVPs become products become companies.",
							},
							{
								title: "INV",
								full: "Investing",
								href: "/investing",
								desc: "Founder checks. Small, involved, opinionated. If you have customers, let's talk. If you have a deck, keep iterating.",
							},
						].map((item, i) => (
							<Link
								key={item.title}
								href={item.href}
								className="group p-10 md:p-12 border border-[rgba(var(--color-foreground),0.08)] hover:bg-[rgba(var(--color-foreground),0.03)] transition-colors"
							>
								<span className="font-mono text-6xl md:text-7xl font-bold text-[rgba(var(--color-foreground),0.04)] block mb-6 group-hover:text-[rgba(var(--color-accent),0.1)] transition-colors">
									{item.title}
								</span>
								<h3 className="text-xl font-bold mb-3 group-hover:text-[rgb(var(--color-accent))] transition-colors">
									{item.full}
								</h3>
								<p className="text-sm text-[rgba(var(--color-foreground),0.4)] leading-relaxed font-mono">
									{item.desc}
								</p>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* Photo band — full width, harsh */}
			<section className="relative z-10">
				<div
					className="relative h-[50vh] overflow-hidden"
					style={{
						marginLeft: "calc(-50vw + 50%)",
						marginRight: "calc(-50vw + 50%)",
						width: "100vw",
					}}
				>
					<Image
						src="/images/doug-casual.jpg"
						alt="Doug Rogers"
						fill
						className="object-cover grayscale"
					/>
					<div className="absolute inset-0 bg-[rgba(var(--color-background),0.6)]" />
					<div className="absolute inset-0 flex items-center justify-center">
						<p
							className="text-4xl md:text-6xl lg:text-7xl font-bold text-center leading-[0.9] max-w-4xl px-6"
							style={{
								fontFamily: "var(--font-display)",
								mixBlendMode: "difference",
								color: "white",
							}}
						>
							It's not how many
							<br />
							mistakes you make.
						</p>
					</div>
				</div>
			</section>

			{/* Bottom grid */}
			<section className="relative z-10">
				<div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2">
					{/* Quote completion */}
					<div className="p-10 md:p-16 border border-[rgba(var(--color-foreground),0.08)] flex items-center">
						<p
							className="text-3xl md:text-4xl font-bold text-[rgb(var(--color-accent))] leading-snug"
							style={{ fontFamily: "var(--font-display)" }}
						>
							It's how many you
							<br />
							don't make twice.
						</p>
					</div>

					{/* CTA */}
					<div className="p-10 md:p-16 border border-[rgba(var(--color-foreground),0.08)] flex flex-col justify-center">
						<h2 className="font-mono text-sm text-[rgba(var(--color-foreground),0.3)] mb-4 tracking-wider">
							{"// CONTACT"}
						</h2>
						<p className="text-[rgba(var(--color-foreground),0.5)] mb-6 leading-relaxed">
							Building something? Need someone who's been through it? I'm
							in the East Bay and I'm around.
						</p>
						<Link
							href="/connecting"
							className="px-8 py-4 font-mono text-sm font-bold bg-[rgb(var(--color-foreground))] text-[rgb(var(--color-background))] hover:bg-[rgb(var(--color-accent))] transition-colors inline-block w-fit"
						>
							GET IN TOUCH
						</Link>
					</div>
				</div>
			</section>
		</div>
	)
}

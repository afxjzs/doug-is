"use client"

import Link from "next/link"
import Image from "next/image"
import { ParallaxHexagons } from "@/components/ParallaxHexagons"

/**
 * Home 4 — "The Bento"
 *
 * Bento grid layout with animated gradient borders,
 * bold accent colors, and hover effects. Parallax hexagons.
 */

const HEX_VB = "0 0 86.6 100"
const HEX_PTS = "43.3,0 86.6,25 86.6,75 43.3,100 0,75 0,25"

function GradientBorder({
	children,
	className = "",
}: {
	children: React.ReactNode
	className?: string
}) {
	return (
		<div className={`relative group ${className}`}>
			<div
				className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
				style={{
					background:
						"conic-gradient(from var(--angle, 0deg), #3b82f6, #8b5cf6, #ec4899, #f59e0b, #3b82f6)",
					animation: "spin-slow 4s linear infinite",
				}}
			/>
			<div className="relative rounded-2xl bg-[rgb(var(--color-background))] h-full">
				{children}
			</div>
		</div>
	)
}

export default function Home4() {
	return (
		<div className="-mt-28 pt-28">
			<ParallaxHexagons />

			<style
				dangerouslySetInnerHTML={{
					__html: `
				@keyframes spin-slow {
					from { --angle: 0deg; }
					to { --angle: 360deg; }
				}
				@property --angle {
					syntax: '<angle>';
					initial-value: 0deg;
					inherits: false;
				}
				@keyframes mesh-move {
					0% { background-position: 0% 50%; }
					50% { background-position: 100% 50%; }
					100% { background-position: 0% 50%; }
				}
				.mesh-bg {
					background: linear-gradient(
						-45deg,
						rgba(59, 130, 246, 0.15),
						rgba(139, 92, 246, 0.1),
						rgba(236, 72, 153, 0.08),
						rgba(245, 158, 11, 0.1)
					);
					background-size: 400% 400%;
					animation: mesh-move 15s ease infinite;
				}
			`,
				}}
			/>

			<section className="max-w-6xl mx-auto px-6 py-12 relative z-10">
				<div className="grid grid-cols-12 gap-4 auto-rows-[minmax(120px,auto)]">
					{/* Main hero card */}
					<GradientBorder className="col-span-12 lg:col-span-8 row-span-3">
						<div className="p-10 md:p-14 h-full flex flex-col justify-between rounded-2xl mesh-bg border border-[rgba(var(--color-foreground),0.06)]">
							<div>
								<div className="flex items-center gap-3 mb-8">
									<div className="w-3 h-3 rounded-full bg-[#3b82f6]" />
									<div className="w-3 h-3 rounded-full bg-[#8b5cf6]" />
									<div className="w-3 h-3 rounded-full bg-[#ec4899]" />
								</div>
								<h1
									className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-6"
									style={{ fontFamily: "var(--font-display)" }}
								>
									<span className="bg-gradient-to-r from-[#3b82f6] via-[#8b5cf6] to-[#ec4899] bg-clip-text text-transparent">
										Doug Rogers
									</span>
								</h1>
								<p className="text-xl md:text-2xl text-[rgba(var(--color-foreground),0.6)] max-w-lg">
									Engineer. Multiple exits. I turn ideas into
									products and help founders do the same.
								</p>
							</div>

							<div className="flex flex-wrap gap-4 mt-8">
								<Link
									href="/connecting"
									className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white font-semibold hover:shadow-lg hover:shadow-[rgba(139,92,246,0.3)] transition-all duration-300"
								>
									Get in Touch
								</Link>
								<Link
									href="/thinking"
									className="px-6 py-3 rounded-xl border border-[rgba(var(--color-foreground),0.1)] text-[rgba(var(--color-foreground),0.7)] font-medium hover:bg-[rgba(var(--color-foreground),0.05)] transition-all duration-300"
								>
									Read My Writing
								</Link>
							</div>
						</div>
					</GradientBorder>

					{/* Photo card */}
					<GradientBorder className="col-span-6 lg:col-span-4 row-span-2">
						<div className="relative h-full min-h-[280px] overflow-hidden rounded-2xl border border-[rgba(var(--color-foreground),0.06)]">
							<Image
								src="/images/doug-2024-cropped-compr.png"
								alt="Doug Rogers"
								fill
								className="object-cover grayscale"
								priority
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.6)] to-transparent" />
						</div>
					</GradientBorder>

					{/* Stats card */}
					<GradientBorder className="col-span-6 lg:col-span-4 row-span-1">
						<div className="p-6 h-full rounded-2xl border border-[rgba(var(--color-foreground),0.06)] flex items-center justify-around">
							<div className="text-center">
								<span className="text-3xl font-bold bg-gradient-to-r from-[#f59e0b] to-[#ec4899] bg-clip-text text-transparent">
									25+
								</span>
								<p className="text-xs text-[rgba(var(--color-foreground),0.4)] mt-1">
									years building
								</p>
							</div>
							<div className="w-px h-8 bg-[rgba(var(--color-foreground),0.08)]" />
							<div className="text-center">
								<span className="text-3xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent">
									2
								</span>
								<p className="text-xs text-[rgba(var(--color-foreground),0.4)] mt-1">
									exits
								</p>
							</div>
							<div className="w-px h-8 bg-[rgba(var(--color-foreground),0.08)]" />
							<div className="text-center">
								<span className="text-3xl font-bold bg-gradient-to-r from-[#ec4899] to-[#f59e0b] bg-clip-text text-transparent">
									YC
								</span>
								<p className="text-xs text-[rgba(var(--color-foreground),0.4)] mt-1">
									& Techstars
								</p>
							</div>
						</div>
					</GradientBorder>

					{/* Advising / Building / Investing cards */}
					{[
						{ title: "Advising", href: "/advising", desc: "Whatever mistake you're about to make, I probably already made it. Let's skip that part.", color: "#3b82f6" },
						{ title: "Building", href: "/building", desc: "DubPrime, VentureBuilder, and side projects at 2am. Shipping is a lifestyle.", color: "#8b5cf6" },
						{ title: "Investing", href: "/investing", desc: "Small checks, real involvement. Revenue over pitch decks, every time.", color: "#ec4899" },
					].map((item) => (
						<Link key={item.title} href={item.href} className="col-span-12 md:col-span-4">
							<GradientBorder className="h-full">
								<div className={`p-8 h-full rounded-2xl border border-[rgba(var(--color-foreground),0.06)] hover:bg-[rgba(var(--color-foreground),0.02)] transition-colors`}>
									<div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${item.color}15` }}>
										<svg className="w-5 h-6" style={{ color: item.color }} viewBox={HEX_VB}>
											<polygon points={HEX_PTS} fill="currentColor" />
										</svg>
									</div>
									<h3 className="text-xl font-semibold mb-2">{item.title}</h3>
									<p className="text-sm text-[rgba(var(--color-foreground),0.5)] leading-relaxed">{item.desc}</p>
								</div>
							</GradientBorder>
						</Link>
					))}

					{/* NYC skyline — wide card */}
					<div className="col-span-12 lg:col-span-8 row-span-2">
						<div className="relative h-full min-h-[300px] overflow-hidden rounded-2xl border border-[rgba(var(--color-foreground),0.06)]">
							<Image src="/images/doug-nyc.jpg" alt="NYC Skyline" fill className="object-cover" />
							<div className="absolute inset-0 bg-gradient-to-r from-[rgba(0,0,0,0.7)] to-transparent" />
							<div className="absolute bottom-0 left-0 p-10">
								<p className="text-2xl md:text-3xl text-white font-bold max-w-md leading-snug" style={{ fontFamily: "var(--font-display)" }}>
									"It's not how many mistakes you make. It's how many you don't make twice."
								</p>
							</div>
						</div>
					</div>

					{/* CTA card */}
					<div className="col-span-12 lg:col-span-4 row-span-2">
						<div className="h-full rounded-2xl border border-[rgba(var(--color-foreground),0.06)] p-8 flex flex-col justify-center items-center text-center mesh-bg">
							<svg className="w-12 h-14 mb-6 text-[rgba(139,92,246,0.4)]" viewBox={HEX_VB}>
								<polygon points={HEX_PTS} fill="none" stroke="currentColor" strokeWidth="2" />
							</svg>
							<h2 className="text-2xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
								Let's talk.
							</h2>
							<p className="text-sm text-[rgba(var(--color-foreground),0.5)] mb-6">
								Building something? I'm around.
							</p>
							<Link
								href="/connecting"
								className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white font-semibold hover:shadow-lg hover:shadow-[rgba(139,92,246,0.3)] transition-all duration-300"
							>
								Get in Touch
							</Link>
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}

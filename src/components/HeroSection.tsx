"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import TerminalText from "@/components/TerminalText"

const HEXES = [
	{ size: 120, x: "80%", y: "15%", delay: "0s", parallaxFactor: 0.05 },
	{ size: 80, x: "10%", y: "70%", delay: "1s", parallaxFactor: 0.1 },
	{ size: 60, x: "70%", y: "80%", delay: "2s", parallaxFactor: 0.15 },
	{ size: 40, x: "20%", y: "20%", delay: "0.5s", parallaxFactor: 0.2 },
]

export default function HeroSection() {
	const parallaxRefs = useRef<(HTMLDivElement | null)[]>([])

	useEffect(() => {
		// Direct DOM writes via rAF — no React state, no reconciliation.
		// Parallax lives on wrapper divs so the SVGs inside stay free to
		// run their hex-float keyframe.
		let ticking = false
		const onScroll = () => {
			if (ticking) return
			requestAnimationFrame(() => {
				const y = window.scrollY
				parallaxRefs.current.forEach((el, i) => {
					if (!el) return
					const factor = HEXES[i]?.parallaxFactor ?? 0
					el.style.transform = `translate3d(0, ${-y * factor}px, 0)`
				})
				ticking = false
			})
			ticking = true
		}

		// Honor reduced-motion: skip parallax entirely.
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
		if (reduced) return

		window.addEventListener("scroll", onScroll, { passive: true })
		return () => window.removeEventListener("scroll", onScroll)
	}, [])

	return (
		<section className="flex items-center px-5 md:px-10 pt-[220px] pb-[200px] relative">
			{/* Floating hexagons — parallax on wrapper, keyframe float on SVG */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				{HEXES.map((hex, i) => (
					<div
						key={i}
						ref={(el) => {
							parallaxRefs.current[i] = el
						}}
						className="absolute will-change-transform"
						style={{
							left: hex.x,
							top: hex.y,
						}}
					>
						<svg
							className="opacity-[0.06]"
							style={{
								width: `${hex.size}px`,
								height: `${hex.size * 1.155}px`,
								animation: `hex-float 8s ease-in-out ${hex.delay} infinite`,
							}}
							viewBox="0 0 86.6 100"
						>
							<polygon
								points="43.3,0 86.6,25 86.6,75 43.3,100 0,75 0,25"
								fill="none"
								className="stroke-[rgb(var(--color-accent))]"
								strokeWidth="1"
							/>
						</svg>
					</div>
				))}
			</div>

			<div className="max-w-[1200px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
				{/* Identity — first in DOM so mobile (and screen readers) get
				   who-this-is before the terminal; md:order-2 keeps it on the
				   right on desktop. Each child staggers in 60ms apart. */}
				<div className="md:order-2">
					{/* Circular B&W photo */}
					<div
						className="w-[120px] h-[120px] rounded-full overflow-hidden border-2 border-[rgb(var(--color-accent))] mb-7 hero-stagger"
						style={{ animationDelay: "0ms" }}
					>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src="/images/doug-2024-cropped-compr.png"
							alt="Doug Rogers"
							className="w-full h-full object-cover grayscale brightness-110 contrast-105"
						/>
					</div>
					<h1
						className="font-[family-name:var(--font-display)] text-[clamp(40px,5vw,64px)] font-bold leading-[1.1] mb-6 hero-stagger"
						style={{ animationDelay: "60ms" }}
					>
						Ideas to products.{" "}
						<span className="text-[rgb(var(--color-accent))]">
							Zero to one.
						</span>
					</h1>
					<p
						className="text-base leading-[1.7] text-[rgba(var(--color-foreground),0.65)] max-w-[440px] mb-10 hero-stagger"
						style={{ animationDelay: "120ms" }}
					>
						I&apos;m not a theoretical advisor. I&apos;ve raised capital,
						invested capital, pivoted, shipped, sold. I excel at taking a raw
						idea and turning it into something customers actually pay for,
						validating all the way.
					</p>
					<div
						className="flex flex-wrap gap-4 hero-stagger"
						style={{ animationDelay: "180ms" }}
					>
						<Link href="/connecting" className="btn-primary">
							Get in Touch
						</Link>
						<Link href="/writing" className="btn-secondary">
							Read My Writing
						</Link>
					</div>
				</div>

				{/* Terminal — md:order-1 puts it on the left on desktop */}
				<div
					className="bg-[rgb(var(--color-background-alt))] rounded-xl border border-[rgba(var(--color-border),0.12)] overflow-hidden hero-stagger md:order-1"
					style={{ animationDelay: "240ms" }}
				>
					{/* Terminal title bar */}
					<div className="px-4 py-3 border-b border-[rgba(var(--color-border),0.08)] flex items-center gap-2">
						<div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
						<div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
						<div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
						<span className="text-[11px] text-[rgba(var(--color-foreground),0.65)] ml-3 font-[family-name:var(--font-mono)]">
							~/doug-rogers
						</span>
					</div>
					{/* Terminal content — fixed height so typing never pushes the
					   page; the terminal scrolls inside like a real one. */}
					<div data-terminal-scroll className="p-6 h-[520px] overflow-y-auto">
						<TerminalText />
					</div>
				</div>
			</div>
		</section>
	)
}

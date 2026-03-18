"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import TerminalText from "@/components/TerminalText"

const ARTICLES = [
	{
		title: "AI Slop Will Eat Itself",
		category: "Technology",
		href: "/thinking/about/technology/ai-slop-will-eat-itself",
		summary:
			"What happens when AI-generated content becomes AI training data? A feedback loop that degrades everything.",
	},
	{
		title: "Planner/Executor: A Systematic Approach to LLM-Guided Development",
		category: "Development",
		href: "/thinking/about/development/plannerexecutor-a-systematic-approach-to-llm-guided-development",
		summary:
			"LLMs need role clarity to excel. Explicit role separation prevents the chaos of planning and executing simultaneously.",
	},
	{
		title: "Introducing the Migraine Trigger Foods Database",
		category: "Lifestyle",
		href: "/thinking/about/lifestyle/introducing-the-migraine-trigger-foods-database-mtfdb",
		summary:
			"A database of foods and ingredients that can trigger migraines. I get migraines, so I built this to figure out what to avoid.",
	},
]

function HexSeparator() {
	return (
		<svg
			width="8"
			height="10"
			viewBox="0 0 86.6 100"
			className="fill-[rgb(var(--color-accent))] shrink-0"
		>
			<polygon points="43.3,0 86.6,25 86.6,75 43.3,100 0,75 0,25" />
		</svg>
	)
}

export default function Home() {
	const [scrollY, setScrollY] = useState(0)

	useEffect(() => {
		let ticking = false
		const onScroll = () => {
			if (!ticking) {
				requestAnimationFrame(() => {
					setScrollY(window.scrollY)
					ticking = false
				})
				ticking = true
			}
		}
		window.addEventListener("scroll", onScroll, { passive: true })
		return () => window.removeEventListener("scroll", onScroll)
	}, [])

	return (
		<div className="-mt-28 -mb-12">
			{/* Hero */}
			<section className="flex items-center px-5 md:px-10 pt-[220px] pb-[200px] relative">
				{/* Floating hexagons */}
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					{[
						{ size: 120, x: "80%", y: "15%", delay: "0s" },
						{ size: 80, x: "10%", y: "70%", delay: "1s" },
						{ size: 60, x: "70%", y: "80%", delay: "2s" },
						{ size: 40, x: "20%", y: "20%", delay: "0.5s" },
					].map((hex, i) => (
						<svg
							key={i}
							className="absolute opacity-[0.06]"
							style={{
								left: hex.x,
								top: hex.y,
								width: `${hex.size}px`,
								height: `${hex.size * 1.155}px`,
								animation: `hex-float 8s ease-in-out ${hex.delay} infinite`,
								transform: `translateY(${-scrollY * 0.05 * (i + 1)}px)`,
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
					))}
				</div>

				<div className="max-w-[1200px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
					{/* Left — terminal */}
					<div className="bg-[rgb(var(--color-background-alt))] rounded-xl border border-[rgba(var(--color-border),0.12)] overflow-hidden">
						{/* Terminal title bar */}
						<div className="px-4 py-3 border-b border-[rgba(var(--color-border),0.08)] flex items-center gap-2">
							<div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
							<div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
							<div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
							<span className="text-[11px] text-[rgba(var(--color-foreground),0.45)] ml-3 font-[family-name:var(--font-mono)]">
								~/doug-rogers
							</span>
						</div>
						{/* Terminal content */}
						<div className="p-6 min-h-[420px]">
							<TerminalText />
						</div>
					</div>

					{/* Right — headline */}
					<div>
						{/* Circular B&W photo */}
						<div className="w-[120px] h-[120px] rounded-full overflow-hidden border-2 border-[rgb(var(--color-accent))] mb-7">
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src="/images/doug-2024-cropped-compr.png"
								alt="Doug Rogers"
								className="w-full h-full object-cover grayscale brightness-110 contrast-105"
							/>
						</div>
						<h1 className="font-[family-name:var(--font-display)] text-[clamp(40px,5vw,64px)] font-bold leading-[1.1] mb-6">
							Ideas to products.{" "}
							<span className="text-[rgb(var(--color-accent))]">
								Zero to one.
							</span>
						</h1>
						<p className="text-base leading-[1.7] text-[rgba(var(--color-foreground),0.45)] max-w-[440px] mb-10">
							I&apos;m not a theoretical advisor. I&apos;ve raised capital,
							invested capital, pivoted, shipped, sold. I excel at taking a raw
							idea and turning it into something customers actually pay for,
							validating all the way.
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
				</div>
			</section>

			{/* Credential bar */}
			<section className="border-t border-b border-[rgba(var(--color-border),0.08)] py-5 px-5 md:px-10">
				<div className="max-w-[1200px] mx-auto flex flex-wrap justify-center items-center gap-3 font-[family-name:var(--font-mono)] text-xs tracking-[0.1em] text-[rgba(var(--color-foreground),0.45)]">
					{[
						"Y Combinator (W15)",
						"Techstars (JPM/24)",
						"25+ Years Building",
						"2x Exits",
					].map((item, i, arr) => (
						<span key={item} className="flex items-center gap-3">
							{item}
							{i < arr.length - 1 && <HexSeparator />}
						</span>
					))}
				</div>
			</section>

			{/* Three pillars */}
			<section className="py-24 px-5 md:px-10">
				<div className="max-w-[1200px] mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-3">
						{[
							{
								num: "01",
								title: "Advising",
								desc: "Fractional CTO & strategic advisor for early-stage founders navigating 0\u21921 product development.",
								href: "/advising",
							},
							{
								num: "02",
								title: "Building",
								desc: "DubPrime (fintech, Techstars '24), GAIuS (gaius.fyi), VentureBuilder, and side projects when I can't sleep.",
								href: "/building",
							},
							{
								num: "03",
								title: "Investing",
								desc: "Small checks into founders with real revenue. Revenue over pitch decks, every time.",
								href: "/investing",
							},
						].map((item, i) => (
							<Link
								key={item.num}
								href={item.href}
								className={`group p-10 md:px-10 transition-colors duration-300 hover:bg-[rgba(var(--color-accent),0.03)] ${
									i > 0
										? "md:border-l border-t md:border-t-0 border-[rgba(var(--color-border),0.08)]"
										: ""
								}`}
							>
								<span className="block mb-4 font-[family-name:var(--font-mono)] text-[11px] text-[rgba(var(--color-accent),0.3)]">
									{item.num}
								</span>
								<h3 className="font-[family-name:var(--font-display)] text-[28px] font-bold mb-3">
									{item.title}
								</h3>
								<p className="text-[13px] leading-[1.7] text-[rgba(var(--color-foreground),0.45)]">
									{item.desc}
								</p>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* Articles */}
			<section className="px-5 md:px-10 pb-24">
				<div className="max-w-[1200px] mx-auto">
					<div className="flex justify-between items-baseline mb-10">
						<h2 className="font-[family-name:var(--font-display)] text-[32px] font-bold">
							Writing
						</h2>
						<Link
							href="/thinking"
							className="font-[family-name:var(--font-mono)] text-xs tracking-[0.1em] text-[rgba(var(--color-accent),0.3)] hover:text-[rgb(var(--color-accent))] transition-colors"
						>
							ALL POSTS &rarr;
						</Link>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{ARTICLES.map((article, i) => (
							<Link
								key={i}
								href={article.href}
								className="p-8 bg-[rgb(var(--color-background-alt))] rounded-lg border border-[rgba(var(--color-border),0.06)] transition-all duration-300 hover:border-[rgba(var(--color-border),0.2)] hover:-translate-y-1"
							>
								<span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.15em] text-[rgba(var(--color-accent),0.3)] uppercase">
									{article.category}
								</span>
								<h3 className="font-[family-name:var(--font-display)] text-lg font-bold mt-3 leading-snug">
									{article.title}
								</h3>
								<p className="text-xs leading-relaxed text-[rgba(var(--color-foreground),0.45)] mt-2.5">
									{article.summary}
								</p>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* Photo + quote band */}
			<section className="relative h-[400px] md:h-[400px] overflow-hidden">
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src="/images/doug-nyc.jpg"
					alt="NYC Skyline"
					className="absolute inset-0 w-full h-full object-cover sepia-[0.4] saturate-[0.6] brightness-[0.35] hue-rotate-[10deg]"
				/>
				<div className="absolute inset-0 bg-gradient-to-r from-[rgba(10,14,26,0.7)] to-[rgba(10,14,26,0.3)]" />
				<div className="relative z-10 h-full flex items-center px-5 md:px-12 max-w-[1200px] mx-auto">
					<p className="font-[family-name:var(--font-display)] text-[clamp(28px,3.5vw,44px)] font-bold leading-[1.3] max-w-[600px]">
						&ldquo;It&apos;s not how many mistakes you make.{" "}
						<span className="text-[rgb(var(--color-accent))]">
							It&apos;s how many you don&apos;t make twice.&rdquo;
						</span>
					</p>
				</div>
			</section>

			{/* Bottom CTA */}
			<section className="py-20 px-5 md:px-10 text-center">
				<p className="font-[family-name:var(--font-display)] text-[clamp(28px,3vw,40px)] font-bold max-w-[600px] mx-auto mb-6 leading-[1.3]">
					Let&apos;s build{" "}
					<span className="text-[rgb(var(--color-accent))] italic">
						something great.
					</span>
				</p>
				<p className="text-sm text-[rgba(var(--color-foreground),0.45)] mb-8">
					Got an idea? Already building? Let&apos;s talk.
				</p>
				<Link href="/connecting" className="btn-primary">
					Get in Touch
				</Link>
			</section>
		</div>
	)
}

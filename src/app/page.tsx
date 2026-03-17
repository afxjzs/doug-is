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
			style={{ fill: "rgb(var(--color-accent))", flexShrink: 0 }}
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
		<div style={{ marginTop: "-7rem", marginBottom: "-3rem" }}>
			{/* Hero */}
			<section
				style={{
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
					padding: "0 40px",
					position: "relative",
				}}
			>
				{/* Floating hexagons */}
				<div
					style={{
						position: "absolute",
						inset: 0,
						overflow: "hidden",
						pointerEvents: "none",
					}}
				>
					{[
						{ size: 120, x: "80%", y: "15%", delay: "0s" },
						{ size: 80, x: "10%", y: "70%", delay: "1s" },
						{ size: 60, x: "70%", y: "80%", delay: "2s" },
						{ size: 40, x: "20%", y: "20%", delay: "0.5s" },
					].map((hex, i) => (
						<svg
							key={i}
							style={{
								position: "absolute",
								left: hex.x,
								top: hex.y,
								width: `${hex.size}px`,
								height: `${hex.size * 1.155}px`,
								opacity: 0.06,
								animation: `hex-float 8s ease-in-out ${hex.delay} infinite`,
								transform: `translateY(${-scrollY * 0.05 * (i + 1)}px)`,
							}}
							viewBox="0 0 86.6 100"
						>
							<polygon
								points="43.3,0 86.6,25 86.6,75 43.3,100 0,75 0,25"
								fill="none"
								stroke="rgb(var(--color-accent))"
								strokeWidth="1"
							/>
						</svg>
					))}
				</div>

				<div
					className="hero-grid"
					style={{
						maxWidth: "1200px",
						margin: "0 auto",
						width: "100%",
						display: "grid",
						gridTemplateColumns: "1fr 1fr",
						gap: "80px",
						alignItems: "center",
					}}
				>
					{/* Left — terminal */}
					<div
						style={{
							backgroundColor: "rgb(var(--color-background-alt))",
							borderRadius: "12px",
							border: "1px solid rgba(var(--color-border), 0.12)",
							overflow: "hidden",
						}}
					>
						<div
							style={{
								padding: "12px 16px",
								borderBottom: "1px solid rgba(var(--color-border), 0.08)",
								display: "flex",
								alignItems: "center",
								gap: "8px",
							}}
						>
							<div
								style={{
									width: "10px",
									height: "10px",
									borderRadius: "50%",
									background: "#ff5f57",
								}}
							/>
							<div
								style={{
									width: "10px",
									height: "10px",
									borderRadius: "50%",
									background: "#febc2e",
								}}
							/>
							<div
								style={{
									width: "10px",
									height: "10px",
									borderRadius: "50%",
									background: "#28c840",
								}}
							/>
							<span
								style={{
									fontSize: "11px",
									color: "rgba(var(--color-foreground), 0.45)",
									marginLeft: "12px",
								}}
							>
								~/doug-rogers
							</span>
						</div>
						<div style={{ padding: "24px", minHeight: "420px" }}>
							<TerminalText />
						</div>
					</div>

					{/* Right — headline */}
					<div>
						<div
							style={{
								width: "120px",
								height: "120px",
								borderRadius: "50%",
								overflow: "hidden",
								border: "2px solid rgb(var(--color-accent))",
								marginBottom: "28px",
							}}
						>
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src="/images/doug-2024-cropped-compr.png"
								alt="Doug Rogers"
								style={{
									width: "100%",
									height: "100%",
									objectFit: "cover",
									filter: "grayscale(1) brightness(1.1) contrast(1.05)",
								}}
							/>
						</div>
						<h1
							style={{
								fontFamily:
									"var(--font-display, 'Playfair Display', Georgia, serif)",
								fontSize: "clamp(40px, 5vw, 64px)",
								fontWeight: 700,
								lineHeight: 1.1,
								marginBottom: "24px",
								color: "rgb(var(--color-foreground))",
							}}
						>
							Ideas to products.{" "}
							<span style={{ color: "rgb(var(--color-accent))" }}>
								Zero to one.
							</span>
						</h1>
						<p
							style={{
								fontSize: "16px",
								lineHeight: 1.7,
								color: "rgba(var(--color-foreground), 0.45)",
								maxWidth: "440px",
								marginBottom: "40px",
							}}
						>
							I&apos;m not a theoretical advisor. I&apos;ve raised capital,
							invested capital, pivoted, shipped, sold. I excel at taking a raw
							idea and turning it into something customers actually pay for,
							validating all the way.
						</p>
						<div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
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
			<section
				style={{
					borderTop: "1px solid rgba(var(--color-border), 0.08)",
					borderBottom: "1px solid rgba(var(--color-border), 0.08)",
					padding: "20px 40px",
				}}
			>
				<div
					style={{
						maxWidth: "1200px",
						margin: "0 auto",
						display: "flex",
						flexWrap: "wrap",
						justifyContent: "center",
						alignItems: "center",
						gap: "12px",
						fontSize: "12px",
						letterSpacing: "0.1em",
						color: "rgba(var(--color-foreground), 0.45)",
					}}
				>
					{[
						"YC W15",
						"JPMorgan / Techstars '24",
						"25+ Years Building",
						"2x Exits",
					].map((item, i, arr) => (
						<span
							key={item}
							style={{
								display: "flex",
								alignItems: "center",
								gap: "12px",
							}}
						>
							{item}
							{i < arr.length - 1 && <HexSeparator />}
						</span>
					))}
				</div>
			</section>

			{/* Three pillars */}
			<section style={{ padding: "100px 40px" }}>
				<div style={{ maxWidth: "1200px", margin: "0 auto" }}>
					<div
						className="pillars-grid"
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(3, 1fr)",
							gap: "0",
						}}
					>
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
								className="group"
								style={{
									padding: "48px 40px",
									borderLeft:
										i > 0
											? "1px solid rgba(var(--color-border), 0.08)"
											: "none",
									transition: "background 0.3s",
								}}
								onMouseEnter={(e) =>
									(e.currentTarget.style.background =
										"rgba(var(--color-accent), 0.03)")
								}
								onMouseLeave={(e) =>
									(e.currentTarget.style.background = "transparent")
								}
							>
								<span
									style={{
										fontSize: "11px",
										color: "rgba(var(--color-accent), 0.3)",
										display: "block",
										marginBottom: "16px",
									}}
								>
									{item.num}
								</span>
								<h3
									style={{
										fontFamily:
											"var(--font-display, 'Playfair Display', Georgia, serif)",
										fontSize: "28px",
										fontWeight: 700,
										marginBottom: "12px",
									}}
								>
									{item.title}
								</h3>
								<p
									style={{
										fontSize: "13px",
										lineHeight: 1.7,
										color: "rgba(var(--color-foreground), 0.45)",
									}}
								>
									{item.desc}
								</p>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* Articles */}
			<section style={{ padding: "0 40px 100px" }}>
				<div style={{ maxWidth: "1200px", margin: "0 auto" }}>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "baseline",
							marginBottom: "40px",
						}}
					>
						<h2
							style={{
								fontFamily:
									"var(--font-display, 'Playfair Display', Georgia, serif)",
								fontSize: "32px",
								fontWeight: 700,
							}}
						>
							Writing
						</h2>
						<Link
							href="/thinking"
							style={{
								fontSize: "12px",
								letterSpacing: "0.1em",
								color: "rgba(var(--color-accent), 0.3)",
								transition: "color 0.2s",
							}}
							onMouseEnter={(e) =>
								(e.currentTarget.style.color = "rgb(var(--color-accent))")
							}
							onMouseLeave={(e) =>
								(e.currentTarget.style.color =
									"rgba(var(--color-accent), 0.3)")
							}
						>
							ALL POSTS &rarr;
						</Link>
					</div>

					<div
						className="articles-grid"
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(3, 1fr)",
							gap: "24px",
						}}
					>
						{ARTICLES.map((article, i) => (
							<Link
								key={i}
								href={article.href}
								style={{
									padding: "32px",
									backgroundColor: "rgb(var(--color-background-alt))",
									borderRadius: "8px",
									border: "1px solid rgba(var(--color-border), 0.06)",
									transition: "all 0.3s",
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.borderColor =
										"rgba(var(--color-border), 0.2)"
									e.currentTarget.style.transform = "translateY(-4px)"
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.borderColor =
										"rgba(var(--color-border), 0.06)"
									e.currentTarget.style.transform = "translateY(0)"
								}}
							>
								<span
									style={{
										fontSize: "10px",
										letterSpacing: "0.15em",
										color: "rgba(var(--color-accent), 0.3)",
										textTransform: "uppercase" as const,
									}}
								>
									{article.category}
								</span>
								<h3
									style={{
										fontFamily:
											"var(--font-display, 'Playfair Display', Georgia, serif)",
										fontSize: "18px",
										fontWeight: 700,
										marginTop: "12px",
										lineHeight: 1.4,
									}}
								>
									{article.title}
								</h3>
								<p
									style={{
										fontSize: "12px",
										lineHeight: 1.6,
										color: "rgba(var(--color-foreground), 0.45)",
										marginTop: "10px",
									}}
								>
									{article.summary}
								</p>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* Photo + quote band */}
			<section
				style={{
					position: "relative",
					height: "400px",
					overflow: "hidden",
				}}
			>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src="/images/doug-nyc.jpg"
					alt="NYC Skyline"
					style={{
						position: "absolute",
						inset: 0,
						width: "100%",
						height: "100%",
						objectFit: "cover",
						filter:
							"sepia(0.4) saturate(0.6) brightness(0.35) hue-rotate(10deg)",
					}}
				/>
				<div
					style={{
						position: "absolute",
						inset: 0,
						background:
							"linear-gradient(to right, rgba(10,14,26,0.7), rgba(10,14,26,0.3))",
					}}
				/>
				<div
					style={{
						position: "relative",
						zIndex: 1,
						height: "100%",
						display: "flex",
						alignItems: "center",
						padding: "0 48px",
						maxWidth: "1200px",
						margin: "0 auto",
					}}
				>
					<p
						style={{
							fontFamily:
								"var(--font-display, 'Playfair Display', Georgia, serif)",
							fontSize: "clamp(28px, 3.5vw, 44px)",
							fontWeight: 700,
							lineHeight: 1.3,
							color: "rgb(var(--color-foreground))",
							maxWidth: "600px",
						}}
					>
						&ldquo;It&apos;s not how many mistakes you make.{" "}
						<span style={{ color: "rgb(var(--color-accent))" }}>
							It&apos;s how many you don&apos;t make twice.&rdquo;
						</span>
					</p>
				</div>
			</section>

			{/* Bottom CTA */}
			<section
				style={{
					padding: "80px 40px",
					textAlign: "center" as const,
				}}
			>
				<p
					style={{
						fontFamily:
							"var(--font-display, 'Playfair Display', Georgia, serif)",
						fontSize: "clamp(28px, 3vw, 40px)",
						fontWeight: 700,
						maxWidth: "600px",
						margin: "0 auto 24px",
						lineHeight: 1.3,
					}}
				>
					Let&apos;s build{" "}
					<span
						style={{
							color: "rgb(var(--color-accent))",
							fontStyle: "italic",
						}}
					>
						something great.
					</span>
				</p>
				<p
					style={{
						fontSize: "14px",
						color: "rgba(var(--color-foreground), 0.45)",
						marginBottom: "32px",
					}}
				>
					Got an idea? Already building? Let&apos;s talk.
				</p>
				<Link href="/connecting" className="btn-primary">
					Get in Touch
				</Link>
			</section>

			{/* Responsive overrides */}
			<style jsx>{`
				@media (max-width: 768px) {
					.hero-grid {
						grid-template-columns: 1fr !important;
						gap: 40px !important;
					}
					.pillars-grid {
						grid-template-columns: 1fr !important;
					}
					.articles-grid {
						grid-template-columns: 1fr !important;
					}
				}
			`}</style>
		</div>
	)
}

"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"

/**
 * Home 9 — "The Terminal"
 *
 * SCRATCH BUILD. No imported layout, no CSS variables, no existing styles.
 * Deep navy + amber/gold palette. Terminal-inspired but refined.
 * Incorporates the "whoami" concept. Monospace + serif contrast.
 * Designed to show experience without telegraphing age.
 */

const ARTICLES = [
	{ title: "AI Slop Will Eat Itself", category: "Technology", href: "/thinking/about/technology/ai-slop-will-eat-itself" },
	{ title: "Planner/Executor: A Systematic Approach to LLM-Guided Development", category: "Development", href: "/thinking/about/development/plannerexecutor-a-systematic-approach-to-llm-guided-development" },
	{ title: "Introducing the Migraine Trigger Foods Database", category: "Lifestyle", href: "/thinking/about/lifestyle/introducing-the-migraine-trigger-foods-database-mtfdb" },
]

function TerminalText() {
	const [lines, setLines] = useState<string[]>([])
	const [currentLine, setCurrentLine] = useState(0)
	const [currentChar, setCurrentChar] = useState(0)
	const [showCursor, setShowCursor] = useState(true)

	const allLines = [
		"$ whoami",
		"doug rogers — engineer, founder, advisor",
		"",
		"$ cat experience.log",
		"25+ years building products",
		"multiple startups, two exits",
		"YC & Techstars alum",
		"accelerator director",
		"",
		"$ cat strengths.txt",
		"rapid prototyping & MVPs",
		"idea validation & ICP identification",
		"0 → 1 product development",
		"customer empathy (the real kind)",
		"",
		"$ echo $STATUS",
		"still shipping."
	]

	useEffect(() => {
		const timer = setInterval(() => {
			setShowCursor(prev => !prev)
		}, 530)
		return () => clearInterval(timer)
	}, [])

	useEffect(() => {
		if (currentLine >= allLines.length) return

		const line = allLines[currentLine]
		if (line === "") {
			setTimeout(() => {
				setLines(prev => [...prev, ""])
				setCurrentLine(prev => prev + 1)
				setCurrentChar(0)
			}, 200)
			return
		}

		if (currentChar >= line.length) {
			setLines(prev => [...prev, line])
			setCurrentLine(prev => prev + 1)
			setCurrentChar(0)
			return
		}

		const isCommand = line.startsWith("$")
		const speed = isCommand ? 45 : 18

		const timer = setTimeout(() => {
			setCurrentChar(prev => prev + 1)
		}, speed)

		return () => clearTimeout(timer)
	}, [currentLine, currentChar])

	const typingLine = currentLine < allLines.length ? allLines[currentLine].substring(0, currentChar) : ""

	return (
		<div style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace", fontSize: "14px", lineHeight: "1.8" }}>
			{lines.map((line, i) => (
				<div key={i} style={{ minHeight: "25px" }}>
					{line.startsWith("$") ? (
						<span>
							<span style={{ color: "#d4a853" }}>❯ </span>
							<span style={{ color: "#e8e2d6" }}>{line.substring(2)}</span>
						</span>
					) : (
						<span style={{ color: "rgba(232,226,214,0.55)" }}>{line}</span>
					)}
				</div>
			))}
			{currentLine < allLines.length && (
				<div style={{ minHeight: "25px" }}>
					{typingLine.startsWith("$") ? (
						<span>
							<span style={{ color: "#d4a853" }}>❯ </span>
							<span style={{ color: "#e8e2d6" }}>{typingLine.substring(2)}</span>
						</span>
					) : (
						<span style={{ color: "rgba(232,226,214,0.55)" }}>{typingLine}</span>
					)}
					<span style={{ opacity: showCursor ? 1 : 0, color: "#d4a853", transition: "opacity 0.1s" }}>▊</span>
				</div>
			)}
		</div>
	)
}

export default function Home9() {
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
		<>
			<style dangerouslySetInnerHTML={{ __html: `
				@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
				.h9-page * { box-sizing: border-box; margin: 0; padding: 0; }
				.h9-page a { text-decoration: none; color: inherit; }
				.h9-page { --navy: #0a0e1a; --navy-light: #141b2d; --amber: #d4a853; --amber-dim: rgba(212,168,83,0.3); --cream: #e8e2d6; --cream-dim: rgba(232,226,214,0.45); }
				@keyframes h9-float { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(3deg); } }
				@keyframes h9-glow { 0%,100% { opacity: 0.4; } 50% { opacity: 0.8; } }
			`}} />

			<div className="h9-page" style={{
				background: "var(--navy)",
				color: "var(--cream)",
				minHeight: "100vh",
				fontFamily: "'JetBrains Mono', monospace",
				overflow: "hidden",
			}}>
				{/* Nav */}
				<nav style={{
					position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
					padding: "20px 40px",
					display: "flex", justifyContent: "space-between", alignItems: "center",
					background: scrollY > 50 ? "rgba(10,14,26,0.95)" : "transparent",
					backdropFilter: scrollY > 50 ? "blur(20px)" : "none",
					borderBottom: scrollY > 50 ? "1px solid rgba(212,168,83,0.1)" : "1px solid transparent",
					transition: "all 0.3s ease",
				}}>
					<div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
						<div style={{
							width: "8px", height: "8px", borderRadius: "50%",
							background: "var(--amber)",
							animation: "h9-glow 3s ease infinite",
						}} />
						<span style={{ fontSize: "14px", letterSpacing: "0.15em", color: "var(--cream-dim)" }}>
							doug.is
						</span>
					</div>
					<div style={{ display: "flex", gap: "32px", fontSize: "12px", letterSpacing: "0.1em" }}>
						{["advising", "building", "investing", "writing"].map(item => (
							<Link key={item} href={item === "writing" ? "/thinking" : `/${item}`} style={{
								color: "var(--cream-dim)",
								transition: "color 0.2s",
							}}
							onMouseEnter={e => (e.target as HTMLElement).style.color = "#d4a853"}
							onMouseLeave={e => (e.target as HTMLElement).style.color = "rgba(232,226,214,0.45)"}
							>{item}</Link>
						))}
					</div>
				</nav>

				{/* Hero */}
				<section style={{
					minHeight: "100vh",
					display: "flex", alignItems: "center",
					padding: "0 40px",
					position: "relative",
				}}>
					{/* Floating geometric elements */}
					<div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
						{[
							{ size: 120, x: "80%", y: "15%", delay: "0s" },
							{ size: 80, x: "10%", y: "70%", delay: "1s" },
							{ size: 60, x: "70%", y: "80%", delay: "2s" },
							{ size: 40, x: "20%", y: "20%", delay: "0.5s" },
						].map((hex, i) => (
							<svg key={i} style={{
								position: "absolute", left: hex.x, top: hex.y,
								width: `${hex.size}px`, height: `${hex.size * 1.155}px`,
								opacity: 0.06,
								animation: `h9-float 8s ease-in-out ${hex.delay} infinite`,
								transform: `translateY(${-scrollY * 0.05 * (i + 1)}px)`,
							}} viewBox="0 0 86.6 100">
								<polygon points="43.3,0 86.6,25 86.6,75 43.3,100 0,75 0,25" fill="none" stroke="#d4a853" strokeWidth="1" />
							</svg>
						))}
					</div>

					<div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
						{/* Left — terminal */}
						<div style={{
							background: "var(--navy-light)",
							borderRadius: "12px",
							border: "1px solid rgba(212,168,83,0.12)",
							overflow: "hidden",
						}}>
							{/* Terminal title bar */}
							<div style={{
								padding: "12px 16px",
								borderBottom: "1px solid rgba(212,168,83,0.08)",
								display: "flex", alignItems: "center", gap: "8px",
							}}>
								<div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ff5f57" }} />
								<div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#febc2e" }} />
								<div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#28c840" }} />
								<span style={{ fontSize: "11px", color: "var(--cream-dim)", marginLeft: "12px" }}>~/doug-rogers</span>
							</div>
							{/* Terminal content */}
							<div style={{ padding: "24px", minHeight: "420px" }}>
								<TerminalText />
							</div>
						</div>

						{/* Right — headline */}
						<div>
							<h1 style={{
								fontFamily: "'Playfair Display', Georgia, serif",
								fontSize: "clamp(40px, 5vw, 64px)",
								fontWeight: 700,
								lineHeight: 1.1,
								marginBottom: "24px",
							}}>
								Ideas to products.{" "}
								<span style={{ color: "var(--amber)" }}>Zero to one.</span>
							</h1>
							<p style={{
								fontSize: "16px",
								lineHeight: 1.7,
								color: "var(--cream-dim)",
								maxWidth: "440px",
								marginBottom: "40px",
							}}>
								I'm not a theoretical advisor. I've raised capital, invested capital,
								pivoted, shipped, sold. I excel at taking a raw idea and turning
								it into something customers actually pay for.
							</p>
							<div style={{ display: "flex", gap: "16px" }}>
								<Link href="/connecting" style={{
									padding: "14px 32px",
									background: "var(--amber)",
									color: "var(--navy)",
									fontWeight: 500,
									fontSize: "13px",
									letterSpacing: "0.05em",
									borderRadius: "6px",
									transition: "all 0.2s",
								}}
								onMouseEnter={e => { (e.target as HTMLElement).style.background = "#e0b55e"; (e.target as HTMLElement).style.transform = "translateY(-2px)"; }}
								onMouseLeave={e => { (e.target as HTMLElement).style.background = "#d4a853"; (e.target as HTMLElement).style.transform = "translateY(0)"; }}
								>Get in Touch</Link>
								<Link href="/thinking" style={{
									padding: "14px 32px",
									border: "1px solid var(--amber-dim)",
									color: "var(--amber)",
									fontWeight: 400,
									fontSize: "13px",
									letterSpacing: "0.05em",
									borderRadius: "6px",
									transition: "all 0.2s",
								}}
								onMouseEnter={e => (e.target as HTMLElement).style.borderColor = "#d4a853"}
								onMouseLeave={e => (e.target as HTMLElement).style.borderColor = "rgba(212,168,83,0.3)"}
								>Read My Writing</Link>
							</div>
						</div>
					</div>
				</section>

				{/* Credential bar */}
				<section style={{
					borderTop: "1px solid rgba(212,168,83,0.08)",
					borderBottom: "1px solid rgba(212,168,83,0.08)",
					padding: "20px 40px",
				}}>
					<div style={{
						maxWidth: "1200px", margin: "0 auto",
						display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center",
						gap: "12px",
						fontSize: "12px", letterSpacing: "0.1em", color: "var(--cream-dim)",
					}}>
						{["YC Alum", "Techstars '24", "2 Exits", "25+ Years Building", "Accelerator Director"].map((item, i, arr) => (
							<span key={item} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
								{item}
								{i < arr.length - 1 && (
									<span style={{ color: "var(--amber)", fontSize: "8px" }}>◆</span>
								)}
							</span>
						))}
					</div>
				</section>

				{/* Three pillars */}
				<section style={{ padding: "100px 40px" }}>
					<div style={{ maxWidth: "1200px", margin: "0 auto" }}>
						<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0" }}>
							{[
								{
									num: "01",
									title: "Advising",
									desc: "Whatever mistake you're about to make, I probably already made it. Let's skip that part.",
									href: "/advising",
								},
								{
									num: "02",
									title: "Building",
									desc: "DubPrime (fintech, Techstars '24), VentureBuilder, and side projects when I can't sleep.",
									href: "/building",
								},
								{
									num: "03",
									title: "Investing",
									desc: "Small checks into founders with real revenue. Revenue over pitch decks, every time.",
									href: "/investing",
								},
							].map((item, i) => (
								<Link key={item.num} href={item.href} style={{
									padding: "48px 40px",
									borderLeft: i > 0 ? "1px solid rgba(212,168,83,0.08)" : "none",
									transition: "background 0.3s",
								}}
								onMouseEnter={e => (e.target as HTMLElement).closest("a")!.style.background = "rgba(212,168,83,0.03)"}
								onMouseLeave={e => (e.target as HTMLElement).closest("a")!.style.background = "transparent"}
								>
									<span style={{ fontSize: "11px", color: "var(--amber-dim)", display: "block", marginBottom: "16px" }}>
										{item.num}
									</span>
									<h3 style={{
										fontFamily: "'Playfair Display', Georgia, serif",
										fontSize: "28px", fontWeight: 700,
										marginBottom: "12px",
									}}>{item.title}</h3>
									<p style={{ fontSize: "13px", lineHeight: 1.7, color: "var(--cream-dim)" }}>
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
						<div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "40px" }}>
							<h2 style={{
								fontFamily: "'Playfair Display', Georgia, serif",
								fontSize: "32px", fontWeight: 700,
							}}>Writing</h2>
							<Link href="/thinking" style={{ fontSize: "12px", letterSpacing: "0.1em", color: "var(--amber-dim)", transition: "color 0.2s" }}
							onMouseEnter={e => (e.target as HTMLElement).style.color = "#d4a853"}
							onMouseLeave={e => (e.target as HTMLElement).style.color = "rgba(212,168,83,0.3)"}
							>ALL POSTS →</Link>
						</div>

						<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
							{ARTICLES.map((article, i) => (
								<Link key={i} href={article.href} style={{
									padding: "32px",
									background: "var(--navy-light)",
									borderRadius: "8px",
									border: "1px solid rgba(212,168,83,0.06)",
									transition: "all 0.3s",
								}}
								onMouseEnter={e => {
									const el = e.currentTarget as HTMLElement
									el.style.borderColor = "rgba(212,168,83,0.2)"
									el.style.transform = "translateY(-4px)"
								}}
								onMouseLeave={e => {
									const el = e.currentTarget as HTMLElement
									el.style.borderColor = "rgba(212,168,83,0.06)"
									el.style.transform = "translateY(0)"
								}}
								>
									<span style={{ fontSize: "10px", letterSpacing: "0.15em", color: "var(--amber-dim)", textTransform: "uppercase" as const }}>
										{article.category}
									</span>
									<h3 style={{
										fontFamily: "'Playfair Display', Georgia, serif",
										fontSize: "18px", fontWeight: 700,
										marginTop: "12px", lineHeight: 1.4,
									}}>{article.title}</h3>
								</Link>
							))}
						</div>
					</div>
				</section>

				{/* Photo + quote band */}
				<section style={{
					position: "relative",
					height: "400px",
					overflow: "hidden",
				}}>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src="/images/doug-nyc.jpg"
						alt="NYC Skyline"
						style={{
							position: "absolute", inset: 0,
							width: "100%", height: "100%",
							objectFit: "cover",
							filter: "sepia(0.4) saturate(0.6) brightness(0.35) hue-rotate(10deg)",
						}}
					/>
					<div style={{
						position: "absolute", inset: 0,
						background: "linear-gradient(to right, rgba(10,14,26,0.7), rgba(10,14,26,0.3))",
					}} />
					<div style={{
						position: "relative", zIndex: 1,
						height: "100%",
						display: "flex", alignItems: "center",
						padding: "0 48px",
						maxWidth: "1200px", margin: "0 auto",
					}}>
						<p style={{
							fontFamily: "'Playfair Display', Georgia, serif",
							fontSize: "clamp(28px, 3.5vw, 44px)",
							fontWeight: 700,
							lineHeight: 1.3,
							color: "var(--cream)",
							maxWidth: "600px",
						}}>
							"It's not how many mistakes you make.{" "}
							<span style={{ color: "var(--amber)" }}>
								It's how many you don't make twice."
							</span>
						</p>
					</div>
				</section>

				{/* Bottom CTA */}
				<section style={{
					padding: "80px 40px",
					textAlign: "center" as const,
				}}>
					<p style={{
						fontFamily: "'Playfair Display', Georgia, serif",
						fontSize: "clamp(28px, 3vw, 40px)",
						fontWeight: 700,
						maxWidth: "600px",
						margin: "0 auto 24px",
						lineHeight: 1.3,
					}}>
						Whatever you're struggling with,{" "}
						<span style={{ color: "var(--amber)", fontStyle: "italic" }}>I've been there.</span>
					</p>
					<p style={{ fontSize: "14px", color: "var(--cream-dim)", marginBottom: "32px" }}>
						Building something? Thinking about it? I'm around.
					</p>
					<Link href="/connecting" style={{
						display: "inline-block",
						padding: "14px 40px",
						background: "var(--amber)",
						color: "var(--navy)",
						fontWeight: 500,
						fontSize: "13px",
						letterSpacing: "0.05em",
						borderRadius: "6px",
						transition: "all 0.2s",
					}}
					onMouseEnter={e => { (e.target as HTMLElement).style.background = "#e0b55e"; (e.target as HTMLElement).style.transform = "translateY(-2px)"; }}
					onMouseLeave={e => { (e.target as HTMLElement).style.background = "#d4a853"; (e.target as HTMLElement).style.transform = "translateY(0)"; }}
					>Get in Touch</Link>
				</section>

				{/* Footer */}
				<footer style={{
					padding: "24px 40px",
					borderTop: "1px solid rgba(212,168,83,0.06)",
					display: "flex", justifyContent: "space-between",
					fontSize: "11px", color: "rgba(232,226,214,0.25)",
				}}>
					<span>doug.is</span>
					<span>built with coffee and spite</span>
				</footer>
			</div>
		</>
	)
}

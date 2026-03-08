"use client"

import { useEffect, useState } from "react"

/**
 * Home 11 — "The Contrast"
 *
 * SCRATCH BUILD. Black and off-white split. No imported anything.
 * Oversized type mixed with small mono details. Deep green + warm white palette.
 * Magazine editorial meets startup energy. Photo-forward.
 * Experience shown through confidence and specificity, not age-coded numbers.
 */

const ARTICLES = [
	{ title: "AI Slop Will Eat Itself", category: "Technology", href: "/thinking/about/technology/ai-slop-will-eat-itself" },
	{ title: "Planner/Executor: LLM-Guided Development", category: "Development", href: "/thinking/about/development/plannerexecutor-a-systematic-approach-to-llm-guided-development" },
	{ title: "The Migraine Trigger Foods Database", category: "Lifestyle", href: "/thinking/about/lifestyle/introducing-the-migraine-trigger-foods-database-mtfdb" },
]

export default function Home11() {
	const [scrollY, setScrollY] = useState(0)
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
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
				@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
				.h11 * { box-sizing: border-box; margin: 0; padding: 0; }
				.h11 a { text-decoration: none; color: inherit; }
				.h11 {
					--dark: #0c0c0c;
					--light: #f5f0e8;
					--green: #2d5a3d;
					--green-bright: #3d7a52;
					--green-dim: rgba(45,90,61,0.15);
					--mono: 'Space Mono', monospace;
					--sans: 'Space Grotesk', -apple-system, sans-serif;
					--serif: 'DM Serif Display', Georgia, serif;
				}
				@keyframes h11-slideUp {
					from { opacity: 0; transform: translateY(40px); }
					to { opacity: 1; transform: translateY(0); }
				}
				@keyframes h11-marquee {
					0% { transform: translateX(0); }
					100% { transform: translateX(-50%); }
				}
				.h11-marquee { animation: h11-marquee 30s linear infinite; }
			`}} />

			<div className="h11" style={{
				background: "var(--dark)",
				color: "var(--light)",
				minHeight: "100vh",
				fontFamily: "var(--sans)",
			}}>
				{/* Nav — minimal */}
				<nav style={{
					position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
					padding: "24px 48px",
					display: "flex", justifyContent: "space-between", alignItems: "center",
					background: scrollY > 80 ? "rgba(12,12,12,0.92)" : "transparent",
					backdropFilter: scrollY > 80 ? "blur(12px)" : "none",
					transition: "all 0.3s",
				}}>
					<a href="/" style={{
						fontFamily: "var(--serif)", fontSize: "22px",
					}}>
						doug.is
					</a>
					<div style={{ display: "flex", gap: "32px" }}>
						{[
							{ label: "advising", href: "/advising" },
							{ label: "building", href: "/building" },
							{ label: "investing", href: "/investing" },
							{ label: "writing", href: "/thinking" },
						].map(item => (
							<a key={item.label} href={item.href} style={{
								fontFamily: "var(--mono)", fontSize: "11px",
								letterSpacing: "0.08em",
								color: "rgba(245,240,232,0.4)",
								transition: "color 0.2s",
							}}
							onMouseEnter={e => (e.target as HTMLElement).style.color = "var(--green-bright)"}
							onMouseLeave={e => (e.target as HTMLElement).style.color = "rgba(245,240,232,0.4)"}
							>{item.label}</a>
						))}
					</div>
				</nav>

				{/* Hero — oversized type with photo */}
				<section style={{
					minHeight: "100vh",
					display: "flex",
					flexDirection: "column" as const,
					justifyContent: "center",
					padding: "120px 48px 80px",
					position: "relative",
				}}>
					{/* Floating photo — right side */}
					<div style={{
						position: "absolute",
						right: "48px",
						top: "50%",
						transform: "translateY(-50%)",
						width: "280px",
						height: "380px",
						borderRadius: "8px",
						overflow: "hidden",
						opacity: 0.25,
					}}>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src="/images/doug-2024-cropped-compr.png"
							alt=""
							style={{
								width: "100%", height: "100%",
								objectFit: "cover",
								filter: "grayscale(1) contrast(1.2)",
								mixBlendMode: "luminosity",
							}}
						/>
					</div>
					<div style={{ maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
						{/* Small intro */}
						<div style={{
							fontFamily: "var(--mono)", fontSize: "12px",
							letterSpacing: "0.15em", color: "var(--green-bright)",
							marginBottom: "32px",
							opacity: mounted ? 1 : 0,
							transform: mounted ? "translateY(0)" : "translateY(20px)",
							transition: "all 0.6s ease 0.2s",
						}}>
							DOUG ROGERS — ENGINEER, ADVISOR, INVESTOR
						</div>

						{/* Big headline */}
						<h1 style={{
							fontFamily: "var(--serif)",
							fontSize: "clamp(48px, 7vw, 96px)",
							lineHeight: 1.05,
							marginBottom: "40px",
							maxWidth: "900px",
							opacity: mounted ? 1 : 0,
							transform: mounted ? "translateY(0)" : "translateY(30px)",
							transition: "all 0.8s ease 0.3s",
						}}>
							I take raw ideas and turn them into{" "}
							<span style={{
								fontStyle: "italic",
								color: "var(--green-bright)",
							}}>products people pay&nbsp;for</span>
						</h1>

						{/* Sub + CTA */}
						<div style={{
							display: "flex", gap: "60px", alignItems: "flex-end",
							opacity: mounted ? 1 : 0,
							transform: mounted ? "translateY(0)" : "translateY(20px)",
							transition: "all 0.8s ease 0.5s",
						}}>
							<p style={{
								fontSize: "16px", lineHeight: 1.7,
								color: "rgba(245,240,232,0.5)",
								maxWidth: "420px",
							}}>
								Multiple startups, two exits, YC and Techstars.
								I help founders who need someone in their corner
								who's already been through it.
							</p>
							<div style={{ display: "flex", gap: "16px" }}>
								<a href="/connecting" style={{
									padding: "14px 32px",
									background: "var(--green)",
									color: "var(--light)",
									fontFamily: "var(--mono)",
									fontSize: "12px",
									letterSpacing: "0.05em",
									borderRadius: "4px",
									transition: "all 0.2s",
								}}
								onMouseEnter={e => { (e.target as HTMLElement).style.background = "var(--green-bright)"; (e.target as HTMLElement).style.transform = "translateY(-2px)"; }}
								onMouseLeave={e => { (e.target as HTMLElement).style.background = "var(--green)"; (e.target as HTMLElement).style.transform = "translateY(0)"; }}
								>GET IN TOUCH</a>
								<a href="/thinking" style={{
									padding: "14px 32px",
									border: "1px solid rgba(245,240,232,0.12)",
									color: "rgba(245,240,232,0.6)",
									fontFamily: "var(--mono)",
									fontSize: "12px",
									letterSpacing: "0.05em",
									borderRadius: "4px",
									transition: "all 0.2s",
								}}
								onMouseEnter={e => (e.target as HTMLElement).style.borderColor = "var(--green-bright)"}
								onMouseLeave={e => (e.target as HTMLElement).style.borderColor = "rgba(245,240,232,0.12)"}
								>MY WRITING</a>
							</div>
						</div>
					</div>
				</section>

				{/* Scrolling credential ticker — single row */}
				<section style={{
					overflow: "hidden",
					borderTop: "1px solid rgba(245,240,232,0.06)",
					borderBottom: "1px solid rgba(245,240,232,0.06)",
					padding: "16px 0",
				}}>
					<div className="h11-marquee" style={{
						display: "flex", gap: "48px",
						whiteSpace: "nowrap" as const,
						fontFamily: "var(--mono)",
						fontSize: "12px",
						letterSpacing: "0.1em",
						color: "rgba(245,240,232,0.2)",
					}}>
						{[...Array(2)].map((_, rep) => (
							<span key={rep} style={{ display: "flex", gap: "48px" }}>
								{["YC ALUM", "TECHSTARS '24", "2 EXITS", "25+ YEARS BUILDING", "ACCELERATOR DIRECTOR", "RAPID PROTOTYPING", "IDEA VALIDATION", "0→1 SPECIALIST"].map((item, i) => (
									<span key={`${rep}-${i}`} style={{ display: "flex", alignItems: "center", gap: "48px" }}>
										{item}
										<span style={{ color: "var(--green-bright)", opacity: 0.4 }}>◆</span>
									</span>
								))}
							</span>
						))}
					</div>
				</section>

				{/* Light section — what I do */}
				<section style={{
					background: "var(--light)",
					color: "var(--dark)",
					padding: "100px 48px",
				}}>
					<div style={{ maxWidth: "1200px", margin: "0 auto" }}>
						<div style={{
							fontFamily: "var(--mono)", fontSize: "11px",
							letterSpacing: "0.15em", color: "var(--green)",
							marginBottom: "32px",
						}}>
							WHAT I DO
						</div>

						<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0" }}>
							{[
								{
									title: "Advising",
									desc: "Rapid prototyping, idea validation, ICP identification. I help you figure out what to build and who to build it for.",
									href: "/advising",
								},
								{
									title: "Building",
									desc: "DubPrime (fintech, Techstars '24), VentureBuilder (venture studio), and whatever I'm tinkering with at 2am.",
									href: "/building",
								},
								{
									title: "Investing",
									desc: "Small checks into founders with real traction. I've been on both sides of the table and I prefer this one.",
									href: "/investing",
								},
							].map((item, i) => (
								<a key={item.title} href={item.href} style={{
									padding: "40px",
									borderLeft: i > 0 ? "1px solid rgba(12,12,12,0.08)" : "none",
									transition: "background 0.3s",
								}}
								onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--green-dim)"}
								onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
								>
									<h3 style={{
										fontFamily: "var(--serif)",
										fontSize: "32px",
										marginBottom: "16px",
									}}>{item.title}</h3>
									<p style={{
										fontSize: "14px", lineHeight: 1.7,
										color: "rgba(12,12,12,0.55)",
									}}>{item.desc}</p>
								</a>
							))}
						</div>
					</div>
				</section>

				{/* Big quote — dark */}
				<section style={{
					padding: "100px 48px",
					textAlign: "center" as const,
				}}>
					<blockquote style={{
						fontFamily: "var(--serif)",
						fontSize: "clamp(32px, 4vw, 56px)",
						lineHeight: 1.3,
						maxWidth: "800px",
						margin: "0 auto",
						fontStyle: "italic",
					}}>
						Whatever you're struggling with,{" "}
						<span style={{ color: "var(--green-bright)" }}>I've been there</span>
					</blockquote>
					<p style={{
						fontFamily: "var(--mono)",
						fontSize: "13px",
						color: "rgba(245,240,232,0.35)",
						marginTop: "32px",
						maxWidth: "500px",
						margin: "32px auto 0",
						lineHeight: 1.7,
					}}>
						I'm not a theoretical advisor. I've raised money, lost money,
						pivoted, shipped, sold. I excel at taking a raw idea and turning
						it into something customers actually pay for.
					</p>
				</section>

				{/* Articles — light section */}
				<section style={{
					background: "var(--light)",
					color: "var(--dark)",
					padding: "80px 48px",
				}}>
					<div style={{ maxWidth: "1200px", margin: "0 auto" }}>
						<div style={{
							display: "flex", justifyContent: "space-between",
							alignItems: "baseline", marginBottom: "40px",
						}}>
							<h2 style={{ fontFamily: "var(--serif)", fontSize: "36px" }}>
								Writing
							</h2>
							<a href="/thinking" style={{
								fontFamily: "var(--mono)", fontSize: "12px",
								letterSpacing: "0.1em", color: "var(--green)",
							}}>ALL POSTS →</a>
						</div>

						<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px" }}>
							{ARTICLES.map((article, i) => (
								<a key={i} href={article.href} style={{
									padding: "28px 0",
									borderTop: "2px solid rgba(12,12,12,0.06)",
									transition: "border-color 0.3s",
								}}
								onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--green)"}
								onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(12,12,12,0.06)"}
								>
									<span style={{
										fontFamily: "var(--mono)", fontSize: "10px",
										letterSpacing: "0.15em",
										color: "var(--green)",
										textTransform: "uppercase" as const,
									}}>{article.category}</span>
									<h3 style={{
										fontFamily: "var(--serif)", fontSize: "20px",
										marginTop: "10px", lineHeight: 1.4,
									}}>{article.title}</h3>
								</a>
							))}
						</div>
					</div>
				</section>

				{/* CTA */}
				<section style={{
					padding: "100px 48px",
					textAlign: "center" as const,
				}}>
					<h2 style={{
						fontFamily: "var(--serif)",
						fontSize: "clamp(36px, 4vw, 52px)",
						marginBottom: "24px",
					}}>
						Let's build something<span style={{ color: "var(--green-bright)" }}>.</span>
					</h2>
					<a href="/connecting" style={{
						display: "inline-block",
						padding: "16px 40px",
						background: "var(--green)",
						color: "var(--light)",
						fontFamily: "var(--mono)",
						fontSize: "12px",
						letterSpacing: "0.05em",
						borderRadius: "4px",
						transition: "all 0.2s",
					}}
					onMouseEnter={e => { (e.target as HTMLElement).style.background = "var(--green-bright)"; (e.target as HTMLElement).style.transform = "translateY(-2px)"; }}
					onMouseLeave={e => { (e.target as HTMLElement).style.background = "var(--green)"; (e.target as HTMLElement).style.transform = "translateY(0)"; }}
					>GET IN TOUCH</a>
				</section>

				{/* Footer */}
				<footer style={{
					padding: "24px 48px",
					borderTop: "1px solid rgba(245,240,232,0.06)",
					display: "flex", justifyContent: "space-between",
					fontFamily: "var(--mono)",
					fontSize: "11px", color: "rgba(245,240,232,0.2)",
				}}>
					<span>doug.is</span>
					<span>built with coffee and spite</span>
				</footer>
			</div>
		</>
	)
}

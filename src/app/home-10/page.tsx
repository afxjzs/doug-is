"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

/**
 * Home 10 — "The Editorial"
 *
 * SCRATCH BUILD. Warm cream/charcoal palette with a burnt orange accent.
 * Editorial magazine feel. Large serif type. Warm, inviting, smart.
 * Light-first design (opposite of the dark defaults).
 * Shows experience through confidence, not through numbers.
 */

const ARTICLES = [
	{ title: "AI Slop Will Eat Itself", category: "Technology", href: "/thinking/about/technology/ai-slop-will-eat-itself" },
	{ title: "Planner/Executor: LLM-Guided Development", category: "Development", href: "/thinking/about/development/plannerexecutor-a-systematic-approach-to-llm-guided-development" },
	{ title: "The Migraine Trigger Foods Database", category: "Lifestyle", href: "/thinking/about/lifestyle/introducing-the-migraine-trigger-foods-database-mtfdb" },
]

export default function Home10() {
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
				@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&family=Inter:wght@300;400;500;600&display=swap');
				.h10 * { box-sizing: border-box; margin: 0; padding: 0; }
				.h10 a { text-decoration: none; color: inherit; }
				.h10 {
					--bg: #faf7f2;
					--fg: #1a1a18;
					--fg-dim: rgba(26,26,24,0.5);
					--fg-faint: rgba(26,26,24,0.12);
					--accent: #c4572a;
					--accent-dim: rgba(196,87,42,0.15);
					--serif: 'Source Serif 4', Georgia, serif;
					--sans: 'Inter', -apple-system, sans-serif;
				}
				@keyframes h10-reveal {
					from { opacity: 0; transform: translateY(30px); }
					to { opacity: 1; transform: translateY(0); }
				}
				.h10-reveal { animation: h10-reveal 0.8s ease-out forwards; }
				.h10-reveal-delay { animation: h10-reveal 0.8s ease-out 0.2s forwards; opacity: 0; }
				.h10-reveal-delay2 { animation: h10-reveal 0.8s ease-out 0.4s forwards; opacity: 0; }
			`}} />

			<div className="h10" style={{
				background: "var(--bg)",
				color: "var(--fg)",
				minHeight: "100vh",
				fontFamily: "var(--sans)",
			}}>
				{/* Nav */}
				<nav style={{
					position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
					padding: "20px 48px",
					display: "flex", justifyContent: "space-between", alignItems: "center",
					background: scrollY > 50 ? "rgba(250,247,242,0.92)" : "transparent",
					backdropFilter: scrollY > 50 ? "blur(20px)" : "none",
					borderBottom: scrollY > 50 ? "1px solid var(--fg-faint)" : "1px solid transparent",
					transition: "all 0.3s ease",
				}}>
					<Link href="/" style={{
						fontFamily: "var(--serif)", fontSize: "20px", fontWeight: 700,
						color: "var(--fg)",
					}}>
						doug.is
					</Link>
					<div style={{ display: "flex", gap: "36px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.02em" }}>
						{[
							{ label: "advising", href: "/advising" },
							{ label: "building", href: "/building" },
							{ label: "investing", href: "/investing" },
							{ label: "writing", href: "/thinking" },
							{ label: "contact", href: "/connecting" },
						].map(item => (
							<Link key={item.label} href={item.href} style={{
								color: "var(--fg-dim)", transition: "color 0.2s",
							}}
							onMouseEnter={e => (e.target as HTMLElement).style.color = "var(--accent)"}
							onMouseLeave={e => (e.target as HTMLElement).style.color = "rgba(26,26,24,0.5)"}
							>{item.label}</Link>
						))}
					</div>
				</nav>

				{/* Hero */}
				<section style={{
					minHeight: "100vh",
					display: "flex", alignItems: "center",
					padding: "0 48px",
					maxWidth: "1280px", margin: "0 auto",
				}}>
					<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center", width: "100%" }}>
					<div>
						<div className="h10-reveal" style={{
							fontSize: "13px", fontWeight: 500, letterSpacing: "0.15em",
							color: "var(--accent)", marginBottom: "24px",
							textTransform: "uppercase" as const,
						}}>
							Engineer / Advisor / Investor
						</div>
						<h1 className="h10-reveal" style={{
							fontFamily: "var(--serif)",
							fontSize: "clamp(48px, 6vw, 80px)",
							fontWeight: 700,
							lineHeight: 1.08,
							marginBottom: "32px",
							letterSpacing: "-0.02em",
						}}>
							I turn ideas into
							<br />
							products that{" "}
							<span style={{
								fontStyle: "italic",
								color: "var(--accent)",
							}}>people pay&nbsp;for</span>
						</h1>
						<p className="h10-reveal-delay" style={{
							fontSize: "18px",
							lineHeight: 1.7,
							color: "var(--fg-dim)",
							maxWidth: "540px",
							marginBottom: "48px",
						}}>
							Multiple startups, two exits, YC and Techstars. I help founders
							who need someone in their corner who's already been through it.
						</p>
						<div className="h10-reveal-delay2" style={{ display: "flex", gap: "16px", alignItems: "center" }}>
							<Link href="/connecting" style={{
								padding: "16px 36px",
								background: "var(--accent)",
								color: "var(--bg)",
								fontWeight: 600,
								fontSize: "14px",
								borderRadius: "4px",
								transition: "all 0.2s",
							}}
							onMouseEnter={e => { (e.target as HTMLElement).style.background = "#d4632f"; (e.target as HTMLElement).style.transform = "translateY(-2px)"; }}
							onMouseLeave={e => { (e.target as HTMLElement).style.background = "#c4572a"; (e.target as HTMLElement).style.transform = "translateY(0)"; }}
							>Get in Touch</Link>
							<Link href="/thinking" style={{
								padding: "16px 36px",
								border: "1.5px solid var(--fg-faint)",
								color: "var(--fg)",
								fontWeight: 500,
								fontSize: "14px",
								borderRadius: "4px",
								transition: "all 0.2s",
							}}
							onMouseEnter={e => (e.target as HTMLElement).style.borderColor = "var(--accent)"}
							onMouseLeave={e => (e.target as HTMLElement).style.borderColor = "rgba(26,26,24,0.12)"}
							>Read My Writing</Link>
						</div>
					</div>

					{/* Photo */}
					<div style={{
						position: "relative",
						aspectRatio: "3/4",
						borderRadius: "8px",
						overflow: "hidden",
					}}>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src="/images/doug-2024-cropped-compr.png"
							alt="Doug Rogers"
							style={{
								width: "100%", height: "100%",
								objectFit: "cover",
								filter: "grayscale(1) contrast(1.1)",
							}}
						/>
						<div style={{
							position: "absolute", bottom: 0, left: 0, right: 0,
							padding: "24px",
							background: "linear-gradient(to top, rgba(26,26,24,0.8), transparent)",
						}}>
							<div style={{
								display: "flex", gap: "16px",
								fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em",
								color: "rgba(250,247,242,0.7)",
							}}>
								{["YC Alum", "Techstars '24", "2 Exits"].map((item, i) => (
									<span key={i}>{item}</span>
								))}
							</div>
						</div>
					</div>
					</div>
				</section>

				{/* Horizontal rule with accent */}
				<div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px" }}>
					<div style={{ height: "1px", background: "var(--fg-faint)", position: "relative" }}>
						<div style={{ position: "absolute", left: 0, top: 0, height: "1px", width: "120px", background: "var(--accent)" }} />
					</div>
				</div>

				{/* What I Do */}
				<section style={{ padding: "100px 48px", maxWidth: "1280px", margin: "0 auto" }}>
					<div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "80px" }}>
						<div>
							<h2 style={{
								fontFamily: "var(--serif)", fontSize: "36px", fontWeight: 700,
								lineHeight: 1.2, letterSpacing: "-0.01em",
							}}>
								What I<br />actually do
							</h2>
						</div>
						<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "48px" }}>
							{[
								{
									title: "Advising",
									desc: "Whatever mistake you're about to make, I probably already made it. Let's skip that part.",
									href: "/advising",
								},
								{
									title: "Building",
									desc: "DubPrime, VentureBuilder, and side projects. Shipping is a lifestyle.",
									href: "/building",
								},
								{
									title: "Investing",
									desc: "Small checks into founders with real revenue. Revenue over pitch decks.",
									href: "/investing",
								},
							].map((item) => (
								<Link key={item.title} href={item.href} style={{
									borderTop: "2px solid var(--fg-faint)",
									paddingTop: "24px",
									transition: "border-color 0.3s",
								}}
								onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "#c4572a"}
								onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(26,26,24,0.12)"}
								>
									<h3 style={{
										fontFamily: "var(--serif)", fontSize: "24px", fontWeight: 600,
										marginBottom: "12px",
									}}>{item.title}</h3>
									<p style={{
										fontSize: "14px", lineHeight: 1.7, color: "var(--fg-dim)",
									}}>{item.desc}</p>
								</Link>
							))}
						</div>
					</div>
				</section>

				{/* Pull quote */}
				<section style={{
					padding: "80px 48px",
					background: "var(--fg)",
					color: "var(--bg)",
				}}>
					<div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" as const }}>
						<blockquote style={{
							fontFamily: "var(--serif)",
							fontSize: "clamp(28px, 3.5vw, 42px)",
							fontWeight: 300,
							lineHeight: 1.4,
							fontStyle: "italic",
						}}>
							"It's not how many mistakes you make.
							It's how many you don't make twice."
						</blockquote>
					</div>
				</section>

				{/* Writing */}
				<section style={{ padding: "100px 48px", maxWidth: "1280px", margin: "0 auto" }}>
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "48px" }}>
						<h2 style={{
							fontFamily: "var(--serif)", fontSize: "36px", fontWeight: 700,
						}}>Writing</h2>
						<Link href="/thinking" style={{
							fontSize: "13px", fontWeight: 500, color: "var(--accent)",
							letterSpacing: "0.05em",
						}}>All Articles →</Link>
					</div>

					<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px" }}>
						{ARTICLES.map((article, i) => (
							<Link key={i} href={article.href} style={{
								borderTop: "2px solid var(--fg-faint)",
								paddingTop: "24px",
								transition: "border-color 0.3s",
							}}
							onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "#c4572a"}
							onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(26,26,24,0.12)"}
							>
								<span style={{
									fontSize: "11px", letterSpacing: "0.12em",
									color: "var(--accent)", textTransform: "uppercase" as const,
									fontWeight: 500,
								}}>{article.category}</span>
								<h3 style={{
									fontFamily: "var(--serif)", fontSize: "20px", fontWeight: 600,
									marginTop: "12px", lineHeight: 1.4,
								}}>{article.title}</h3>
							</Link>
						))}
					</div>
				</section>

				{/* CTA */}
				<section style={{
					padding: "80px 48px",
					textAlign: "center" as const,
					borderTop: "1px solid var(--fg-faint)",
				}}>
					<h2 style={{
						fontFamily: "var(--serif)",
						fontSize: "clamp(32px, 4vw, 48px)",
						fontWeight: 700,
						marginBottom: "16px",
						letterSpacing: "-0.01em",
					}}>
						Let's build something<span style={{ color: "var(--accent)" }}>.</span>
					</h2>
					<p style={{ fontSize: "16px", color: "var(--fg-dim)", marginBottom: "32px" }}>
						Building something? Thinking about it? I'm around.
					</p>
					<Link href="/connecting" style={{
						display: "inline-block",
						padding: "16px 40px",
						background: "var(--accent)",
						color: "var(--bg)",
						fontWeight: 600,
						fontSize: "14px",
						borderRadius: "4px",
						transition: "all 0.2s",
					}}
					onMouseEnter={e => { (e.target as HTMLElement).style.background = "#d4632f"; (e.target as HTMLElement).style.transform = "translateY(-2px)"; }}
					onMouseLeave={e => { (e.target as HTMLElement).style.background = "#c4572a"; (e.target as HTMLElement).style.transform = "translateY(0)"; }}
					>Get in Touch</Link>
				</section>

				{/* Footer */}
				<footer style={{
					padding: "24px 48px",
					borderTop: "1px solid var(--fg-faint)",
					display: "flex", justifyContent: "space-between",
					fontSize: "12px", color: "var(--fg-dim)",
				}}>
					<span style={{ fontFamily: "var(--serif)", fontWeight: 600 }}>doug.is</span>
					<span>built with coffee and spite</span>
				</footer>
			</div>
		</>
	)
}

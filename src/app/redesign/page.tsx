import Link from "next/link"

const pages = [
	{ href: "/home-1", name: "Home 1 — The Architect", desc: "Full-bleed NYC hero, geometric grid, monochrome + accent" },
	{ href: "/home-2", name: "Home 2 — The Terminal", desc: "Split hero with B&W headshot, monospace accents, hexagon motif" },
	{ href: "/home-3", name: "Home 3 — The Manifesto", desc: "Full-bleed NYC hero, editorial feel, asymmetric card layout" },
	{ href: "/home-4", name: "Home 4 — The Bento", desc: "Bento grid, animated gradient borders, colorful gradient text" },
	{ href: "/home-5", name: "Home 5 — Low Poly", desc: "SVG triangulated mesh background, glassmorphism cards" },
	{ href: "/home-6", name: "Home 6 — The Marquee", desc: "Scrolling credential ticker, clip-path diagonal hero" },
	{ href: "/home-7", name: "Home 7 — The Split", desc: "Sticky left panel + scrolling right content, two-column layout" },
	{ href: "/home-8", name: "Home 8 — The Brutalist", desc: "Anti-design, oversized type, monospace, terminal whoami" },
	{ href: "/home-9", name: "Home 9 — The Terminal (Scratch)", desc: "Navy + amber, typing terminal animation, own nav/fonts/layout" },
	{ href: "/home-10", name: "Home 10 — The Editorial (Scratch)", desc: "Light cream + burnt orange, serif editorial, own layout" },
	{ href: "/home-11", name: "Home 11 — The Contrast (Scratch)", desc: "Black + off-white + forest green, alternating sections, own layout" },
]

export default function RedesignIndex() {
	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-12">
				<p className="text-lg text-[rgba(var(--color-foreground),0.7)] mb-2">
					doug.is/redesign
				</p>
				<h1 className="text-4xl font-bold gradient-heading mb-4">
					Homepage Redesign
				</h1>
				<p className="text-[rgba(var(--color-foreground),0.6)]">
					{pages.length} variations. Pages 9–11 are scratch builds with their own layout, fonts, and color scheme.
				</p>
			</div>

			<div className="grid grid-cols-1 gap-4">
				{pages.map((page, i) => (
					<Link
						key={page.href}
						href={page.href}
						className="group flex items-baseline gap-6 p-6 rounded-lg border border-[rgba(var(--color-border),0.08)] hover:border-[rgba(var(--color-accent),0.3)] hover:bg-[rgba(var(--color-foreground),0.02)] transition-all duration-200"
					>
						<span className="font-mono text-sm text-[rgba(var(--color-accent),0.4)] shrink-0 w-8">
							{String(i + 1).padStart(2, "0")}
						</span>
						<div className="flex-1 min-w-0">
							<h2 className="text-lg font-semibold group-hover:text-[rgb(var(--color-accent))] transition-colors">
								{page.name}
							</h2>
							<p className="text-sm text-[rgba(var(--color-foreground),0.45)] mt-1">
								{page.desc}
							</p>
						</div>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4 text-[rgba(var(--color-foreground),0.2)] group-hover:text-[rgb(var(--color-accent))] group-hover:translate-x-1 transition-all shrink-0"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
								clipRule="evenodd"
							/>
						</svg>
					</Link>
				))}
			</div>
		</div>
	)
}

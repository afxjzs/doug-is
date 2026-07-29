"use client"

import Link from "next/link"
import Image from "next/image"
import { useClientEventTracking } from "@/lib/analytics"

// Companies I'm currently building
const companies = [
	{
		id: "gaius",
		title: "GAIuS",
		description:
			"Explainable AI for high-stakes decisions. GAIuS shows its work: every decision traces back to rules you can read and audit. Built for industries where \"the model said so\" doesn't cut it — defense, fintech, construction.",
		role: "Co-Founder (via DubPrime)",
		image: "/images/gaius-logo-wide-dark-bg.png",
		website: "https://gaius.fyi",
		tags: ["AI", "Explainable AI", "Defense", "Fintech", "Construction"],
		color: "amber",
	},
	{
		id: "dubprime",
		title: "DubPrime",
		description:
			"DubPrime connects investors looking to diversify with borrowers who need fast capital. We spread investments across thousands of small loans, so no single default hurts much. It's a simpler, more resilient model than most alternatives.",
		role: "Co-Founder, CPO/CTO",
		image: "/images/dubprime-grad-horizontal.png",
		website: "https://www.dubprime.com/",
		tags: ["Fintech", "SaaS", "Enterprise", "Techstars '24"],
		color: "cyan",
	},
	{
		id: "venturebuilder",
		title: "VentureBuilder",
		description:
			"A venture studio that pairs startups with industrial partners. The idea is simple: real customers and real revenue from day one, not just VC money and hope.",
		role: "Director of Pilot Programs",
		image: "/images/venture-builder-color-white.webp",
		website: "https://venturebuilder.vc/",
		tags: ["Venture Studio", "Corporate Innovation", "B2B"],
		color: "emerald",
	},
]

// Side projects
const projects = [
	{
		id: "migraine-free",
		title: "Migraine Trigger Database",
		description:
			"A database of foods and ingredients that can trigger migraines, with their chemical triggers and categories. I get migraines, so I built this to figure out what to avoid.",
		image: "/images/projects/migraine-square.webp",
		tags: ["Next.js", "Supabase", "PostgreSQL", "TypeScript"],
		link: "/migraine-free",
	},
	{
		id: "hopping-list",
		title: "Hopping List",
		description:
			"A dynamic shopping list app that lets you see what items you need at each specific store.",
		image: "/images/projects/hopping-list-logo.png",
		tags: ["Flutter", "FlutterFlow", "Supabase", "PostgreSQL"],
		link: "/building/hopping-list",
		github: "https://github.com/afxjzs/hoppinglist",
		testflight: "https://testflight.apple.com/join/CscPEAD4",
	},
	{
		id: "oil-price-ticker",
		title: "Oil Price Ticker",
		description:
			"A macOS menu bar app that displays live oil price updates with customizable preferences.",
		image: "/images/projects/oil-price-ticker/oil-price-icon.png",
		tags: ["macOS", "Swift", "Menu Bar", "Live Data", "Objective-C"],
		link: "/building/oil-price-ticker",
		github: "https://github.com/afxjzs/oil-price-ticker",
	},
	{
		id: "inn",
		title: "Inn Ruby Gem",
		description:
			"A simple Ruby gem that adds the .in? method as an inverse of Ruby's .include? method.",
		image: "/images/ruby-gems-logo.png",
		tags: ["Ruby", "RubyGems", "Open Source"],
		link: "/building/inn",
		github: "https://github.com/afxjzs/inn",
		rubyGems: "https://rubygems.org/gems/inn",
	},
]

export default function BuildingPage() {
	const {
		trackPortfolioCompanyClick,
		trackPortfolioProjectClick,
		trackPortfolioExternalLink,
	} = useClientEventTracking()

	const handleCompanyClick = (
		companyId: string,
		companyName: string,
		linkType: "website"
	) => {
		trackPortfolioCompanyClick(companyId, companyName, linkType)
	}

	const handleProjectClick = (
		projectId: string,
		projectName: string,
		linkType: "details" | "image"
	) => {
		trackPortfolioProjectClick(projectId, projectName, linkType)
	}

	const handleExternalLinkClick = (
		projectId: string,
		linkType: "github" | "testflight" | "rubygems",
		url: string
	) => {
		trackPortfolioExternalLink(projectId, linkType, url)
	}

	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-12">
				<p className="font-[family-name:var(--font-mono)] text-xs tracking-[0.1em] text-[rgba(var(--color-accent),0.75)] mb-2">
					doug.is/building
				</p>
				<h1 className="text-4xl font-bold display-heading mb-4">Building</h1>
				<p className="text-xl text-[rgba(var(--color-foreground),0.8)]">
					Companies and projects I'm building or have built.
				</p>
			</div>

			{/* Companies Section */}
			<div className="mb-16">
				<h2 className="text-3xl font-semibold display-heading mb-8">
					Companies
				</h2>
				<div className="grid grid-cols-1 gap-8">
					{companies.map((company, i) => (
						<div
							key={company.id}
							className="bg-[rgba(var(--color-foreground),0.03)] border border-[rgba(var(--color-border),0.08)] hover:border-[rgba(var(--color-border),0.2)] hover:-translate-y-1 rounded-xl overflow-hidden group"
							style={{
								transition:
									"border-color var(--dur-base) var(--ease-out), translate var(--dur-base) var(--ease-out)",
							}}
						>
							<div className="flex flex-col md:flex-row">
								<div className="md:w-2/5 bg-[rgb(var(--color-background))] flex items-center justify-center p-8 rounded-xl overflow-hidden">
									<div className="w-full h-full flex items-center justify-center">
										<div className="relative w-full h-[140px] overflow-hidden rounded-xl">
											<Image
												src={company.image}
												alt={company.title}
												fill
												className="object-contain group-hover:scale-[1.04] rounded-xl"
												style={{ transition: "scale var(--dur-slow) var(--ease-out)" }}
												priority={i === 0}
											/>
										</div>
									</div>
								</div>
								<div className="p-8 md:w-3/5">
									<h3 className="text-2xl font-bold text-[rgba(var(--color-foreground),0.95)] mb-2">
										{company.title}
									</h3>
									<p className="text-[rgb(var(--color-accent))] font-medium mb-3">
										{company.role}
									</p>
									<p className="text-[rgba(var(--color-foreground),0.7)] mb-5 leading-relaxed">
										{company.description}
									</p>
									<div className="flex flex-wrap gap-x-4 gap-y-2 mb-5">
										{company.tags.map((tag) => (
											<span
												key={tag}
												className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.15em] text-[rgba(var(--color-accent),0.75)]"
											>
												{tag}
											</span>
										))}
									</div>
									<div className="flex flex-wrap gap-4">
										<Link
											href={company.website}
											target="_blank"
											rel="noopener noreferrer"
											className={`btn-primary text-sm py-2`}
											onClick={() =>
												handleCompanyClick(company.id, company.title, "website")
											}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4 inline-block mr-1"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<circle cx="12" cy="12" r="10"></circle>
												<line x1="2" y1="12" x2="22" y2="12"></line>
												<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
											</svg>
											Visit Website
										</Link>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Projects Section */}
			<div className="mb-16">
				<h2 className="text-3xl font-semibold display-heading mb-8">
					Projects
				</h2>
				<div className="grid grid-cols-1 gap-8">
					{projects.map((project) => (
						<div
							key={project.id}
							className="bg-[rgba(var(--color-foreground),0.03)] border border-[rgba(var(--color-border),0.08)] hover:border-[rgba(var(--color-border),0.2)] hover:-translate-y-1 rounded-xl overflow-hidden group"
							style={{
								transition:
									"border-color var(--dur-base) var(--ease-out), translate var(--dur-base) var(--ease-out)",
							}}
						>
							<div className="flex flex-col md:flex-row">
								<div className="md:w-2/5 bg-[rgb(var(--color-background))] flex items-center justify-center p-8 rounded-xl overflow-hidden">
									<div className="w-full h-full flex items-center justify-center">
										<div className="relative w-full h-[200px] overflow-hidden rounded-xl">
											{project.link ? (
												<Link
													href={project.link}
													onClick={() =>
														handleProjectClick(
															project.id,
															project.title,
															"image"
														)
													}
												>
													<Image
														src={project.image}
														alt={project.title}
														fill
														className="object-contain group-hover:scale-[1.04] rounded-xl"
														style={{ transition: "scale var(--dur-slow) var(--ease-out)" }}
													/>
												</Link>
											) : (
												<Image
													src={project.image}
													alt={project.title}
													fill
													className="object-contain group-hover:scale-[1.04] rounded-xl"
													style={{ transition: "scale var(--dur-slow) var(--ease-out)" }}
												/>
											)}
										</div>
									</div>
								</div>
								<div className="p-6 md:w-3/5">
									{project.link ? (
										<Link
											href={project.link}
											className="hover:no-underline"
											onClick={() =>
												handleProjectClick(project.id, project.title, "details")
											}
										>
											<h3
												className="text-2xl font-bold text-[rgba(var(--color-foreground),0.9)] mb-2 group-hover:text-[rgb(var(--color-accent))]"
												style={{ transition: "color var(--dur-base) var(--ease-out)" }}
											>
												{project.title}
											</h3>
										</Link>
									) : (
										<h3
											className="text-2xl font-bold text-[rgba(var(--color-foreground),0.9)] mb-2"
										>
											{project.title}
										</h3>
									)}
									<p className="text-[rgba(var(--color-foreground),0.7)] mb-4">
										{project.description}
									</p>
									<div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
										{project.tags.map((tag) => (
											<span
												key={tag}
												className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.15em] text-[rgba(var(--color-accent),0.75)]"
											>
												{tag}
											</span>
										))}
									</div>
									<div className="flex flex-wrap gap-4">
										{project.link && (
											<Link
												href={project.link}
												className="btn-primary"
												onClick={() =>
													handleProjectClick(
														project.id,
														project.title,
														"details"
													)
												}
											>
												View Project Details
											</Link>
										)}

										{project.github && (
											<Link
												href={project.github}
												target="_blank"
												rel="noopener noreferrer"
												className="text-[rgba(var(--color-foreground),0.7)] hover:text-[rgba(var(--color-foreground),0.9)] transition-colors"
												onClick={() =>
													handleExternalLinkClick(
														project.id,
														"github",
														project.github
													)
												}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-5 w-5 inline-block mr-1"
													viewBox="0 0 24 24"
													fill="currentColor"
												>
													<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
												</svg>
												GitHub
											</Link>
										)}

										{project.testflight && (
											<Link
												href={project.testflight}
												target="_blank"
												rel="noopener noreferrer"
												className="text-[rgba(var(--color-foreground),0.7)] hover:text-[rgba(var(--color-foreground),0.9)] transition-colors"
												onClick={() =>
													handleExternalLinkClick(
														project.id,
														"testflight",
														project.testflight
													)
												}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-5 w-5 inline-block mr-1"
													viewBox="0 0 24 24"
													fill="currentColor"
												>
													<path d="M12 1.5c-5.79 0-10.5 4.71-10.5 10.5s4.71 10.5 10.5 10.5 10.5-4.71 10.5-10.5-4.71-10.5-10.5-10.5zm-1.97 6.28l5.81 2.178c.266.106.266.372 0 .478l-5.81 2.178c-.262.107-.564-.043-.564-.345V8.126c0-.302.302-.452.564-.345z" />
												</svg>
												TestFlight
											</Link>
										)}
										{project.rubyGems && (
											<Link
												href={project.rubyGems}
												target="_blank"
												rel="noopener noreferrer"
												className="text-[rgba(var(--color-foreground),0.7)] hover:text-[rgba(var(--color-foreground),0.9)] transition-colors"
												onClick={() =>
													handleExternalLinkClick(
														project.id,
														"rubygems",
														project.rubyGems
													)
												}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-5 w-5 inline-block mr-1"
													viewBox="0 0 24 24"
													fill="currentColor"
												>
													<path d="M20.936 12.72l-6.365 7.287a1.417 1.417 0 01-2.142 0L6.064 12.72a1.378 1.378 0 010-1.953l6.365-7.287a1.417 1.417 0 012.142 0l6.365 7.287a1.378 1.378 0 010 1.953z" />
												</svg>
												RubyGems
											</Link>
										)}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

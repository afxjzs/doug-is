"use client"

import Link from "next/link"
import Image from "next/image"
import SafeImage from "@/components/SafeImage"
import { useClientEventTracking } from "@/lib/analytics"

// Companies I'm currently building
const companies = [
	{
		id: "dubprime",
		title: "DubPrime",
		description:
			"DubPrime bridges the gap between investors seeking portfolio diversification and borrowers needing quick capital. Our portfolio approach distributes capital across thousands of small-dollar loans, creating natural risk diffusion that traditional investments cannot match.",
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
			"A venture studio focused on connecting startups with industrial partners to accelerate growth through commercial relationships and strategic investments.",
		role: "Director of Pilot Programs",
		image: "/images/venture-builder-color-white.webp",
		website: "https://venturebuilder.vc/",
		tags: ["Venture Studio", "Corporate Innovation", "B2B"],
		color: "emerald",
	},
]

// Sample projects data - replace with actual data from a CMS or database
const projects = [
	// {
	// 	id: "just-ate",
	// 	title: "JustAte",
	// 	description:
	// 		"A timer app that reminds you to exercise at the optimal time after eating to kickstart your metabolism.",
	// 	image: "/images/projects/just-ate.jpg",
	// 	tags: ["iOS", "Swift", "SwiftUI", "HealthKit"],
	// 	link: "/building/just-ate",
	// 	appStore: "https://apps.apple.com/us/app/justateapp",
	// },
	// {
	// 	id: "doug-is",
	// 	title: "This Website (doug.is)",
	// 	description:
	// 		"My own personal website, built with Next.js, Tailwind CSS, and TypeScript. Vibe-coding experiment.",
	// 	image: "/images/projects/doug-is.png",
	// 	tags: ["Next.js", "Tailwind CSS", "TypeScript", "Vercel"],
	// 	link: "/building/doug-is",
	// 	github: "https://github.com/afxjzs/doug-is",
	// },
	{
		id: "goose-chase",
		title: "Goose Chase",
		description:
			"A curated guide to Chicago's finest venues based on Dante The Don's Barstool Sports article. Features interactive maps, venue filtering, and comprehensive recommendations for bachelor parties and visitors.",
		image: "/images/projects/goose-chase/goosechase-screenshot-modal.png",
		tags: [
			"Next.js",
			"Tailwind CSS",
			"Google Places API",
			"CSV Data",
			"Vercel",
		],
		link: "/building/goose-chase",
		github: "https://github.com/afxjzs/goose-chase-simple",
		website: "https://goosechase.doug.is/",
	},
	{
		id: "migraine-free",
		title: "Migraine Trigger Database",
		description:
			"A comprehensive database of foods and ingredients that may trigger migraines, along with their chemical triggers and categories. Built to help migraine sufferers make informed dietary choices.",
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
	// {
	// 	id: "occupado",
	// 	title: "Occupado",
	// 	description:
	// 		"A calendar combining app that helps you manage multiple calendars in one place.",
	// 	image: "/images/projects/occupado.jpg",
	// 	tags: ["React", "Google Calendar API", "Firebase"],
	// 	link: "/building/occupado",
	// 	github: "https://github.com/afxjzs/occupado",
	// },
	// {
	// 	id: "bolt-form",
	// 	title: "BoltForm",
	// 	description:
	// 		"A JavaScript form builder with validation, conditional logic, and API integration.",
	// 	image: "/images/projects/bolt-form.jpg",
	// 	tags: ["JavaScript", "TypeScript", "React"],
	// 	link: "/building/bolt-form",
	// 	github: "https://github.com/afxjzs/bolt-form",
	// },
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
				<p className="text-lg text-[rgba(var(--color-foreground),0.7)] mb-2">
					doug.is/building
				</p>
				<h1 className="text-4xl font-bold gradient-heading mb-4">Building</h1>
				<p className="text-xl text-[rgba(var(--color-foreground),0.8)]">
					Companies and projects I'm building or have built.
				</p>
			</div>

			{/* Companies Section */}
			<div className="mb-16">
				<h2 className="text-3xl font-semibold gradient-heading mb-8">
					Companies
				</h2>
				<div className="grid grid-cols-1 gap-8">
					{companies.map((company) => (
						<div
							key={company.id}
							className={`bg-[rgba(var(--color-foreground),0.03)] border border-[rgba(var(--color-foreground),0.08)] hover:border-[rgba(var(--color-${company.color}),0.3)] rounded-xl overflow-hidden transition-all duration-300 group`}
						>
							<div className="flex flex-col md:flex-row">
								<div className="md:w-2/5 bg-[rgba(var(--color-background),0.6)] flex items-center justify-center p-8 rounded-xl overflow-hidden">
									<div className="w-full h-full flex items-center justify-center">
										<div className="relative w-full h-[140px] overflow-hidden rounded-xl">
											<Image
												src={company.image}
												alt={company.title}
												fill
												style={{ objectFit: "contain" }}
												className="transition-transform duration-500 group-hover:scale-105 rounded-xl"
												priority
											/>
										</div>
									</div>
								</div>
								<div className="p-8 md:w-3/5">
									<h3 className="text-2xl font-bold text-[rgba(var(--color-foreground),0.95)] mb-2 transition-colors">
										{company.title}
									</h3>
									{company.id === "dubprime" ? (
										<p className="text-[rgba(var(--color-cyan),0.9)] font-medium mb-3">
											{company.role}
										</p>
									) : (
										<p className="text-[rgba(var(--color-emerald),1)] font-medium mb-3">
											{company.role}
										</p>
									)}
									<p className="text-[rgba(var(--color-foreground),0.7)] mb-5 leading-relaxed">
										{company.description}
									</p>
									<div className="flex flex-wrap gap-2 mb-5">
										{company.tags.map((tag) => (
											<span
												key={tag}
												className={`text-xs px-2 py-1 rounded-full ${
													company.id === "dubprime"
														? "bg-[rgba(var(--color-cyan),0.1)] text-[rgba(var(--color-cyan),0.9)]"
														: "bg-[rgba(var(--color-emerald),0.1)] text-[rgba(var(--color-emerald),1)]"
												}`}
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
											className={`neon-button-${company.color} text-sm py-2`}
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
				<h2 className="text-3xl font-semibold gradient-heading mb-8">
					Projects
				</h2>
				<div className="grid grid-cols-1 gap-8">
					{projects.map((project) => (
						<div
							key={project.id}
							className={`bg-[rgba(var(--color-foreground),0.03)] border border-[rgba(var(--color-foreground),0.08)] ${
								project.id === "hopping-list"
									? "hover:border-[rgba(var(--color-magenta),0.2)]"
									: project.id === "oil-price-ticker"
									? "hover:border-[rgba(var(--color-orange),0.2)]"
									: "hover:border-[rgba(var(--color-violet),0.2)]"
							} rounded-xl overflow-hidden transition-all duration-300 group`}
						>
							<div className="flex flex-col md:flex-row">
								<div className="md:w-2/5 bg-[rgba(var(--color-background),0.6)] flex items-center justify-center p-8 rounded-xl overflow-hidden">
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
														style={{ objectFit: "contain" }}
														className="transition-transform duration-500 group-hover:scale-105 rounded-xl"
													/>
												</Link>
											) : (
												<Image
													src={project.image}
													alt={project.title}
													fill
													style={{ objectFit: "contain" }}
													className="transition-transform duration-500 group-hover:scale-105 rounded-xl"
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
											<h2
												className={`text-2xl font-bold text-[rgba(var(--color-foreground),0.9)] mb-2 ${
													project.id === "hopping-list"
														? "group-hover:text-[rgba(var(--color-magenta),1)]"
														: project.id === "oil-price-ticker"
														? "group-hover:text-[rgba(var(--color-orange),1)]"
														: "group-hover:text-[rgba(var(--color-violet),1)]"
												} transition-colors`}
											>
												{project.title}
											</h2>
										</Link>
									) : (
										<h2
											className={`text-2xl font-bold text-[rgba(var(--color-foreground),0.9)] mb-2 ${
												project.id === "hopping-list"
													? "group-hover:text-[rgba(var(--color-magenta),1)]"
													: project.id === "oil-price-ticker"
													? "group-hover:text-[rgba(var(--color-orange),1)]"
													: "group-hover:text-[rgba(var(--color-violet),1)]"
											} transition-colors`}
										>
											{project.title}
										</h2>
									)}
									<p className="text-[rgba(var(--color-foreground),0.7)] mb-4">
										{project.description}
									</p>
									<div className="flex flex-wrap gap-2 mb-4">
										{project.tags.map((tag) => (
											<span
												key={tag}
												className={`text-xs px-2 py-1 rounded-full ${
													project.id === "hopping-list"
														? "bg-[rgba(var(--color-magenta),0.1)] text-[rgba(var(--color-magenta),0.9)]"
														: project.id === "oil-price-ticker"
														? "bg-[rgba(var(--color-orange),0.1)] text-[rgba(var(--color-orange),0.9)]"
														: "bg-[rgba(var(--color-violet),0.1)] text-[rgba(var(--color-violet),0.9)]"
												}`}
											>
												{tag}
											</span>
										))}
									</div>
									<div className="flex flex-wrap gap-4">
										{(project.id === "hopping-list" ||
											project.id === "migraine-free" ||
											project.id === "oil-price-ticker" ||
											project.id === "inn" ||
											project.id === "goose-chase") &&
											project.link && (
												<div className="w-full mb-3">
													<Link
														href={project.link}
														className={`neon-button-${
															project.id === "hopping-list"
																? "magenta"
																: project.id === "oil-price-ticker"
																? "orange"
																: "violet"
														} text-center block`}
														onClick={() =>
															handleProjectClick(
																project.id,
																project.title,
																"details"
															)
														}
													>
														{project.id === "hopping-list"
															? "View Project Details"
															: project.id === "oil-price-ticker"
															? "View Project Details"
															: project.id === "inn"
															? "View Project Details"
															: project.id === "goose-chase"
															? "View Project Details"
															: "View Database"}
													</Link>
												</div>
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
										{project.website && (
											<Link
												href={project.website}
												target="_blank"
												rel="noopener noreferrer"
												className="text-[rgba(var(--color-foreground),0.7)] hover:text-[rgba(var(--color-foreground),0.9)] transition-colors"
												onClick={() =>
													handleExternalLinkClick(
														project.id,
														"github",
														project.website
													)
												}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-5 w-5 inline-block mr-1"
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
												Live Site
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

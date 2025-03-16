import { Metadata } from "next"
import Link from "next/link"
import SafeImage from "@/components/SafeImage"

export const metadata: Metadata = {
	title: "Building | Doug.is",
	description: "Projects and things I've built",
}

// Sample projects data - replace with actual data from a CMS or database
const projects = [
	{
		id: "just-ate",
		title: "JustAte",
		description:
			"A timer app that reminds you to exercise at the optimal time after eating to kickstart your metabolism.",
		image: "/images/projects/just-ate.jpg",
		tags: ["iOS", "Swift", "SwiftUI", "HealthKit"],
		link: "/building/just-ate",
		appStore: "https://apps.apple.com/us/app/justateapp",
	},
	{
		id: "hopping-list",
		title: "Hopping List",
		description:
			"A shopping list app that helps you organize your grocery shopping by store sections.",
		image: "/images/projects/hopping-list.jpg",
		tags: ["Next.js", "React", "Tailwind CSS", "Supabase"],
		link: "/building/hopping-list",
		github: "https://github.com/afxjzs/hopping-list",
	},
	{
		id: "occupado",
		title: "Occupado",
		description:
			"A calendar combining app that helps you manage multiple calendars in one place.",
		image: "/images/projects/occupado.jpg",
		tags: ["React", "Google Calendar API", "Firebase"],
		link: "/building/occupado",
		github: "https://github.com/afxjzs/occupado",
	},
	{
		id: "bolt-form",
		title: "BoltForm",
		description:
			"A JavaScript form builder with validation, conditional logic, and API integration.",
		image: "/images/projects/bolt-form.jpg",
		tags: ["JavaScript", "TypeScript", "React"],
		link: "/building/bolt-form",
		github: "https://github.com/afxjzs/bolt-form",
	},
	{
		id: "inn",
		title: "Inn Ruby Gem",
		description:
			"A simple Ruby gem that adds the .in? method as an inverse of Ruby's .include? method.",
		image: "/images/projects/rubygems-logo.png",
		tags: ["Ruby", "RubyGems", "Open Source"],
		link: "/building/inn",
		github: "https://github.com/afxjzs/inn",
	},
]

export default function BuildingPage() {
	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-12">
				<p className="text-lg text-[rgba(var(--color-foreground),0.7)] mb-2">
					doug.is/building
				</p>
				<h1 className="text-4xl font-bold gradient-heading mb-4">
					Current Projects
				</h1>
				<p className="text-xl text-[rgba(var(--color-foreground),0.8)]">
					Some things I&apos;m currently working on.
				</p>
			</div>

			<div className="grid grid-cols-1 gap-12">
				{projects.map((project) => (
					<div
						key={project.id}
						className="bg-[rgba(var(--color-foreground),0.03)] border border-[rgba(var(--color-foreground),0.08)] hover:border-[rgba(var(--color-violet),0.2)] rounded-xl overflow-hidden transition-all duration-300 group"
					>
						<div className="flex flex-col md:flex-row">
							<div className="relative h-64 md:w-2/5">
								<SafeImage
									src={project.image}
									alt={project.title}
									fill
									className="object-cover transition-transform duration-500 group-hover:scale-105"
								/>
							</div>
							<div className="p-6 md:w-3/5">
								<h2 className="text-2xl font-bold text-[rgba(var(--color-foreground),0.9)] mb-2 group-hover:text-[rgba(var(--color-violet),1)] transition-colors">
									{project.title}
								</h2>
								<p className="text-[rgba(var(--color-foreground),0.7)] mb-4">
									{project.description}
								</p>
								<div className="flex flex-wrap gap-2 mb-4">
									{project.tags.map((tag) => (
										<span
											key={tag}
											className="text-xs px-2 py-1 rounded-full bg-[rgba(var(--color-violet),0.1)] text-[rgba(var(--color-violet),0.9)]"
										>
											{tag}
										</span>
									))}
								</div>
								<div className="flex space-x-4">
									{project.link && (
										<Link href={project.link} className="neon-link">
											View Project
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4 ml-1"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
													clipRule="evenodd"
												/>
											</svg>
										</Link>
									)}
									{project.github && (
										<Link
											href={project.github}
											target="_blank"
											rel="noopener noreferrer"
											className="text-[rgba(var(--color-foreground),0.7)] hover:text-[rgba(var(--color-foreground),0.9)] transition-colors"
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
									{project.appStore && (
										<Link
											href={project.appStore}
											target="_blank"
											rel="noopener noreferrer"
											className="text-[rgba(var(--color-foreground),0.7)] hover:text-[rgba(var(--color-foreground),0.9)] transition-colors"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5 inline-block mr-1"
												viewBox="0 0 24 24"
												fill="currentColor"
											>
												<path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.75 14.35c-.566.647-1.283.961-2.001.961-.448 0-.895-.128-1.284-.379-.391-.25-.7-.605-.91-1.051-.428.222-.912.333-1.399.333-.448 0-.895-.128-1.284-.379-.391-.25-.7-.605-.91-1.051-.428.222-.912.333-1.399.333-.448 0-.895-.128-1.284-.379-.391-.25-.7-.605-.91-1.051-.428.222-.912.333-1.399.333v-1.333c.487 0 .971-.111 1.399-.333.21.446.519.801.91 1.051.389.251.836.379 1.284.379.487 0 .971-.111 1.399-.333.21.446.519.801.91 1.051.389.251.836.379 1.284.379.718 0 1.435-.314 2.001-.961l1.053.875c-.8.964-1.999 1.42-3.054 1.42-.718 0-1.435-.314-2.001-.961-.566.647-1.283.961-2.001.961-.718 0-1.435-.314-2.001-.961-.566.647-1.283.961-2.001.961v-1.333c.487 0 .971-.111 1.399-.333.21.446.519.801.91 1.051.389.251.836.379 1.284.379.487 0 .971-.111 1.399-.333.21.446.519.801.91 1.051.389.251.836.379 1.284.379.718 0 1.435-.314 2.001-.961l1.053.875z" />
											</svg>
											App Store
										</Link>
									)}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

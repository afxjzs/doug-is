import { Metadata } from "next"
import Link from "next/link"
import SafeImage from "@/components/SafeImage"

export const metadata: Metadata = {
	title: "Bolt Form | Building | Doug.is",
	description:
		"A JavaScript form builder with validation, conditional logic, and API integration",
}

export default function BoltFormPage() {
	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-8">
				<Link href="/building" className="neon-link mb-4 inline-block">
					← Back to Projects
				</Link>
				<h1 className="text-4xl font-bold gradient-heading mb-4">Bolt Form</h1>
				<p className="text-xl text-[rgba(var(--color-foreground),0.8)]">
					A JavaScript form builder with validation, conditional logic, and API
					integration.
				</p>
			</div>

			<div className="relative h-80 rounded-lg overflow-hidden mb-12">
				<SafeImage
					src="/images/projects/bolt-form.jpg"
					alt="Bolt Form"
					fill
					className="object-cover"
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
				<div className="dark-card">
					<h2 className="text-xl font-semibold gradient-text-cyan mb-4">
						Technologies
					</h2>
					<ul className="space-y-2 text-[rgba(var(--color-foreground),0.7)]">
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							JavaScript
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							TypeScript
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							React
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Zod Validation
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							REST API
						</li>
					</ul>
				</div>

				<div className="dark-card">
					<h2 className="text-xl font-semibold gradient-text-magenta mb-4">
						Features
					</h2>
					<ul className="space-y-2 text-[rgba(var(--color-foreground),0.7)]">
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Drag-and-drop form builder
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Advanced validation rules
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Conditional logic
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							API integration
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Custom styling options
						</li>
					</ul>
				</div>

				<div className="dark-card">
					<h2 className="text-xl font-semibold gradient-text-violet mb-4">
						Links
					</h2>
					<div className="space-y-4">
						<div>
							<Link
								href="https://bolt-form.vercel.app"
								target="_blank"
								rel="noopener noreferrer"
								className="neon-button-cyan w-full text-center inline-block"
							>
								Live Demo
							</Link>
						</div>
						<div>
							<Link
								href="https://github.com/afxjzs/bolt-form"
								target="_blank"
								rel="noopener noreferrer"
								className="neon-button-violet w-full text-center inline-block"
							>
								GitHub Repository
							</Link>
						</div>
					</div>
				</div>
			</div>

			<div className="mb-12">
				<h2 className="text-2xl font-semibold gradient-heading mb-6">
					Project Overview
				</h2>
				<div className="dark-card">
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
						Bolt Form was created to simplify the process of building complex
						forms for web applications. While there are many form libraries
						available, most either lack advanced features or require significant
						configuration and customization.
					</p>
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
						This project provides a user-friendly interface for creating forms
						with advanced validation rules, conditional logic (showing/hiding
						fields based on user input), and direct API integration for form
						submission.
					</p>
					<p className="text-[rgba(var(--color-foreground),0.8)]">
						Bolt Form can be used as a standalone form builder or integrated
						into existing applications. It generates clean, accessible HTML and
						includes built-in support for various input types, from simple text
						fields to complex multi-select components.
					</p>
				</div>
			</div>

			<div className="mb-12">
				<h2 className="text-2xl font-semibold gradient-heading mb-6">
					Development Challenges
				</h2>
				<div className="dark-card">
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
						One of the main challenges was designing a flexible yet intuitive
						system for defining conditional logic. The solution needed to be
						powerful enough for complex scenarios while remaining accessible to
						non-technical users.
					</p>
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
						Another challenge was implementing real-time validation that could
						handle complex rules and interdependencies between fields. This
						required careful state management and optimization to ensure good
						performance even with large forms.
					</p>
					<p className="text-[rgba(var(--color-foreground),0.8)]">
						Creating a drag-and-drop interface that worked well across devices
						and maintained accessibility standards was also challenging. The
						final implementation uses a combination of keyboard navigation and
						touch/mouse interactions to ensure usability for all users.
					</p>
				</div>
			</div>

			<div className="mb-12">
				<h2 className="text-2xl font-semibold gradient-heading mb-6">
					Future Plans
				</h2>
				<div className="dark-card">
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
						Future development plans include:
					</p>
					<ul className="list-disc pl-6 space-y-2 text-[rgba(var(--color-foreground),0.8)]">
						<li>
							More advanced field types (signature capture, file uploads with
							preview)
						</li>
						<li>Integration with popular CMS platforms</li>
						<li>Form analytics and user behavior tracking</li>
						<li>Multi-page form support with progress tracking</li>
						<li>AI-assisted form creation and optimization</li>
					</ul>
				</div>
			</div>

			<div className="flex justify-center">
				<Link href="/building" className="neon-button-magenta">
					← Back to Projects
				</Link>
			</div>
		</div>
	)
}

import { Metadata } from "next"
import Link from "next/link"
import SafeImage from "@/components/SafeImage"

export const metadata: Metadata = {
	title: "Occupado | Building | Doug.is",
	description:
		"A calendar combining app that helps you manage multiple calendars in one place",
	openGraph: {
		title: "Occupado - Calendar Combining App",
		description:
			"A smart calendar app that helps you manage multiple calendars in one unified view",
		url: "https://doug.is/building/occupado",
		siteName: "Doug.is",
		type: "website",
		images: [
			{
				url: "https://doug.is/images/projects/doug-is.png",
				width: 1200,
				height: 630,
				alt: "Occupado Calendar App",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Occupado - Calendar Combining App",
		description:
			"A smart calendar app that helps you manage multiple calendars in one unified view",
		images: ["https://doug.is/images/projects/doug-is.png"],
		creator: "@afxjzs",
	},
	alternates: {
		canonical: "https://doug.is/building/occupado",
	},
}

export default function OccupadoPage() {
	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-8">
				<Link href="/building" className="neon-link mb-4 inline-block">
					← Back to Projects
				</Link>
				<h1 className="text-4xl font-bold gradient-heading mb-4">Occupado</h1>
				<p className="text-xl text-[rgba(var(--color-foreground),0.8)]">
					A calendar combining app that helps you manage multiple calendars in
					one place.
				</p>
			</div>

			<div className="relative h-80 rounded-lg overflow-hidden mb-12">
				<SafeImage
					src="/images/projects/occupado.jpg"
					alt="Occupado"
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
							React
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Google Calendar API
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Firebase
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							OAuth 2.0
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Material UI
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
							Multiple calendar integration
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Unified view of all events
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Smart scheduling suggestions
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Conflict detection
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Customizable notifications
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
								href="https://occupado.vercel.app"
								target="_blank"
								rel="noopener noreferrer"
								className="neon-button-cyan w-full text-center inline-block"
							>
								Live Demo
							</Link>
						</div>
						<div>
							<Link
								href="https://github.com/afxjzs/occupado"
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
						Occupado was developed to solve the problem of managing multiple
						calendars across different platforms. Many people have separate
						calendars for work, personal life, and various projects, making it
						difficult to get a comprehensive view of their schedule.
					</p>
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
						The app connects to various calendar services (Google Calendar,
						Outlook, Apple Calendar) and presents all events in a unified
						interface. This makes it easier to spot conflicts, find available
						time slots, and manage your schedule efficiently.
					</p>
					<p className="text-[rgba(var(--color-foreground),0.8)]">
						Occupado also offers smart scheduling features, suggesting optimal
						meeting times based on participants&apos; availability and
						preferences, such as avoiding early morning meetings or scheduling
						breaks between consecutive meetings.
					</p>
				</div>
			</div>

			<div className="mb-12">
				<h2 className="text-2xl font-semibold gradient-heading mb-6">
					Development Challenges
				</h2>
				<div className="dark-card">
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
						One of the main challenges was integrating with multiple calendar
						APIs, each with their own authentication methods, data formats, and
						limitations. Creating a consistent interface across these different
						systems required careful design and abstraction.
					</p>
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
						Another significant challenge was implementing the scheduling
						algorithm that could analyze multiple calendars, consider user
						preferences, and suggest optimal meeting times. This required
						efficient data structures and algorithms to handle potentially large
						datasets.
					</p>
					<p className="text-[rgba(var(--color-foreground),0.8)]">
						Ensuring data privacy and security was also a priority, as calendar
						data can contain sensitive information. Implementing proper
						authentication, authorization, and data handling practices was
						essential to protect user information.
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
							Integration with more calendar services and productivity tools
						</li>
						<li>
							Advanced analytics to help users understand how they spend their
							time
						</li>
						<li>
							AI-powered scheduling assistant for natural language processing of
							meeting requests
						</li>
						<li>Team calendar management features for better coordination</li>
						<li>Mobile apps with offline support and push notifications</li>
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

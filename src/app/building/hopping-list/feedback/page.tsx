import { Metadata } from "next"
import Link from "next/link"
import ContactForm from "@/components/ContactForm"

export const metadata: Metadata = {
	title: "Hopping List Feedback | Building | Doug.is",
	description:
		"Share your feedback, report bugs, or request features for the Hopping List shopping app. Help us improve your multi-store shopping experience.",
	openGraph: {
		title: "Hopping List Feedback - Help Us Improve Your Shopping Experience",
		description:
			"Share your feedback about the Hopping List app - report bugs, request features, or tell us about your experience",
		url: "https://www.doug.is/building/hopping-list/feedback",
		siteName: "Doug.is",
		images: [
			{
				url: "https://www.doug.is/images/projects/hopping-list-logo.png",
				width: 800,
				height: 800,
				alt: "Hopping List Feedback",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Hopping List Feedback",
		description: "Share your feedback about the Hopping List shopping app",
		images: ["https://www.doug.is/images/projects/hopping-list-logo.png"],
	},
}

const feedbackSubjects = [
	"General feedback about the app",
	"Report a bug or issue",
	"Request a new feature",
	"Beta testing experience",
	"App Store submission feedback",
	"Technical support request",
]

export default function HoppingListFeedbackPage() {
	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-8">
				<Link
					href="/building/hopping-list"
					className="neon-link mb-4 inline-block"
				>
					← Back to Hopping List
				</Link>
				<h1 className="text-4xl font-bold gradient-heading mb-4">
					Hopping List Feedback
				</h1>
				<p className="text-xl text-[rgba(var(--color-foreground),0.8)] mb-6">
					Your feedback helps make Hopping List better! Share your experience,
					report bugs, or suggest new features.
				</p>

				{/* Info section */}
				<div className="dark-card mb-8">
					<div className="flex items-start space-x-4">
						<div className="flex-shrink-0">
							<div className="w-16 h-16 rounded-lg bg-[rgba(var(--color-magenta),0.1)] border border-[rgba(var(--color-magenta),0.3)] flex items-center justify-center">
								<span className="text-2xl">📝</span>
							</div>
						</div>
						<div>
							<h2 className="text-xl font-semibold gradient-text-magenta mb-2">
								We Value Your Input
							</h2>
							<p className="text-[rgba(var(--color-foreground),0.8)] mb-3">
								As a beta tester or interested user, your feedback is invaluable
								in shaping the future of Hopping List. Whether you've found a
								bug, have an idea for improvement, or just want to share your
								experience, we'd love to hear from you.
							</p>
							<ul className="text-[rgba(var(--color-foreground),0.7)] space-y-1 text-sm">
								<li>• Bug reports help us fix issues quickly</li>
								<li>• Feature requests guide our development roadmap</li>
								<li>• General feedback helps us understand user needs</li>
								<li>• Beta testing insights improve the app before launch</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			{/* Feedback Form */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				<div className="md:col-span-2">
					<div className="dark-card">
						<ContactForm subjects={feedbackSubjects} />
					</div>
				</div>

				{/* Sidebar with additional info */}
				<div>
					<div className="dark-card mb-6">
						<h2 className="text-xl font-semibold gradient-text-magenta mb-4">
							About Hopping List
						</h2>
						<div className="space-y-4 text-[rgba(var(--color-foreground),0.8)]">
							<p>
								Hopping List is a smart shopping list app that shows you what
								you need at each specific store.
							</p>
							<div className="flex space-x-3">
								<Link
									href="/building/hopping-list"
									className="neon-button-magenta text-sm px-4 py-2 text-center flex-1"
								>
									Project Details
								</Link>
							</div>
						</div>
					</div>

					<div className="dark-card">
						<h2 className="text-xl font-semibold gradient-text-magenta mb-4">
							Beta Testing
						</h2>
						<div className="space-y-4 text-[rgba(var(--color-foreground),0.8)]">
							<p>
								Want to try Hopping List? Join our beta program through
								TestFlight.
							</p>
							<Link
								href="https://testflight.apple.com/join/CscPEAD4"
								target="_blank"
								rel="noopener noreferrer"
								className="neon-button-magenta text-sm px-4 py-2 text-center block"
							>
								Join Beta Program
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

// src/app/migraine-free/feedback/page.tsx

import ContactForm from "@/components/ContactForm"
import Link from "next/link"

export const metadata = {
	title: "Migraine-Free Feedback",
	description: "Share your feedback about the Migraine-Free program.",
}

const subjects = [
	"General feedback",
	"Request an edit",
	"Report a bug",
	"Share a success story",
	"Ask a question",
	"Suggest a new feature",
]

export default function MigraineFreeFeedbackPage() {
	return (
		<main className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-background">
			<section className="w-full max-w-lg space-y-8">
				<div className="text-center space-y-2">
					<h1 className="text-3xl font-bold gradient-text-cyan">
						Migraine-Free Feedback
					</h1>
					<p className="text-[rgba(var(--color-foreground),0.8)]">
						We value your experience! Please share your thoughts, suggestions,
						or questions about the Migraine-Free program below.
					</p>
				</div>
				<ContactForm subjects={subjects} />
				<div className="text-center pt-4">
					<Link
						href="/migraine-free"
						className="inline-block text-cyan-600 hover:underline font-medium transition-colors"
					>
						Back to Migraine-Free Home
					</Link>
				</div>
			</section>
		</main>
	)
}

import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
	title: "Thank You | Doug.is",
	description: "Thank you for your message. I'll get back to you soon.",
}

export default function ThankYouPage() {
	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-12">
				<p className="text-lg text-[rgba(var(--color-foreground),0.7)] mb-2">
					doug.is/contact/thank-you
				</p>
				<h1 className="text-4xl font-bold gradient-heading mb-4">Thank You!</h1>
				<p className="text-xl text-[rgba(var(--color-foreground),0.8)] mb-6">
					Your message has been received. I'll get back to you as soon as
					possible.
				</p>
				<div className="flex space-x-4">
					<Link href="/" className="neon-button-cyan">
						Return Home
					</Link>
					<Link href="/contact" className="neon-button-violet">
						Send Another Message
					</Link>
				</div>
			</div>
		</div>
	)
}

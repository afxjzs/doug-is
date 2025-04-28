import { Metadata } from "next"
import ContactForm from "@/components/ContactForm"
import Link from "next/link"
import SocialIcons from "@/components/SocialIcons"

export const metadata: Metadata = {
	title: "Connect with Doug | Doug.is",
	description:
		"Get in touch with Doug Rogers for consulting, advising, or collaboration opportunities.",
}

export default function ConnectingPage() {
	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-12">
				<p className="text-lg text-[rgba(var(--color-foreground),0.7)] mb-2">
					doug.is/connecting
				</p>
				<h1 className="text-4xl font-bold gradient-heading mb-4">
					Let's Connect
				</h1>
				<p className="text-xl text-[rgba(var(--color-foreground),0.8)]">
					Have a question or want to work together? Fill out the form below and
					I&apos;ll get back to you as soon as possible.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
				<div className="md:col-span-2">
					<div className="dark-card">
						<ContactForm />
					</div>
				</div>
				<div>
					<div className="dark-card mb-6">
						<h2 className="text-xl font-semibold gradient-text-cyan mb-4">
							General Location
						</h2>
						<div className="space-y-4 text-[rgba(var(--color-foreground),0.8)]">
							<div className="flex items-start">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-12 w-12 mr-3 mt-0 text-[rgba(var(--color-magenta),1)]"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
										clipRule="evenodd"
									/>
								</svg>
								<div>
									<p>
										Currently residing in the East Bay Area of California near
										Oakland and Berkeley.
									</p>
									<p>Originally from Boston, MA.</p>
								</div>
							</div>
						</div>
					</div>
					<div className="dark-card">
						<h2 className="text-xl font-semibold gradient-text-violet mb-4">
							Connect
						</h2>
						<SocialIcons />
					</div>
				</div>
			</div>
		</div>
	)
}

import { Metadata } from "next"
import ContactForm from "@/components/ContactForm"
import Link from "next/link"

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
									className="h-5 w-5 mr-3 mt-1 text-[rgba(var(--color-magenta),1)]"
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
										Originally from Boston, MA. Currently residing in the East
										Bay Area of California near Oakland and Berkeley.
									</p>
								</div>
							</div>
						</div>
					</div>
					<div className="dark-card">
						<h2 className="text-xl font-semibold gradient-text-violet mb-4">
							Connect
						</h2>
						<div className="flex space-x-4">
							<SocialLink
								href="https://bsky.app/profile/dougxyz.bsky.social"
								aria-label="Bluesky"
								className="hover-glow-cyan"
							>
								<svg fill="none" viewBox="0 0 64 57" className="w-5 h-5">
									<path
										fill="currentColor"
										d="M13.873 3.805C21.21 9.332 29.103 20.537 32 26.55v15.882c0-.338-.13.044-.41.867-1.512 4.456-7.418 21.847-20.923 7.944-7.111-7.32-3.819-14.64 9.125-16.85-7.405 1.264-15.73-.825-18.014-9.015C1.12 23.022 0 8.51 0 6.55 0-3.268 8.579-.182 13.873 3.805ZM50.127 3.805C42.79 9.332 34.897 20.537 32 26.55v15.882c0-.338.13.044.41.867 1.512 4.456 7.418 21.847 20.923 7.944 7.111-7.32 3.819-14.64-9.125-16.85 7.405 1.264 15.73-.825 18.014-9.015C62.88 23.022 64 8.51 64 6.55c0-9.818-8.578-6.732-13.873-2.745Z"
									/>
								</svg>
							</SocialLink>

							<SocialLink
								href="https://github.com/afxjzs"
								aria-label="GitHub"
								className="hover-glow-violet"
							>
								<svg
									className="w-5 h-5 fill-current"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
								</svg>
							</SocialLink>

							<SocialLink
								href="https://linkedin.com/in/douglasrogers"
								aria-label="LinkedIn"
								className="hover-glow-magenta"
							>
								<svg
									className="w-5 h-5 fill-current"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
								</svg>
							</SocialLink>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

function SocialLink({
	href,
	children,
	className,
	...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
	href: string
	children: React.ReactNode
	className?: string
}) {
	return (
		<Link
			href={href}
			className={`text-[rgba(var(--color-foreground),0.6)] transition-all duration-300 ${
				className || ""
			}`}
			target="_blank"
			rel="noopener noreferrer"
			{...props}
		>
			{children}
		</Link>
	)
}

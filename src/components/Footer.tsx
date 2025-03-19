import Link from "next/link"
import SocialIcons from "./SocialIcons"

export default function Footer() {
	return (
		<footer className="relative z-10 mt-32">
			<div className="absolute inset-0 bg-gradient-to-t from-[rgba(var(--color-violet),0.1)] to-transparent -z-10"></div>
			<div className="container mx-auto px-4 py-12">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
					<div>
						<h3 className="text-xl font-semibold gradient-heading mb-4">
							doug.is
						</h3>
						<p className="text-[rgba(var(--color-foreground),0.7)] mb-4">
							This is my personal website. All views expressed here are my own
							and do not represent the opinions of any affiliated organizations.
						</p>
						<SocialIcons />
					</div>

					<div className="grid grid-cols-2 gap-6">
						<div>
							<h3 className="text-lg font-semibold gradient-text-cyan mb-4">
								doug.is ...
							</h3>
							<ul className="space-y-2">
								{/* <li>
									<Link
										href="/"
										className="text-[rgba(var(--color-foreground),0.7)] hover:text-[rgba(var(--color-foreground),1)] transition-colors"
									>
										doug.is ...
									</Link>
								</li> */}
								<li>
									<Link
										href="/advising"
										className="text-[rgba(var(--color-foreground),0.7)] hover:text-[rgba(var(--color-foreground),1)] transition-colors"
									>
										Advising
									</Link>
								</li>
								<li>
									<Link
										href="/building"
										className="text-[rgba(var(--color-foreground),0.7)] hover:text-[rgba(var(--color-foreground),1)] transition-colors"
									>
										Building
									</Link>
								</li>
								<li>
									<Link
										href="/investing"
										className="text-[rgba(var(--color-foreground),0.7)] hover:text-[rgba(var(--color-foreground),1)] transition-colors"
									>
										Investing
									</Link>
								</li>
								<li>
									<Link
										href="/thinking"
										className="text-[rgba(var(--color-foreground),0.7)] hover:text-[rgba(var(--color-foreground),1)] transition-colors"
									>
										Writing
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="text-lg font-semibold gradient-text-cyan mb-4">
								Other Links
							</h3>
							<ul className="space-y-2">
								<li>
									<Link
										href="/hustling"
										className="text-[rgba(var(--color-foreground),0.7)] hover:text-[rgba(var(--color-foreground),1)] transition-colors"
									>
										Hustlin&apos;
									</Link>
								</li>
								<li>
									<Link
										href="/attributing"
										className="text-[rgba(var(--color-foreground),0.7)] hover:text-[rgba(var(--color-foreground),1)] transition-colors"
									>
										Attribution
									</Link>
								</li>
								<li>
									<Link
										href="/respecting-privacy"
										className="text-[rgba(var(--color-foreground),0.7)] hover:text-[rgba(var(--color-foreground),1)] transition-colors"
									>
										Privacy Policy
									</Link>
								</li>
							</ul>
						</div>
					</div>

					<div>
						<h3 className="text-lg font-semibold gradient-text-magenta mb-4">
							Contact
						</h3>
						<p className="text-[rgba(var(--color-foreground),0.7)] mb-4">
							Get in touch for collaborations, opportunities, or just to say
							hello.
						</p>
						<Link
							href="/connecting"
							className="neon-button-magenta inline-block"
						>
							Let&apos;s Connect
						</Link>
					</div>
				</div>

				<div className="pt-8 border-t border-[rgba(var(--color-foreground),0.1)] flex flex-col md:flex-row justify-between items-center">
					<p className="text-[rgba(var(--color-foreground),0.6)] text-sm mb-4 md:mb-0">
						© {new Date().getFullYear()} Doug.is. All rights reserved.
					</p>

					<div className="text-[rgba(var(--color-foreground),0.6)] text-sm">
						<span className="inline-block relative px-2">
							<span className="absolute inset-0 bg-gradient-to-r from-[rgba(var(--color-cyan),0.2)] to-[rgba(var(--color-magenta),0.2)] opacity-50 rounded-md"></span>
							<span className="relative">
								this site was vibe coded by doug in like two hours using{" "}
								<Link
									href="https://cursor.sh"
									className="text-[rgba(var(--color-cyan),0.9)] hover:text-[rgba(var(--color-cyan),1)]"
									target="_blank"
									rel="noopener noreferrer"
								>
									cursor
								</Link>{" "}
								and{" "}
								<Link
									href="https://claude.ai"
									className="text-[rgba(var(--color-magenta),0.9)] hover:text-[rgba(var(--color-magenta),1)]"
									target="_blank"
									rel="noopener noreferrer"
								>
									claude-sonnet-3.7
								</Link>
							</span>
						</span>
					</div>
				</div>
			</div>
		</footer>
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
			className={`text-[rgba(var(--color-foreground),0.6)] hover:text-[rgba(var(--color-foreground),1)] transition-all duration-300 ${
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

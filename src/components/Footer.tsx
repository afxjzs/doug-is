"use client"

import Link from "next/link"

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
							Or maybe they do. Whatever.
						</p>
						<div className="flex space-x-6">
							<SocialLink
								href="https://bsky.app/profile/dougxyz.bsky.social"
								aria-label="Bluesky"
								className="hover-glow-cyan"
							>
								<svg
									fill="none"
									viewBox="0 0 64 57"
									className="w-6 h-6 transition-all duration-300 transform hover:scale-110"
								>
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
									className="w-6 h-6 transition-all duration-300 transform hover:scale-110"
									viewBox="0 0 24 24"
									fill="currentColor"
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
									className="w-6 h-6 transition-all duration-300 transform hover:scale-110"
									viewBox="0 0 24 24"
									fill="currentColor"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
								</svg>
							</SocialLink>
						</div>
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
										About
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

interface SocialLinkProps
	extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
	href: string
	children: React.ReactNode
	className?: string
}

function SocialLink({ href, children, className, ...props }: SocialLinkProps) {
	return (
		<Link
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className={`text-[rgba(var(--color-foreground),0.7)] hover:text-[rgba(var(--color-foreground),1)] transition-colors ${className}`}
			{...props}
		>
			{children}
		</Link>
	)
}

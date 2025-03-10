import { Metadata } from "next"
import Link from "next/link"
import SafeImage from "@/components/SafeImage"

export const metadata: Metadata = {
	title: "Hustling | Doug.is",
	description: "About me and how to get in touch",
}

export default function HustlingPage() {
	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-12">
				<h1 className="text-4xl font-bold gradient-heading mb-4">
					doug.is/hustling
				</h1>
				<p className="text-xl text-[rgba(var(--color-foreground),0.8)]">
					About me, my work, and how to get in touch.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
				<div className="relative h-80 rounded-lg overflow-hidden">
					<SafeImage
						src="/images/profile.jpg"
						alt="Doug Rogers"
						fill
						className="object-cover"
					/>
				</div>
				<div>
					<h2 className="text-2xl font-semibold gradient-heading mb-4">
						About Me
					</h2>
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
						I&apos;m Doug Rogers, a passionate developer, investor, and
						entrepreneur. With over 10 years of experience in the tech industry,
						I specialize in building modern web applications and providing
						strategic advisory services.
					</p>
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-6">
						My background spans software development, product management, and
						financial markets. I enjoy combining these disciplines to create
						innovative solutions and help businesses grow.
					</p>
					<div className="flex space-x-4">
						<Link
							href="https://linkedin.com/in/douglasrogers"
							target="_blank"
							rel="noopener noreferrer"
							className="neon-link"
						>
							LinkedIn
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-4 w-4 ml-1"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
							</svg>
						</Link>
						<Link
							href="https://github.com/afxjzs"
							target="_blank"
							rel="noopener noreferrer"
							className="neon-link"
						>
							GitHub
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-4 w-4 ml-1"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
							</svg>
						</Link>
					</div>
				</div>
			</div>

			<div className="bg-[rgba(var(--color-foreground),0.02)] border border-[rgba(var(--color-foreground),0.05)] p-8 rounded-lg mb-16">
				<h2 className="text-2xl font-semibold gradient-heading mb-6">
					What I Do
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="dark-card">
						<h3 className="text-xl font-semibold text-[rgba(var(--color-foreground),0.9)] mb-3">
							Development
						</h3>
						<p className="text-[rgba(var(--color-foreground),0.7)]">
							Building modern web applications with React, Next.js, and other
							cutting-edge technologies.
						</p>
					</div>
					<div className="dark-card">
						<h3 className="text-xl font-semibold text-[rgba(var(--color-foreground),0.9)] mb-3">
							Investing
						</h3>
						<p className="text-[rgba(var(--color-foreground),0.7)]">
							Strategic investments in public markets, private companies, and
							alternative assets.
						</p>
					</div>
					<div className="dark-card">
						<h3 className="text-xl font-semibold text-[rgba(var(--color-foreground),0.9)] mb-3">
							Advisory
						</h3>
						<p className="text-[rgba(var(--color-foreground),0.7)]">
							Helping businesses grow through strategic planning, product
							development, and technical guidance.
						</p>
					</div>
				</div>
			</div>

			<div className="mb-16">
				<h2 className="text-2xl font-semibold gradient-heading mb-6">
					Get in Touch
				</h2>
				<div className="bg-[rgba(var(--color-foreground),0.03)] border border-[rgba(var(--color-foreground),0.08)] rounded-lg p-8">
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-6">
						I&apos;m always open to discussing new projects, opportunities, or
						partnerships. Feel free to reach out!
					</p>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<h3 className="text-lg font-semibold text-[rgba(var(--color-foreground),0.9)] mb-2">
								Email
							</h3>
							<a href="mailto:hello@doug.is" className="neon-link">
								hello@doug.is
							</a>
						</div>
						<div>
							<h3 className="text-lg font-semibold text-[rgba(var(--color-foreground),0.9)] mb-2">
								Social Media
							</h3>
							<div className="flex space-x-4">
								<Link
									href="https://twitter.com/username"
									target="_blank"
									rel="noopener noreferrer"
									className="hover-glow-cyan"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6 fill-current"
										viewBox="0 0 24 24"
									>
										<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
									</svg>
								</Link>
								<Link
									href="https://linkedin.com/in/douglasrogers"
									target="_blank"
									rel="noopener noreferrer"
									className="hover-glow-magenta"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6 fill-current"
										viewBox="0 0 24 24"
									>
										<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
									</svg>
								</Link>
								<Link
									href="https://github.com/afxjzs"
									target="_blank"
									rel="noopener noreferrer"
									className="hover-glow-violet"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6 fill-current"
										viewBox="0 0 24 24"
									>
										<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
									</svg>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

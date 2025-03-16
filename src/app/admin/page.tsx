import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
	title: "Admin Dashboard | Doug.is",
	description: "Admin dashboard for managing the website",
}

export default function AdminPage() {
	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-12">
				<h1 className="text-4xl font-bold gradient-heading mb-4">
					Admin Dashboard
				</h1>
				<p className="text-xl text-[rgba(var(--color-foreground),0.8)]">
					Manage your website content and settings.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<AdminCard
					title="Contact Messages"
					description="View and manage contact form submissions"
					href="/admin/contact"
					icon={
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-8 w-8"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							/>
						</svg>
					}
				/>
				<AdminCard
					title="Blog Posts"
					description="Create, edit, and manage blog posts"
					href="/admin/posts"
					icon={
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-8 w-8"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
							/>
						</svg>
					}
				/>
				<AdminCard
					title="Projects"
					description="Manage your portfolio projects"
					href="/admin/projects"
					icon={
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-8 w-8"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
							/>
						</svg>
					}
				/>
				<AdminCard
					title="Settings"
					description="Configure website settings"
					href="/admin/settings"
					icon={
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-8 w-8"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
							/>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
					}
				/>
			</div>
		</div>
	)
}

function AdminCard({
	title,
	description,
	href,
	icon,
}: {
	title: string
	description: string
	href: string
	icon: React.ReactNode
}) {
	return (
		<Link
			href={href}
			className="p-6 bg-[rgba(var(--color-foreground),0.03)] border border-[rgba(var(--color-foreground),0.08)] hover:border-[rgba(var(--color-violet),0.2)] rounded-xl transition-all duration-300 group"
		>
			<div className="flex items-start space-x-4">
				<div className="text-[rgba(var(--color-violet),0.7)] group-hover:text-[rgba(var(--color-violet),1)] transition-colors">
					{icon}
				</div>
				<div>
					<h2 className="text-xl font-semibold text-[rgba(var(--color-foreground),0.9)] mb-2 group-hover:text-[rgba(var(--color-violet),1)] transition-colors">
						{title}
					</h2>
					<p className="text-[rgba(var(--color-foreground),0.7)]">
						{description}
					</p>
				</div>
			</div>
		</Link>
	)
}

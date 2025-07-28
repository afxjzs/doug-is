/**
 * Admin Login Layout - Bypasses Admin Protection
 *
 * Simple layout for the login page that doesn't require authentication.
 * Only the login page content, no admin navigation or header.
 */

export default function AdminLoginLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className="min-h-screen bg-[rgba(var(--color-background),1)] flex items-center justify-center">
			<div className="max-w-md w-full space-y-8">
				<div className="text-center">
					<h1 className="text-3xl font-bold text-[rgba(var(--color-foreground),0.9)]">
						Admin Login
					</h1>
					<p className="mt-2 text-[rgba(var(--color-foreground),0.6)]">
						Sign in to access the admin dashboard
					</p>
				</div>
				{children}
			</div>
		</div>
	)
}

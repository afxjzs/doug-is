/**
 * Admin Login Page
 *
 * Cyberpunk-themed login page using standard Supabase authentication.
 */

import SimpleLoginForm from "@/components/admin/SimpleLoginForm"

export default function AdminLoginPage() {
	return (
		<div className="min-h-screen bg-[rgb(var(--color-background))] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
			{/* Background gradient effects */}
			<div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-cyan-900/5 to-pink-900/10"></div>
			<div className="absolute inset-0 bg-gradient-to-tl from-violet-900/5 via-emerald-900/5 to-orange-900/5"></div>

			{/* Scanlines effect */}
			<div className="absolute inset-0 scanlines opacity-30"></div>

			{/* Main content */}
			<div className="relative z-10 max-w-md w-full">
				{/* Header section */}
				<div className="text-center mb-8">
					<div className="mb-6">
						<h1 className="text-4xl md:text-5xl font-bold gradient-heading mb-2">
							Admin Access
						</h1>
						<p className="text-lg text-[rgba(var(--color-foreground),0.7)]">
							Sign in to access the admin dashboard
						</p>
					</div>

					{/* Decorative line */}
					<div className="w-24 h-1 bg-gradient-to-r from-transparent via-[rgba(var(--color-cyan),0.6)] to-transparent mx-auto mb-6"></div>
				</div>

				{/* Login form container */}
				<div className="relative">
					{/* Glow effect behind form */}
					<div className="absolute inset-0 bg-gradient-to-r from-cyan-900/20 to-violet-900/20 rounded-lg blur-xl -z-10"></div>

					{/* Form container */}
					<div className="relative border border-[rgba(var(--color-foreground),0.1)] rounded-lg bg-[rgba(var(--color-background),0.8)] backdrop-blur-sm shadow-[0_0_20px_rgba(var(--color-cyan),0.1)]">
						<SimpleLoginForm />
					</div>
				</div>

				{/* Footer */}
				<div className="text-center mt-8">
					<p className="text-sm text-[rgba(var(--color-foreground),0.5)]">
						Secure access to doug.is administration
					</p>
				</div>
			</div>
		</div>
	)
}

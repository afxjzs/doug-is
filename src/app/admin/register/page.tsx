/**
 * Admin Register Page
 *
 * Registration page for admin users
 */

import RegisterForm from "@/components/admin/RegisterForm"

interface PageProps {
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AdminRegisterPage({ searchParams }: PageProps) {
	const params = searchParams ? await searchParams : {}

	return (
		<div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			{/* Background gradient effects */}
			<div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-cyan-900/5 to-pink-900/10"></div>
			<div className="absolute inset-0 bg-gradient-to-tl from-violet-900/5 via-emerald-900/5 to-orange-900/5"></div>

			{/* Scanlines effect */}
			<div className="absolute inset-0 scanlines opacity-30"></div>

			{/* Main content */}
			<div className="relative z-10 max-w-md w-full space-y-8">
				{/* Header section */}
				<div className="text-center">
					<h1 className="text-4xl md:text-5xl font-bold gradient-heading mb-2">
						Create Admin Account
					</h1>
					<p className="text-lg text-gray-300">
						Register a new admin user for the dashboard
					</p>
				</div>

				{/* Registration form */}
				<RegisterForm />
			</div>
		</div>
	)
}

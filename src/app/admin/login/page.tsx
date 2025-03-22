import { Metadata } from "next"
import LoginForm from "@/components/admin/LoginForm"

/**
 * Metadata for the login page
 */
export const metadata: Metadata = {
	title: "Admin Login | Doug.is",
	description: "Login to the admin dashboard",
}

/**
 * Server component that handles the admin login page
 * The auth check is handled by middleware, so we don't need to check again here
 */
export default async function AdminLoginPage(props: {
	searchParams?: { [key: string]: string | string[] | undefined }
}) {
	// In Next.js 15, we MUST await searchParams before accessing properties
	const searchParams = (await props.searchParams) || {}

	// Get error and redirect params (after awaiting searchParams)
	const errorValue = searchParams.error
	const redirectValue = searchParams.redirect

	// Ensure they are strings or undefined
	const error = typeof errorValue === "string" ? errorValue : undefined
	const redirectTo =
		typeof redirectValue === "string" ? redirectValue : undefined

	return (
		<div className="flex min-h-screen flex-col items-center justify-center">
			<div className="w-full max-w-md">
				<div className="rounded-lg border border-[rgba(var(--color-foreground),0.1)] bg-[rgba(0,0,0,0.9)] p-8 shadow-lg backdrop-blur-sm">
					<div className="mb-6 text-center">
						<h1 className="text-3xl font-bold gradient-heading mb-2">
							Admin Login
						</h1>
						<p className="text-[rgba(var(--color-foreground),0.7)]">
							Sign in to access the admin dashboard
						</p>
					</div>

					{/* Display any error messages */}
					{error && (
						<div className="mb-6 rounded-md bg-[rgba(var(--color-red),0.1)] p-4 text-[rgba(var(--color-red),0.9)] border border-[rgba(var(--color-red),0.3)]">
							{error}
						</div>
					)}

					{/* Login form component */}
					<LoginForm redirectTo={redirectTo} />
				</div>
			</div>
		</div>
	)
}

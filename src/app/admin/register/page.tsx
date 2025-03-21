import { Metadata } from "next"
import RegisterForm from "@/components/admin/RegisterForm"

/**
 * Metadata for the registration page
 */
export const metadata: Metadata = {
	title: "Register Admin | Doug.is",
	description: "Create your admin account",
}

/**
 * Server component that handles the admin registration
 * The auth check is handled by middleware, so we don't need to check again here
 * This page should be removed after initial setup
 */
export default async function RegisterPage(props: {
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
		<div className="flex min-h-screen flex-col items-center justify-center bg-[rgba(var(--color-background),1)]">
			<div className="w-full max-w-md">
				<div className="rounded-lg border border-[rgba(var(--color-foreground),0.1)] bg-[rgba(var(--color-background),0.6)] p-8 shadow-lg backdrop-blur-sm">
					<div className="mb-6 text-center">
						<h1 className="text-3xl font-bold gradient-heading mb-2">
							Create Admin Account
						</h1>
						<p className="text-[rgba(var(--color-foreground),0.7)]">
							Create your administrator account
						</p>
					</div>

					{/* Display any error messages */}
					{error && (
						<div className="mb-6 rounded-md bg-[rgba(var(--color-red),0.1)] p-4 text-[rgba(var(--color-red),0.9)] border border-[rgba(var(--color-red),0.3)]">
							{error}
						</div>
					)}

					{/* Registration form component */}
					<RegisterForm redirectTo={redirectTo} />

					<div className="mt-6 text-center text-sm text-[rgba(var(--color-foreground),0.6)]">
						<p>Already have an account?</p>
						<p className="mt-2">
							<a
								href="/admin/login"
								className="text-[rgba(var(--color-cyan),0.9)] hover:text-[rgba(var(--color-cyan),1)] hover:underline transition-colors"
							>
								Sign in instead
							</a>
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

import { Metadata } from "next"
import LoginForm from "@/components/admin/LoginForm"

export const metadata: Metadata = {
	title: "Login | Admin",
	description: "Admin login page",
	robots: {
		index: false,
		follow: false,
	},
}

export default async function AdminLoginPage({
	searchParams,
}: {
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
	// NEXT.JS 15 FIX: Await searchParams before accessing properties
	const params = await searchParams

	// Get redirect destination from search params
	const redirectTo = Array.isArray(params?.redirect)
		? params.redirect[0]
		: params?.redirect

	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="w-full max-w-md">
				<div className="bg-zinc-900 p-8 rounded-lg border border-zinc-800">
					<h1 className="text-2xl font-bold text-center mb-8 text-white">
						Admin Login
					</h1>
					<LoginForm redirectTo={redirectTo} />
				</div>
			</div>
		</div>
	)
}

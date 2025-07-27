/**
 * Admin Setup Page
 *
 * Provides instructions for setting up admin authentication.
 */

import { Metadata } from "next"

export const metadata: Metadata = {
	title: "Admin Setup | doug.is",
	description: "Setup instructions for admin authentication",
}

export default function AdminSetupPage() {
	return (
		<div className="min-h-screen bg-[rgba(var(--color-background),1)] text-[rgba(var(--color-foreground),0.9)]">
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-2xl mx-auto">
					<h1 className="text-3xl font-bold mb-8">Admin Setup</h1>

					<div className="space-y-6">
						<div className="bg-[rgba(var(--color-violet),0.1)] p-6 rounded-lg border border-[rgba(var(--color-violet),0.3)]">
							<h2 className="text-xl font-semibold mb-4 text-[rgba(var(--color-violet),0.9)]">
								Authentication Status
							</h2>
							<p className="mb-4">
								Your admin account is set up and ready to use! Here are your
								login options:
							</p>

							<div className="space-y-4">
								<div>
									<h3 className="font-semibold text-[rgba(var(--color-violet),0.9)] mb-2">
										Option 1: Magic Link (Recommended)
									</h3>
									<p className="text-sm">
										Go to{" "}
										<a
											href="/admin/login"
											className="text-[rgba(var(--color-violet),0.9)] hover:underline"
										>
											/admin/login
										</a>{" "}
										and use the magic link option. Enter your email and click
										"Sign in with a magic link instead". Check your email and
										click the link to sign in.
									</p>
								</div>

								<div>
									<h3 className="font-semibold text-[rgba(var(--color-violet),0.9)] mb-2">
										Option 2: Set Up Password
									</h3>
									<p className="text-sm">
										To use password authentication, you need to set up a
										password for your account:
									</p>
									<ol className="list-decimal list-inside text-sm mt-2 space-y-1">
										<li>Go to your Supabase dashboard</li>
										<li>Navigate to Authentication → Users</li>
										<li>Find your user account (douglas.rogers@gmail.com)</li>
										<li>Click "Edit" and set a password</li>
										<li>
											Return to{" "}
											<a
												href="/admin/login"
												className="text-[rgba(var(--color-violet),0.9)] hover:underline"
											>
												/admin/login
											</a>{" "}
											and sign in with your password
										</li>
									</ol>
								</div>
							</div>
						</div>

						<div className="bg-[rgba(var(--color-foreground),0.05)] p-6 rounded-lg border border-[rgba(var(--color-foreground),0.1)]">
							<h2 className="text-xl font-semibold mb-4">Account Details</h2>
							<div className="space-y-2 text-sm">
								<p>
									<strong>Email:</strong> douglas.rogers@gmail.com
								</p>
								<p>
									<strong>Status:</strong> Active
								</p>
								<p>
									<strong>Created:</strong> March 21, 2025
								</p>
								<p>
									<strong>Last Sign In:</strong> July 27, 2025
								</p>
							</div>
						</div>

						<div className="bg-[rgba(var(--color-green),0.1)] p-6 rounded-lg border border-[rgba(var(--color-green),0.3)]">
							<h2 className="text-xl font-semibold mb-4 text-[rgba(var(--color-green),0.9)]">
								Next Steps
							</h2>
							<p className="text-sm">
								Once you're logged in, you'll have access to:
							</p>
							<ul className="list-disc list-inside text-sm mt-2 space-y-1">
								<li>Create and edit blog posts</li>
								<li>Manage draft content</li>
								<li>View contact messages</li>
								<li>Access admin dashboard</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

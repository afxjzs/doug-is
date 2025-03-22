/**
 * Admin Contact Messages Page
 *
 * This page displays all contact form submissions received on the site
 */

import { Metadata } from "next"
import { getServerUser, isAdminUser } from "@/lib/auth/supabaseServerAuth"
import { adminGetContactSubmissions } from "@/lib/supabase/serverClient"
import { redirect } from "next/navigation"

// Mark this page as dynamic to prevent static generation
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
	title: "Contact Messages | Admin Dashboard",
	description: "Manage contact form submissions",
}

export default async function AdminContactsPage() {
	try {
		// Verify user is authenticated and is an admin
		const user = await getServerUser()
		const isAdmin = await isAdminUser()

		if (!user || !isAdmin) {
			console.log("Not authenticated as admin, redirecting to login")
			redirect("/admin/login?redirect=/admin/contacts")
		}

		// Fetch all contact messages
		const messages = await adminGetContactSubmissions()

		// Format date for display
		const formatDate = (dateString: string | undefined) => {
			if (!dateString) return "Unknown date"

			const date = new Date(dateString)
			return date.toLocaleDateString("en-US", {
				year: "numeric",
				month: "short",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			})
		}

		return (
			<div>
				<h1 className="text-3xl font-bold mb-6">Contact Messages</h1>
				<p className="mb-8">Messages received through the contact form.</p>

				{messages.length > 0 ? (
					<div className="admin-card overflow-x-auto">
						<table className="w-full admin-table">
							<thead>
								<tr>
									<th>Name</th>
									<th>Email</th>
									<th>Subject</th>
									<th>Date</th>
									<th>Status</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{messages.map((message) => (
									<tr key={message.id}>
										<td className="font-medium">{message.name}</td>
										<td className="text-sm">
											<a
												href={`mailto:${message.email}`}
												className="text-[rgba(var(--color-violet),0.9)] hover:underline"
											>
												{message.email}
											</a>
										</td>
										<td className="text-sm">
											{message.subject || "No Subject"}
										</td>
										<td className="text-sm">
											{formatDate(message.created_at)}
										</td>
										<td>
											{message.is_read ? (
												<span className="px-2 py-1 text-xs rounded-full bg-[rgba(var(--color-foreground),0.1)] text-[rgba(var(--color-foreground),0.6)]">
													Read
												</span>
											) : (
												<span className="px-2 py-1 text-xs rounded-full bg-[rgba(var(--color-cyan),0.1)] text-[rgba(var(--color-cyan),0.9)]">
													New
												</span>
											)}
										</td>
										<td>
											<a
												href={`/admin/contacts/${message.id}`}
												className="text-sm text-[rgba(var(--color-violet),0.9)] hover:underline"
											>
												View
											</a>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<div className="admin-card p-6 text-center">
						<p className="text-[rgba(var(--color-foreground),0.7)] mb-4">
							No contact messages found
						</p>
						<p className="text-sm">
							Messages submitted through the contact form will appear here.
						</p>
					</div>
				)}
			</div>
		)
	} catch (error) {
		console.error("Error in AdminContactsPage:", error)
		return (
			<div className="admin-card p-6">
				<h1 className="text-3xl font-bold text-[rgba(var(--color-red),0.9)] mb-6">
					Error
				</h1>
				<p className="mb-4">
					An error occurred while loading contact messages.
				</p>
				<p className="text-sm text-[rgba(var(--color-foreground),0.7)]">
					Please try refreshing the page or contact the administrator.
				</p>
			</div>
		)
	}
}

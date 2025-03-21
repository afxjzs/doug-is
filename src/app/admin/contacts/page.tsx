/**
 * Admin Contacts Page
 *
 * This page displays all contact form submissions with options to
 * mark as read, filter, and respond to messages.
 */

import { Metadata } from "next"
import {
	adminGetContactSubmissions,
	ContactMessage,
} from "@/lib/supabase/serverClient"
import ContactsList from "@/components/admin/ContactsList"

export const metadata: Metadata = {
	title: "Contact Messages | Admin",
	description: "Manage contact form submissions",
}

export default async function AdminContactsPage() {
	// Get all contact messages
	const contactMessages = await adminGetContactSubmissions()

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-semibold">Contact Messages</h1>
			</div>

			{/* Summary statistics */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				<div className="bg-white rounded-lg shadow-sm border border-[rgba(var(--color-foreground),0.1)] p-4">
					<h2 className="text-sm font-medium text-[rgba(var(--color-foreground),0.6)]">
						Total Messages
					</h2>
					<p className="text-2xl font-bold text-[rgba(var(--color-foreground),0.9)]">
						{contactMessages.length}
					</p>
				</div>
				<div className="bg-white rounded-lg shadow-sm border border-[rgba(var(--color-foreground),0.1)] p-4">
					<h2 className="text-sm font-medium text-[rgba(var(--color-foreground),0.6)]">
						Unread Messages
					</h2>
					<p className="text-2xl font-bold text-[rgba(var(--color-cyan),1)]">
						{
							contactMessages.filter((msg: ContactMessage) => !msg.is_read)
								.length
						}
					</p>
				</div>
				<div className="bg-white rounded-lg shadow-sm border border-[rgba(var(--color-foreground),0.1)] p-4">
					<h2 className="text-sm font-medium text-[rgba(var(--color-foreground),0.6)]">
						Read Messages
					</h2>
					<p className="text-2xl font-bold text-[rgba(var(--color-green),1)]">
						{
							contactMessages.filter((msg: ContactMessage) => msg.is_read)
								.length
						}
					</p>
				</div>
			</div>

			{/* Contact messages list */}
			<div className="bg-white rounded-lg shadow-sm border border-[rgba(var(--color-foreground),0.1)] p-6">
				{contactMessages.length === 0 ? (
					<div className="text-center py-8 text-[rgba(var(--color-foreground),0.6)]">
						No contact submissions found. Once visitors submit contact forms,
						they will appear here.
					</div>
				) : (
					<ContactsList initialContacts={contactMessages} />
				)}
			</div>
		</div>
	)
}

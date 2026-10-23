/**
 * Admin Contacts Page
 *
 * This page displays contact form submissions for admin review.
 * Auth is handled by AdminLayout - no need for duplicate auth checks.
 */

import { Metadata } from "next"
import { createServiceRoleClient } from "@/lib/supabase/server"
import ContactsList from "@/components/admin/ContactsList"

// Force dynamic rendering
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
	title: "Contact Messages | Admin",
	description: "Manage contact form submissions",
	robots: {
		index: false,
		follow: false,
	},
}

/**
 * Helper function to get contact messages using service role client
 */
async function adminGetContactMessages() {
	try {
		console.log("Getting contact messages for admin...")
		const supabase = createServiceRoleClient()

		const { data, error } = await supabase
			.from("contact_messages")
			.select("*")
			.order("created_at", { ascending: false })

		if (error) {
			console.error("Error fetching contact messages:", error)
			return []
		}

		console.log(`Found ${data?.length || 0} contact messages`)
		return data || []
	} catch (error) {
		console.error("Error in adminGetContactMessages:", error)
		return []
	}
}

export default async function AdminContactsPage() {
	// No auth check needed - AdminLayout handles this
	// Fetch all contact messages using service role client
	const contacts = await adminGetContactMessages()

	return (
		<div>
			<h1 className="text-3xl font-bold mb-6">Contact Messages</h1>

			<div className="admin-card">
				<ContactsList initialContacts={contacts} />
			</div>
		</div>
	)
}

/**
 * Admin Contacts Page
 *
 * This page displays contact form submissions for admin review.
 * Uses UNIFIED AUTHENTICATION SYSTEM.
 */

import { Metadata } from "next"
import { redirect } from "next/navigation"
import {
	getCurrentUser,
	isCurrentUserAdmin,
	createAdminSupabaseClient,
} from "@/lib/auth/unified-auth"
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

// Helper function to get all contact messages using unified auth
async function adminGetContactMessages() {
	try {
		console.log("Getting all contact messages for admin...")
		const supabase = createAdminSupabaseClient()

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
	try {
		// Verify user is authenticated and has admin privileges using UNIFIED AUTH
		const user = await getCurrentUser()
		const isAdmin = await isCurrentUserAdmin()

		if (!user || !isAdmin) {
			console.log("Not authenticated as admin, redirecting to login")
			redirect("/admin/login?redirect=/admin/contacts")
		}

		// Fetch all contact messages using unified auth
		const contacts = await adminGetContactMessages()

		return (
			<div>
				<h1 className="text-3xl font-bold mb-6">Contact Messages</h1>
				<ContactsList initialContacts={contacts} />
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
					An error occurred while loading the contact messages.
				</p>
				<p className="text-sm text-[rgba(var(--color-foreground),0.7)]">
					Please try refreshing the page or contact the administrator.
				</p>
			</div>
		)
	}
}

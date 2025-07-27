/**
 * Admin Contacts Page
 *
 * This page displays contact form submissions for admin review.
 * Uses official Supabase SSR patterns.
 */

import { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
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

// Admin emails
const ADMIN_EMAILS = ["douglas.rogers@gmail.com", "test@testing.com"] as const

/**
 * Check if user is admin
 */
function isAdmin(email?: string): boolean {
	if (!email) return false
	return ADMIN_EMAILS.includes(
		email.toLowerCase() as (typeof ADMIN_EMAILS)[number]
	)
}

// Helper function to get all contact messages using Supabase SSR
async function adminGetContactMessages() {
	try {
		console.log("Getting all contact messages for admin...")
		const supabase = await createClient()

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
		// Verify user is authenticated and has admin privileges
		const supabase = await createClient()
		const {
			data: { user },
		} = await supabase.auth.getUser()

		if (!user || !isAdmin(user.email)) {
			console.log("Not authenticated as admin, redirecting to login")
			redirect("/admin/login?redirect=/admin/contacts")
		}

		// Fetch all contact messages using Supabase SSR
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

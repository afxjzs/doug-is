"use client"

/**
 * This component displays a list of contact form submissions
 * with functionality to mark messages as read/unread.
 */

import { useState } from "react"
import { ContactMessage } from "@/lib/supabase/clientData"

interface ContactsListProps {
	initialContacts: ContactMessage[]
}

export default function ContactsList({ initialContacts }: ContactsListProps) {
	const [contacts, setContacts] = useState<ContactMessage[]>(initialContacts)
	const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "read">(
		"all"
	)
	const [expandedIds, setExpandedIds] = useState<Set<string>>(
		new Set(initialContacts.map((contact) => contact.id))
	)

	// Filter contacts based on current filter selection
	const filteredContacts = contacts.filter((contact) => {
		// Since we removed read/unread functionality, all contacts are shown
		return true // "all" filter
	})

	// Count of each type (keeping for UI consistency but not functional)
	const unreadCount = contacts.length
	const readCount = 0

	// Toggle message expanded state
	const toggleExpand = (id: string) => {
		setExpandedIds((prev) => {
			const newSet = new Set(prev)
			if (newSet.has(id)) {
				newSet.delete(id)
			} else {
				newSet.add(id)
			}
			return newSet
		})
	}

	// Format date for display
	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		})
	}

	return (
		<div className="space-y-4">
			{/* Filter tabs */}
			<div className="filter-tabs">
				<button
					onClick={() => setActiveFilter("all")}
					className={activeFilter === "all" ? "active" : ""}
				>
					All ({contacts.length})
				</button>
				<button
					onClick={() => setActiveFilter("unread")}
					className={activeFilter === "unread" ? "active" : ""}
				>
					Unread ({unreadCount})
				</button>
				<button
					onClick={() => setActiveFilter("read")}
					className={activeFilter === "read" ? "active" : ""}
				>
					Read ({readCount})
				</button>
			</div>

			{/* Contact messages list */}
			{filteredContacts.length === 0 ? (
				<div className="text-center py-8 text-gray-400">
					No contact submissions found.
				</div>
			) : (
				<div className="contacts-list">
					{filteredContacts.map((contact) => (
						<div key={contact.id} className="contact-card">
							<div
								className="contact-header"
								onClick={() => toggleExpand(contact.id)}
							>
								<div className="flex-1">
									<div className="flex items-center gap-3">
										<h3 className="contact-title">
											{contact.subject || "No Subject"}
										</h3>
									</div>
									<div className="contact-meta">
										<span>{contact.name}</span>
										<span className="mx-2">•</span>
										<span>{contact.email}</span>
										<span className="mx-2">•</span>
										<span>{formatDate(contact.created_at)}</span>
									</div>
								</div>
								<div className="contact-actions">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className={`h-5 w-5 text-gray-400 transform transition-transform ${
											expandedIds.has(contact.id) ? "rotate-180" : ""
										}`}
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
							</div>

							{expandedIds.has(contact.id) && (
								<div className="contact-content">
									<div className="contact-message">{contact.message}</div>
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	)
}

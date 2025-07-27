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
	const [expandedId, setExpandedId] = useState<string | null>(null)

	// Filter contacts based on current filter selection
	const filteredContacts = contacts.filter((contact) => {
		if (activeFilter === "unread") return !contact.is_read
		if (activeFilter === "read") return contact.is_read
		return true // "all" filter
	})

	// Count of each type
	const unreadCount = contacts.filter((contact) => !contact.is_read).length
	const readCount = contacts.filter((contact) => contact.is_read).length

	// Toggle message expanded state
	const toggleExpand = (id: string) => {
		setExpandedId(expandedId === id ? null : id)
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

	// Just for display purposes - in a real app this would update the database
	const toggleReadStatus = (id: string) => {
		setContacts(
			contacts.map((contact) =>
				contact.id === id ? { ...contact, is_read: !contact.is_read } : contact
			)
		)
	}

	return (
		<div className="space-y-4">
			{/* Filter tabs */}
			<div className="flex border-b border-[rgba(var(--color-foreground),0.1)]">
				<button
					onClick={() => setActiveFilter("all")}
					className={`px-4 py-2 border-b-2 ${
						activeFilter === "all"
							? "border-[rgba(var(--color-violet),1)] text-[rgba(var(--color-violet),1)]"
							: "border-transparent text-[rgba(var(--color-foreground),0.6)] hover:text-[rgba(var(--color-foreground),0.8)]"
					}`}
				>
					All ({contacts.length})
				</button>
				<button
					onClick={() => setActiveFilter("unread")}
					className={`px-4 py-2 border-b-2 ${
						activeFilter === "unread"
							? "border-[rgba(var(--color-cyan),1)] text-[rgba(var(--color-cyan),1)]"
							: "border-transparent text-[rgba(var(--color-foreground),0.6)] hover:text-[rgba(var(--color-foreground),0.8)]"
					}`}
				>
					Unread ({unreadCount})
				</button>
				<button
					onClick={() => setActiveFilter("read")}
					className={`px-4 py-2 border-b-2 ${
						activeFilter === "read"
							? "border-[rgba(var(--color-green),1)] text-[rgba(var(--color-green),1)]"
							: "border-transparent text-[rgba(var(--color-foreground),0.6)] hover:text-[rgba(var(--color-foreground),0.8)]"
					}`}
				>
					Read ({readCount})
				</button>
			</div>

			{/* Contact messages list */}
			{filteredContacts.length === 0 ? (
				<div className="text-center py-8 text-[rgba(var(--color-foreground),0.6)]">
					No contact submissions found.
				</div>
			) : (
				<div className="space-y-4">
					{filteredContacts.map((contact) => (
						<div
							key={contact.id}
							className={`bg-white rounded-lg shadow-sm border ${
								!contact.is_read
									? "border-[rgba(var(--color-cyan),0.3)]"
									: "border-[rgba(var(--color-foreground),0.1)]"
							}`}
						>
							<div
								className="p-4 cursor-pointer flex justify-between items-center"
								onClick={() => toggleExpand(contact.id)}
							>
								<div className="flex-1">
									<div className="flex items-center gap-3">
										{!contact.is_read && (
											<div className="w-2 h-2 rounded-full bg-[rgba(var(--color-cyan),1)]"></div>
										)}
										<h3 className="font-medium text-lg">
											{contact.subject || "No Subject"}
										</h3>
									</div>
									<div className="flex items-center gap-4 mt-1 text-sm text-[rgba(var(--color-foreground),0.6)]">
										<span>{contact.name}</span>
										<span>{contact.email}</span>
										<span>{formatDate(contact.created_at)}</span>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<button
										onClick={(e) => {
											e.stopPropagation()
											toggleReadStatus(contact.id)
										}}
										className={`p-2 rounded-md ${
											contact.is_read
												? "bg-[rgba(var(--color-foreground),0.05)] text-[rgba(var(--color-foreground),0.6)]"
												: "bg-[rgba(var(--color-cyan),0.1)] text-[rgba(var(--color-cyan),0.9)]"
										}`}
									>
										{contact.is_read ? "Mark as unread" : "Mark as read"}
									</button>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className={`h-5 w-5 text-[rgba(var(--color-foreground),0.4)] transform transition-transform ${
											expandedId === contact.id ? "rotate-180" : ""
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

							{expandedId === contact.id && (
								<div className="px-4 pb-4 pt-2 border-t border-[rgba(var(--color-foreground),0.05)]">
									<div className="bg-[rgba(var(--color-foreground),0.02)] rounded-md p-3 whitespace-pre-wrap">
										{contact.message}
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	)
}

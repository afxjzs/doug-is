import { Metadata } from "next"
import { createClient } from "@supabase/supabase-js"
import Link from "next/link"

export const metadata: Metadata = {
	title: "Contact Messages | Admin | Doug.is",
	description: "Admin page to view contact form submissions",
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

interface ContactMessage {
	id: string
	name: string
	email: string
	subject: string
	message: string
	is_read: boolean
	created_at: string
}

export default async function ContactMessagesPage() {
	// Fetch contact messages from Supabase
	const { data: messages, error } = await supabase
		.from("contact_messages")
		.select("*")
		.order("created_at", { ascending: false })

	if (error) {
		console.error("Error fetching contact messages:", error)
	}

	return (
		<div className="max-w-6xl mx-auto">
			<div className="mb-8">
				<Link href="/admin" className="neon-link mb-4 inline-block">
					← Back to Admin
				</Link>
				<h1 className="text-4xl font-bold gradient-heading mb-4">
					Contact Messages
				</h1>
				<p className="text-xl text-[rgba(var(--color-foreground),0.8)]">
					View and manage contact form submissions.
				</p>
			</div>

			{error && (
				<div className="p-4 bg-[rgba(var(--color-red),0.1)] border border-[rgba(var(--color-red),0.3)] rounded-md text-[rgba(var(--color-red),0.9)] mb-8">
					Error loading messages: {error.message}
				</div>
			)}

			{messages && messages.length === 0 && (
				<div className="p-8 text-center bg-[rgba(var(--color-foreground),0.03)] border border-[rgba(var(--color-foreground),0.1)] rounded-lg">
					<p className="text-[rgba(var(--color-foreground),0.7)]">
						No contact messages yet.
					</p>
				</div>
			)}

			{messages && messages.length > 0 && (
				<div className="space-y-6">
					{messages.map((message: ContactMessage) => (
						<div
							key={message.id}
							className={`p-6 rounded-lg border ${
								message.is_read
									? "bg-[rgba(var(--color-foreground),0.03)] border-[rgba(var(--color-foreground),0.1)]"
									: "bg-[rgba(var(--color-violet),0.05)] border-[rgba(var(--color-violet),0.2)]"
							}`}
						>
							<div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
								<div>
									<h2 className="text-xl font-semibold text-[rgba(var(--color-foreground),0.9)]">
										{message.subject}
									</h2>
									<p className="text-[rgba(var(--color-foreground),0.7)]">
										From: {message.name} ({message.email})
									</p>
								</div>
								<div className="text-[rgba(var(--color-foreground),0.6)] text-sm mt-2 md:mt-0">
									{new Date(message.created_at).toLocaleString()}
								</div>
							</div>
							<div className="bg-[rgba(var(--color-foreground),0.02)] p-4 rounded-md mb-4 whitespace-pre-wrap">
								{message.message}
							</div>
							<div className="flex justify-end">
								{!message.is_read && (
									<button
										className="text-sm text-[rgba(var(--color-cyan),0.9)] hover:text-[rgba(var(--color-cyan),1)]"
										// Note: This button is just for UI demonstration
										// You would need to implement the actual functionality
									>
										Mark as Read
									</button>
								)}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

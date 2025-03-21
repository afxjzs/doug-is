"use server"

import { getServerSupabaseClient } from "@/lib/supabase/serverClient"
import { z } from "zod"

/**
 * Schema for validating contact form submissions
 */
const contactFormSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Invalid email address"),
	subject: z.string().min(1, "Subject is required"),
	message: z.string().min(5, "Message is too short"),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

/**
 * Server action to submit contact form data
 * This uses the server-side Supabase client with the service role key
 * but is safe since it's a server action and never exposes the key to the client
 */
export async function submitContactForm(formData: ContactFormData) {
	try {
		// Validate form data
		const validated = contactFormSchema.safeParse(formData)

		if (!validated.success) {
			return {
				success: false,
				message: "Validation failed",
				errors: validated.error.errors,
			}
		}

		// Get the server-side Supabase client
		const supabase = getServerSupabaseClient()

		// Insert the contact message
		const { error } = await supabase.from("contact_messages").insert({
			name: validated.data.name,
			email: validated.data.email,
			subject: validated.data.subject,
			message: validated.data.message,
			is_read: false,
		})

		if (error) {
			console.error("Failed to submit contact form:", error)
			return {
				success: false,
				message: "Failed to submit your message. Please try again later.",
			}
		}

		return {
			success: true,
			message: "Your message has been sent successfully!",
		}
	} catch (error) {
		console.error("Error submitting contact form:", error)
		return {
			success: false,
			message: "An unexpected error occurred. Please try again later.",
		}
	}
}

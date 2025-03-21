"use server"

import { z } from "zod"
import { createServiceClient } from "@/lib/supabase/serverClient"
import { revalidatePath } from "next/cache"

/**
 * Schema for validating contact form submissions
 */
const contactFormSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Please enter a valid email address"),
	subject: z.string().min(3, "Subject must be at least 3 characters"),
	message: z.string().min(10, "Message must be at least 10 characters"),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

export type ContactFormResponse = {
	success: boolean
	message: string
	errors?: z.ZodIssue[]
}

/**
 * Server action to submit contact form data
 * This uses the server-side Supabase client with the service role key
 * but is safe since it's a server action and never exposes the key to the client
 */
export async function submitContactForm(
	formData: ContactFormData
): Promise<ContactFormResponse> {
	console.log("Server action: submitContactForm called with:", formData)

	// Validate the form data using the schema
	const validationResult = contactFormSchema.safeParse(formData)
	if (!validationResult.success) {
		console.log("Form validation failed:", validationResult.error.issues)
		return {
			success: false,
			message: "Form validation failed",
			errors: validationResult.error.issues,
		}
	}

	try {
		// Create service client with admin role to bypass RLS
		const supabase = createServiceClient()
		console.log("Created server client with service role")

		// Insert form data into database
		console.log("Inserting contact message into database:", formData)

		// Attempt direct insert with all fields
		const { data, error } = await supabase
			.from("contact_messages")
			.insert({
				name: formData.name,
				email: formData.email,
				subject: formData.subject,
				message: formData.message,
			})
			.select()

		if (error) {
			console.error("Database insertion error:", error)

			// If error indicates missing subject column, try alternative approach
			if (error.code === "PGRST204" && error.message.includes("subject")) {
				console.log("Trying alternative insert without subject field")

				// Try insert with subject column omitted - NOTE: This will only work if subject is not required
				const { data: fallbackData, error: fallbackError } = await supabase
					.from("contact_messages")
					.insert({
						name: formData.name,
						email: formData.email,
						// Combine subject into message
						message: `Subject: ${formData.subject}\n\n${formData.message}`,
						// Add empty subject if the type requires it but the column might be nullable
						subject: "",
					})
					.select()

				if (fallbackError) {
					console.error("Alternative insertion failed:", fallbackError)
					return {
						success: false,
						message: `Failed to submit form: ${fallbackError.message}`,
					}
				}

				console.log("Alternative insertion succeeded:", fallbackData)
				revalidatePath("/admin")
				return {
					success: true,
					message: "Your message has been sent successfully!",
				}
			}

			return {
				success: false,
				message: `Failed to submit form: ${error.message}`,
			}
		}

		// Revalidate the admin page path if a new message was added
		revalidatePath("/admin")

		console.log("Form submitted successfully:", data)
		return {
			success: true,
			message: "Your message has been sent successfully!",
		}
	} catch (error) {
		console.error("Unexpected error in submitContactForm:", error)
		return {
			success: false,
			message: "An unexpected error occurred. Please try again later.",
		}
	}
}

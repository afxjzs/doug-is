"use client"

import { useState, useEffect } from "react"
import {
	submitContactForm,
	ContactFormData,
} from "@/lib/actions/contactActions"
import { useEventTracking } from "@/lib/analytics"

type FormState = ContactFormData

type FormStatus = "idle" | "submitting" | "success" | "error"

type FieldErrors = {
	[key in keyof FormState]?: string
}

interface ContactFormProps {
	subjects?: string[]
}

export default function ContactForm({ subjects }: ContactFormProps) {
	const [formState, setFormState] = useState<FormState>({
		name: "",
		email: "",
		subject: subjects && subjects.length > 0 ? subjects[0] : "",
		message: "",
	})
	const [status, setStatus] = useState<FormStatus>("idle")
	const [errorMessage, setErrorMessage] = useState<string>("")
	const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
	const [isVisible, setIsVisible] = useState(false)

	// Analytics tracking
	const {
		trackContactFormView,
		trackContactFormSubmit,
		trackContactFormSuccess,
		trackContactFormError,
	} = useEventTracking()

	// Determine form type based on subjects
	const formType =
		subjects && subjects.length > 0 ? "predefined_subjects" : "open_subject"

	// Track form view on component mount
	useEffect(() => {
		trackContactFormView(formType)
	}, [trackContactFormView, formType])

	useEffect(() => {
		if (status === "success") {
			setIsVisible(true)
			// Track successful form submission
			trackContactFormSuccess(formType)
		} else {
			setIsVisible(false)
		}
	}, [status, trackContactFormSuccess, formType])

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target
		setFormState((prev) => ({ ...prev, [name]: value }))

		// Clear field error when user starts typing
		if (fieldErrors[name as keyof FormState]) {
			setFieldErrors((prev) => ({ ...prev, [name]: undefined }))
		}
	}

	const handleFieldFocus = (fieldName: string) => {
		// Track field focus events using the generic event tracker
		const { trackCustomEvent } = useEventTracking()
		trackCustomEvent({
			event: "contact_form_field_focus",
			properties: {
				field_name: fieldName,
				form_type: formType,
				timestamp: new Date().toISOString(),
			},
		})
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		console.log("Form submission started", formState)
		setStatus("submitting")
		setErrorMessage("")
		setFieldErrors({})

		// Track form submission attempt
		trackContactFormSubmit(
			formType,
			typeof window !== "undefined" ? document.referrer : undefined
		)

		let result: any = null
		try {
			// Using server action instead of fetch API
			console.log("Calling submitContactForm with:", formState)
			result = (await submitContactForm(formState)) || {
				success: false,
				message: "No response from server",
			}
			console.log("Server action response:", result)

			if (!result || !result.success) {
				console.error(
					"Form submission failed:",
					result?.message || "Unknown error"
				)

				// Process field-specific errors if available
				if (result?.errors && Array.isArray(result.errors)) {
					const newFieldErrors: FieldErrors = {}
					result.errors.forEach((error: any) => {
						if (error.path && error.path.length > 0) {
							const fieldName = error.path[0] as keyof FormState
							newFieldErrors[fieldName] = error.message
						}
					})
					setFieldErrors(newFieldErrors)
				}

				// Track form submission error
				trackContactFormError(
					result?.message || "Unknown submission error",
					formType
				)

				throw new Error(
					result?.message || "Something went wrong with form submission"
				)
			}

			console.log("Form submission successful")
			setStatus("success")
			setFormState({
				name: "",
				email: "",
				subject: subjects && subjects.length > 0 ? subjects[0] : "",
				message: "",
			})
		} catch (error: any) {
			console.error("Form submission error details:", error)
			setStatus("error")
			const errorMsg =
				error instanceof Error ? error.message : "An unexpected error occurred"
			setErrorMessage(errorMsg)

			// Track form submission error if not already tracked
			if (!result || result.success !== false) {
				trackContactFormError(errorMsg, formType)
			}
		}
	}

	const handleSendAnotherMessage = () => {
		setStatus("idle")
		// Track when user chooses to send another message
		trackContactFormView(formType) // Track as a new form view
	}

	// Display thank you message when form is successfully submitted
	if (status === "success") {
		return (
			<div className="space-y-6">
				<div
					className={`
						dark-card
						bg-[rgba(var(--color-background),0.4)]
						border border-[rgba(var(--color-cyan),0.4)]
						shadow-[0_0_15px_rgba(var(--color-cyan),0.3)]
						rounded-md text-center p-8
						transition-all duration-500 ease-in-out
						${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
					`}
				>
					<h3 className="text-2xl font-semibold gradient-text-cyan mb-3">
						Thank You!
					</h3>
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-6">
						Your message has been received. I'll get back to you as soon as
						possible.
					</p>
					<button
						onClick={handleSendAnotherMessage}
						className="neon-button-magenta px-6 py-2"
					>
						Send Another Message
					</button>
				</div>
			</div>
		)
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{status === "error" && (
				<div className="p-4 bg-[rgba(var(--color-red),0.1)] border border-[rgba(var(--color-red),0.3)] rounded-md text-[rgba(var(--color-red),0.9)]">
					{errorMessage}
				</div>
			)}

			<div>
				<label
					htmlFor="name"
					className="block text-[rgba(var(--color-foreground),0.8)] mb-2"
				>
					Name
				</label>
				<input
					type="text"
					id="name"
					name="name"
					value={formState.name}
					onChange={handleChange}
					onFocus={() => handleFieldFocus("name")}
					required
					disabled={status === "submitting"}
					className={`w-full p-3 bg-[rgba(var(--color-foreground),0.03)] border ${
						fieldErrors.name
							? "border-[rgba(var(--color-red),0.5)]"
							: "border-[rgba(var(--color-foreground),0.1)]"
					} rounded-md focus:outline-none focus:ring-2 focus:ring-[rgba(var(--color-violet),0.5)] focus:border-transparent text-[rgba(var(--color-foreground),0.9)]`}
				/>
				{fieldErrors.name && (
					<p className="mt-1 text-sm text-[rgba(var(--color-red),0.9)]">
						{fieldErrors.name}
					</p>
				)}
			</div>

			<div>
				<label
					htmlFor="email"
					className="block text-[rgba(var(--color-foreground),0.8)] mb-2"
				>
					Email
				</label>
				<input
					type="email"
					id="email"
					name="email"
					value={formState.email}
					onChange={handleChange}
					onFocus={() => handleFieldFocus("email")}
					required
					disabled={status === "submitting"}
					className={`w-full p-3 bg-[rgba(var(--color-foreground),0.03)] border ${
						fieldErrors.email
							? "border-[rgba(var(--color-red),0.5)]"
							: "border-[rgba(var(--color-foreground),0.1)]"
					} rounded-md focus:outline-none focus:ring-2 focus:ring-[rgba(var(--color-violet),0.5)] focus:border-transparent text-[rgba(var(--color-foreground),0.9)]`}
				/>
				{fieldErrors.email && (
					<p className="mt-1 text-sm text-[rgba(var(--color-red),0.9)]">
						{fieldErrors.email}
					</p>
				)}
			</div>

			<div>
				<label
					htmlFor="subject"
					className="block text-[rgba(var(--color-foreground),0.8)] mb-2"
				>
					Subject
				</label>
				{subjects && subjects.length > 0 ? (
					<select
						id="subject"
						name="subject"
						value={formState.subject}
						onChange={handleChange}
						onFocus={() => handleFieldFocus("subject")}
						required
						disabled={status === "submitting"}
						className={`w-full p-3 bg-[rgba(var(--color-foreground),0.03)] border ${
							fieldErrors.subject
								? "border-[rgba(var(--color-red),0.5)]"
								: "border-[rgba(var(--color-foreground),0.1)]"
						} rounded-md focus:outline-none focus:ring-2 focus:ring-[rgba(var(--color-violet),0.5)] focus:border-transparent text-[rgba(var(--color-foreground),0.9)]`}
					>
						{subjects.map((option) => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</select>
				) : (
					<input
						type="text"
						id="subject"
						name="subject"
						value={formState.subject}
						onChange={handleChange}
						onFocus={() => handleFieldFocus("subject")}
						required
						disabled={status === "submitting"}
						className={`w-full p-3 bg-[rgba(var(--color-foreground),0.03)] border ${
							fieldErrors.subject
								? "border-[rgba(var(--color-red),0.5)]"
								: "border-[rgba(var(--color-foreground),0.1)]"
						} rounded-md focus:outline-none focus:ring-2 focus:ring-[rgba(var(--color-violet),0.5)] focus:border-transparent text-[rgba(var(--color-foreground),0.9)]`}
					/>
				)}
				{fieldErrors.subject && (
					<p className="mt-1 text-sm text-[rgba(var(--color-red),0.9)]">
						{fieldErrors.subject}
					</p>
				)}
			</div>

			<div>
				<label
					htmlFor="message"
					className="block text-[rgba(var(--color-foreground),0.8)] mb-2"
				>
					Message
				</label>
				<textarea
					id="message"
					name="message"
					value={formState.message}
					onChange={handleChange}
					onFocus={() => handleFieldFocus("message")}
					required
					disabled={status === "submitting"}
					rows={6}
					className={`w-full p-3 bg-[rgba(var(--color-foreground),0.03)] border ${
						fieldErrors.message
							? "border-[rgba(var(--color-red),0.5)]"
							: "border-[rgba(var(--color-foreground),0.1)]"
					} rounded-md focus:outline-none focus:ring-2 focus:ring-[rgba(var(--color-violet),0.5)] focus:border-transparent text-[rgba(var(--color-foreground),0.9)]`}
				></textarea>
				{fieldErrors.message && (
					<p className="mt-1 text-sm text-[rgba(var(--color-red),0.9)]">
						{fieldErrors.message}
					</p>
				)}
			</div>

			<div>
				<button
					type="submit"
					disabled={status === "submitting"}
					className="neon-button-magenta w-full py-3 text-center"
				>
					{status === "submitting" ? "Sending..." : "Send Message"}
				</button>
			</div>
		</form>
	)
}

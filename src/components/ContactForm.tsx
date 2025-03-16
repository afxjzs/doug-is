"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type FormState = {
	name: string
	email: string
	subject: string
	message: string
}

type FormStatus = "idle" | "submitting" | "success" | "error"

export default function ContactForm() {
	const router = useRouter()
	const [formState, setFormState] = useState<FormState>({
		name: "",
		email: "",
		subject: "",
		message: "",
	})
	const [status, setStatus] = useState<FormStatus>("idle")
	const [errorMessage, setErrorMessage] = useState<string>("")

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target
		setFormState((prev) => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setStatus("submitting")
		setErrorMessage("")

		try {
			const response = await fetch("/api/contact", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formState),
			})

			// Check if response is JSON
			const contentType = response.headers.get("content-type")
			if (!contentType || !contentType.includes("application/json")) {
				// Handle non-JSON response (like HTML error pages)
				const text = await response.text()
				console.error("Non-JSON response:", text)
				throw new Error(
					"Server returned an invalid response. Please try again later."
				)
			}

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.message || "Something went wrong")
			}

			setStatus("success")
			setFormState({
				name: "",
				email: "",
				subject: "",
				message: "",
			})

			// Redirect after a short delay to show success message
			setTimeout(() => {
				router.push("/contact/thank-you")
			}, 2000)
		} catch (error) {
			setStatus("error")
			if (error instanceof SyntaxError && error.message.includes("JSON")) {
				// Handle JSON parsing errors specifically
				console.error("JSON parsing error:", error)
				setErrorMessage(
					"The server returned an invalid response. This might be due to a temporary issue. Please try again later."
				)
			} else {
				setErrorMessage(
					error instanceof Error
						? error.message
						: "An unexpected error occurred"
				)
			}
			console.error("Form submission error:", error)
		}
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{status === "error" && (
				<div className="p-4 bg-[rgba(var(--color-red),0.1)] border border-[rgba(var(--color-red),0.3)] rounded-md text-[rgba(var(--color-red),0.9)]">
					{errorMessage}
				</div>
			)}

			{status === "success" && (
				<div className="p-4 bg-[rgba(var(--color-green),0.1)] border border-[rgba(var(--color-green),0.3)] rounded-md text-[rgba(var(--color-green),0.9)]">
					Your message has been sent successfully! Redirecting...
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
					required
					disabled={status === "submitting"}
					className="w-full p-3 bg-[rgba(var(--color-foreground),0.03)] border border-[rgba(var(--color-foreground),0.1)] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgba(var(--color-violet),0.5)] focus:border-transparent text-[rgba(var(--color-foreground),0.9)]"
				/>
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
					required
					disabled={status === "submitting"}
					className="w-full p-3 bg-[rgba(var(--color-foreground),0.03)] border border-[rgba(var(--color-foreground),0.1)] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgba(var(--color-violet),0.5)] focus:border-transparent text-[rgba(var(--color-foreground),0.9)]"
				/>
			</div>

			<div>
				<label
					htmlFor="subject"
					className="block text-[rgba(var(--color-foreground),0.8)] mb-2"
				>
					Subject
				</label>
				<input
					type="text"
					id="subject"
					name="subject"
					value={formState.subject}
					onChange={handleChange}
					required
					disabled={status === "submitting"}
					className="w-full p-3 bg-[rgba(var(--color-foreground),0.03)] border border-[rgba(var(--color-foreground),0.1)] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgba(var(--color-violet),0.5)] focus:border-transparent text-[rgba(var(--color-foreground),0.9)]"
				/>
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
					required
					disabled={status === "submitting"}
					rows={6}
					className="w-full p-3 bg-[rgba(var(--color-foreground),0.03)] border border-[rgba(var(--color-foreground),0.1)] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgba(var(--color-violet),0.5)] focus:border-transparent text-[rgba(var(--color-foreground),0.9)]"
				></textarea>
			</div>

			<div>
				<button
					type="submit"
					disabled={status === "submitting"}
					className="neon-button-violet w-full py-3 text-center"
				>
					{status === "submitting" ? "Sending..." : "Send Message"}
				</button>
			</div>
		</form>
	)
}

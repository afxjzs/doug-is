"use client"

import { useEffect, useRef, useState } from "react"
import { useAnalytics } from "@/lib/analytics/context"
import { loadCalEmbed } from "@/lib/cal-embed"

// Cal.com event for this page. Doug creates it in Cal; on 2026-10-03
// cal.com/afxjzs/automation-discovery-call still returned 404.
const CAL_LINK = "afxjzs/automation-discovery-call"
const CAL_NAMESPACE = "automation-discovery-call"

type Status = "idle" | "submitting" | "success" | "error"

const CONTEXT_OPTIONS = [
	{ value: "business", label: "My business" },
	{ value: "team", label: "My team at work" },
	{ value: "just-me", label: "Just me" },
]

const inputClass =
	"w-full p-3 bg-[rgba(var(--color-foreground),0.03)] border border-[rgba(var(--color-foreground),0.1)] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgba(var(--color-accent),0.5)] focus:border-transparent text-[rgba(var(--color-foreground),0.9)]"
const inputStyle = {
	transition: "border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)",
}
const labelClass = "block text-[rgba(var(--color-foreground),0.8)] mb-2"

export default function AutomationLeadForm() {
	const [form, setForm] = useState({ name: "", email: "", phone: "", context: "", problem: "" })
	const [status, setStatus] = useState<Status>("idle")
	const [error, setError] = useState("")
	const calLoaded = useRef(false)
	const analytics = useAnalytics()

	// Fields stay disabled until React hydrates. Anything typed before then
	// gets wiped by hydration, and a submit would skip the JS handler.
	const [hydrated, setHydrated] = useState(false)
	useEffect(() => setHydrated(true), [])

	const set = (field: keyof typeof form) => (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
	) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

	useEffect(() => {
		if (status !== "success" || calLoaded.current) return
		calLoaded.current = true
		loadCalEmbed({
			calLink: CAL_LINK,
			namespace: CAL_NAMESPACE,
			brand: { light: "#0a0e1a", dark: "#d4a853" },
		})
	}, [status])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setStatus("submitting")
		setError("")
		analytics.trackEvent({
			event: "contact_form_submit",
			properties: { form_type: "automation-lead", context: form.context, timestamp: new Date().toISOString() },
		})

		try {
			const res = await fetch("/api/automation-lead", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form),
			})
			if (!res.ok) {
				const data = await res.json().catch(() => null)
				throw new Error(data?.message || `Something went wrong (HTTP ${res.status}). Please try again.`)
			}
			setStatus("success")
			analytics.trackEvent({
				event: "contact_form_success",
				properties: { form_type: "automation-lead", context: form.context, timestamp: new Date().toISOString() },
			})
		} catch (err) {
			const message = err instanceof Error ? err.message : "Something went wrong. Please try again."
			setStatus("error")
			setError(message)
			analytics.trackEvent({
				event: "contact_form_error",
				properties: { form_type: "automation-lead", error_message: message, timestamp: new Date().toISOString() },
			})
		}
	}

	if (status === "success") {
		return (
			<div className="dark-card">
				<h3 className="text-2xl font-semibold display-heading mb-2">Got it. Now pick a time.</h3>
				<p className="text-[rgba(var(--color-foreground),0.75)] mb-6">
					Thirty minutes, free. Grab whatever slot works and I&apos;ll call you.
				</p>
				<div
					id={`my-cal-inline-${CAL_NAMESPACE}`}
					className="w-full min-h-[550px] rounded-md overflow-auto"
					style={{ colorScheme: "dark" }}
				/>
			</div>
		)
	}

	const submitting = status === "submitting"

	return (
		<form onSubmit={handleSubmit} className="dark-card space-y-6">
			{status === "error" && (
				<div role="alert" className="p-4 rounded-md border border-red-400/40 bg-red-400/10 text-red-300">
					{error}
				</div>
			)}

			<fieldset disabled={!hydrated || submitting} className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					<label htmlFor="al-name" className={labelClass}>Your name</label>
					<input id="al-name" required value={form.name} onChange={set("name")} className={inputClass} style={inputStyle} autoComplete="name" />
				</div>
				<div>
					<label htmlFor="al-email" className={labelClass}>Email</label>
					<input id="al-email" type="email" required value={form.email} onChange={set("email")} className={inputClass} style={inputStyle} autoComplete="email" />
				</div>
				<div>
					<label htmlFor="al-phone" className={labelClass}>
						Phone <span className="text-[rgba(var(--color-foreground),0.5)]">(optional)</span>
					</label>
					<input id="al-phone" type="tel" value={form.phone} onChange={set("phone")} className={inputClass} style={inputStyle} autoComplete="tel" />
				</div>
				<div>
					<label htmlFor="al-context" className={labelClass}>Who&apos;s this for?</label>
					<select id="al-context" required value={form.context} onChange={set("context")} className={inputClass} style={inputStyle}>
						<option value="" disabled>Pick one</option>
						{CONTEXT_OPTIONS.map((o) => (
							<option key={o.value} value={o.value}>{o.label}</option>
						))}
					</select>
				</div>
			</div>

			<div>
				<label htmlFor="al-problem" className={labelClass}>What&apos;s eating your time?</label>
				<textarea
					id="al-problem"
					required
					rows={4}
					value={form.problem}
					onChange={set("problem")}
					placeholder="The task you dread every week. A sentence is plenty."
					className={inputClass}
					style={inputStyle}
				/>
			</div>

			<button type="submit" className="btn-primary w-full py-3 text-center disabled:opacity-60">
				{submitting ? "Sending…" : "Book a free call"}
			</button>
			</fieldset>
		</form>
	)
}

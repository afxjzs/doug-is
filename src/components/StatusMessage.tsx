import React from "react"
import { cn } from "@/lib/utils"

export type StatusType = "loading" | "error" | "info" | "success" | "warning"

interface StatusMessageProps {
	type: StatusType
	message: string
	details?: string
	className?: string
	showDetails?: boolean
}

export default function StatusMessage({
	type,
	message,
	details,
	className,
	showDetails = process.env.NODE_ENV === "development",
}: StatusMessageProps) {
	const styles = {
		container: {
			base: "relative overflow-hidden rounded-lg border border-[rgba(var(--color-foreground),0.05)] p-4 mb-6 backdrop-blur-sm",
			loading:
				"bg-[rgba(var(--color-cyan),0.05)] border-l-4 border-l-[rgba(var(--color-cyan),0.5)]",
			error:
				"bg-[rgba(var(--color-magenta),0.05)] border-l-4 border-l-[rgba(var(--color-magenta),0.5)]",
			success:
				"bg-[rgba(var(--color-emerald),0.05)] border-l-4 border-l-[rgba(var(--color-emerald),0.5)]",
			warning:
				"bg-[rgba(var(--color-gold),0.05)] border-l-4 border-l-[rgba(var(--color-gold),0.5)]",
			info: "bg-[rgba(var(--color-violet),0.05)] border-l-4 border-l-[rgba(var(--color-violet),0.5)]",
		},
		text: {
			loading: "text-[rgba(var(--color-cyan),0.9)]",
			error: "text-[rgba(var(--color-magenta),0.9)]",
			success: "text-[rgba(var(--color-emerald),0.9)]",
			warning: "text-[rgba(var(--color-gold),0.9)]",
			info: "text-[rgba(var(--color-violet),0.9)]",
		},
		details: {
			base: "text-sm mt-2 font-mono",
			loading: "text-[rgba(var(--color-cyan),0.7)]",
			error: "text-[rgba(var(--color-magenta),0.7)]",
			success: "text-[rgba(var(--color-emerald),0.7)]",
			warning: "text-[rgba(var(--color-gold),0.7)]",
			info: "text-[rgba(var(--color-violet),0.7)]",
		},
	}

	// Pulse animation for loading state
	const loadingAnimation =
		type === "loading" ? (
			<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-pulse-slide opacity-30" />
		) : null

	return (
		<div
			className={cn(styles.container.base, styles.container[type], className)}
		>
			{loadingAnimation}
			<div className="relative z-10">
				<p className={styles.text[type]}>{message}</p>
				{details && showDetails && (
					<p className={cn(styles.details.base, styles.details[type])}>
						{details}
					</p>
				)}
			</div>
		</div>
	)
}

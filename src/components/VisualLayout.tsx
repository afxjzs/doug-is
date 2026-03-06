"use client"

export default function VisualLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className="min-h-screen flex flex-col bg-[rgb(var(--color-background))]">
			{children}
		</div>
	)
}

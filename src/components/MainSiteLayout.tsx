"use client"

import LayoutWrapper from "./LayoutWrapper"

export default function MainSiteLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className="min-h-screen flex flex-col bg-[rgb(var(--color-background))]">
			{/* Subtle top glow — adds depth without being flashy */}
			<div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(var(--color-accent),0.06)_0%,transparent_70%)] pointer-events-none z-0" />
			<LayoutWrapper>{children}</LayoutWrapper>
		</div>
	)
}

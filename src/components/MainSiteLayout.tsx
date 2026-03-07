"use client"

import LayoutWrapper from "./LayoutWrapper"

export default function MainSiteLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className="min-h-screen flex flex-col bg-[rgb(var(--color-background))]">
			<LayoutWrapper>{children}</LayoutWrapper>
		</div>
	)
}

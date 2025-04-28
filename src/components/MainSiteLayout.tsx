"use client"

import LayoutWrapper from "./LayoutWrapper"
import { cn } from "@/lib/utils/index"

export default function MainSiteLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className="min-h-screen flex flex-col">
			{/* Subtle grid background */}
			<div className="fixed inset-0 bg-[url('/grid-bg.svg')] opacity-5 z-0 pointer-events-none"></div>

			{/* Subtle gradient overlay */}
			<div className="fixed inset-0 bg-gradient-to-br from-[rgba(var(--color-violet),0.05)] via-transparent to-[rgba(var(--color-cyan),0.05)] z-0 pointer-events-none"></div>

			{/* Subtle noise texture */}
			<div className="fixed inset-0 bg-[url('/noise.png')] opacity-[0.02] z-0 pointer-events-none mix-blend-overlay"></div>

			{/* Scanlines effect */}
			<div className="fixed inset-0 scanlines opacity-10 z-0 pointer-events-none"></div>

			<LayoutWrapper>{children}</LayoutWrapper>
		</div>
	)
}

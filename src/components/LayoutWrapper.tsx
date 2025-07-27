"use client"

import { usePathname } from "next/navigation"
import ServerLayoutWrapper from "./ServerLayoutWrapper"

export default function LayoutWrapper({
	children,
}: {
	children: React.ReactNode
}) {
	const pathname = usePathname()

	// Routes that should NOT have the site layout
	const isSpecialRoute =
		pathname.startsWith("/migraine-free") || pathname.startsWith("/admin")

	if (isSpecialRoute) {
		// Special routes get no wrapper - they handle their own layout
		return <>{children}</>
	}

	// Regular routes get the site layout
	return <ServerLayoutWrapper>{children}</ServerLayoutWrapper>
}

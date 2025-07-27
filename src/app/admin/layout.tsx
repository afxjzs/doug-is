/**
 * Admin route group layout that provides admin-specific layout
 * without main site header and footer
 */

import { headers } from "next/headers"
import AdminNavigation from "@/components/admin/AdminNavigation"
import "./admin.css"

export default async function AdminRouteLayout({
	children,
}: {
	children: React.ReactNode
}) {
	// Check if we're on the login page
	const headersList = await headers()
	const isLoginPage = headersList.get("x-is-login-page") === "true"

	// Route group layout - provides complete isolated admin layout
	if (isLoginPage) {
		// Login page: Just the content, no navigation
		return <>{children}</>
	}

	// Admin pages: Complete admin layout with navigation
	return (
		<div
			className="admin-layout"
			style={{
				display: "flex",
				height: "100vh",
				backgroundColor: "#0f0d14",
				color: "rgba(255, 255, 255, 0.9)",
				fontFamily:
					'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
			}}
		>
			<AdminNavigation />
			<main
				className="admin-main"
				style={{
					flex: 1,
					padding: "2rem",
					overflow: "auto",
					backgroundColor: "#0f0d14",
					marginLeft: "16rem",
				}}
			>
				{children}
			</main>
		</div>
	)
}

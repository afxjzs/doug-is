/**
 * Admin Layout - Server-Side Auth Protection
 *
 * Following official Supabase patterns for protecting admin routes.
 * Authentication check happens in the component, not middleware.
 */

import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { getUser, isAdmin } from "@/lib/supabase/server"
import AdminNavigation from "@/components/admin/AdminNavigation"
import AdminHeader from "@/components/admin/AdminHeader"
import "./admin.css"

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode
}) {
	// Get the current path to check if we should bypass auth
	const headersList = await headers()
	const pathname = headersList.get("x-pathname") || ""

	// Bypass auth check for login, register, and auth callback pages
	const authBypassPaths = ["/admin/login", "/admin/register", "/admin/setup"]
	const shouldBypassAuth = authBypassPaths.some((path) =>
		pathname.startsWith(path)
	)

	if (shouldBypassAuth) {
		// For auth pages, just render the children without admin layout
		return <>{children}</>
	}

	// Get user using the official pattern for protected admin pages
	const user = await getUser()
	const adminCheck = await isAdmin()

	// Redirect to login if not authenticated or not admin
	if (!user) {
		redirect("/admin/login?error=login_required")
	}

	if (!adminCheck) {
		redirect("/admin/login?error=admin_required")
	}

	return (
		<div className="admin-layout">
			<AdminNavigation />
			<div className="admin-main">{children}</div>
		</div>
	)
}

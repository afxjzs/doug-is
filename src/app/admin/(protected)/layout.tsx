/**
 * Admin Gate - Server-Side Auth Protection
 *
 * Every page in the (protected) route group sits under this layout, so none
 * of them renders without an admin session. The public auth pages (login,
 * register, setup) live outside the group and never reach this check, so the
 * gate needs no knowledge of the current path. Do not reintroduce a
 * path-based bypass here: request headers are client-controlled.
 */

import { redirect } from "next/navigation"
import { getUser, isAdmin } from "@/lib/supabase/server"
import AdminNavigation from "@/components/admin/AdminNavigation"

export default async function AdminGateLayout({
	children,
}: {
	children: React.ReactNode
}) {
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

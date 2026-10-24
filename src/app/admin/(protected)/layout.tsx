/**
 * Admin Gate - Server-Side Auth Protection
 *
 * Every page in the (protected) route group sits under this layout, so none
 * of them renders without an admin session. The public auth pages (login,
 * setup) live outside the group and never reach this check, so the
 * gate needs no knowledge of the current path. Do not reintroduce a
 * path-based bypass here: request headers are client-controlled.
 */

import AdminNavigation from "@/components/admin/AdminNavigation"
import { requireAdminPage } from "./require-admin"

// This check guards document requests. RSC navigations can skip this layout,
// so every page in the group also calls requireAdminPage() itself.
export default async function AdminGateLayout({
	children,
}: {
	children: React.ReactNode
}) {
	await requireAdminPage()

	return (
		<div className="admin-layout">
			<AdminNavigation />
			<div className="admin-main">{children}</div>
		</div>
	)
}

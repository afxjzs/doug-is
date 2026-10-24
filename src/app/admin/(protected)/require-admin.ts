/**
 * The admin check every gated page, layout and generateMetadata calls itself.
 *
 * The (protected) layout is not enough on its own. On an RSC navigation
 * request Next skips rendering any layout the client says it already has
 * mounted (the Next-Router-State-Tree header), and a client can forge that
 * header, so a check that lives only in the layout never runs. Call this at
 * the top of anything that reads private data, outside any try/catch:
 * redirect() works by throwing.
 */

import { redirect } from "next/navigation"
import { getUser, isAdmin } from "@/lib/supabase/server"

export async function requireAdminPage() {
	const user = await getUser()
	if (!user) {
		redirect("/admin/login?error=login_required")
	}
	if (!(await isAdmin())) {
		redirect("/admin/login?error=admin_required")
	}
	return user
}

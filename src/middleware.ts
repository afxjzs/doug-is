import { updateSession } from "@/lib/supabase/middleware"
import { type NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
	// Handle Supabase auth session updates
	const response = await updateSession(request)

	// Set headers for admin login page detection (still needed for admin layout logic)
	if (request.nextUrl.pathname === "/admin/login") {
		response.headers.set("x-is-login-page", "true")
	} else {
		response.headers.set("x-is-login-page", "false")
	}

	return response
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
		 * - Supabase auth endpoints (to prevent infinite loops)
		 * Feel free to modify this pattern to include more paths.
		 */
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|auth).*)",
	],
}

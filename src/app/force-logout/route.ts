/**
 * Emergency force logout route that works in all cases
 */

import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
	// Get cookie store
	const cookieStore = await cookies()

	// Clear all auth-related cookies (be exhaustive to ensure logout)
	const authCookies = [
		"sb-access-token",
		"sb-refresh-token",
		"supabase-auth-token",
		"sb:token", // Cover older formats
		"supabase.auth.token",
		// Add any other potential auth cookie names
		"sb-tzffjzocrazemvtgqavg-auth-token",
	]

	// Delete each cookie with every possible domain/path combination
	for (const name of authCookies) {
		cookieStore.delete(name)

		// Also try deleting with different options in case one works
		cookieStore.set({
			name,
			value: "",
			expires: new Date(0),
			path: "/",
			maxAge: 0,
		})
	}

	// Return an HTML response that clears localStorage and redirects
	const html = `
	<!DOCTYPE html>
	<html>
	<head>
		<title>Logging Out...</title>
		<style>
			body { font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f7f7f7; }
			.logout-box { text-align: center; padding: 2rem; background: white; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
			h1 { margin-top: 0; color: #333; }
			p { color: #666; margin-bottom: 1.5rem; }
		</style>
	</head>
	<body>
		<div class="logout-box">
			<h1>Logging Out</h1>
			<p>Clearing authentication data and redirecting...</p>
		</div>
		
		<script>
			// Clear ALL localStorage
			localStorage.clear();
			
			// Also try to clear specific items
			localStorage.removeItem("supabase.auth.token");
			localStorage.removeItem("sb-tzffjzocrazemvtgqavg-auth-token");
			
			// Redirect after a short delay
			setTimeout(function() {
				window.location.href = "/admin/login";
			}, 1000);
		</script>
	</body>
	</html>
	`

	return new NextResponse(html, {
		status: 200,
		headers: {
			"Content-Type": "text/html",
			"Cache-Control": "no-store, max-age=0, must-revalidate",
		},
	})
}

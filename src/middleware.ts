import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient, type CookieOptions } from "@supabase/ssr"

// Single admin email - only this account has admin access
const ALLOWED_ADMIN_EMAILS = ["douglas.rogers@gmail.com"]

/**
 * This middleware intercepts requests and adds auth protection for admin routes
 */
export async function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname

	// Only apply auth protection to admin routes
	if (pathname.startsWith("/admin")) {
		// Skip auth check for auth-related pages to prevent redirect loops
		if (
			pathname === "/admin/login" ||
			pathname === "/admin/register" ||
			pathname.startsWith("/api/auth/")
		) {
			return NextResponse.next()
		}

		// Initialize response to modify
		let response = NextResponse.next({
			request: {
				headers: request.headers,
			},
		})

		// Create a Supabase client specifically for middleware usage
		const supabase = createServerClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL || "",
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
			{
				cookies: {
					get(name) {
						return request.cookies.get(name)?.value
					},
					set(name, value, options) {
						// This is used for setting cookies in the response
						response.cookies.set({
							name,
							value,
							...options,
						})
					},
					remove(name, options) {
						// This is used for removing cookies in the response
						response.cookies.set({
							name,
							value: "",
							...options,
						})
					},
				},
			}
		)

		// Check if there's an authenticated user using getUser() which is more secure
		// than getSession() as it verifies with the auth server
		const {
			data: { user },
		} = await supabase.auth.getUser()

		// If no authenticated user, redirect to login
		if (!user) {
			// Use a simple redirect with only the pathname to avoid encoding issues
			const redirectUrl = new URL("/admin/login", request.url)
			redirectUrl.searchParams.set("redirect", pathname)

			// Return a clean redirect response
			return NextResponse.redirect(redirectUrl.toString())
		}

		// Check if the user's email is in the admin allowlist
		const userEmail = user.email
		const isAdmin =
			userEmail && ALLOWED_ADMIN_EMAILS.includes(userEmail.toLowerCase())

		if (!isAdmin) {
			// User is logged in but not an admin
			return new NextResponse(
				`<html>
        <head>
          <title>Access Denied</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background: #0f1214;
              color: rgba(255, 255, 255, 0.9);
            }
            .container {
              max-width: 600px;
              padding: 2rem;
              text-align: center;
              background: rgba(255, 255, 255, 0.03);
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 10px;
            }
            h1 {
              margin-top: 0;
              color: #f87171;
            }
            p {
              margin-bottom: 1.5rem;
            }
            a {
              display: inline-block;
              margin-top: 1rem;
              padding: 0.5rem 1rem;
              background: rgba(136, 153, 248, 0.1);
              border: 1px solid rgba(136, 153, 248, 0.3);
              border-radius: 5px;
              color: #8899f8;
              text-decoration: none;
              transition: all 0.2s ease;
            }
            a:hover {
              background: rgba(136, 153, 248, 0.2);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Access Denied</h1>
            <p>You don't have permission to access this area.</p>
            <p>Please contact the administrator if you believe this is an error.</p>
            <a href="/">Return to Home</a>
          </div>
        </body>
      </html>`,
				{
					status: 403,
					headers: {
						"Content-Type": "text/html",
					},
				}
			)
		}

		// User is an admin, allow the request to proceed
		return response
	}

	// For non-admin routes, proceed normally
	return NextResponse.next()
}

// Only apply this middleware to admin routes
export const config = {
	matcher: ["/admin/:path*"],
}

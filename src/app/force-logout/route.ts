/**
 * Force logout route that matches the site's style
 */

import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
	// Get cookie store
	const cookieStore = await cookies()

	// Clear all auth-related cookies
	const authCookies = [
		"sb-access-token",
		"sb-refresh-token",
		"supabase-auth-token",
		"sb:token",
		"supabase.auth.token",
		"sb-tzffjzocrazemvtgqavg-auth-token",
	]

	// Delete each cookie
	for (const name of authCookies) {
		cookieStore.delete(name)

		// Also try setting to expired
		cookieStore.set({
			name,
			value: "",
			expires: new Date(0),
			path: "/",
			maxAge: 0,
		})
	}

	// Return an HTML response with site styling
	const html = `
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Signing Out | Doug.is</title>
		<link rel="preconnect" href="https://fonts.googleapis.com">
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
		<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
		<style>
			:root {
				--color-background: 18, 18, 18;
				--color-foreground: 255, 255, 255;
				--color-violet: 138, 43, 226;
			}
			
			* {
				margin: 0;
				padding: 0;
				box-sizing: border-box;
			}
			
			body {
				font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
				background-color: rgb(var(--color-background));
				color: rgba(var(--color-foreground), 0.9);
				display: flex;
				flex-direction: column;
				min-height: 100vh;
				line-height: 1.5;
			}
			
			.container {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				flex: 1;
				padding: 2rem;
				text-align: center;
			}
			
			.card {
				background-color: rgba(var(--color-foreground), 0.03);
				border: 1px solid rgba(var(--color-foreground), 0.1);
				border-radius: 0.75rem;
				padding: 2.5rem;
				max-width: 32rem;
				width: 100%;
			}
			
			h1 {
				font-size: 2rem;
				font-weight: 700;
				margin-bottom: 1rem;
				background: linear-gradient(to right, rgba(var(--color-violet), 1), rgba(var(--color-foreground), 0.8));
				-webkit-background-clip: text;
				background-clip: text;
				-webkit-text-fill-color: transparent;
			}
			
			p {
				margin-bottom: 1.5rem;
				color: rgba(var(--color-foreground), 0.7);
			}
			
			.loader {
				width: 2.5rem;
				height: 2.5rem;
				border: 3px solid rgba(var(--color-foreground), 0.1);
				border-radius: 50%;
				border-top-color: rgba(var(--color-violet), 0.8);
				animation: spin 1s ease-in-out infinite;
				margin: 0 auto 1.5rem;
			}
			
			@keyframes spin {
				to { transform: rotate(360deg); }
			}
		</style>
	</head>
	<body>
		<div class="container">
			<div class="card">
				<div class="loader"></div>
				<h1>Signing Out</h1>
				<p>You are being signed out of Doug.is admin...</p>
			</div>
		</div>
		
		<script>
			// Clear localStorage
			localStorage.clear();
			
			// Redirect after a short delay
			setTimeout(function() {
				window.location.href = "/admin/login";
			}, 1500);
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

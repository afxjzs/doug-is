import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This middleware protects admin routes
export function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname

	// Only apply to admin routes
	if (pathname.startsWith("/admin")) {
		// For now, just display a message that admin is not implemented
		// In the future, this should implement proper authentication

		// Create a Response with a simple message
		return new NextResponse(
			`<html>
        <head>
          <title>Admin Not Implemented</title>
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
              color: #8899f8;
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
            <h1>Admin Area Not Implemented</h1>
            <p>The admin area is not yet implemented. Please check back later.</p>
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

	return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
	matcher: ["/admin/:path*"],
}

/**
 * API Key authentication for external services (e.g., OpenClaw bot).
 * Checks the Authorization header for a valid Bearer token matching BLOG_API_KEY.
 */

export function isValidApiKey(request: Request): boolean {
	const apiKey = process.env.BLOG_API_KEY
	if (!apiKey) return false

	const authHeader = request.headers.get("authorization")
	if (!authHeader) return false

	const [scheme, token] = authHeader.split(" ")
	if (scheme !== "Bearer" || !token) return false

	return token === apiKey
}

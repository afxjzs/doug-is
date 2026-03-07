/**
 * Drafts API - used by OpenClaw bot to create and list draft posts.
 * Authentication: Bearer token (BLOG_API_KEY) or admin session.
 */

import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/serverClient"
import { isValidApiKey } from "@/lib/auth/api-key"
import { isCurrentUserAdmin } from "@/lib/supabase/auth"
import type { PostStatus } from "@/lib/types/supabase"

export const dynamic = "force-dynamic"

function generateSlug(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^\w\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.trim()
}

async function isAuthorized(request: Request): Promise<boolean> {
	if (isValidApiKey(request)) return true
	return isCurrentUserAdmin()
}

/**
 * GET /api/drafts - List non-published posts (ideas, drafts, review)
 * Query params: ?status=idea|draft|review
 */
export async function GET(request: Request) {
	if (!(await isAuthorized(request))) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
	}

	try {
		const supabase = createAdminClient()
		const { searchParams } = new URL(request.url)
		const status = searchParams.get("status") as PostStatus | null

		let query = supabase
			.from("posts")
			.select("id, title, slug, excerpt, category, status, created_at, updated_at")
			.is("published_at", null)
			.order("updated_at", { ascending: false })

		if (status) {
			query = query.eq("status", status)
		}

		const { data, error } = await query

		if (error) {
			console.error("Error fetching drafts:", error)
			return NextResponse.json({ error: "Failed to fetch drafts" }, { status: 500 })
		}

		return NextResponse.json({ drafts: data })
	} catch (error) {
		console.error("Exception in GET /api/drafts:", error)
		return NextResponse.json({ error: "Internal server error" }, { status: 500 })
	}
}

/**
 * POST /api/drafts - Create a new draft/idea
 * Required: title
 * Optional: content, category, status (defaults to "idea"), slug (auto-generated from title)
 */
export async function POST(request: Request) {
	if (!(await isAuthorized(request))) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
	}

	try {
		const supabase = createAdminClient()
		const json = await request.json()

		if (!json.title) {
			return NextResponse.json({ error: "Title is required" }, { status: 400 })
		}

		const slug = json.slug || generateSlug(json.title)

		// Check for slug collision, append timestamp if needed
		const { data: existing } = await supabase
			.from("posts")
			.select("id")
			.eq("slug", slug)
			.maybeSingle()

		const finalSlug = existing ? `${slug}-${Date.now()}` : slug

		const postData = {
			title: json.title,
			slug: finalSlug,
			content: json.content || "",
			excerpt: json.excerpt || "",
			category: json.category || "general",
			status: json.status || "idea",
			published_at: null,
			featured_image: null,
		}

		const { data, error } = await supabase
			.from("posts")
			.insert(postData as any)
			.select()
			.single()

		if (error) {
			console.error("Error creating draft:", error)
			return NextResponse.json(
				{ error: "Failed to create draft", details: error.message },
				{ status: 500 }
			)
		}

		return NextResponse.json(data, { status: 201 })
	} catch (error) {
		console.error("Exception in POST /api/drafts:", error)
		return NextResponse.json({ error: "Internal server error" }, { status: 500 })
	}
}

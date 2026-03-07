/**
 * Drafts API - single draft operations (get, update, append content).
 * Authentication: Bearer token (BLOG_API_KEY) or admin session.
 */

import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/serverClient"
import { isValidApiKey } from "@/lib/auth/api-key"
import { isCurrentUserAdmin } from "@/lib/supabase/auth"

export const dynamic = "force-dynamic"

async function isAuthorized(request: Request): Promise<boolean> {
	if (isValidApiKey(request)) return true
	return isCurrentUserAdmin()
}

/**
 * GET /api/drafts/[id] - Get a single draft by ID
 */
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	if (!(await isAuthorized(request))) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
	}

	const { id } = await params

	try {
		const supabase = createAdminClient()

		const { data, error } = await supabase
			.from("posts")
			.select("*")
			.eq("id", id)
			.single()

		if (error || !data) {
			return NextResponse.json({ error: "Draft not found" }, { status: 404 })
		}

		return NextResponse.json(data)
	} catch (error) {
		console.error("Exception in GET /api/drafts/[id]:", error)
		return NextResponse.json({ error: "Internal server error" }, { status: 500 })
	}
}

/**
 * PATCH /api/drafts/[id] - Update a draft
 *
 * Special behavior:
 * - If `append_content` is provided, it appends to existing content instead of replacing
 * - All other fields do a normal update
 */
export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	if (!(await isAuthorized(request))) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
	}

	const { id } = await params

	try {
		const supabase = createAdminClient()
		const json = await request.json()

		// Fetch existing post for append logic
		const { data: existing, error: fetchError } = await supabase
			.from("posts")
			.select("*")
			.eq("id", id)
			.single()

		if (fetchError || !existing) {
			return NextResponse.json({ error: "Draft not found" }, { status: 404 })
		}

		// Build update object from provided fields
		const updateData: Record<string, any> = {}

		if (json.title !== undefined) updateData.title = json.title
		if (json.slug !== undefined) updateData.slug = json.slug
		if (json.excerpt !== undefined) updateData.excerpt = json.excerpt
		if (json.category !== undefined) updateData.category = json.category
		if (json.status !== undefined) updateData.status = json.status
		if (json.featured_image !== undefined) updateData.featured_image = json.featured_image

		// Handle content: append mode vs replace mode
		if (json.append_content) {
			const separator = existing.content ? "\n\n" : ""
			updateData.content = existing.content + separator + json.append_content
		} else if (json.content !== undefined) {
			updateData.content = json.content
		}

		if (Object.keys(updateData).length === 0) {
			return NextResponse.json({ error: "No fields to update" }, { status: 400 })
		}

		const { data, error } = await supabase
			.from("posts")
			.update(updateData)
			.eq("id", id)
			.select()
			.single()

		if (error) {
			console.error("Error updating draft:", error)
			return NextResponse.json(
				{ error: "Failed to update draft", details: error.message },
				{ status: 500 }
			)
		}

		return NextResponse.json(data)
	} catch (error) {
		console.error("Exception in PATCH /api/drafts/[id]:", error)
		return NextResponse.json({ error: "Internal server error" }, { status: 500 })
	}
}

"use client"

/**
 * This component displays a table of blog posts with
 * options to filter, sort, and manage them.
 */

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { Post } from "@/lib/supabase/serverClient"
import PublishButton from "./PublishButton"

interface PostsTableProps {
	posts: Post[]
}

export default function PostsTable({ posts }: PostsTableProps) {
	const [searchTerm, setSearchTerm] = useState("")
	const [categoryFilter, setCategoryFilter] = useState("all")

	// Get unique categories from posts
	const uniqueCategories = Array.from(
		new Set(posts.map((post) => post.category))
	)
	const categories = ["all", ...uniqueCategories]

	// Format date for display
	const formatDate = (dateString: string | null) => {
		if (!dateString) return "Draft"
		const date = new Date(dateString)
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		})
	}

	// Filter posts based on search term and category
	const filteredPosts = posts.filter((post) => {
		const matchesSearch =
			post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			post.category.toLowerCase().includes(searchTerm.toLowerCase())

		const matchesCategory =
			categoryFilter === "all" || post.category === categoryFilter

		return matchesSearch && matchesCategory
	})

	// Function to truncate text
	const truncateText = (text: string, maxLength: number) => {
		if (text.length <= maxLength) return text
		return text.substring(0, maxLength) + "..."
	}

	return (
		<div className="space-y-4">
			{/* Search and filter controls */}
			<div className="flex flex-col sm:flex-row gap-4">
				<div className="relative flex-1">
					<input
						type="text"
						placeholder="Search posts..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full px-4 py-2 rounded-md border border-[rgba(var(--color-foreground),0.1)] focus:outline-none focus:ring-2 focus:ring-[rgba(var(--color-violet),0.4)]"
					/>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[rgba(var(--color-foreground),0.4)]"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</div>

				<div className="w-full sm:w-48">
					<select
						value={categoryFilter}
						onChange={(e) => setCategoryFilter(e.target.value)}
						className="w-full px-4 py-2 rounded-md border border-[rgba(var(--color-foreground),0.1)] focus:outline-none focus:ring-2 focus:ring-[rgba(var(--color-violet),0.4)]"
					>
						{categories.map((category) => (
							<option key={category} value={category}>
								{category === "all" ? "All Categories" : category}
							</option>
						))}
					</select>
				</div>
			</div>

			{/* Posts table */}
			<div className="bg-white rounded-lg shadow-sm border border-[rgba(var(--color-foreground),0.1)] overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="bg-[rgba(var(--color-foreground),0.02)] border-b border-[rgba(var(--color-foreground),0.1)]">
								<th className="px-6 py-3 text-left text-sm font-medium text-[rgba(var(--color-foreground),0.6)]">
									Title
								</th>
								<th className="px-6 py-3 text-left text-sm font-medium text-[rgba(var(--color-foreground),0.6)]">
									Category
								</th>
								<th className="px-6 py-3 text-left text-sm font-medium text-[rgba(var(--color-foreground),0.6)]">
									Published
								</th>
								<th className="px-6 py-3 text-right text-sm font-medium text-[rgba(var(--color-foreground),0.6)]">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-[rgba(var(--color-foreground),0.1)]">
							{filteredPosts.length === 0 ? (
								<tr>
									<td
										colSpan={4}
										className="px-6 py-8 text-center text-[rgba(var(--color-foreground),0.6)]"
									>
										No posts match your search criteria. Try adjusting your
										filters.
									</td>
								</tr>
							) : (
								filteredPosts.map((post) => (
									<tr
										key={post.id}
										className="hover:bg-[rgba(var(--color-foreground),0.01)]"
									>
										<td className="px-6 py-4">
											<div className="flex flex-col">
												<span className="font-medium text-[rgba(var(--color-foreground),0.9)]">
													{post.title}
												</span>
												{post.excerpt && (
													<span className="text-sm text-[rgba(var(--color-foreground),0.6)] mt-1">
														{truncateText(post.excerpt, 70)}
													</span>
												)}
											</div>
										</td>
										<td className="px-6 py-4">
											<span className="px-2.5 py-1 text-xs font-medium rounded-full bg-[rgba(var(--color-foreground),0.05)]">
												{post.category}
											</span>
										</td>
										<td className="px-6 py-4 text-sm">
											{post.published_at ? (
												<span className="text-[rgba(var(--color-green),1)]">
													{formatDate(post.published_at)}
												</span>
											) : (
												<span className="text-[rgba(var(--color-amber),1)]">
													Draft
												</span>
											)}
										</td>
										<td className="px-6 py-4 text-right whitespace-nowrap">
											<div className="flex items-center justify-end gap-2">
												<Link
													href={`/admin/posts/${post.id}`}
													className="p-2 rounded-md text-[rgba(var(--color-violet),1)] hover:bg-[rgba(var(--color-violet),0.1)]"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-5 w-5"
														viewBox="0 0 20 20"
														fill="currentColor"
														aria-hidden="true"
													>
														<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
													</svg>
													<span className="sr-only">Edit</span>
												</Link>

												{/* Publish Now Button - Only shown for unpublished posts */}
												{!post.published_at && (
													<PublishButton
														postId={post.id}
														postTitle={post.title}
														redirectUrl="/admin/posts"
													/>
												)}

												{/* Single View Button - Routes to draft preview for drafts, live post for published */}
												<Link
													href={
														post.published_at
															? `/thinking/about/${post.category.toLowerCase()}/${
																	post.slug
															  }`
															: `/admin/posts/${post.id}/preview`
													}
													target={post.published_at ? "_blank" : undefined}
													className="p-2 rounded-md text-[rgba(var(--color-cyan),1)] hover:bg-[rgba(var(--color-cyan),0.1)]"
													title={
														post.published_at ? "View Live Post" : "View Draft"
													}
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-5 w-5"
														viewBox="0 0 20 20"
														fill="currentColor"
														aria-hidden="true"
													>
														<path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
														<path
															fillRule="evenodd"
															d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
															clipRule="evenodd"
														/>
													</svg>
													<span className="sr-only">
														{post.published_at
															? "View Live Post"
															: "View Draft"}
													</span>
												</Link>

												<button
													className="p-2 rounded-md text-[rgba(var(--color-red),1)] hover:bg-[rgba(var(--color-red),0.1)]"
													onClick={() => {
														// In a real app, this would show a confirmation dialog
														alert(`Delete post: ${post.title}`)
													}}
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-5 w-5"
														viewBox="0 0 20 20"
														fill="currentColor"
														aria-hidden="true"
													>
														<path
															fillRule="evenodd"
															d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
															clipRule="evenodd"
														/>
													</svg>
													<span className="sr-only">Delete</span>
												</button>
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}

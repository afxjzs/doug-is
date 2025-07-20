"use client"

import Link from "next/link"
import { format } from "date-fns"
import { Post } from "@/lib/supabase/serverClient"
import PublishButton from "./PublishButton"

interface DraftOverviewWidgetProps {
	drafts: Post[]
}

export default function DraftOverviewWidget({
	drafts,
}: DraftOverviewWidgetProps) {
	if (drafts.length === 0) {
		return (
			<div className="admin-card p-6">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-xl font-semibold">Draft Posts</h2>
					<Link
						href="/admin/posts/new"
						className="bg-[rgba(var(--color-green),0.9)] hover:bg-[rgba(var(--color-green),1)] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
								clipRule="evenodd"
							/>
						</svg>
						New Draft
					</Link>
				</div>
				<div className="text-center py-8 text-[rgba(var(--color-foreground),0.6)]">
					<div className="mb-2">
						<svg
							className="w-12 h-12 mx-auto text-[rgba(var(--color-foreground),0.3)]"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
							/>
						</svg>
					</div>
					<p className="text-sm">No draft posts</p>
					<p className="text-xs mt-1">Create your first draft to get started</p>
				</div>
			</div>
		)
	}

	return (
		<div className="admin-card">
			<div className="p-6 border-b border-[rgba(var(--color-foreground),0.1)]">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-xl font-semibold">Draft Posts</h2>
						<p className="text-sm text-[rgba(var(--color-foreground),0.7)] mt-1">
							{drafts.length} draft{drafts.length !== 1 ? "s" : ""} ready for
							review
						</p>
					</div>
					<Link
						href="/admin/posts/new"
						className="bg-[rgba(var(--color-green),0.9)] hover:bg-[rgba(var(--color-green),1)] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
								clipRule="evenodd"
							/>
						</svg>
						New Draft
					</Link>
				</div>
			</div>
			<div className="divide-y divide-[rgba(var(--color-foreground),0.1)]">
				{drafts.slice(0, 3).map((draft) => (
					<div key={draft.id} className="p-6">
						<div className="flex justify-between items-start">
							<div className="flex-1">
								<h3 className="font-medium text-[rgba(var(--color-foreground),0.9)]">
									{draft.title}
								</h3>
								<div className="flex items-center gap-4 mt-2 text-sm text-[rgba(var(--color-foreground),0.6)]">
									<span className="flex items-center gap-1">
										<svg
											className="w-4 h-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={1.5}
												d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
											/>
										</svg>
										{draft.category}
									</span>
									<span className="flex items-center gap-1">
										<svg
											className="w-4 h-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={1.5}
												d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										{format(new Date(draft.created_at), "MMM d, yyyy")}
									</span>
								</div>
								{draft.excerpt && (
									<p className="text-sm text-[rgba(var(--color-foreground),0.7)] mt-2 line-clamp-2">
										{draft.excerpt}
									</p>
								)}
							</div>
							<div className="flex items-center gap-2 ml-4">
								<Link
									href={`/admin/posts/${draft.id}/preview`}
									className="p-2 rounded-md text-[rgba(var(--color-amber),1)] hover:bg-[rgba(var(--color-amber),0.1)] transition-colors"
									title="Preview Draft"
								>
									<svg
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={1.5}
											d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
										/>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={1.5}
											d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
										/>
									</svg>
								</Link>
								<Link
									href={`/admin/posts/${draft.id}`}
									className="p-2 rounded-md text-[rgba(var(--color-violet),1)] hover:bg-[rgba(var(--color-violet),0.1)] transition-colors"
									title="Edit Draft"
								>
									<svg
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={1.5}
											d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
										/>
									</svg>
								</Link>
								<PublishButton
									postId={draft.id}
									postTitle={draft.title}
									redirectUrl="/admin/posts"
								/>
							</div>
						</div>
					</div>
				))}
				{drafts.length > 3 && (
					<div className="p-6 border-t border-[rgba(var(--color-foreground),0.1)]">
						<Link
							href="/admin/posts"
							className="text-[rgba(var(--color-violet),0.9)] hover:text-[rgba(var(--color-violet),1)] text-sm"
						>
							View all {drafts.length} drafts →
						</Link>
					</div>
				)}
			</div>
		</div>
	)
}

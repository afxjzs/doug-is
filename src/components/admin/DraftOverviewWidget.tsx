"use client"

import Link from "next/link"
import { format } from "date-fns"
import { Post } from "@/lib/supabase/clientData"
import PublishButton from "./PublishButton"

interface DraftOverviewWidgetProps {
	drafts: Post[]
}

export default function DraftOverviewWidget({
	drafts,
}: DraftOverviewWidgetProps) {
	if (drafts.length === 0) {
		return (
			<div className="admin-card">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-xl font-semibold">Draft Posts</h2>
					<Link href="/admin/posts/new" className="neon-button-violet">
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
				<div className="text-center py-8 text-gray-400">
					<div className="mb-2">
						<svg
							className="w-12 h-12 mx-auto text-gray-500"
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
			<div className="border-b border-gray-600 pb-4 mb-4">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-xl font-semibold">Draft Posts</h2>
						<p className="text-sm text-gray-400 mt-1">
							{drafts.length} draft{drafts.length !== 1 ? "s" : ""} ready for
							review
						</p>
					</div>
					<Link href="/admin/posts/new" className="neon-button-violet">
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
			<div className="space-y-4">
				{drafts.slice(0, 3).map((draft) => (
					<div
						key={draft.id}
						className="py-3 border-b border-gray-600 last:border-b-0"
					>
						<div className="flex justify-between items-start mb-2">
							<div className="flex-1">
								<h3 className="font-medium text-gray-100">{draft.title}</h3>
								<div className="flex items-center gap-2 mt-1">
									<span className="text-xs bg-purple-600 text-white px-2 py-1 rounded">
										{draft.category}
									</span>
									<span className="text-xs text-gray-400">
										{format(
											new Date(draft.created_at || new Date()),
											"MMM d, yyyy"
										)}
									</span>
								</div>
								{draft.excerpt && (
									<p className="text-sm text-gray-400 mt-2">{draft.excerpt}</p>
								)}
							</div>
							<div className="flex items-center gap-2 ml-4">
								<Link
									href={`/admin/posts/${draft.id}/preview`}
									className="text-blue-400 hover:text-blue-300 text-sm"
								>
									Preview Draft
								</Link>
								<Link
									href={`/admin/posts/${draft.id}`}
									className="text-purple-400 hover:text-purple-300 text-sm"
								>
									Edit Draft
								</Link>
								<PublishButton postId={draft.id} postTitle={draft.title} />
							</div>
						</div>
					</div>
				))}
				{drafts.length > 3 && (
					<div className="pt-4 border-t border-gray-600">
						<Link
							href="/admin/posts"
							className="text-blue-400 hover:text-blue-300 text-sm"
						>
							View all {drafts.length} drafts →
						</Link>
					</div>
				)}
			</div>
		</div>
	)
}

import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { getPostBySlug as getSupabasePost } from "@/lib/supabase/client"
import { getPostBySlug as getMarkdownPost } from "@/lib/utils/markdown"
import { formatDate } from "@/lib/utils"

interface PageProps {
	params: {
		slug: string
	}
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug } = params

	// Try to get post from Supabase
	const supabasePost = await getSupabasePost(slug)

	// If not found in Supabase, try markdown files
	const markdownPost = !supabasePost ? getMarkdownPost(slug) : null

	// If post not found in either source, return default metadata
	if (!supabasePost && !markdownPost) {
		return {
			title: "Post Not Found | Doug.is",
			description: "The requested blog post could not be found.",
		}
	}

	const post = supabasePost || markdownPost

	return {
		title: `${post?.title} | Doug.is`,
		description: post?.excerpt,
	}
}

export default async function PostPage({ params }: PageProps) {
	const { slug } = params

	// Try to get post from Supabase
	const supabasePost = await getSupabasePost(slug)

	// If not found in Supabase, try markdown files
	const markdownPost = !supabasePost ? getMarkdownPost(slug) : null

	// If post not found in either source, return 404
	if (!supabasePost && !markdownPost) {
		notFound()
	}

	// Use whichever post was found
	const post = supabasePost || {
		title: markdownPost?.title || "",
		content: markdownPost?.content || "",
		published_at: markdownPost?.date || "",
		category: markdownPost?.category || "",
		featured_image: markdownPost?.featured_image,
	}

	return (
		<article className="max-w-3xl mx-auto">
			<Link
				href="/writing"
				className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-5 w-5 mr-1"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fillRule="evenodd"
						d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
						clipRule="evenodd"
					/>
				</svg>
				Back to all posts
			</Link>

			<header className="mb-8">
				<h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
				<div className="flex items-center text-gray-600">
					<time dateTime={post.published_at}>
						{formatDate(post.published_at)}
					</time>
					<span className="mx-2">•</span>
					<span>{post.category}</span>
				</div>
			</header>

			{post.featured_image && (
				<div className="relative h-96 w-full mb-8 overflow-hidden rounded-lg">
					<Image
						src={post.featured_image}
						alt={post.title}
						fill
						className="object-cover"
						priority
					/>
				</div>
			)}

			<div className="prose prose-lg max-w-none">
				<ReactMarkdown remarkPlugins={[remarkGfm]}>
					{post.content}
				</ReactMarkdown>
			</div>
		</article>
	)
}

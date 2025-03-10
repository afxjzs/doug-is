"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import {
	getPosts,
	createPost,
	updatePost,
	deletePost,
	Post,
} from "@/lib/supabase/client"

// Simple admin interface with minimal styling
export default function AdminPage() {
	const [posts, setPosts] = useState<Post[]>([])
	const [currentPost, setCurrentPost] = useState<Partial<Post>>({
		title: "",
		slug: "",
		content: "",
		excerpt: "",
		category: "general",
		featured_image: "",
	})
	const [isEditing, setIsEditing] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState("")
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const router = useRouter()

	// Initialize Supabase client
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
	const supabase = createClient(supabaseUrl, supabaseAnonKey)

	useEffect(() => {
		checkAuth()
		loadPosts()
	}, [])

	async function checkAuth() {
		const { data } = await supabase.auth.getSession()
		setIsAuthenticated(!!data.session)
		setIsLoading(false)
	}

	async function handleLogin(e: React.FormEvent) {
		e.preventDefault()
		setIsLoading(true)
		setError("")

		try {
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password,
			})

			if (error) throw error
			setIsAuthenticated(true)
			loadPosts()
		} catch (err: any) {
			setError(err.message || "Failed to login")
		} finally {
			setIsLoading(false)
		}
	}

	async function handleLogout() {
		await supabase.auth.signOut()
		setIsAuthenticated(false)
	}

	async function loadPosts() {
		try {
			const allPosts = await getPosts()
			setPosts(allPosts)
		} catch (err: any) {
			console.error("Error loading posts:", err)
		}
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setIsLoading(true)

		try {
			if (isEditing && currentPost.id) {
				await updatePost(currentPost.id, currentPost)
			} else {
				await createPost(currentPost as Omit<Post, "id">)
			}

			setCurrentPost({
				title: "",
				slug: "",
				content: "",
				excerpt: "",
				category: "general",
				featured_image: "",
			})
			setIsEditing(false)
			loadPosts()
		} catch (err: any) {
			setError(err.message || "Failed to save post")
		} finally {
			setIsLoading(false)
		}
	}

	async function handleDelete(id: string) {
		if (confirm("Are you sure you want to delete this post?")) {
			setIsLoading(true)
			try {
				await deletePost(id)
				loadPosts()
			} catch (err: any) {
				setError(err.message || "Failed to delete post")
			} finally {
				setIsLoading(false)
			}
		}
	}

	function handleEdit(post: Post) {
		setCurrentPost(post)
		setIsEditing(true)
	}

	function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
		if (!e.target.files || e.target.files.length === 0) return

		const file = e.target.files[0]
		const fileExt = file.name.split(".").pop()
		const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
		const filePath = `${fileName}`

		setIsLoading(true)

		supabase.storage
			.from("blog_images")
			.upload(filePath, file)
			.then(({ data, error }) => {
				if (error) {
					throw error
				}

				if (data) {
					const imageUrl = `${supabaseUrl}/storage/v1/object/public/blog_images/${data.path}`
					setCurrentPost({
						...currentPost,
						featured_image: imageUrl,
					})
				}
			})
			.catch((err) => {
				setError("Error uploading image: " + err.message)
			})
			.finally(() => {
				setIsLoading(false)
			})
	}

	if (isLoading) {
		return <div className="p-8">Loading...</div>
	}

	if (!isAuthenticated) {
		return (
			<div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
				<h1 className="text-2xl font-bold mb-6">Admin Login</h1>

				{error && (
					<div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
						{error}
					</div>
				)}

				<form onSubmit={handleLogin}>
					<div className="mb-4">
						<label className="block mb-1">Email</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full p-2 border rounded"
							required
						/>
					</div>

					<div className="mb-6">
						<label className="block mb-1">Password</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full p-2 border rounded"
							required
						/>
					</div>

					<button
						type="submit"
						className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
						disabled={isLoading}
					>
						{isLoading ? "Logging in..." : "Login"}
					</button>
				</form>
			</div>
		)
	}

	return (
		<div className="container mx-auto p-4">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Blog Post Admin</h1>
				<button
					onClick={handleLogout}
					className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
				>
					Logout
				</button>
			</div>

			{error && (
				<div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
			)}

			<form onSubmit={handleSubmit} className="mb-8 p-4 border rounded">
				<h2 className="text-xl mb-4">
					{isEditing ? "Edit Post" : "Create New Post"}
				</h2>

				<div className="mb-4">
					<label className="block mb-1">Title</label>
					<input
						type="text"
						value={currentPost.title}
						onChange={(e) =>
							setCurrentPost({ ...currentPost, title: e.target.value })
						}
						className="w-full p-2 border rounded"
						required
					/>
				</div>

				<div className="mb-4">
					<label className="block mb-1">Slug</label>
					<input
						type="text"
						value={currentPost.slug}
						onChange={(e) =>
							setCurrentPost({ ...currentPost, slug: e.target.value })
						}
						className="w-full p-2 border rounded"
						required
					/>
				</div>

				<div className="mb-4">
					<label className="block mb-1">Category</label>
					<select
						value={currentPost.category}
						onChange={(e) =>
							setCurrentPost({ ...currentPost, category: e.target.value })
						}
						className="w-full p-2 border rounded"
						required
					>
						<option value="general">General</option>
						<option value="investing">Investing</option>
						<option value="advisory">Advisory</option>
					</select>
				</div>

				<div className="mb-4">
					<label className="block mb-1">Excerpt</label>
					<textarea
						value={currentPost.excerpt}
						onChange={(e) =>
							setCurrentPost({ ...currentPost, excerpt: e.target.value })
						}
						className="w-full p-2 border rounded"
						rows={2}
						required
					/>
				</div>

				<div className="mb-4">
					<label className="block mb-1">Content (Markdown supported)</label>
					<textarea
						value={currentPost.content}
						onChange={(e) =>
							setCurrentPost({ ...currentPost, content: e.target.value })
						}
						className="w-full p-2 border rounded"
						rows={10}
						required
					/>
				</div>

				<div className="mb-4">
					<label className="block mb-1">Featured Image</label>
					<div className="flex items-center space-x-4">
						<input
							type="text"
							value={currentPost.featured_image}
							onChange={(e) =>
								setCurrentPost({
									...currentPost,
									featured_image: e.target.value,
								})
							}
							className="flex-1 p-2 border rounded"
							placeholder="Image URL or upload"
						/>
						<input
							type="file"
							accept="image/*"
							onChange={handleImageUpload}
							className="hidden"
							id="image-upload"
						/>
						<label
							htmlFor="image-upload"
							className="px-4 py-2 bg-gray-200 rounded cursor-pointer hover:bg-gray-300"
						>
							Upload
						</label>
					</div>
					{currentPost.featured_image && (
						<div className="mt-2">
							<img
								src={currentPost.featured_image}
								alt="Preview"
								className="h-32 object-cover rounded"
							/>
						</div>
					)}
				</div>

				<div className="flex gap-2">
					<button
						type="submit"
						className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
						disabled={isLoading}
					>
						{isLoading
							? "Saving..."
							: isEditing
							? "Update Post"
							: "Create Post"}
					</button>
					{isEditing && (
						<button
							type="button"
							onClick={() => {
								setCurrentPost({
									title: "",
									slug: "",
									content: "",
									excerpt: "",
									category: "general",
									featured_image: "",
								})
								setIsEditing(false)
							}}
							className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
						>
							Cancel
						</button>
					)}
				</div>
			</form>

			<div>
				<h2 className="text-xl mb-4">Existing Posts</h2>
				{posts.length === 0 ? (
					<p>No posts found.</p>
				) : (
					<div className="space-y-4">
						{posts.map((post) => (
							<div key={post.id} className="p-4 border rounded">
								<h3 className="text-lg font-bold">{post.title}</h3>
								<p className="text-sm text-gray-500">/{post.slug}</p>
								<p className="my-2">{post.excerpt}</p>
								<div className="flex gap-2 mt-4">
									<button
										onClick={() => handleEdit(post)}
										className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
									>
										Edit
									</button>
									<button
										onClick={() => handleDelete(post.id)}
										className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
									>
										Delete
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

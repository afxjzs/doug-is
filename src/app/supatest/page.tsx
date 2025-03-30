"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import StatusMessage from "@/components/StatusMessage"

export default function SupaTestPage() {
	const [posts, setPosts] = useState<any[]>([])
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(true)
	const [logs, setLogs] = useState<string[]>([])

	const addLog = (message: string) => {
		setLogs((prev) => [...prev, `${new Date().toISOString()}: ${message}`])
	}

	useEffect(() => {
		async function testSupabase() {
			addLog("Starting Supabase test...")
			setLoading(true)
			setError(null)

			try {
				const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
				const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

				if (!supabaseUrl || !supabaseAnonKey) {
					throw new Error("Missing Supabase credentials")
				}

				addLog(`Connecting to Supabase at ${supabaseUrl.substring(0, 20)}...`)

				// Create Supabase client with timeout options
				const supabase = createClient(supabaseUrl, supabaseAnonKey, {
					auth: {
						persistSession: false,
						autoRefreshToken: false,
					},
				})

				addLog("Fetching posts directly from Supabase...")

				// Use a Promise with timeout for the query
				const controller = new AbortController()
				const timeoutId = setTimeout(() => {
					controller.abort()
					addLog("Query timed out after 15 seconds")
				}, 15000)

				const { data, error } = await supabase
					.from("posts")
					.select("*")
					.order("published_at", { ascending: false })

				clearTimeout(timeoutId)

				if (error) {
					addLog(`Error fetching posts: ${error.message}`)
					setError(error.message)
				} else {
					addLog(`Successfully fetched ${data?.length || 0} posts`)
					setPosts(data || [])
				}
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "Unknown error"
				addLog(`Exception: ${errorMessage}`)
				setError(errorMessage)
			} finally {
				setLoading(false)
			}
		}

		testSupabase()
	}, [])

	return (
		<div className="max-w-4xl mx-auto p-4">
			<h1 className="text-3xl font-bold mb-4">Supabase Direct Test</h1>

			<div className="mb-8 p-4 bg-gray-100 rounded-lg">
				<h2 className="text-xl font-semibold mb-2">Logs:</h2>
				<pre className="whitespace-pre-wrap text-sm">
					{logs.map((log, i) => (
						<div key={i} className="mb-1">
							{log}
						</div>
					))}
				</pre>
			</div>

			<div className="mb-8">
				<h2 className="text-xl font-semibold mb-2">Status:</h2>
				{loading ? (
					<StatusMessage
						type="loading"
						message="Connecting to Supabase and fetching data..."
					/>
				) : error ? (
					<StatusMessage
						type="error"
						message="Error connecting to Supabase"
						details={error}
					/>
				) : (
					<StatusMessage
						type="success"
						message={`Success! Fetched ${posts.length} posts`}
					/>
				)}
			</div>

			{posts.length > 0 && (
				<div>
					<h2 className="text-xl font-semibold mb-2">Posts:</h2>
					<div className="space-y-4">
						{posts.map((post) => (
							<div key={post.id} className="p-4 border rounded-lg">
								<h3 className="text-lg font-medium">{post.title}</h3>
								<p className="text-sm text-gray-600">
									{post.published_at
										? new Date(post.published_at).toLocaleDateString()
										: "No date"}{" "}
									• {post.category}
								</p>
								<p className="mt-2">{post.excerpt}</p>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	)
}

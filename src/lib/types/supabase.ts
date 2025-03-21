// src/lib/types/supabase.ts
export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[]

export interface Database {
	public: {
		Tables: {
			posts: {
				Row: {
					id: string
					title: string
					slug: string
					content: string
					excerpt: string
					published_at: string
					category: string
					featured_image: string | null
					created_at: string
					updated_at: string
				}
				Insert: {
					id?: string
					title: string
					slug: string
					content: string
					excerpt: string
					published_at?: string
					category: string
					featured_image?: string | null
					created_at?: string
					updated_at?: string
				}
				Update: {
					id?: string
					title?: string
					slug?: string
					content?: string
					excerpt?: string
					published_at?: string
					category?: string
					featured_image?: string | null
					created_at?: string
					updated_at?: string
				}
				Relationships: []
			}
			// Add other tables as needed
		}
		Views: {
			[_ in never]: never
		}
		Functions: {
			[_ in never]: never
		}
		Enums: {
			[_ in never]: never
		}
	}
}

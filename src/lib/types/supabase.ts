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
			migraine_triggers: {
				Row: {
					id: number
					food: string
					trigger: string
					reason: string | null
					categories: string[] | null
					chemical_triggers: string[] | null
					source: string | null
					notes: string | null
					created_at: string
					updated_at: string
				}
				Insert: {
					id?: number
					food: string
					trigger: string
					reason?: string | null
					categories?: string[] | null
					chemical_triggers?: string[] | null
					source?: string | null
					notes?: string | null
					created_at?: string
					updated_at?: string
				}
				Update: {
					id?: number
					food?: string
					trigger?: string
					reason?: string | null
					categories?: string[] | null
					chemical_triggers?: string[] | null
					source?: string | null
					notes?: string | null
					created_at?: string
					updated_at?: string
				}
				Relationships: []
			}
			posts: {
				Row: {
					id: string
					title: string
					slug: string
					content: string
					excerpt: string
					category: string
					published_at: string | null
					featured_image: string | null
					created_at: string
					updated_at: string
				}
				Insert: {
					id?: string
					title: string
					slug: string
					content: string
					excerpt?: string
					category?: string
					published_at?: string | null
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
					category?: string
					published_at?: string | null
					featured_image?: string | null
					created_at?: string
					updated_at?: string
				}
				Relationships: []
			}
			contact_messages: {
				Row: {
					id: string
					name: string
					email: string
					subject: string
					message: string
					read_at: string | null
					created_at: string
				}
				Insert: {
					id?: string
					name: string
					email: string
					subject?: string
					message: string
					read_at?: string | null
					created_at?: string
				}
				Update: {
					id?: string
					name?: string
					email?: string
					subject?: string
					message?: string
					read_at?: string | null
					created_at?: string
				}
				Relationships: []
			}
			user_roles: {
				Row: {
					user_id: string
					role: string
					id: string
					created_at: string
					updated_at: string
				}
				Insert: {
					user_id: string
					role: string
					id?: string
					created_at?: string
					updated_at?: string
				}
				Update: {
					user_id?: string
					role?: string
					id?: string
					created_at?: string
					updated_at?: string
				}
				Relationships: []
			}
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

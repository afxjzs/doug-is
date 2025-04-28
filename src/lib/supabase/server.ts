import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "../types/supabase"
import type { SupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error("Missing environment variables for Supabase configuration")
}

export const createClient = (): SupabaseClient<Database> =>
	createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)

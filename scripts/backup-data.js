// scripts/backup-data.js
require("dotenv").config({ path: ".env.local" })
const { createClient } = require("@supabase/supabase-js")
const fs = require("fs")
const path = require("path")

// Get database configuration (production only)
function getDatabaseConfig() {
	return {
		url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
		serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
		anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
	}
}

// Escape CSV field
function escapeCSVField(value) {
	if (value === null || value === undefined) {
		return ""
	}
	
	const stringValue = String(value)
	
	// If contains comma, quote, or newline, wrap in quotes and escape quotes
	if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
		return `"${stringValue.replace(/"/g, '""')}"`
	}
	
	return stringValue
}

// Convert array to JSON string for CSV
function arrayToCSVString(value) {
	if (value === null || value === undefined) {
		return ""
	}
	if (Array.isArray(value)) {
		return JSON.stringify(value)
	}
	return String(value)
}

// Convert row to CSV line
function rowToCSVLine(row, headers) {
	return headers.map((header) => {
		const value = row[header]
		
		// Handle arrays by converting to JSON
		if (Array.isArray(value)) {
			return escapeCSVField(JSON.stringify(value))
		}
		
		return escapeCSVField(value)
	}).join(",")
}

// Write data to CSV file
function writeCSV(filename, headers, rows) {
	const lines = [
		headers.join(","), // Header row
		...rows.map((row) => rowToCSVLine(row, headers)),
	]
	
	const content = lines.join("\n")
	fs.writeFileSync(filename, content, "utf8")
	console.log(`✓ Written ${rows.length} rows to ${filename}`)
}

async function backupTableViaREST(url, apiKey, tableName, outputDir, keyType = "service role") {
	console.log(`\n📥 Fetching data from ${tableName} via REST API (using ${keyType})...`)
	
	try {
		const response = await fetch(`${url}/rest/v1/${tableName}?select=*&order=created_at.asc`, {
			method: "GET",
			headers: {
				"apikey": apiKey,
				"Authorization": `Bearer ${apiKey}`,
				"Content-Type": "application/json",
				"Prefer": "return=representation",
			},
		})
		
		if (!response.ok) {
			const errorText = await response.text()
			console.error(`❌ HTTP Error ${response.status}: ${errorText}`)
			return false
		}
		
		const data = await response.json()
		
		if (!data || data.length === 0) {
			console.log(`⚠️  No data found in ${tableName}`)
			return true
		}
		
		console.log(`✓ Found ${data.length} rows in ${tableName}`)
		
		// Get headers from first row
		const headers = Object.keys(data[0])
		
		// Generate filename with timestamp
		const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5)
		const filename = path.join(outputDir, `${tableName}_${timestamp}.csv`)
		
		// Write CSV
		writeCSV(filename, headers, data)
		
		return true
	} catch (error) {
		console.error(`❌ Error fetching ${tableName} via REST:`, error.message)
		return false
	}
}

async function backupTable(supabase, tableName, outputDir) {
	console.log(`\n📥 Fetching data from ${tableName}...`)
	
	const { data, error } = await supabase
		.from(tableName)
		.select("*")
		.order("created_at", { ascending: true })
	
	if (error) {
		console.error(`❌ Error fetching ${tableName}:`, error.message)
		return false
	}
	
	if (!data || data.length === 0) {
		console.log(`⚠️  No data found in ${tableName}`)
		return true
	}
	
	console.log(`✓ Found ${data.length} rows in ${tableName}`)
	
	// Get headers from first row
	const headers = Object.keys(data[0])
	
	// Generate filename with timestamp
	const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5)
	const filename = path.join(outputDir, `${tableName}_${timestamp}.csv`)
	
	// Write CSV
	writeCSV(filename, headers, data)
	
	return true
}

async function main() {
	const config = getDatabaseConfig()
	
	if (!config.url) {
		console.error("❌ Missing Supabase URL")
		console.error("   Required: NEXT_PUBLIC_SUPABASE_URL")
		process.exit(1)
	}
	
	if (!config.serviceRoleKey && !config.anonKey) {
		console.error("❌ Missing Supabase credentials")
		console.error("   Required: SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY")
		process.exit(1)
	}
	
	// Create backup directory
	const backupDir = path.join(process.cwd(), "backups")
	if (!fs.existsSync(backupDir)) {
		fs.mkdirSync(backupDir, { recursive: true })
		console.log(`📁 Created backup directory: ${backupDir}`)
	}
	
	console.log(`\n💾 Starting backup...`)
	console.log(`📂 Output directory: ${backupDir}`)
	
	// Try service role first, then anon key
	const keys = []
	if (config.serviceRoleKey) {
		keys.push({ key: config.serviceRoleKey, type: "service role" })
	}
	if (config.anonKey) {
		keys.push({ key: config.anonKey, type: "anon" })
	}
	
	// Backup posts table
	let postsSuccess = false
	for (const { key, type } of keys) {
		const supabase = createClient(config.url, key, {
			auth: {
				autoRefreshToken: false,
				persistSession: false,
			},
		})
		
		postsSuccess = await backupTable(supabase, "posts", backupDir)
		if (postsSuccess) break
		
		// Try REST API with this key
		postsSuccess = await backupTableViaREST(config.url, key, "posts", backupDir, type)
		if (postsSuccess) break
	}
	
	// Backup migraine_triggers table
	let triggersSuccess = false
	for (const { key, type } of keys) {
		const supabase = createClient(config.url, key, {
			auth: {
				autoRefreshToken: false,
				persistSession: false,
			},
		})
		
		triggersSuccess = await backupTable(supabase, "migraine_triggers", backupDir)
		if (triggersSuccess) break
		
		// Try REST API with this key
		triggersSuccess = await backupTableViaREST(config.url, key, "migraine_triggers", backupDir, type)
		if (triggersSuccess) break
	}
	
	if (postsSuccess && triggersSuccess) {
		console.log(`\n✅ Backup completed successfully!`)
		console.log(`📂 Files saved to: ${backupDir}`)
	} else {
		console.error(`\n❌ Backup completed with errors`)
		if (!postsSuccess) console.error(`   Failed to backup posts table`)
		if (!triggersSuccess) console.error(`   Failed to backup migraine_triggers table`)
		process.exit(1)
	}
}

main().catch((error) => {
	console.error("❌ Fatal error:", error)
	process.exit(1)
})


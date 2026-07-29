// scripts/backup-data.js
//
// Exports production tables to timestamped CSVs in ./backups for import into
// local Supabase via scripts/reset-local-supabase.sh.
//
// Failure policy: this script never degrades quietly.
//   - It refuses to run with a key that cannot see every row.
//   - It verifies each export against an exact server-side count.
//   - It fetches every table before writing anything, so a failure part-way
//     through cannot leave a fresh CSV for one table beside a stale CSV for
//     another (the import picks the newest file per table independently, and
//     would happily pair mismatched vintages).
//   - Skipping a table requires an explicit flag and is logged in the output.
//
// Usage:
//   node scripts/backup-data.js
//   node scripts/backup-data.js --skip=migraine_triggers
//   node scripts/backup-data.js --tables=posts
//   node scripts/backup-data.js --allow-anon        # published rows only

require("dotenv").config({ path: ".env.local" })
const { createClient } = require("@supabase/supabase-js")
const fs = require("fs")
const path = require("path")

const ALL_TABLES = ["posts", "migraine_triggers"]
const PAGE_SIZE = 1000

// supabase-js splits PostgREST failures across message/code/details/hint, and
// leaves `message` empty for some of them (a bare 403 is one). Collapse the
// whole payload so an error is never reported as an empty string.
function describeError(error) {
	const parts = []
	if (error.message) parts.push(error.message)
	if (error.code) parts.push(`code=${error.code}`)
	if (error.details) parts.push(`details=${error.details}`)
	if (error.hint) parts.push(`hint=${error.hint}`)
	return parts.length > 0 ? parts.join(" | ") : JSON.stringify(error)
}

// NULL and empty string must serialize differently. Postgres COPY ... FORMAT csv
// reads an UNQUOTED empty field as NULL and a QUOTED empty field ("") as an
// empty string. Emitting a bare empty field for both — as this script used to —
// silently converts every '' in production into a NULL on import. That is
// invisible wherever the column is nullable, and a hard constraint violation
// where it is not.
function escapeCSVField(value) {
	if (value === null || value === undefined) {
		return "" // bare empty field -> NULL on import
	}

	const stringValue = String(value)

	if (stringValue === "") {
		return '""' // quoted empty field -> empty string on import
	}

	if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
		return `"${stringValue.replace(/"/g, '""')}"`
	}

	return stringValue
}

function rowToCSVLine(row, headers) {
	return headers.map((header) => {
		const value = row[header]

		if (Array.isArray(value)) {
			return escapeCSVField(JSON.stringify(value))
		}

		return escapeCSVField(value)
	}).join(",")
}

function parseArgs(argv) {
	const allowAnon = argv.includes("--allow-anon")

	const tablesArg = argv.find((a) => a.startsWith("--tables="))
	const skipArg = argv.find((a) => a.startsWith("--skip="))

	let tables = ALL_TABLES
	if (tablesArg) {
		tables = tablesArg.slice("--tables=".length).split(",").map((t) => t.trim()).filter(Boolean)
	}
	if (skipArg) {
		const skip = skipArg.slice("--skip=".length).split(",").map((t) => t.trim()).filter(Boolean)
		tables = tables.filter((t) => !skip.includes(t))
	}

	const unknown = tables.filter((t) => !ALL_TABLES.includes(t))
	if (unknown.length > 0) {
		throw new Error(`Unknown table(s): ${unknown.join(", ")}. Known: ${ALL_TABLES.join(", ")}`)
	}

	if (tables.length === 0) {
		throw new Error("No tables selected; nothing to back up.")
	}

	return { allowAnon, tables, skipped: ALL_TABLES.filter((t) => !tables.includes(t)) }
}

// Defaults to the service role key because a full backup must see drafts and
// ideas, which RLS hides from the anon key. Downgrading requires an explicit
// --allow-anon so the reduced scope is a decision, never an accident.
function resolveCredentials(allowAnon) {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL
	const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
	const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

	if (!url) {
		throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL in .env.local")
	}

	if (serviceRoleKey) {
		return { url, key: serviceRoleKey, keyType: "service role", complete: true }
	}

	if (!allowAnon) {
		throw new Error(
			"Missing SUPABASE_SERVICE_ROLE_KEY in .env.local.\n" +
			"   A full backup needs the service role key; RLS hides drafts and ideas\n" +
			"   from the anon key, so an anon backup would omit unpublished rows while\n" +
			"   still looking successful.\n" +
			"   Add the key, or re-run with --allow-anon to accept a published-only backup."
		)
	}

	if (!anonKey) {
		throw new Error("Missing both SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_ANON_KEY")
	}

	return { url, key: anonKey, keyType: "anon", complete: false }
}

// Ask the server how many rows exist, so the export has something to verify
// against rather than trusting whatever the first page happened to return.
async function fetchExactCount(supabase, tableName) {
	const { count, error } = await supabase
		.from(tableName)
		.select("*", { count: "exact", head: true })

	if (error) {
		throw new Error(`Could not count ${tableName}: ${describeError(error)}`)
	}

	if (count === null) {
		throw new Error(`Server returned no count for ${tableName}; cannot verify completeness`)
	}

	return count
}

// Page through the table. PostgREST caps rows per request, so a single
// .select("*") silently truncates any table above that cap.
async function fetchAllRows(supabase, tableName, expectedCount) {
	const rows = []

	while (rows.length < expectedCount) {
		const from = rows.length
		const to = from + PAGE_SIZE - 1

		const { data, error } = await supabase
			.from(tableName)
			.select("*")
			.order("created_at", { ascending: true })
			.range(from, to)

		if (error) {
			throw new Error(`Fetching ${tableName} rows ${from}-${to} failed: ${describeError(error)}`)
		}

		if (!data || data.length === 0) {
			// The server stopped handing back rows before reaching the counted
			// total. Do not pretend this is a complete backup.
			break
		}

		rows.push(...data)
	}

	if (rows.length !== expectedCount) {
		throw new Error(
			`${tableName} row count mismatch: server counted ${expectedCount}, ` +
			`export retrieved ${rows.length}. Backup is incomplete.`
		)
	}

	return rows
}

async function fetchTable(supabase, tableName) {
	console.log(`\n📥 ${tableName}`)

	const expectedCount = await fetchExactCount(supabase, tableName)
	console.log(`   Server reports ${expectedCount} rows`)

	if (expectedCount === 0) {
		throw new Error(
			`${tableName} is empty. Refusing to write an empty backup, because ` +
			`importing it would TRUNCATE the local table and leave you with nothing.`
		)
	}

	const rows = await fetchAllRows(supabase, tableName, expectedCount)
	const headers = Object.keys(rows[0])

	console.log(`   ✓ Retrieved ${rows.length} rows`)
	console.log(`   Columns: ${headers.join(",")}`)

	return { tableName, rows, headers }
}

async function main() {
	const { allowAnon, tables, skipped } = parseArgs(process.argv.slice(2))
	const { url, key, keyType, complete } = resolveCredentials(allowAnon)

	const backupDir = path.join(process.cwd(), "backups")
	if (!fs.existsSync(backupDir)) {
		fs.mkdirSync(backupDir, { recursive: true })
		console.log(`📁 Created backup directory: ${backupDir}`)
	}

	console.log(`\n💾 Starting backup`)
	console.log(`🔑 Credentials: ${keyType} key`)
	if (!complete) {
		console.log(`⚠️  ANON KEY: RLS applies. Unpublished rows (idea/draft/review)`)
		console.log(`   will be MISSING from this backup. You passed --allow-anon.`)
	}
	console.log(`📋 Tables: ${tables.join(", ")}`)
	if (skipped.length > 0) {
		console.log(`⚠️  SKIPPING (by flag): ${skipped.join(", ")}`)
		console.log(`   No fresh CSV will be written for these. The import step picks the`)
		console.log(`   newest file per table, so it will fall back to an older backup.`)
	}
	console.log(`📂 Output: ${backupDir}`)

	const supabase = createClient(url, key, {
		auth: { autoRefreshToken: false, persistSession: false },
	})

	// Fetch everything before writing anything, so a mid-run failure cannot
	// leave a fresh CSV for one table next to a stale CSV for another.
	const fetched = []
	for (const tableName of tables) {
		fetched.push(await fetchTable(supabase, tableName))
	}

	const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5)

	console.log("")
	for (const { tableName, rows, headers } of fetched) {
		const filename = path.join(backupDir, `${tableName}_${timestamp}.csv`)
		const lines = [headers.join(","), ...rows.map((row) => rowToCSVLine(row, headers))]
		fs.writeFileSync(filename, lines.join("\n"), "utf8")
		console.log(`✓ Wrote ${rows.length} rows to ${path.basename(filename)}`)
	}

	console.log(`\n✅ Backup complete (${keyType} key)`)
	for (const { tableName, rows } of fetched) {
		console.log(`   ${tableName}: ${rows.length} rows`)
	}
	if (!complete) {
		console.log(`\n⚠️  Reminder: this backup is published-rows-only.`)
	}
	if (skipped.length > 0) {
		console.log(`\n⚠️  Reminder: ${skipped.join(", ")} was skipped and is NOT current.`)
	}
}

main().catch((error) => {
	console.error(`\n❌ Backup failed: ${error.message}`)
	console.error(`   Nothing was written. Local import should NOT be run.`)
	process.exit(1)
})

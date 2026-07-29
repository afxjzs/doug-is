#!/usr/bin/env bash

set -euo pipefail

PROJECT_ID="doug-is"
BACKUP_DIR="backups"
SKIP_IMPORT="false"
POSTS_FILE=""
TRIGGERS_FILE=""
ALLOW_MISMATCH="false"

print_usage() {
	echo "Usage: ./scripts/reset-local-supabase.sh [options]"
	echo ""
	echo "Resets local Supabase state for this project and optionally imports backup CSV data."
	echo ""
	echo "Options:"
	echo "  --project-id <id>        Supabase local project id (default: doug-is)"
	echo "  --backup-dir <dir>       Backup directory (default: backups)"
	echo "  --posts-file <file>      Explicit posts CSV file path"
	echo "  --triggers-file <file>   Explicit migraine_triggers CSV file path"
	echo "  --skip-import            Skip CSV data import step"
	echo "  --allow-mismatched-backups"
	echo "                           Permit posts and migraine_triggers CSVs from"
	echo "                           different backup runs (normally an error)"
	echo "  --help                   Show this help text"
}

while [[ $# -gt 0 ]]; do
	case "$1" in
		--project-id)
			PROJECT_ID="$2"
			shift 2
			;;
		--backup-dir)
			BACKUP_DIR="$2"
			shift 2
			;;
		--posts-file)
			POSTS_FILE="$2"
			shift 2
			;;
		--triggers-file)
			TRIGGERS_FILE="$2"
			shift 2
			;;
		--skip-import)
			SKIP_IMPORT="true"
			shift
			;;
		--allow-mismatched-backups)
			ALLOW_MISMATCH="true"
			shift
			;;
		--help)
			print_usage
			exit 0
			;;
		*)
			echo "Unknown option: $1"
			echo ""
			print_usage
			exit 1
			;;
	esac
done

require_command() {
	if ! command -v "$1" >/dev/null 2>&1; then
		echo "Missing required command: $1"
		exit 1
	fi
}

require_command docker
require_command supabase
require_command psql

# Resolve and validate the backup CSVs BEFORE anything destructive runs.
# Everything below this block tears down containers, deletes volumes, and
# TRUNCATEs tables. Discovering a missing, mismatched, or wrong-shaped backup
# after that point would leave a wiped local database and nothing to load into
# it, so every check that can fail cheaply happens here first.
if [[ "$SKIP_IMPORT" != "true" ]]; then
	if [[ -z "$POSTS_FILE" ]]; then
		shopt -s nullglob
		posts_matches=( "$BACKUP_DIR"/posts_*.csv )
		shopt -u nullglob
		if (( ${#posts_matches[@]} == 0 )); then
			echo "No posts backup file found in ${BACKUP_DIR}"
			exit 1
		fi
		POSTS_FILE="$(ls -t "${posts_matches[@]}" | sed -n '1p')"
	fi

	if [[ -z "$TRIGGERS_FILE" ]]; then
		shopt -s nullglob
		triggers_matches=( "$BACKUP_DIR"/migraine_triggers_*.csv )
		shopt -u nullglob
		if (( ${#triggers_matches[@]} == 0 )); then
			echo "No migraine_triggers backup file found in ${BACKUP_DIR}"
			exit 1
		fi
		TRIGGERS_FILE="$(ls -t "${triggers_matches[@]}" | sed -n '1p')"
	fi

	if [[ ! -f "$POSTS_FILE" ]]; then
		echo "Posts CSV file not found: $POSTS_FILE"
		exit 1
	fi

	if [[ ! -f "$TRIGGERS_FILE" ]]; then
		echo "Migraine triggers CSV file not found: $TRIGGERS_FILE"
		exit 1
	fi

	# The two CSVs are selected independently by mtime, so a backup run that
	# failed part-way (or a --skip=<table> run) leaves a fresh file for one
	# table beside a months-old file for the other. Loading that pair produces
	# a local database matching no actual state of production. backup-data.js
	# stamps every file in a run with the same timestamp, so requiring a match
	# catches it.
	posts_stamp="$(basename "$POSTS_FILE" .csv)"
	posts_stamp="${posts_stamp#posts_}"
	triggers_stamp="$(basename "$TRIGGERS_FILE" .csv)"
	triggers_stamp="${triggers_stamp#migraine_triggers_}"

	if [[ "$posts_stamp" != "$triggers_stamp" ]]; then
		echo ""
		echo "ERROR: the two backup CSVs come from different backup runs."
		echo "  posts:             ${POSTS_FILE}  (${posts_stamp})"
		echo "  migraine_triggers: ${TRIGGERS_FILE}  (${triggers_stamp})"
		echo ""
		echo "Importing these together gives you a local database matching no real"
		echo "state of production. Re-run 'node scripts/backup-data.js' to refresh"
		echo "both, pass explicit --posts-file/--triggers-file, or if the mismatch"
		echo "is intentional, re-run with --allow-mismatched-backups."

		if [[ "$ALLOW_MISMATCH" != "true" ]]; then
			exit 1
		fi

		echo ""
		echo "==> --allow-mismatched-backups given; continuing with mismatched vintages."
	fi

	# Take the posts column list from the CSV header rather than hardcoding it.
	# \copy matches by position, not by name, so a hardcoded list silently rots
	# every time the production schema gains a column (this is how the list fell
	# behind the `status` column). Reading the header keeps the two in step; if
	# production has a column the local migrations lack, \copy fails loudly.
	POSTS_COLUMNS="$(head -1 "$POSTS_FILE" | tr -d '\r')"

	if [[ -z "$POSTS_COLUMNS" ]]; then
		echo "ERROR: could not read a column header from ${POSTS_FILE}"
		exit 1
	fi

	# migraine_triggers cannot use the same trick: its rows go through a
	# transform INSERT below that maps specific columns by name into Postgres
	# arrays. Assert the header still matches what that INSERT expects, so a
	# schema change stops the import instead of quietly loading wrong columns.
	TRIGGERS_COLUMNS="$(head -1 "$TRIGGERS_FILE" | tr -d '\r')"
	EXPECTED_TRIGGERS_COLUMNS="food,trigger,reason,categories,chemical_triggers,source,notes,id,created_at,updated_at"

	if [[ "$TRIGGERS_COLUMNS" != "$EXPECTED_TRIGGERS_COLUMNS" ]]; then
		echo "ERROR: migraine_triggers CSV header does not match the import transform."
		echo "  expected: ${EXPECTED_TRIGGERS_COLUMNS}"
		echo "  found:    ${TRIGGERS_COLUMNS}"
		echo "Update the transform INSERT in this script before importing."
		exit 1
	fi

	echo "==> Backup CSVs validated. Proceeding with reset."
fi

echo "==> Checking Docker availability..."
docker ps >/dev/null

echo "==> Stopping local Supabase project: ${PROJECT_ID}"
supabase stop --project-id "$PROJECT_ID" >/dev/null 2>&1 || true

echo "==> Removing stale local containers for project: ${PROJECT_ID}"
container_names=()
while IFS= read -r name; do
	if [[ "$name" == supabase_*_"$PROJECT_ID" ]]; then
		container_names+=("$name")
	fi
done < <(docker ps -a --format '{{.Names}}')

if (( ${#container_names[@]} > 0 )); then
	docker rm -f "${container_names[@]}" >/dev/null
fi

echo "==> Removing local Supabase volumes for project: ${PROJECT_ID}"
volume_names=()
while IFS= read -r vol; do
	if [[ -n "$vol" ]]; then
		volume_names+=("$vol")
	fi
done < <(docker volume ls -q --filter "label=com.supabase.cli.project=${PROJECT_ID}")

if (( ${#volume_names[@]} > 0 )); then
	docker volume rm "${volume_names[@]}" >/dev/null
fi

echo "==> Starting clean local Supabase stack..."
supabase start

echo "==> Applying migrations to local database..."
supabase db push --local

# Removing the Docker volumes above wipes the ENTIRE cluster, including the auth
# schema — so auth.users and user_roles come back empty and /admin locks you out.
# `supabase db push` does not run seeds (only `db reset` does), so apply them
# here explicitly. This runs before the --skip-import early exit on purpose:
# admin access should be restored whether or not CSV data is loaded.
seed_files=()
shopt -s nullglob
seed_files=( supabase/seeds/*.sql )
shopt -u nullglob

if (( ${#seed_files[@]} == 0 )); then
	echo "WARNING: no seed files found in supabase/seeds/."
	echo "  The local auth schema was just wiped and nothing will restore it."
	echo "  /admin will reject every login until a user and admin role exist."
else
	echo "==> Applying ${#seed_files[@]} seed file(s) from supabase/seeds/..."
	for seed_file in "${seed_files[@]}"; do
		echo "    - $(basename "$seed_file")"
		psql "postgresql://postgres:postgres@127.0.0.1:54332/postgres" \
			-v ON_ERROR_STOP=1 -q -f "$seed_file"
	done
fi

if [[ "$SKIP_IMPORT" == "true" ]]; then
	echo "==> Skipping CSV import as requested."
	echo "Done."
	exit 0
fi

echo "==> Importing posts from: ${POSTS_FILE}"
echo "==> Importing migraine_triggers from: ${TRIGGERS_FILE}"
echo "==> Posts columns from CSV header: ${POSTS_COLUMNS}"

psql "postgresql://postgres:postgres@127.0.0.1:54332/postgres" -v ON_ERROR_STOP=1 \
	-c "TRUNCATE TABLE public.posts RESTART IDENTITY CASCADE;" \
	-c "\\copy public.posts (${POSTS_COLUMNS}) FROM '${POSTS_FILE}' WITH (FORMAT csv, HEADER true)" \
	-c "CREATE TEMP TABLE tmp_migraine_import (food text, trigger text, reason text, categories text, chemical_triggers text, source text, notes text, id text, created_at text, updated_at text);" \
	-c "\\copy tmp_migraine_import (food,trigger,reason,categories,chemical_triggers,source,notes,id,created_at,updated_at) FROM '${TRIGGERS_FILE}' WITH (FORMAT csv, HEADER true)" \
	-c "TRUNCATE TABLE public.migraine_triggers RESTART IDENTITY;" \
	-c "INSERT INTO public.migraine_triggers (food, trigger, reason, categories, chemical_triggers, source, notes, created_at, updated_at) SELECT food, trigger, NULLIF(reason, ''), CASE WHEN categories IS NULL OR categories = '' OR categories = '[]' THEN NULL ELSE ARRAY(SELECT jsonb_array_elements_text(categories::jsonb)) END, CASE WHEN chemical_triggers IS NULL OR chemical_triggers = '' OR chemical_triggers = '[]' OR chemical_triggers = '[\"\"]' THEN NULL ELSE ARRAY(SELECT jsonb_array_elements_text(chemical_triggers::jsonb)) END, NULLIF(source, ''), NULLIF(notes, ''), COALESCE(NULLIF(created_at, '')::timestamptz, now()), COALESCE(NULLIF(updated_at, '')::timestamptz, now()) FROM tmp_migraine_import;" \
	-c "SELECT 'posts' AS table_name, COUNT(*) AS row_count FROM public.posts UNION ALL SELECT 'migraine_triggers' AS table_name, COUNT(*) AS row_count FROM public.migraine_triggers;"

echo "==> Local Supabase reset and data import completed."
echo "==> Note: this DESTROYS the entire local cluster, not just public schema"
echo "    data. Removing the Docker volumes wipes auth.users, user_roles, and"
echo "    everything else. supabase/seeds/*.sql restores the local admin login;"
echo "    any other local-only data you had is gone. Production is never touched."

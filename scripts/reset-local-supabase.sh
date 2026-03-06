#!/usr/bin/env bash

set -euo pipefail

PROJECT_ID="doug-is"
BACKUP_DIR="backups"
SKIP_IMPORT="false"
POSTS_FILE=""
TRIGGERS_FILE=""

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

if [[ "$SKIP_IMPORT" == "true" ]]; then
	echo "==> Skipping CSV import as requested."
	echo "Done."
	exit 0
fi

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

echo "==> Importing posts from: ${POSTS_FILE}"
echo "==> Importing migraine_triggers from: ${TRIGGERS_FILE}"

psql "postgresql://postgres:postgres@127.0.0.1:54332/postgres" -v ON_ERROR_STOP=1 \
	-c "TRUNCATE TABLE public.posts RESTART IDENTITY CASCADE;" \
	-c "\\copy public.posts (id,title,slug,content,published_at,created_at,updated_at,category,excerpt,featured_image) FROM '${POSTS_FILE}' WITH (FORMAT csv, HEADER true)" \
	-c "CREATE TEMP TABLE tmp_migraine_import (food text, trigger text, reason text, categories text, chemical_triggers text, source text, notes text, id text, created_at text, updated_at text);" \
	-c "\\copy tmp_migraine_import (food,trigger,reason,categories,chemical_triggers,source,notes,id,created_at,updated_at) FROM '${TRIGGERS_FILE}' WITH (FORMAT csv, HEADER true)" \
	-c "TRUNCATE TABLE public.migraine_triggers RESTART IDENTITY;" \
	-c "INSERT INTO public.migraine_triggers (food, trigger, reason, categories, chemical_triggers, source, notes, created_at, updated_at) SELECT food, trigger, NULLIF(reason, ''), CASE WHEN categories IS NULL OR categories = '' OR categories = '[]' THEN NULL ELSE ARRAY(SELECT jsonb_array_elements_text(categories::jsonb)) END, CASE WHEN chemical_triggers IS NULL OR chemical_triggers = '' OR chemical_triggers = '[]' OR chemical_triggers = '[\"\"]' THEN NULL ELSE ARRAY(SELECT jsonb_array_elements_text(chemical_triggers::jsonb)) END, NULLIF(source, ''), NULLIF(notes, ''), COALESCE(NULLIF(created_at, '')::timestamptz, now()), COALESCE(NULLIF(updated_at, '')::timestamptz, now()) FROM tmp_migraine_import;" \
	-c "SELECT 'posts' AS table_name, COUNT(*) AS row_count FROM public.posts UNION ALL SELECT 'migraine_triggers' AS table_name, COUNT(*) AS row_count FROM public.migraine_triggers;"

echo "==> Local Supabase reset and data import completed."
echo "==> Note: This script only manages local Docker state and public schema data."

#!/bin/bash

# create-migration.sh - Helper script to create new Supabase migrations

# Check if a description was provided
if [ -z "$1" ]; then
  echo "Error: Migration description is required"
  echo "Usage: ./scripts/create-migration.sh <description>"
  echo "Example: ./scripts/create-migration.sh add_users_table"
  exit 1
fi

# Create timestamp in format YYYYMMDDHHMMSS
TIMESTAMP=$(date +%Y%m%d%H%M%S)
DESCRIPTION=$(echo "$1" | tr ' ' '_' | tr '[:upper:]' '[:lower:]')
MIGRATION_NAME="${TIMESTAMP}_${DESCRIPTION}"

# Create migration directory if it doesn't exist
MIGRATION_DIR="supabase/migrations"
mkdir -p "$MIGRATION_DIR"

# Create up migration file
UP_FILE="${MIGRATION_DIR}/${MIGRATION_NAME}.sql"
touch "$UP_FILE"

# Create down migration file
DOWN_FILE="${MIGRATION_DIR}/${MIGRATION_NAME}.down.sql"
touch "$DOWN_FILE"

# Add template content to up file
cat > "$UP_FILE" << EOF
-- Migration: $DESCRIPTION
-- Created at: $(date)

-- Example: Create a table with IF NOT EXISTS
-- CREATE TABLE IF NOT EXISTS my_table (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   name TEXT NOT NULL,
--   created_at TIMESTAMPTZ DEFAULT NOW()
-- );

-- Example: Create a policy with IF NOT EXISTS check
-- DO \$\$
-- BEGIN
--   IF NOT EXISTS (
--     SELECT FROM pg_policies 
--     WHERE tablename = 'my_table' 
--     AND policyname = 'My policy name'
--   ) THEN
--     CREATE POLICY "My policy name" 
--     ON my_table
--     FOR SELECT 
--     USING (true);
--   END IF;
-- END
-- \$\$;

-- Your SQL statements here

EOF

# Add template content to down file
cat > "$DOWN_FILE" << EOF
-- Down Migration: $DESCRIPTION
-- Created at: $(date)

-- Example: Drop a policy with IF EXISTS check
-- DO \$\$
-- BEGIN
--   IF EXISTS (
--     SELECT FROM pg_policies 
--     WHERE tablename = 'my_table' 
--     AND policyname = 'My policy name'
--   ) THEN
--     DROP POLICY IF EXISTS "My policy name" ON my_table;
--   END IF;
-- END
-- \$\$;

-- Example: Drop a table with IF EXISTS
-- DROP TABLE IF EXISTS my_table;

-- Your rollback SQL statements here

EOF

echo "Migration files created:"
echo "- $UP_FILE"
echo "- $DOWN_FILE"
echo ""
echo "Next steps:"
echo "1. Edit the files to add your SQL statements"
echo "2. Run the migration with: ./scripts/run-migrations.sh up"
echo "3. To roll back, use: ./scripts/run-migrations.sh down" 
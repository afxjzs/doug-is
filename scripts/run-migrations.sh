#!/bin/bash

# run-migrations.sh - Helper script to run Supabase migrations

# Function to display usage information
show_usage() {
  echo "Usage: ./scripts/run-migrations.sh [OPTION]"
  echo ""
  echo "Options:"
  echo "  up                Apply all pending migrations"
  echo "  up [name]         Apply a specific migration"
  echo "  down              Roll back the most recent migration (may not work reliably)"
  echo "  down [version]    Roll back to a specific version"
  echo "  manual-down       Show SQL to manually roll back the most recent migration"
  echo "  status            Show migration status"
  echo "  help              Show this help message"
  echo ""
  echo "Examples:"
  echo "  ./scripts/run-migrations.sh up"
  echo "  ./scripts/run-migrations.sh up 20250312204350_create_posts_table"
  echo "  ./scripts/run-migrations.sh manual-down"
  echo "  ./scripts/run-migrations.sh down 20250312204315"
}

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
  echo "Error: Supabase CLI is not installed"
  echo "Install it with: npm install -g supabase"
  exit 1
fi

# Check if the project is linked to Supabase
if ! supabase status &> /dev/null; then
  echo "Warning: Your project may not be linked to Supabase"
  echo "Link it with: supabase link --project-ref YOUR_PROJECT_REF"
fi

# Process command line arguments
if [ $# -eq 0 ]; then
  show_usage
  exit 1
fi

case "$1" in
  up)
    # Create a temporary directory for down files
    mkdir -p supabase/temp_down
    
    # Move down files to temporary directory
    if [ -n "$(ls -A supabase/migrations/*.down.sql 2>/dev/null)" ]; then
      mv supabase/migrations/*.down.sql supabase/temp_down/
    fi
    
    if [ -z "$2" ]; then
      echo "Applying all pending migrations..."
      supabase db push
    else
      echo "Applying migration: $2..."
      supabase db push --migration-name "$2"
    fi
    
    # Move down files back
    if [ -n "$(ls -A supabase/temp_down/*.down.sql 2>/dev/null)" ]; then
      mv supabase/temp_down/*.down.sql supabase/migrations/
    fi
    
    # Remove temporary directory
    rmdir supabase/temp_down
    ;;
  down)
    if [ -z "$2" ]; then
      echo "Rolling back the most recent migration..."
      echo "Note: This method may not work reliably. If it fails, use manual-down instead."
      
      # Get the current migration list in a more reliable way
      MIGRATIONS=$(supabase migration list | grep -E "^\s+[0-9]+" | awk '{print $1}' | sort)
      
      if [ -z "$MIGRATIONS" ]; then
        echo "No migrations found to roll back."
        echo "Try using manual-down instead: ./scripts/run-migrations.sh manual-down"
        exit 1
      fi
      
      # Get the most recent migration
      LATEST_MIGRATION=$(echo "$MIGRATIONS" | tail -n 1)
      
      # Get the second-to-last migration (the one we want to roll back to)
      PREVIOUS_MIGRATION=$(echo "$MIGRATIONS" | tail -n 2 | head -n 1)
      
      if [ -n "$PREVIOUS_MIGRATION" ]; then
        echo "Latest migration: $LATEST_MIGRATION"
        echo "Rolling back to migration: $PREVIOUS_MIGRATION"
        supabase db reset --linked --version "$PREVIOUS_MIGRATION"
      else
        echo "No previous migration found to roll back to."
        echo "Try using manual-down instead: ./scripts/run-migrations.sh manual-down"
        exit 1
      fi
    else
      echo "Rolling back to version: $2..."
      supabase db reset --linked --version "$2"
    fi
    ;;
  manual-down)
    echo "Preparing to manually roll back the most recent migration..."
    
    # List all migration files and sort by timestamp (newest first)
    echo "Available migrations:"
    echo "----------------------------------------"
    ls -1t supabase/migrations/*.sql | grep -v "\.down\.sql" | while read -r file; do
      base_name=$(basename "$file" .sql)
      echo "$base_name"
    done
    echo "----------------------------------------"
    
    # Ask which migration to roll back
    read -p "Enter the migration name to roll back (e.g., 20250312205200_add_read_flag_to_posts): " MIGRATION_NAME
    
    if [ -z "$MIGRATION_NAME" ]; then
      echo "No migration name provided. Exiting."
      exit 1
    fi
    
    # Check if the migration file exists
    UP_MIGRATION="supabase/migrations/${MIGRATION_NAME}.sql"
    if [ ! -f "$UP_MIGRATION" ]; then
      echo "Migration file not found: $UP_MIGRATION"
      exit 1
    fi
    
    # Get the corresponding down migration file
    DOWN_MIGRATION="supabase/migrations/${MIGRATION_NAME}.down.sql"
    
    if [ ! -f "$DOWN_MIGRATION" ]; then
      echo "Down migration file not found: $DOWN_MIGRATION"
      exit 1
    fi
    
    # Create a combined SQL file with both the down migration and the tracking update
    TEMP_SQL_FILE=$(mktemp)
    
    # Add a header
    cat > "$TEMP_SQL_FILE" << EOF
-- MANUAL MIGRATION ROLLBACK
-- Migration: ${MIGRATION_NAME}
-- Generated: $(date)

-- STEP 1: Run the down migration SQL to undo database changes
$(cat "$DOWN_MIGRATION")

-- STEP 2: Update the migration history table to track that this migration has been rolled back
DELETE FROM supabase_migrations.schema_migrations WHERE version = '${MIGRATION_NAME}';

-- IMPORTANT: Both steps above must be executed for the rollback to be properly tracked
EOF
    
    # Display the combined SQL
    echo "Combined SQL for rollback (includes both the migration rollback and tracking update):"
    echo "----------------------------------------"
    cat "$TEMP_SQL_FILE"
    echo "----------------------------------------"
    
    echo "IMPORTANT: To properly roll back this migration:"
    echo "1. Go to Supabase SQL Editor: https://app.supabase.com/project/YOUR_PROJECT_REF/sql"
    echo "2. Copy ALL the SQL above (including both steps)"
    echo "3. Run the SQL as a single transaction"
    echo "4. This will both roll back the database changes AND update the migration tracking"
    
    # Offer to copy to clipboard if available
    if command -v pbcopy &> /dev/null; then
      read -p "Copy the combined SQL to clipboard? (y/n) " -n 1 -r
      echo
      if [[ $REPLY =~ ^[Yy]$ ]]; then
        cat "$TEMP_SQL_FILE" | pbcopy
        echo "Combined SQL copied to clipboard!"
      fi
    fi
    
    # Clean up
    rm "$TEMP_SQL_FILE"
    
    # Offer to save to a file
    read -p "Save the combined SQL to a file? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      SAVE_FILE="rollback_${MIGRATION_NAME}.sql"
      cat > "$SAVE_FILE" << EOF
-- MANUAL MIGRATION ROLLBACK
-- Migration: ${MIGRATION_NAME}
-- Generated: $(date)

-- STEP 1: Run the down migration SQL to undo database changes
$(cat "$DOWN_MIGRATION")

-- STEP 2: Update the migration history table to track that this migration has been rolled back
DELETE FROM supabase_migrations.schema_migrations WHERE version = '${MIGRATION_NAME}';

-- IMPORTANT: Both steps above must be executed for the rollback to be properly tracked
EOF
      echo "SQL saved to $SAVE_FILE"
    fi
    ;;
  status)
    echo "Checking migration status..."
    supabase migration list
    ;;
  help)
    show_usage
    ;;
  *)
    echo "Error: Unknown option '$1'"
    show_usage
    exit 1
    ;;
esac 
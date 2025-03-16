# Supabase Migrations

This directory contains SQL migrations for the Supabase database.

## Migration Files

- `20240601000000_create_contact_messages.sql`: Creates the `contact_messages` table for storing contact form submissions with appropriate Row Level Security policies.
- `20240601000001_create_posts_table.sql`: Creates the `posts` table for storing blog posts with appropriate Row Level Security policies.
- `20240601000002_sample_posts_data.sql`: Inserts sample data into the `posts` table.

Each migration has a corresponding `.down.sql` file for rolling back changes.

## Running Migrations

### Prerequisites

1. Install the Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

### Linking Your Project

Link your local project to your Supabase project:

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

You can find your project reference in the Supabase dashboard URL: `https://app.supabase.io/project/YOUR_PROJECT_REF`

### Running Migrations Up

To apply all migrations:

```bash
supabase db push
```

To apply a specific migration:

```bash
supabase db push --migration-name 20240601000001_create_posts_table
```

### Rolling Back Migrations

To roll back the most recent migration:

```bash
supabase db reset --no-backup-fetch
```

To roll back to a specific migration:

```bash
supabase db reset --target-version 20240601000000 --no-backup-fetch
```

## Manual Migration

If you prefer to run migrations manually, you can copy the SQL from the migration files and run them in the Supabase SQL Editor in the dashboard:

1. Go to the [Supabase Dashboard](https://app.supabase.io)
2. Select your project
3. Go to the SQL Editor
4. Copy and paste the SQL from the migration files
5. Run the SQL

## Creating New Migrations

To create a new migration:

1. Create a new file in the `migrations` directory with a timestamp prefix:
   ```
   YYYYMMDDHHMMSS_description.sql
   ```

2. Add your SQL statements to the file.

3. Create a corresponding `.down.sql` file with the same name to roll back the changes.

## Best Practices

1. Always test migrations locally before applying them to production.
2. Keep migrations small and focused on a single change.
3. Ensure each migration has a corresponding down migration.
4. Use `IF EXISTS` and `IF NOT EXISTS` clauses to make migrations idempotent.
5. Add comments to explain complex migrations. 
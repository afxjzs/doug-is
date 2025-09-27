-- Initial schema setup for local development
-- This is a minimal migration to get Supabase started

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create a simple test table to verify the setup works
CREATE TABLE IF NOT EXISTS test_table (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Grant basic permissions
GRANT SELECT ON test_table TO anon;
GRANT ALL ON test_table TO postgres;


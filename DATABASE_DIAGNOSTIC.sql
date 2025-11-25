-- ============================================================================
-- DIAGNOSTIC SCRIPT: Run this FIRST to check your database structure
-- ============================================================================

-- Check if training_enrollments table exists and its columns
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'training_enrollments'
ORDER BY ordinal_position;

-- Check if payments table exists and its columns
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'payments'
ORDER BY ordinal_position;

-- List all your tables in public schema
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check existing indexes
SELECT 
    indexname,
    tablename,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
AND (tablename = 'training_enrollments' OR tablename = 'payments')
ORDER BY tablename, indexname;
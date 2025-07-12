-- Export your current database schema to compare with expected structure
-- Run this in psql or pgAdmin query editor

-- 1. Export complete schema structure
\o current_schema_export.sql
\d+ 

-- 2. Get table creation scripts
SELECT 
    'CREATE TABLE ' || table_name || ' (' || string_agg(
        column_name || ' ' || 
        CASE 
            WHEN data_type = 'character varying' THEN 'VARCHAR(' || character_maximum_length || ')'
            WHEN data_type = 'character' THEN 'CHAR(' || character_maximum_length || ')'
            WHEN data_type = 'numeric' THEN 'NUMERIC(' || numeric_precision || ',' || numeric_scale || ')'
            ELSE UPPER(data_type)
        END ||
        CASE 
            WHEN is_nullable = 'NO' THEN ' NOT NULL'
            ELSE ''
        END ||
        CASE 
            WHEN column_default IS NOT NULL THEN ' DEFAULT ' || column_default
            ELSE ''
        END, 
        ', '
    ) || ');' as create_statement
FROM information_schema.columns 
WHERE table_schema = 'public'
GROUP BY table_name
ORDER BY table_name;

-- 3. Current table structure overview
SELECT 
    table_name,
    COUNT(*) as column_count
FROM information_schema.columns 
WHERE table_schema = 'public'
GROUP BY table_name
ORDER BY table_name;

-- 4. Check if expected tables exist
WITH expected_tables AS (
    SELECT unnest(ARRAY[
        'users', 'categories', 'tags', 'books', 'book_tags', 
        'borrowers', 'lending_records', 'book_preview_images', 
        'user_favorites', 'alembic_version'
    ]) AS table_name
)
SELECT 
    et.table_name,
    CASE 
        WHEN t.table_name IS NOT NULL THEN 'EXISTS'
        ELSE 'MISSING'
    END as status
FROM expected_tables et
LEFT JOIN information_schema.tables t 
    ON et.table_name = t.table_name 
    AND t.table_schema = 'public'
ORDER BY et.table_name;

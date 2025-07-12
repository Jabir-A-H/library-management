# PostgreSQL Database Verification Commands

## Connect to your database using psql
```cmd
psql -U postgres -d library_db
```

## Or if you're using the library_user:
```cmd
psql -U library_user -d library_db
```

## Basic Database Information Commands:

### 1. List all databases
```sql
\l
```

### 2. List all tables in current database
```sql
\dt
```

### 3. Show detailed table information
```sql
\d+ tablename
```

### 4. Show all tables with their schemas
```sql
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

### 5. Check specific table structure (replace 'books' with any table name)
```sql
\d books
```

### 6. Get column information for all tables
```sql
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;
```

### 7. Check foreign key relationships
```sql
SELECT
    tc.table_name, 
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY';
```

### 8. Check indexes
```sql
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

### 9. Check sequences (for auto-increment columns)
```sql
SELECT sequence_name 
FROM information_schema.sequences 
WHERE sequence_schema = 'public';
```

### 10. Verify user permissions
```sql
SELECT grantee, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public';
```

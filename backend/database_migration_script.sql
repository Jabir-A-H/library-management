-- Database Schema Migration Script
-- This script aligns your current database with the FastAPI backend models

-- ============================================
-- BOOKS TABLE MODIFICATIONS
-- ============================================

-- Add missing columns to books table
ALTER TABLE books 
ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS available_quantity INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS pages INTEGER,
ADD COLUMN IF NOT EXISTS acquisition_date DATE,
ADD COLUMN IF NOT EXISTS condition VARCHAR(50) DEFAULT 'Good',
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS location VARCHAR(100);

-- Copy data from old columns to new columns
UPDATE books SET 
    quantity = COALESCE(total_copies, 1),
    available_quantity = COALESCE(available_copies, 1),
    pages = page_count,
    location = CONCAT_WS(' - ', 
        CASE WHEN room IS NOT NULL THEN 'Room: ' || room END,
        CASE WHEN shelf IS NOT NULL THEN 'Shelf: ' || shelf END,
        CASE WHEN column_location IS NOT NULL THEN 'Column: ' || column_location END,
        CASE WHEN row_location IS NOT NULL THEN 'Row: ' || row_location END
    );

-- Update location field to combine all location info
UPDATE books SET location = 
    CASE 
        WHEN location_comment IS NOT NULL THEN 
            CASE WHEN location IS NOT NULL AND location != '' 
                 THEN location || ' - ' || location_comment 
                 ELSE location_comment 
            END
        ELSE location
    END;

-- Drop old columns (uncomment these after verifying data migration)
-- ALTER TABLE books DROP COLUMN IF EXISTS total_copies;
-- ALTER TABLE books DROP COLUMN IF EXISTS available_copies;
-- ALTER TABLE books DROP COLUMN IF EXISTS page_count;
-- ALTER TABLE books DROP COLUMN IF EXISTS room;
-- ALTER TABLE books DROP COLUMN IF EXISTS shelf;
-- ALTER TABLE books DROP COLUMN IF EXISTS column_location;
-- ALTER TABLE books DROP COLUMN IF EXISTS row_location;
-- ALTER TABLE books DROP COLUMN IF EXISTS location_comment;

-- ============================================
-- BORROWERS TABLE MODIFICATIONS
-- ============================================

-- Add missing columns to borrowers table
ALTER TABLE borrowers 
ADD COLUMN IF NOT EXISTS name VARCHAR(100),
ADD COLUMN IF NOT EXISTS membership_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS membership_type VARCHAR(50) DEFAULT 'Standard',
ADD COLUMN IF NOT EXISTS registration_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Combine first_name and last_name into name
UPDATE borrowers SET 
    name = TRIM(CONCAT(first_name, ' ', last_name)),
    membership_number = 'MEM' || LPAD(id::text, 6, '0'),
    notes = comments;

-- Create unique membership numbers
UPDATE borrowers SET membership_number = 'MEM' || LPAD(id::text, 6, '0');

-- ============================================
-- LENDING_RECORDS TABLE MODIFICATIONS
-- ============================================

-- Add missing columns to lending_records table
ALTER TABLE lending_records 
ADD COLUMN IF NOT EXISTS issue_date DATE,
ADD COLUMN IF NOT EXISTS fine_amount NUMERIC(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS fine_paid BOOLEAN DEFAULT false;

-- Copy checkout_date to issue_date
UPDATE lending_records SET 
    issue_date = checkout_date::date;

-- ============================================
-- USERS TABLE MODIFICATIONS
-- ============================================

-- Add missing columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255),
ADD COLUMN IF NOT EXISTS first_name VARCHAR(50),
ADD COLUMN IF NOT EXISTS last_name VARCHAR(50),
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Copy hashed_password to password_hash
UPDATE users SET 
    password_hash = hashed_password,
    is_admin = (role = 'admin'),
    is_active = true;

-- ============================================
-- CREATE MISSING INDEXES
-- ============================================

-- Add indexes that the backend expects
CREATE INDEX IF NOT EXISTS idx_books_quantity ON books(quantity);
CREATE INDEX IF NOT EXISTS idx_books_available_quantity ON books(available_quantity);
CREATE INDEX IF NOT EXISTS idx_borrowers_membership_number ON borrowers(membership_number);
CREATE INDEX IF NOT EXISTS idx_borrowers_is_active ON borrowers(is_active);
CREATE INDEX IF NOT EXISTS idx_lending_issue_date ON lending_records(issue_date);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin);

-- ============================================
-- ADD MISSING CONSTRAINTS
-- ============================================

-- Make membership_number unique
ALTER TABLE borrowers ADD CONSTRAINT unique_membership_number UNIQUE (membership_number);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check the migration results
SELECT 'Books Migration Check' as check_type, 
       COUNT(*) as total_books,
       COUNT(quantity) as with_quantity,
       COUNT(available_quantity) as with_available_quantity
FROM books;

SELECT 'Borrowers Migration Check' as check_type,
       COUNT(*) as total_borrowers,
       COUNT(name) as with_name,
       COUNT(membership_number) as with_membership_number
FROM borrowers;

SELECT 'Lending Records Migration Check' as check_type,
       COUNT(*) as total_records,
       COUNT(issue_date) as with_issue_date
FROM lending_records;

SELECT 'Users Migration Check' as check_type,
       COUNT(*) as total_users,
       COUNT(password_hash) as with_password_hash,
       COUNT(CASE WHEN is_admin THEN 1 END) as admin_users
FROM users;

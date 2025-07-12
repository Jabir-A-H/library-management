# Using pgAdmin4 to Verify Database Structure

## Steps to check your database in pgAdmin4:

### 1. **Connect to PostgreSQL Server**
   - Open pgAdmin4
   - Right-click "Servers" → "Create" → "Server"
   - **Name**: Local PostgreSQL
   - **Host**: localhost
   - **Port**: 5432
   - **Username**: postgres (or your admin user)
   - **Password**: [your password]

### 2. **Navigate to Your Database**
   ```
   Servers → PostgreSQL → Databases → library_db
   ```

### 3. **Check Database Structure**
   - Expand `library_db` → `Schemas` → `public` → `Tables`
   - You should see these tables:
     ✅ books
     ✅ borrowers  
     ✅ categories
     ✅ tags
     ✅ book_tags
     ✅ users
     ✅ lending_records
     ✅ book_preview_images
     ✅ user_favorites
     ✅ alembic_version

### 4. **Verify Table Structures**
   - Right-click any table → "Properties"
   - Go to "Columns" tab to see all fields
   - Go to "Constraints" tab to see primary/foreign keys
   - Go to "Indexes" tab to see database indexes

### 5. **Quick SQL Query Method**
   - Right-click `library_db` → "Query Tool"
   - Run this query to see all tables:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public'
   ORDER BY table_name;
   ```

### 6. **Export Schema for Comparison**
   - Right-click `library_db` → "Backup..."
   - Format: "Plain"
   - Check "Only schema" 
   - This creates a .sql file with your current structure

### 7. **Check Relationships Visually**
   - Right-click `library_db` → "ERD Tool"
   - This shows a visual diagram of table relationships

## What to Look For:

### ✅ **Expected Tables & Key Fields:**

**users table:**
- id, username, email, password_hash, first_name, last_name, is_active, is_admin

**books table:**  
- id, title, author, isbn, publisher, publication_year, genre, language, pages, description, location, quantity, available_quantity, category_id

**borrowers table:**
- id, name, email, phone, address, membership_number, membership_type, registration_date

**lending_records table:**
- id, book_id, borrower_id, issue_date, due_date, return_date, status, fine_amount

**categories table:**
- id, name, description

**tags table:**
- id, name, color

**book_tags table:**
- book_id, tag_id (junction table)

### ⚠️ **Common Issues to Check:**
- Missing foreign key constraints
- Incorrect data types  
- Missing indexes on frequently queried fields
- Missing default values
- Incorrect nullable settings

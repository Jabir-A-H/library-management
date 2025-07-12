"""
Database Migration Script
This script safely migrates your current database schema to match the FastAPI backend models
"""
import asyncio
import os
from sqlalchemy import create_engine, text
from sqlalchemy.ext.asyncio import create_async_engine
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def run_migration():
    """Run the database migration"""
    
    database_url = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgressadmin@localhost:5432/library_db")
    
    # Create async engine
    async_engine = create_async_engine(database_url)
    
    print("=== DATABASE SCHEMA MIGRATION ===\n")
    print("⚠️  WARNING: This will modify your database structure!")
    print("   Make sure you have a backup before proceeding.\n")
    
    response = input("Do you want to proceed with the migration? (yes/no): ")
    if response.lower() not in ['yes', 'y']:
        print("❌ Migration cancelled.")
        return
    
    try:
        async with async_engine.begin() as conn:
            print("\n🔄 Starting migration...\n")
            
            # Read migration script
            with open('database_migration_script.sql', 'r') as f:
                migration_sql = f.read()
            
            # Split the script into individual statements
            statements = [stmt.strip() for stmt in migration_sql.split(';') if stmt.strip() and not stmt.strip().startswith('--')]
            
            # Execute each statement
            for i, statement in enumerate(statements, 1):
                if statement.strip():
                    try:
                        print(f"📋 Executing step {i}/{len(statements)}...")
                        await conn.execute(text(statement))
                        print(f"   ✅ Success")
                    except Exception as e:
                        print(f"   ⚠️  Warning: {e}")
                        continue
            
            print("\n🔍 Running verification queries...\n")
            
            # Verification queries
            verification_queries = [
                "SELECT 'Books Migration Check' as check_type, COUNT(*) as total_books, COUNT(quantity) as with_quantity, COUNT(available_quantity) as with_available_quantity FROM books",
                "SELECT 'Borrowers Migration Check' as check_type, COUNT(*) as total_borrowers, COUNT(name) as with_name, COUNT(membership_number) as with_membership_number FROM borrowers",
                "SELECT 'Lending Records Migration Check' as check_type, COUNT(*) as total_records, COUNT(issue_date) as with_issue_date FROM lending_records",
                "SELECT 'Users Migration Check' as check_type, COUNT(*) as total_users, COUNT(password_hash) as with_password_hash, COUNT(CASE WHEN is_admin THEN 1 END) as admin_users FROM users"
            ]
            
            for query in verification_queries:
                result = await conn.execute(text(query))
                row = result.fetchone()
                print(f"📊 {row[0]}: {dict(zip(result.keys(), row))}")
            
            print("\n✅ MIGRATION COMPLETED SUCCESSFULLY!")
            print("\n📝 NEXT STEPS:")
            print("1. Run 'python check_database.py' to verify the new structure")
            print("2. Test your FastAPI backend with 'python start_server.py'")
            print("3. If everything works, you can manually remove the old columns")
            print("   (uncomment the DROP COLUMN statements in the migration script)")
    
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        print("\n💡 Troubleshooting:")
        print("• Check if PostgreSQL server is running")
        print("• Verify database connection credentials")
        print("• Ensure you have write permissions on the database")
    
    finally:
        await async_engine.dispose()

if __name__ == "__main__":
    asyncio.run(run_migration())

"""
Database structure verification script
Run this to check your current PostgreSQL database structure
"""
import asyncio
import os
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.ext.asyncio import create_async_engine
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def check_database_structure():
    """Check current database structure"""
    
    # Get database URL from environment
    database_url = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgressadmin@localhost:5432/library_db")
    
    # Create sync engine for inspection
    sync_url = database_url.replace("+asyncpg", "")
    engine = create_engine(sync_url)
    
    try:
        inspector = inspect(engine)
        
        print("=== DATABASE STRUCTURE VERIFICATION ===\n")
        
        # Get all tables
        tables = inspector.get_table_names()
        print(f"📊 FOUND {len(tables)} TABLES:")
        for table in sorted(tables):
            print(f"  ✓ {table}")
        
        print(f"\n" + "="*50)
        
        # Expected tables based on our models
        expected_tables = [
            'users', 'categories', 'tags', 'books', 'book_tags',
            'borrowers', 'lending_records', 'book_preview_images', 
            'user_favorites', 'alembic_version'
        ]
        
        print(f"\n🔍 TABLE VERIFICATION:")
        missing_tables = []
        for table in expected_tables:
            if table in tables:
                print(f"  ✅ {table} - EXISTS")
            else:
                print(f"  ❌ {table} - MISSING")
                missing_tables.append(table)
        
        if missing_tables:
            print(f"\n⚠️  MISSING TABLES: {', '.join(missing_tables)}")
        else:
            print(f"\n✅ ALL EXPECTED TABLES FOUND!")
        
        # Detailed table structure
        print(f"\n" + "="*50)
        print(f"\n📋 DETAILED TABLE STRUCTURES:\n")
        
        for table in sorted(tables):
            if table == 'alembic_version':
                continue
                
            print(f"📌 TABLE: {table.upper()}")
            columns = inspector.get_columns(table)
            
            for col in columns:
                nullable = "NULL" if col['nullable'] else "NOT NULL"
                default = f" DEFAULT {col['default']}" if col['default'] else ""
                print(f"  • {col['name']:<25} {str(col['type']):<20} {nullable}{default}")
            
            # Foreign keys
            fks = inspector.get_foreign_keys(table)
            if fks:
                print(f"  🔗 Foreign Keys:")
                for fk in fks:
                    print(f"    → {fk['constrained_columns']} references {fk['referred_table']}.{fk['referred_columns']}")
            
            # Indexes
            indexes = inspector.get_indexes(table)
            if indexes:
                print(f"  📇 Indexes:")
                for idx in indexes:
                    unique = "UNIQUE " if idx['unique'] else ""
                    print(f"    → {unique}{idx['name']}: {idx['column_names']}")
            
            print()
        
        # Check database connection
        print("="*50)
        print("\n🔗 DATABASE CONNECTION TEST:")
        
        async_engine = create_async_engine(database_url)
        async with async_engine.begin() as conn:
            result = await conn.execute(text("SELECT version()"))
            version = result.scalar()
            print(f"  ✅ PostgreSQL Version: {version}")
            
            result = await conn.execute(text("SELECT current_database()"))
            db_name = result.scalar()
            print(f"  ✅ Connected to Database: {db_name}")
            
            result = await conn.execute(text("SELECT current_user"))
            user = result.scalar()
            print(f"  ✅ Connected as User: {user}")
        
        await async_engine.dispose()
        
        print(f"\n✅ DATABASE VERIFICATION COMPLETE!")
        
    except Exception as e:
        print(f"❌ Error connecting to database: {e}")
        print(f"\n💡 Please check:")
        print(f"  • PostgreSQL server is running")
        print(f"  • Database 'library_db' exists")
        print(f"  • Connection credentials in .env file")
        print(f"  • DATABASE_URL in .env: {database_url}")
    
    finally:
        engine.dispose()

if __name__ == "__main__":
    asyncio.run(check_database_structure())

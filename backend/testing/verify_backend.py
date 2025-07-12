#!/usr/bin/env python3
"""
Complete backend verification script - Tests database connection and model alignment
"""
import asyncio
import sys
import os
from datetime import datetime

# Add the src directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

async def test_database_connection():
    """Test database connection and basic operations"""
    try:
        print("🔌 Testing database connection...")
        from database_async import get_async_session, engine
        from sqlalchemy import text
        
        async with get_async_session() as session:
            # Test basic connection
            result = await session.execute(text("SELECT 1"))
            print("   ✓ Database connection successful")
            
            # Test table existence
            tables_result = await session.execute(text("""
                SELECT table_name FROM information_schema.tables 
                WHERE table_schema = 'public' 
                ORDER BY table_name
            """))
            tables = [row[0] for row in tables_result.fetchall()]
            print(f"   ✓ Found {len(tables)} tables: {', '.join(tables)}")
            
            return True
            
    except Exception as e:
        print(f"   ❌ Database connection failed: {e}")
        return False

async def test_model_imports():
    """Test all model imports"""
    try:
        print("📦 Testing model imports...")
        from src.models import (
            User, Book, Borrower, LendingRecord, 
            Category, Tag, BookPreviewImage, UserFavorite
        )
        print("   ✓ All models imported successfully")
        
        # Test model relationships
        print("🔗 Testing model relationships...")
        print(f"   ✓ Book has relationships: {list(Book.__mapper__.relationships.keys())}")
        print(f"   ✓ User has relationships: {list(User.__mapper__.relationships.keys())}")
        print(f"   ✓ Borrower has relationships: {list(Borrower.__mapper__.relationships.keys())}")
        
        return True
        
    except Exception as e:
        print(f"   ❌ Model import failed: {e}")
        return False

async def test_schema_imports():
    """Test schema imports"""
    try:
        print("📋 Testing schema imports...")
        from src.schemas.user import UserCreate, UserResponse
        from src.schemas.book import BookCreate, BookResponse
        from src.schemas.borrower import BorrowerCreate, BorrowerResponse
        from src.schemas.lending_record import LendingRecordCreate, LendingRecordResponse
        print("   ✓ All schemas imported successfully")
        return True
        
    except Exception as e:
        print(f"   ❌ Schema import failed: {e}")
        return False

async def test_crud_operations():
    """Test basic CRUD operations"""
    try:
        print("🔧 Testing basic CRUD operations...")
        from database_async import get_async_session
        from src.models import User, Category, Book
        from sqlalchemy import select
        
        async with get_async_session() as session:
            # Test reading existing data
            users_result = await session.execute(select(User).limit(5))
            users = users_result.scalars().all()
            print(f"   ✓ Found {len(users)} users in database")
            
            categories_result = await session.execute(select(Category).limit(5))
            categories = categories_result.scalars().all()
            print(f"   ✓ Found {len(categories)} categories in database")
            
            books_result = await session.execute(select(Book).limit(5))
            books = books_result.scalars().all()
            print(f"   ✓ Found {len(books)} books in database")
            
        return True
        
    except Exception as e:
        print(f"   ❌ CRUD operations failed: {e}")
        return False

async def test_fastapi_app():
    """Test FastAPI app creation"""
    try:
        print("🚀 Testing FastAPI app...")
        from src.main_fastapi import app
        print(f"   ✓ FastAPI app created: {app.title}")
        print(f"   ✓ Available routes: {len(app.routes)}")
        return True
        
    except Exception as e:
        print(f"   ❌ FastAPI app failed: {e}")
        return False

async def main():
    """Run all tests"""
    print("🧪 Starting comprehensive backend verification...\n")
    
    tests = [
        ("Database Connection", test_database_connection),
        ("Model Imports", test_model_imports),
        ("Schema Imports", test_schema_imports),
        ("CRUD Operations", test_crud_operations),
        ("FastAPI App", test_fastapi_app)
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n{test_name}:")
        try:
            result = await test_func()
            results.append(result)
        except Exception as e:
            print(f"   ❌ Test failed with exception: {e}")
            results.append(False)
    
    # Summary
    passed = sum(results)
    total = len(results)
    
    print(f"\n" + "="*50)
    print(f"🎯 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Your backend is ready to run.")
        print("\nTo start the server, run:")
        print("uvicorn src.main_fastapi:app --reload --host 0.0.0.0 --port 8000")
    else:
        print("❌ Some tests failed. Check the errors above.")
    
    return passed == total

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n👋 Test interrupted by user")
    except Exception as e:
        print(f"\n💥 Fatal error: {e}")
        sys.exit(1)

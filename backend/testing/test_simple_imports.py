#!/usr/bin/env python3
"""
Simple import test for FastAPI app
"""
import sys
import os

# Add the src directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

def test_simple_imports():
    """Test basic imports without circular dependencies"""
    try:
        print("Testing basic imports...")
        
        # Test database
        from src.database_async import Base, engine
        print("✓ Database imports successful")
        
        # Test models individually
        from src.models.user_async import User
        print("✓ User model imported")
        
        from src.models.category_async import Category
        print("✓ Category model imported")
        
        from src.models.tag_async import Tag
        print("✓ Tag model imported")
        
        from src.models.book_async import Book
        print("✓ Book model imported")
        
        from src.models.borrower_async import Borrower
        print("✓ Borrower model imported")
        
        from src.models.lending_record_async import LendingRecord
        print("✓ LendingRecord model imported")
        
        # Test basic schemas
        from src.schemas.user import UserCreate, UserResponse
        print("✓ User schemas imported")
        
        from src.schemas.category import CategoryCreate, CategoryResponse
        print("✓ Category schemas imported")
        
        # Test main app
        from src.main_fastapi import app
        print("✓ FastAPI app imported")
        
        print("\n🎉 All basic imports successful!")
        # Use assertion instead of return for pytest
        assert True
        
    except Exception as e:
        print(f"❌ Import failed: {e}")
        import traceback
        traceback.print_exc()
        assert False, f"Import failed: {e}"


if __name__ == "__main__":
    success = test_simple_imports()
    sys.exit(0 if success else 1)

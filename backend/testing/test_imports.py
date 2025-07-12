#!/usr/bin/env python3
"""
Test script to verify all imports work correctly
"""
import sys
import os

# Add the src directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

def test_imports():
    """Test importing all modules"""
    print("Testing imports...")
    
    try:
        # Test database connection
        print("1. Testing database connection...")
        from src.database_async import get_db, engine
        print("   ✓ Database imports successful")
        
        # Test models
        print("2. Testing model imports...")
        from src.models import (
            User, Book, Borrower, LendingRecord, 
            Category, Tag, BookPreviewImage, UserFavorite, book_tags
        )
        print("   ✓ All models imported successfully")
        
        # Test schemas
        print("3. Testing schema imports...")
        from src.schemas.user import UserCreate, UserResponse, UserLogin, Token
        from src.schemas.book import BookCreate, BookResponse, BookUpdate
        from src.schemas.borrower import BorrowerCreate, BorrowerResponse
        from src.schemas.lending_record import LendingRecordCreate, LendingRecordResponse
        from src.schemas.category import CategoryCreate, CategoryResponse
        from src.schemas.tag import TagCreate, TagResponse
        from src.schemas.user_favorite import UserFavoriteCreate, UserFavoriteResponse
        print("   ✓ All schemas imported successfully")
        
        # Test dependencies
        print("4. Testing dependencies...")
        from src.dependencies.auth import get_current_user, create_access_token
        print("   ✓ Auth dependencies imported successfully")
        
        # Test main FastAPI app
        print("5. Testing FastAPI app...")
        from src.main_fastapi import app
        print("   ✓ FastAPI app imported successfully")
        
        print("\n🎉 All imports successful! Your backend is ready to run.")
        # Use assertion instead of return for pytest
        assert True
        
    except ImportError as e:
        print(f"   ❌ Import error: {e}")
        assert False, "Import test failed"
    except Exception as e:
        print(f"   ❌ Unexpected error: {e}")
        assert False, f"Unexpected error: {e}"

if __name__ == "__main__":
    success = test_imports()
    sys.exit(0 if success else 1)
"""
Model loader for Alembic migrations
This file helps resolve import issues when running Alembic commands
"""
import sys
import os

# Add src directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
src_dir = os.path.join(current_dir, '..', 'src')
sys.path.insert(0, src_dir)

# Import database base first
from database_async import Base

# Import all models directly to avoid relative import issues
try:
    # Import models one by one with absolute paths
    sys.path.insert(0, os.path.join(src_dir, 'models'))
    
    # Define model classes directly to avoid import issues
    from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, SmallInteger, Table, Boolean
    from sqlalchemy.orm import relationship
    from sqlalchemy.sql import func
    
    # User model
    class User(Base):
        __tablename__ = "users"
        id = Column(Integer, primary_key=True, index=True)
        username = Column(String(50), unique=True, nullable=False, index=True)
        email = Column(String(100), unique=True, nullable=False, index=True)
        hashed_password = Column(String(100), nullable=False)
        role = Column(String(20), nullable=False, default="user")
        comments = Column(Text)
        created_at = Column(DateTime, default=func.current_timestamp())
        updated_at = Column(DateTime, default=func.current_timestamp())
    
    # Category model
    class Category(Base):
        __tablename__ = "categories"
        id = Column(Integer, primary_key=True, index=True)
        name = Column(String(100), nullable=False, index=True)
        description = Column(Text)
        parent_id = Column(Integer, ForeignKey("categories.id"))
        created_at = Column(DateTime, default=func.current_timestamp())
        updated_at = Column(DateTime, default=func.current_timestamp())
    
    # Tag model
    class Tag(Base):
        __tablename__ = "tags"
        id = Column(Integer, primary_key=True, index=True)
        name = Column(String(100), nullable=False, index=True)
        name_bn = Column(Text)
        created_at = Column(DateTime, default=func.current_timestamp())
    
    # Book-Tag association table
    book_tags = Table(
        'book_tags',
        Base.metadata,
        Column('book_id', Integer, ForeignKey('books.id'), primary_key=True),
        Column('tag_id', Integer, ForeignKey('tags.id'), primary_key=True)
    )
    
    # Book model
    class Book(Base):
        __tablename__ = "books"
        id = Column(Integer, primary_key=True, index=True)
        title = Column(String(255), nullable=False, index=True)
        title_bn = Column(Text)
        author = Column(String(255), nullable=False, index=True)
        author_bn = Column(Text)
        isbn = Column(String(20), unique=True, index=True)
        genre = Column(String(100))
        publication_year = Column(Integer)
        description = Column(Text)
        description_bn = Column(Text)
        read_status = Column(String(50), default="unread")
        rating = Column(SmallInteger)
        room = Column(String(100))
        shelf = Column(String(100))
        column_location = Column(String(100))
        row_location = Column(String(100))
        location_comment = Column(Text)
        publisher = Column(String(200))
        publisher_bn = Column(Text)
        language = Column(String(50), default="English")
        page_count = Column(Integer)
        category_id = Column(Integer, ForeignKey("categories.id"))
        cover_image = Column(String(255))
        total_copies = Column(Integer, default=1)
        available_copies = Column(Integer, default=1)
        comments = Column(Text)
        created_at = Column(DateTime, default=func.current_timestamp())
        updated_at = Column(DateTime, default=func.current_timestamp())
    
    # Borrower model
    class Borrower(Base):
        __tablename__ = "borrowers"
        id = Column(Integer, primary_key=True, index=True)
        first_name = Column(String(100), nullable=False, index=True)
        first_name_bn = Column(Text)
        last_name = Column(String(100), nullable=False, index=True)
        last_name_bn = Column(Text)
        email = Column(String(100), unique=True, index=True)
        phone = Column(String(20))
        address = Column(Text)
        address_bn = Column(Text)
        relationship = Column(String(100))
        current_books_count = Column(Integer, default=0)
        comments = Column(Text)
        created_at = Column(DateTime, default=func.current_timestamp())
        updated_at = Column(DateTime, default=func.current_timestamp())
    
    # Lending Record model
    class LendingRecord(Base):
        __tablename__ = "lending_records"
        id = Column(Integer, primary_key=True, index=True)
        book_id = Column(Integer, ForeignKey("books.id"))
        borrower_id = Column(Integer, ForeignKey("borrowers.id"))
        checkout_date = Column(DateTime, default=func.current_timestamp())
        due_date = Column(DateTime, nullable=False)
        return_date = Column(DateTime)
        status = Column(String(20), default="borrowed")
        notes = Column(Text)
        created_at = Column(DateTime, default=func.current_timestamp())
        updated_at = Column(DateTime, default=func.current_timestamp())
    
    # Book Preview Image model
    class BookPreviewImage(Base):
        __tablename__ = "book_preview_images"
        id = Column(Integer, primary_key=True, index=True)
        book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
        image_path = Column(String(255), nullable=False)
        caption = Column(Text)
        display_order = Column(Integer, default=0)
        created_at = Column(DateTime, default=func.current_timestamp())
    
    # User Favorite model
    class UserFavorite(Base):
        __tablename__ = "user_favorites"
        user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
        book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
        created_at = Column(DateTime, default=func.current_timestamp())
    
    print("✓ All models defined successfully for Alembic")
    
except Exception as e:
    print(f"✗ Error defining models: {e}")
    raise

# Export the metadata for Alembic
target_metadata = Base.metadata

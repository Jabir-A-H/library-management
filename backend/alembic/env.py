"""
Alembic environment configuration for library management system
Clean implementation without import issues
"""
import asyncio
import os
import sys
from logging.config import fileConfig
from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import create_async_engine
from alembic import context
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add src directory to Python path for proper imports
current_dir = os.path.dirname(os.path.abspath(__file__))
src_dir = os.path.join(current_dir, '..', 'src')
sys.path.insert(0, src_dir)

# Import database configuration
try:
    from database_async import Base
    
    # Import all models to register them with SQLAlchemy metadata
    # We'll import them directly to avoid relative import issues
    from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, SmallInteger, Table
    from sqlalchemy.sql import func
    
    # Define models inline to avoid import issues - matches your exact database schema
    class User(Base):
        __tablename__ = "users"
        id = Column(Integer, primary_key=True, index=True)
        username = Column(String(50), unique=True, nullable=False, index=True)
        email = Column(String(100), unique=True, nullable=False, index=True)
        hashed_password = Column(String(100), nullable=False)  # Note: using hashed_password not password_hash
        role = Column(String(20), nullable=False, default="user")
        comments = Column(Text)
        created_at = Column(DateTime, default=func.current_timestamp())
        updated_at = Column(DateTime, default=func.current_timestamp())

    class Category(Base):
        __tablename__ = "categories"
        id = Column(Integer, primary_key=True, index=True)
        name = Column(String(100), nullable=False, index=True)
        description = Column(Text)
        parent_id = Column(Integer, ForeignKey("categories.id"))
        created_at = Column(DateTime, default=func.current_timestamp())
        updated_at = Column(DateTime, default=func.current_timestamp())

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
        total_copies = Column(Integer, default=1)  # Note: using total_copies not quantity
        available_copies = Column(Integer, default=1)
        comments = Column(Text)
        created_at = Column(DateTime, default=func.current_timestamp())
        updated_at = Column(DateTime, default=func.current_timestamp())

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

    class LendingRecord(Base):
        __tablename__ = "lending_records"
        id = Column(Integer, primary_key=True, index=True)
        book_id = Column(Integer, ForeignKey("books.id"))
        borrower_id = Column(Integer, ForeignKey("borrowers.id"))
        checkout_date = Column(DateTime, default=func.current_timestamp())  # Note: using checkout_date not issue_date
        due_date = Column(DateTime, nullable=False)
        return_date = Column(DateTime)
        status = Column(String(20), default="borrowed")
        notes = Column(Text)
        created_at = Column(DateTime, default=func.current_timestamp())
        updated_at = Column(DateTime, default=func.current_timestamp())

    class BookPreviewImage(Base):
        __tablename__ = "book_preview_images"
        id = Column(Integer, primary_key=True, index=True)
        book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
        image_path = Column(String(255), nullable=False)
        caption = Column(Text)
        display_order = Column(Integer, default=0)
        created_at = Column(DateTime, default=func.current_timestamp())

    class UserFavorite(Base):
        __tablename__ = "user_favorites"
        user_id = Column(Integer, ForeignKey("users.id"), nullable=False, primary_key=True)
        book_id = Column(Integer, ForeignKey("books.id"), nullable=False, primary_key=True)
        created_at = Column(DateTime, default=func.current_timestamp())

    print("✓ All models loaded successfully for Alembic")
    
except Exception as e:
    print(f"✗ Error loading models: {e}")
    # Create a minimal Base if import fails
    from sqlalchemy.ext.declarative import declarative_base
    Base = declarative_base()

# Alembic Config object
config = context.config

# Interpret the config file for Python logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Set the target metadata for autogenerate support
target_metadata = Base.metadata

def get_database_url():
    """Get database URL from environment variables."""
    return os.getenv(
        "DATABASE_URL", 
        "postgresql+asyncpg://postgres:postgressadmin@localhost:5432/library_db"
    )

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = get_database_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def do_run_migrations(connection: Connection) -> None:
    """Run migrations with database connection."""
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()

async def run_async_migrations() -> None:
    """Run migrations in async mode."""
    connectable = create_async_engine(
        get_database_url(),
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()

def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    asyncio.run(run_async_migrations())

# Determine which mode to run migrations in
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

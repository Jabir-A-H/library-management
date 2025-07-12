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

# Add src directory to path for imports
src_path = os.path.join(os.path.dirname(__file__), '..', 'src')
sys.path.insert(0, src_path)

# Import the database configuration
import database_async

# Set target metadata from Base
target_metadata = database_async.Base.metadata

# Import all models to ensure they are registered with SQLAlchemy
try:
    import models.user_async  # noqa: F401
    import models.book_async  # noqa: F401
    import models.borrower_async  # noqa: F401
    import models.lending_record_async  # noqa: F401
    import models.category_async  # noqa: F401
    import models.tag_async  # noqa: F401
    import models.book_tag_async  # noqa: F401
    import models.book_preview_image_async  # noqa: F401
    import models.user_favorite_async  # noqa: F401
except ImportError as e:
    print(f"Warning: Could not import some models: {e}")
    # Continue anyway, models might be imported elsewhere

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)


def get_database_url():
    """Get database URL from environment variables."""
    return os.getenv(
        "DATABASE_URL", 
        "postgresql+asyncpg://username:password@localhost:5432/library_catalog"
    )


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
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
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    """In this scenario we need to create an Engine
    and associate a connection with the context.

    """
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


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

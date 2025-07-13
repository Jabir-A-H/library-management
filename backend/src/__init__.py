"""
ছোটপাতা পাঠাগার Library Management System - Backend Package

This package contains the backend implementation of the library management
system, including FastAPI routes, SQLAlchemy models, Pydantic schemas, and
database utilities.

Main Components:
- main_fastapi.py: FastAPI application factory and configuration
- models/: SQLAlchemy database models
- schemas/: Pydantic validation schemas
- routes/: FastAPI route handlers
- database/: Database configuration and utilities
- utils/: Utility functions and helpers

Usage:
    from src.main_fastapi import app  # Import FastAPI application
    from src.models import Book, Borrower, User  # Import models
    from src.schemas import BookCreate, BorrowerCreate  # Import schemas
"""

__version__ = "1.0.0"
__author__ = "ছোটপাতা পাঠাগার Development Team"
__description__ = "Library Management System Backend"

# Import main application for easy access
from .main_fastapi import app, create_app

__all__ = ["app", "create_app", "__version__", "__author__", "__description__"]

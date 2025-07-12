# Import all models to ensure they are registered with SQLAlchemy
from .user_async import User
from .book_async import Book
from .borrower_async import Borrower
from .lending_record_async import LendingRecord
from .category_async import Category
from .tag_async import Tag
from .book_tag_async import book_tags
from .book_preview_image_async import BookPreviewImage
from .user_favorite_async import UserFavorite

# Export all models
__all__ = [
    "User",
    "Book", 
    "Borrower",
    "LendingRecord",
    "Category",
    "Tag",
    "book_tags",
    "BookPreviewImage",
    "UserFavorite"
]

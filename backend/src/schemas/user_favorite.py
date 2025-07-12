"""
User Favorite schemas for API r# User's favorite books response
class UserFavoriteBooksResponse(BaseModel):
    user_id: int
    username: str
    favorite_books: List[dict]
    total_favorites: int

# Book's favorited by users response
class BookFavoritedByResponse(BaseModel):
    book_id: int
    book_title: str
    favorited_by: List[dict]
    total_favorites: int

# Forward references removed to avoid circular importses
"""
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field

# Base schema
class UserFavoriteBase(BaseModel):
    user_id: int = Field(..., description="User ID")
    book_id: int = Field(..., description="Book ID")

# Create schema
class UserFavoriteCreate(UserFavoriteBase):
    pass

# Response schema
class UserFavoriteResponse(UserFavoriteBase):
    id: int
    created_at: Optional[datetime]
    
    # Nested relationships - using simple dict to avoid circular imports
    book: Optional[dict] = None
    user: Optional[dict] = None

    class Config:
        from_attributes = True

# List response schema
class UserFavoriteListResponse(BaseModel):
    favorites: List[UserFavoriteResponse]
    total: int
    page: int
    size: int
    pages: int

# User's favorite books response
class UserFavoriteBooksResponse(BaseModel):
    user_id: int
    username: str
    favorite_books: List[dict]
    total_favorites: int

# Book's favorited by users response
class BookFavoritedByResponse(BaseModel):
    book_id: int
    book_title: str
    favorited_by: List[dict]
    total_favorites: int

# Forward references removed to avoid circular imports

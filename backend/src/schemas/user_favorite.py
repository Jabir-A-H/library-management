"""
User Favorite schemas for API requests and responses - Updated to match existing database schema

This module provides Pydantic schemas for handling user favorite books functionality:
- UserFavorite models for CRUD operations
- Response schemas with nested relationships
- Pagination support for favorite lists
- Aggregated responses for user/book statistics

The schemas ensure type safety and data validation for all user favorite operations
while maintaining compatibility with the SQLAlchemy UserFavorite model.
"""
from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, field_validator

# Base schema for user favorites
class UserFavoriteBase(BaseModel):
    """Base schema for user favorite operations"""
    user_id: int = Field(
        ...,
        description="ID of the user who favorited the book",
        gt=0
    )
    book_id: int = Field(
        ...,
        description="ID of the favorited book",
        gt=0
    )

# Create schema for adding new favorites
class UserFavoriteCreate(UserFavoriteBase):
    """Schema for creating a new user favorite"""
    pass

# Update schema (minimal - favorites are mostly create/delete operations)
class UserFavoriteUpdate(BaseModel):
    """Schema for updating user favorite (limited operations)"""
    # Most favorite operations are create/delete, but keeping for consistency
    pass

# Core response schema
class UserFavoriteResponse(UserFavoriteBase):
    """Complete user favorite response with all fields and relationships"""
    id: int = Field(..., description="Unique identifier for the favorite")
    created_at: Optional[datetime] = Field(
        None,
        description="When the favorite was created"
    )
    
    # Nested relationships - using detailed schemas to avoid circular imports
    book: Optional[Dict[str, Any]] = Field(
        None,
        description="Basic book information"
    )
    user: Optional[Dict[str, Any]] = Field(
        None,
        description="Basic user information"
    )

    class Config:
        from_attributes = True

# Simplified response for performance-critical endpoints
class UserFavoriteSimpleResponse(BaseModel):
    """Lightweight user favorite response without nested relationships"""
    id: int
    user_id: int
    book_id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Paginated list response
class UserFavoriteListResponse(BaseModel):
    """Paginated response for user favorite lists"""
    favorites: List[UserFavoriteResponse] = Field(
        ...,
        description="List of user favorites"
    )
    total: int = Field(..., description="Total number of favorites", ge=0)
    page: int = Field(..., description="Current page number", ge=1)
    size: int = Field(
        ...,
        description="Number of items per page",
        ge=1,
        le=100
    )
    pages: int = Field(..., description="Total number of pages", ge=0)

    @field_validator('pages')
    @classmethod
    def validate_pages_consistency(cls, v, info):
        """Ensure pages calculation is consistent with total and size"""
        if 'total' in info.data and 'size' in info.data:
            expected_pages = (info.data['total'] + info.data['size'] - 1) // info.data['size'] if info.data['total'] > 0 else 0
            if v != expected_pages:
                raise ValueError(f'Pages value {v} is inconsistent with total {info.data["total"]} and size {info.data["size"]}')
        return v

# User's favorite books aggregated response
class UserFavoriteBooksResponse(BaseModel):
    """Aggregated response showing all books favorited by a specific user"""
    user_id: int = Field(..., description="ID of the user", gt=0)
    username: str = Field(..., description="Username of the user", min_length=1, max_length=50)
    favorite_books: List[Dict[str, Any]] = Field(..., description="List of favorited books with details")
    total_favorites: int = Field(..., description="Total number of books favorited by this user", ge=0)
    
    # Additional user statistics
    recent_favorites: Optional[List[Dict[str, Any]]] = Field(None, description="Recently favorited books (last 5)")
    favorite_genres: Optional[List[Dict[str, Any]]] = Field(None, description="Most favorited genres with counts")

# Book's favorited by users aggregated response
class BookFavoritedByResponse(BaseModel):
    """Aggregated response showing all users who favorited a specific book"""
    book_id: int = Field(..., description="ID of the book", gt=0)
    book_title: str = Field(..., description="Title of the book", min_length=1, max_length=255)
    book_author: Optional[str] = Field(None, description="Author of the book", max_length=255)
    favorited_by: List[Dict[str, Any]] = Field(..., description="List of users who favorited this book")
    total_favorites: int = Field(..., description="Total number of users who favorited this book", ge=0)
    
    # Additional book statistics
    recent_favorites: Optional[List[Dict[str, Any]]] = Field(None, description="Recent users who favorited (last 5)")
    popularity_rank: Optional[int] = Field(None, description="Popularity rank among all books", ge=1)

# Search/filter schema for user favorites
class UserFavoriteSearchFilters(BaseModel):
    """Search and filter options for user favorites"""
    user_id: Optional[int] = Field(None, description="Filter by specific user ID", gt=0)
    book_id: Optional[int] = Field(None, description="Filter by specific book ID", gt=0)
    genre: Optional[str] = Field(None, description="Filter by book genre", max_length=100)
    author: Optional[str] = Field(None, description="Filter by book author", max_length=255)
    created_after: Optional[datetime] = Field(None, description="Filter favorites created after this date")
    created_before: Optional[datetime] = Field(None, description="Filter favorites created before this date")
    
    @field_validator('created_before')
    @classmethod
    def validate_date_range(cls, v, info):
        """Ensure created_before is after created_after if both are provided"""
        if v and 'created_after' in info.data and info.data['created_after']:
            if v <= info.data['created_after']:
                raise ValueError('created_before must be after created_after')
        return v

# Statistics schema for admin dashboards
class UserFavoriteStatistics(BaseModel):
    """Statistical information about user favorites"""
    total_favorites: int = Field(..., description="Total number of favorites in the system", ge=0)
    unique_users: int = Field(..., description="Number of unique users who have favorites", ge=0)
    unique_books: int = Field(..., description="Number of unique books that are favorited", ge=0)
    average_favorites_per_user: float = Field(..., description="Average number of favorites per user", ge=0)
    most_favorited_books: List[Dict[str, Any]] = Field(..., description="Top 10 most favorited books")
    most_active_users: List[Dict[str, Any]] = Field(..., description="Top 10 users with most favorites")
    daily_favorites_trend: Optional[List[Dict[str, Any]]] = Field(None, description="Daily favorites count for the last 30 days")

# Bulk operations schema
class UserFavoriteBulkCreate(BaseModel):
    """Schema for bulk creating user favorites"""
    favorites: List[UserFavoriteCreate] = Field(..., description="List of favorites to create", min_length=1, max_length=100)
    
    @field_validator('favorites')
    @classmethod
    def validate_unique_combinations(cls, v):
        """Ensure no duplicate user_id, book_id combinations in the bulk request"""
        seen = set()
        for favorite in v:
            combo = (favorite.user_id, favorite.book_id)
            if combo in seen:
                raise ValueError(f'Duplicate user_id ({favorite.user_id}) and book_id ({favorite.book_id}) combination found')
            seen.add(combo)
        return v

class UserFavoriteBulkCreateResponse(BaseModel):
    """Response for bulk create operations"""
    created: List[UserFavoriteResponse] = Field(..., description="Successfully created favorites")
    failed: List[Dict[str, Any]] = Field(..., description="Failed creations with error details")
    total_requested: int = Field(..., description="Total number of favorites requested", ge=0)
    total_created: int = Field(..., description="Total number of favorites successfully created", ge=0)
    total_failed: int = Field(..., description="Total number of failed creations", ge=0)

# Toggle favorite schema for frontend convenience
class UserFavoriteToggle(BaseModel):
    """Schema for toggling favorite status (add if not exists, remove if exists)"""
    user_id: int = Field(..., description="ID of the user", gt=0)
    book_id: int = Field(..., description="ID of the book", gt=0)

class UserFavoriteToggleResponse(BaseModel):
    """Response for favorite toggle operations"""
    user_id: int = Field(..., description="ID of the user")
    book_id: int = Field(..., description="ID of the book")
    action: str = Field(..., description="Action performed: 'added' or 'removed'")
    favorite: Optional[UserFavoriteResponse] = Field(None, description="Favorite object if added, None if removed")
    is_favorited: bool = Field(..., description="Current favorite status after the operation")

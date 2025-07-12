"""
Book schemas for API requests and responses - Updated to match existing database schema
"""
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field, validator

# Base schema matching your database structure
class BookBase(BaseModel):
    title: str = Field(..., max_length=255, description="Book title")
    title_bn: Optional[str] = Field(None, description="Book title in Bengali")
    author: str = Field(..., max_length=255, description="Book author")
    author_bn: Optional[str] = Field(None, description="Book author in Bengali")
    isbn: Optional[str] = Field(None, max_length=20, description="ISBN number")
    genre: Optional[str] = Field(None, max_length=100, description="Book genre")
    publication_year: Optional[int] = Field(None, ge=1000, le=9999, description="Publication year")
    description: Optional[str] = Field(None, description="Book description")
    description_bn: Optional[str] = Field(None, description="Book description in Bengali")
    read_status: Optional[str] = Field("unread", max_length=50, description="Reading status")
    rating: Optional[int] = Field(None, ge=1, le=5, description="Book rating (1-5)")
    room: Optional[str] = Field(None, max_length=100, description="Room location")
    shelf: Optional[str] = Field(None, max_length=100, description="Shelf location")
    column_location: Optional[str] = Field(None, max_length=100, description="Column location")
    row_location: Optional[str] = Field(None, max_length=100, description="Row location")
    location_comment: Optional[str] = Field(None, description="Additional location notes")
    publisher: Optional[str] = Field(None, max_length=200, description="Publisher name")
    publisher_bn: Optional[str] = Field(None, description="Publisher name in Bengali")
    language: Optional[str] = Field("English", max_length=50, description="Book language")
    page_count: Optional[int] = Field(None, ge=1, description="Number of pages")
    category_id: Optional[int] = Field(None, description="Category ID")
    cover_image: Optional[str] = Field(None, max_length=255, description="Cover image path")
    total_copies: Optional[int] = Field(1, ge=1, description="Total copies")
    available_copies: Optional[int] = Field(1, ge=0, description="Available copies")
    comments: Optional[str] = Field(None, description="Additional comments")

    @validator('available_copies')
    def validate_available_copies(cls, v, values):
        if 'total_copies' in values and v is not None and values['total_copies'] is not None:
            if v > values['total_copies']:
                raise ValueError('Available copies cannot exceed total copies')
        return v

# Create schema
class BookCreate(BookBase):
    pass

# Update schema
class BookUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    title_bn: Optional[str] = None
    author: Optional[str] = Field(None, max_length=255)
    author_bn: Optional[str] = None
    isbn: Optional[str] = Field(None, max_length=20)
    genre: Optional[str] = Field(None, max_length=100)
    publication_year: Optional[int] = Field(None, ge=1000, le=9999)
    description: Optional[str] = None
    description_bn: Optional[str] = None
    read_status: Optional[str] = Field(None, max_length=50)
    rating: Optional[int] = Field(None, ge=1, le=5)
    room: Optional[str] = Field(None, max_length=100)
    shelf: Optional[str] = Field(None, max_length=100)
    column_location: Optional[str] = Field(None, max_length=100)
    row_location: Optional[str] = Field(None, max_length=100)
    location_comment: Optional[str] = None
    publisher: Optional[str] = Field(None, max_length=200)
    publisher_bn: Optional[str] = None
    language: Optional[str] = Field(None, max_length=50)
    page_count: Optional[int] = Field(None, ge=1)
    category_id: Optional[int] = None
    cover_image: Optional[str] = Field(None, max_length=255)
    total_copies: Optional[int] = Field(None, ge=1)
    available_copies: Optional[int] = Field(None, ge=0)
    comments: Optional[str] = None

# Response schema with computed fields
class BookResponse(BookBase):
    id: int
    is_available: bool
    borrowed_count: int
    full_location: str
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    
    # Nested relationships
    category: Optional['CategoryResponse'] = None
    tags: List['TagResponse'] = []

    class Config:
        from_attributes = True

# List response schema
class BookListResponse(BaseModel):
    books: List[BookResponse]
    total: int
    page: int
    size: int
    pages: int

# Availability response schema
class BookAvailabilityResponse(BaseModel):
    book_id: int
    title: str
    is_available: bool
    available_copies: int
    total_copies: int

# Forward references for nested models
from .category import CategoryResponse
from .tag import TagResponse

BookResponse.model_rebuild()

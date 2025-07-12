"""
Book schemas for API requests and responses
"""
from typing import Optional, List
from datetime import date, datetime
from decimal import Decimal
from pydantic import BaseModel, Field, validator

# Base schema
class BookBase(BaseModel):
    title: str = Field(..., max_length=200, description="Book title")
    author: str = Field(..., max_length=200, description="Book author")
    isbn: Optional[str] = Field(None, max_length=20, description="ISBN number")
    publisher: Optional[str] = Field(None, max_length=200, description="Publisher name")
    publication_year: Optional[int] = Field(None, ge=1000, le=9999, description="Publication year")
    genre: Optional[str] = Field(None, max_length=100, description="Book genre")
    language: Optional[str] = Field("English", max_length=50, description="Book language")
    pages: Optional[int] = Field(None, ge=1, description="Number of pages")
    description: Optional[str] = Field(None, description="Book description")
    location: Optional[str] = Field(None, max_length=100, description="Physical location")
    quantity: Optional[int] = Field(1, ge=1, description="Total quantity")
    available_quantity: Optional[int] = Field(1, ge=0, description="Available quantity")
    price: Optional[Decimal] = Field(None, ge=0, description="Book price")
    acquisition_date: Optional[date] = Field(None, description="Date acquired")
    condition: Optional[str] = Field("Good", max_length=50, description="Book condition")
    notes: Optional[str] = Field(None, description="Additional notes")
    category_id: Optional[int] = Field(None, description="Category ID")

    @validator('available_quantity')
    def validate_available_quantity(cls, v, values):
        if 'quantity' in values and v is not None and values['quantity'] is not None:
            if v > values['quantity']:
                raise ValueError('Available quantity cannot exceed total quantity')
        return v

# Create schema
class BookCreate(BookBase):
    pass

# Update schema
class BookUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    author: Optional[str] = Field(None, max_length=200)
    isbn: Optional[str] = Field(None, max_length=20)
    publisher: Optional[str] = Field(None, max_length=200)
    publication_year: Optional[int] = Field(None, ge=1000, le=9999)
    genre: Optional[str] = Field(None, max_length=100)
    language: Optional[str] = Field(None, max_length=50)
    pages: Optional[int] = Field(None, ge=1)
    description: Optional[str] = None
    location: Optional[str] = Field(None, max_length=100)
    quantity: Optional[int] = Field(None, ge=1)
    available_quantity: Optional[int] = Field(None, ge=0)
    price: Optional[Decimal] = Field(None, ge=0)
    acquisition_date: Optional[date] = None
    condition: Optional[str] = Field(None, max_length=50)
    notes: Optional[str] = None
    category_id: Optional[int] = None

# Response schemas
class CategoryResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

    class Config:
        from_attributes = True

class TagResponse(BaseModel):
    id: int
    name: str
    color: Optional[str] = None

    class Config:
        from_attributes = True

class BookResponse(BaseModel):
    id: int
    title: str
    author: str
    isbn: Optional[str] = None
    publisher: Optional[str] = None
    publication_year: Optional[int] = None
    genre: Optional[str] = None
    language: Optional[str] = None
    pages: Optional[int] = None
    description: Optional[str] = None
    location: Optional[str] = None
    quantity: Optional[int] = None
    available_quantity: Optional[int] = None
    borrowed_count: Optional[int] = None
    price: Optional[float] = None
    acquisition_date: Optional[date] = None
    condition: Optional[str] = None
    notes: Optional[str] = None
    category_id: Optional[int] = None
    category: Optional[CategoryResponse] = None
    tags: Optional[List[TagResponse]] = []
    is_available: Optional[bool] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class BookListResponse(BaseModel):
    books: List[BookResponse]
    total: int
    page: int
    size: int
    pages: int

class BookAvailabilityResponse(BaseModel):
    book_id: int
    title: str
    is_available: bool
    available_quantity: int
    total_quantity: int

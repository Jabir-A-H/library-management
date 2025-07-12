"""
Category schemas for API requests and responses
"""
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field

# Base schema
class CategoryBase(BaseModel):
    name: str = Field(..., max_length=100, description="Category name")
    description: Optional[str] = Field(None, description="Category description")

# Create schema
class CategoryCreate(CategoryBase):
    pass

# Update schema
class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = None

# Response schema
class CategoryResponse(CategoryBase):
    id: int
    book_count: int
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

# List response schema
class CategoryListResponse(BaseModel):
    categories: List[CategoryResponse]
    total: int
    page: int
    size: int
    pages: int

# Summary response schema (for nested responses)
class CategorySummaryResponse(BaseModel):
    id: int
    name: str
    book_count: int

    class Config:
        from_attributes = True

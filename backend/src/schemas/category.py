"""
Category schemas for API requests and responses
"""
from typing import Optional
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
class CategoryResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    book_count: Optional[int] = 0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# List response schema
class CategoryListResponse(BaseModel):
    categories: list[CategoryResponse]
    total: int

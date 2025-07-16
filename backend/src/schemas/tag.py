"""
Tag schemas for API requests and responses
"""
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field

# Base schema

class TagBase(BaseModel):
    name: str = Field(..., max_length=50, description="Tag name")
    color: Optional[str] = Field(
        "#007bff",
        max_length=7,
        description="Tag color (hex code)"
    )

# Create schema

class TagCreate(TagBase):
    pass

# Update schema

class TagUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=50)
    color: Optional[str] = Field(None, max_length=7)

# Response schema

class TagResponse(TagBase):
    id: int
    book_count: int
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

# List response schema

class TagListResponse(BaseModel):
    tags: List[TagResponse]
    total: int
    page: int
    size: int
    pages: int

# Summary response schema (for nested responses)
class TagSummaryResponse(BaseModel):
    id: int
    name: str
    color: str

    class Config:
        from_attributes = True

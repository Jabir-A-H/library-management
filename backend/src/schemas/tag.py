"""
Tag schemas for API requests and responses
"""
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field

# Base schema
class TagBase(BaseModel):
    name: str = Field(..., max_length=50, description="Tag name")
    color: Optional[str] = Field("#3B82F6", max_length=7, description="Tag color (hex)")

# Create schema
class TagCreate(TagBase):
    pass

# Update schema
class TagUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=50)
    color: Optional[str] = Field(None, max_length=7)

# Response schema
class TagResponse(BaseModel):
    id: int
    name: str
    color: Optional[str] = None
    book_count: Optional[int] = 0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# List response schema
class TagListResponse(BaseModel):
    tags: list[TagResponse]
    total: int

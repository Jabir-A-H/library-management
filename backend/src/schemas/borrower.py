"""
Borrower schemas for API requests and responses
"""
from typing import Optional
from datetime import date, datetime
from pydantic import BaseModel, Field, EmailStr

# Base schema
class BorrowerBase(BaseModel):
    name: str = Field(..., max_length=100, description="Borrower name")
    email: Optional[EmailStr] = Field(None, description="Email address")
    phone: Optional[str] = Field(None, max_length=20, description="Phone number")
    address: Optional[str] = Field(None, description="Address")
    membership_number: Optional[str] = Field(None, max_length=50, description="Membership number")
    membership_type: Optional[str] = Field("Standard", max_length=50, description="Membership type")
    registration_date: Optional[date] = Field(None, description="Registration date")
    is_active: Optional[bool] = Field(True, description="Active status")
    notes: Optional[str] = Field(None, description="Additional notes")

# Create schema
class BorrowerCreate(BorrowerBase):
    pass

# Update schema
class BorrowerUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=20)
    address: Optional[str] = None
    membership_number: Optional[str] = Field(None, max_length=50)
    membership_type: Optional[str] = Field(None, max_length=50)
    registration_date: Optional[date] = None
    is_active: Optional[bool] = None
    notes: Optional[str] = None

# Response schema
class BorrowerResponse(BaseModel):
    id: int
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    membership_number: Optional[str] = None
    membership_type: Optional[str] = None
    registration_date: Optional[date] = None
    is_active: Optional[bool] = None
    notes: Optional[str] = None
    active_loans_count: Optional[int] = 0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# List response schema
class BorrowerListResponse(BaseModel):
    borrowers: list[BorrowerResponse]
    total: int
    page: int
    size: int
    pages: int

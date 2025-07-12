"""
Borrower schemas for API requests and responses - Updated to match existing database schema
"""
from typing import Optional, List
from datetime import datetime, date
from pydantic import BaseModel, Field, EmailStr, validator

# Base schema matching your database structure
class BorrowerBase(BaseModel):
    first_name: str = Field(..., max_length=100, description="First name")
    last_name: str = Field(..., max_length=100, description="Last name")
    email: Optional[EmailStr] = Field(None, description="Email address")
    phone: Optional[str] = Field(None, max_length=20, description="Phone number")
    address: Optional[str] = Field(None, description="Address")
    membership_type: Optional[str] = Field("regular", max_length=50, description="Membership type")
    membership_date: Optional[date] = Field(None, description="Membership start date")
    is_active: bool = Field(True, description="Active status")
    comments: Optional[str] = Field(None, description="Additional comments")

    @validator('phone')
    def validate_phone(cls, v):
        if v and not v.replace('+', '').replace('-', '').replace(' ', '').isdigit():
            raise ValueError('Invalid phone number format')
        return v

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"

# Create schema
class BorrowerCreate(BorrowerBase):
    pass

# Update schema
class BorrowerUpdate(BaseModel):
    first_name: Optional[str] = Field(None, max_length=100)
    last_name: Optional[str] = Field(None, max_length=100)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=20)
    address: Optional[str] = None
    membership_type: Optional[str] = Field(None, max_length=50)
    membership_date: Optional[date] = None
    is_active: Optional[bool] = None
    comments: Optional[str] = None

# Response schema with computed fields
class BorrowerResponse(BorrowerBase):
    id: int
    full_name: str
    total_borrowed: int
    current_borrowed: int
    overdue_books: int
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    
    # Related data
    current_lending_records: List['LendingRecordResponse'] = []
    favorites: List['UserFavoriteResponse'] = []

    class Config:
        from_attributes = True

# List response schema
class BorrowerListResponse(BaseModel):
    borrowers: List[BorrowerResponse]
    total: int
    page: int
    size: int
    pages: int

# Summary response schema
class BorrowerSummaryResponse(BaseModel):
    id: int
    full_name: str
    email: Optional[str]
    phone: Optional[str]
    membership_type: str
    is_active: bool
    total_borrowed: int
    current_borrowed: int

# Statistics response schema
class BorrowerStatsResponse(BaseModel):
    total_borrowers: int
    active_borrowers: int
    inactive_borrowers: int
    borrowers_with_overdue: int
    membership_types: dict

# Forward references for nested models
from .lending_record import LendingRecordResponse
from .user_favorite import UserFavoriteResponse

BorrowerResponse.model_rebuild()

"""
Lending Record schemas for API requests and responses - Updated to match existing database schema
"""
from typing import Optional, List
from datetime import datetime, date
from pydantic import BaseModel, Field, validator

# Base schema matching your database structure
class LendingRecordBase(BaseModel):
    book_id: int = Field(..., description="Book ID")
    borrower_id: int = Field(..., description="Borrower ID")
    checkout_date: date = Field(..., description="Checkout date")
    due_date: date = Field(..., description="Due date")
    return_date: Optional[date] = Field(None, description="Return date")
    status: str = Field("checked_out", max_length=50, description="Lending status")
    fine_amount: Optional[float] = Field(0.0, ge=0, description="Fine amount")
    comments: Optional[str] = Field(None, description="Additional comments")

    @validator('due_date')
    def validate_due_date(cls, v, values):
        if 'checkout_date' in values and v <= values['checkout_date']:
            raise ValueError('Due date must be after checkout date')
        return v

    @validator('return_date')
    def validate_return_date(cls, v, values):
        if v and 'checkout_date' in values and v < values['checkout_date']:
            raise ValueError('Return date cannot be before checkout date')
        return v

# Create schema
class LendingRecordCreate(LendingRecordBase):
    pass

# Update schema
class LendingRecordUpdate(BaseModel):
    due_date: Optional[date] = None
    return_date: Optional[date] = None
    status: Optional[str] = Field(None, max_length=50)
    fine_amount: Optional[float] = Field(None, ge=0)
    comments: Optional[str] = None

# Return book schema
class BookReturn(BaseModel):
    return_date: Optional[date] = Field(default_factory=date.today)
    fine_amount: Optional[float] = Field(0.0, ge=0)
    comments: Optional[str] = None

# Renew book schema
class BookRenew(BaseModel):
    new_due_date: date = Field(..., description="New due date")
    comments: Optional[str] = None

    @validator('new_due_date')
    def validate_new_due_date(cls, v):
        if v <= date.today():
            raise ValueError('New due date must be in the future')
        return v

# Response schema with computed fields
class LendingRecordResponse(LendingRecordBase):
    id: int
    is_overdue: bool
    days_overdue: Optional[int]
    calculated_fine: float
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    
    # Nested relationships
    book: Optional['BookSummaryResponse'] = None
    borrower: Optional['BorrowerSummaryResponse'] = None

    class Config:
        from_attributes = True

# List response schema
class LendingRecordListResponse(BaseModel):
    lending_records: List[LendingRecordResponse]
    total: int
    page: int
    size: int
    pages: int

# Summary response schema
class LendingRecordSummaryResponse(BaseModel):
    id: int
    book_title: str
    borrower_name: str
    checkout_date: date
    due_date: date
    return_date: Optional[date]
    status: str
    is_overdue: bool
    fine_amount: float

# Statistics response schema
class LendingStatsResponse(BaseModel):
    total_records: int
    active_loans: int
    returned_books: int
    overdue_books: int
    total_fines: float
    average_loan_duration: float

# Overdue books response schema
class OverdueBooksResponse(BaseModel):
    overdue_records: List[LendingRecordResponse]
    total_overdue: int
    total_fine_amount: float

# Forward references for nested models
from .book import BookSummaryResponse
from .borrower import BorrowerSummaryResponse

LendingRecordResponse.model_rebuild()

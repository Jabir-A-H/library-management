"""
Lending Record schemas for API requests and responses
"""
from typing import Optional
from datetime import date, datetime
from decimal import Decimal
from pydantic import BaseModel, Field

# Base schema
class LendingRecordBase(BaseModel):
    book_id: int = Field(..., description="Book ID")
    borrower_id: int = Field(..., description="Borrower ID")
    issue_date: Optional[date] = Field(None, description="Issue date")
    due_date: date = Field(..., description="Due date")
    return_date: Optional[date] = Field(None, description="Return date")
    status: Optional[str] = Field("borrowed", max_length=20, description="Loan status")
    notes: Optional[str] = Field(None, description="Notes")
    fine_amount: Optional[Decimal] = Field(0.00, ge=0, description="Fine amount")
    fine_paid: Optional[bool] = Field(False, description="Fine paid status")

# Create schema
class LendingRecordCreate(LendingRecordBase):
    pass

# Update schema
class LendingRecordUpdate(BaseModel):
    due_date: Optional[date] = None
    return_date: Optional[date] = None
    status: Optional[str] = Field(None, max_length=20)
    notes: Optional[str] = None
    fine_amount: Optional[Decimal] = Field(None, ge=0)
    fine_paid: Optional[bool] = None

# Response schemas
class BookSummary(BaseModel):
    id: int
    title: str
    author: str
    isbn: Optional[str] = None

    class Config:
        from_attributes = True

class BorrowerSummary(BaseModel):
    id: int
    name: str
    email: Optional[str] = None
    membership_number: Optional[str] = None

    class Config:
        from_attributes = True

class LendingRecordResponse(BaseModel):
    id: int
    book_id: int
    borrower_id: int
    issue_date: Optional[date] = None
    due_date: Optional[date] = None
    return_date: Optional[date] = None
    status: Optional[str] = None
    notes: Optional[str] = None
    fine_amount: Optional[float] = None
    fine_paid: Optional[bool] = None
    is_overdue: Optional[bool] = None
    days_overdue: Optional[int] = None
    book: Optional[BookSummary] = None
    borrower: Optional[BorrowerSummary] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# List response schema
class LendingRecordListResponse(BaseModel):
    lending_records: list[LendingRecordResponse]
    total: int
    page: int
    size: int
    pages: int

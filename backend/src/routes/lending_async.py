"""
Lending routes for the FastAPI application
"""
from typing import Optional
from datetime import date, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_, update
from sqlalchemy.orm import selectinload
import math

from database_async import get_db
from models.lending_record_async import LendingRecord
from models.book_async import Book
from models.borrower_async import Borrower
from schemas.lending_record import (
    LendingRecordCreate, LendingRecordUpdate, 
    LendingRecordResponse, LendingRecordListResponse
)
from dependencies.auth import get_current_active_user

router = APIRouter()

@router.get("/", response_model=LendingRecordListResponse)
async def get_lending_records(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(10, ge=1, le=100, description="Number of records to return"),
    status_filter: Optional[str] = Query(None, description="Filter by status (borrowed, returned, overdue)"),
    book_id: Optional[int] = Query(None, description="Filter by book ID"),
    borrower_id: Optional[int] = Query(None, description="Filter by borrower ID"),
    overdue_only: bool = Query(False, description="Show only overdue records"),
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Get all lending records with pagination and filtering"""
    
    # Build query
    query = select(LendingRecord).options(
        selectinload(LendingRecord.book),
        selectinload(LendingRecord.borrower)
    )
    
    # Apply filters
    filters = []
    
    if status_filter:
        filters.append(LendingRecord.status == status_filter)
    
    if book_id:
        filters.append(LendingRecord.book_id == book_id)
    
    if borrower_id:
        filters.append(LendingRecord.borrower_id == borrower_id)
    
    if overdue_only:
        filters.append(and_(
            LendingRecord.status == "borrowed",
            LendingRecord.due_date < date.today()
        ))
    
    if filters:
        query = query.where(and_(*filters))
    
    # Get total count
    count_query = select(func.count(LendingRecord.id))
    if filters:
        count_query = count_query.where(and_(*filters))
    
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Apply pagination and ordering (newest first)
    query = query.order_by(LendingRecord.created_at.desc()).offset(skip).limit(limit)
    
    # Execute query
    result = await db.execute(query)
    lending_records = result.scalars().all()
    
    # Convert to response models
    record_responses = []
    for record in lending_records:
        record_dict = record.to_dict()
        record_responses.append(LendingRecordResponse.model_validate(record_dict))
    
    return LendingRecordListResponse(
        lending_records=record_responses,
        total=total,
        page=skip // limit + 1,
        size=limit,
        pages=math.ceil(total / limit) if total > 0 else 1
    )

@router.get("/{record_id}", response_model=LendingRecordResponse)
async def get_lending_record(
    record_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Get a specific lending record by ID"""
    
    query = select(LendingRecord).options(
        selectinload(LendingRecord.book),
        selectinload(LendingRecord.borrower)
    ).where(LendingRecord.id == record_id)
    
    result = await db.execute(query)
    record = result.scalar_one_or_none()
    
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lending record not found"
        )
    
    record_dict = record.to_dict()
    return LendingRecordResponse.model_validate(record_dict)

@router.post("/", response_model=LendingRecordResponse, status_code=status.HTTP_201_CREATED)
async def create_lending_record(
    record_data: LendingRecordCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Create a new lending record (Issue a book)"""
    
    # Check if book exists and is available
    book_result = await db.execute(select(Book).where(Book.id == record_data.book_id))
    book = book_result.scalar_one_or_none()
    
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book not found"
        )
    
    if not book.is_available:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Book is not available for lending"
        )
    
    # Check if borrower exists and is active
    borrower_result = await db.execute(
        select(Borrower).where(Borrower.id == record_data.borrower_id)
    )
    borrower = borrower_result.scalar_one_or_none()
    
    if not borrower:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Borrower not found"
        )
    
    if not borrower.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Borrower is not active"
        )
    
    # Set default dates if not provided
    if not record_data.issue_date:
        record_data.issue_date = date.today()
    
    # Set default due date (2 weeks from issue date)
    if not record_data.due_date:
        record_data.due_date = record_data.issue_date + timedelta(days=14)
    
    # Create new lending record
    record = LendingRecord(**record_data.model_dump())
    db.add(record)
    
    # Update book availability
    book.available_quantity -= 1
    
    await db.commit()
    await db.refresh(record)
    
    # Load relationships
    query = select(LendingRecord).options(
        selectinload(LendingRecord.book),
        selectinload(LendingRecord.borrower)
    ).where(LendingRecord.id == record.id)
    
    result = await db.execute(query)
    record = result.scalar_one()
    
    record_dict = record.to_dict()
    return LendingRecordResponse.model_validate(record_dict)

@router.put("/{record_id}", response_model=LendingRecordResponse)
async def update_lending_record(
    record_id: int,
    record_data: LendingRecordUpdate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Update a lending record"""
    
    # Get existing record
    result = await db.execute(
        select(LendingRecord).options(
            selectinload(LendingRecord.book)
        ).where(LendingRecord.id == record_id)
    )
    record = result.scalar_one_or_none()
    
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lending record not found"
        )
    
    # Update record fields
    update_data = record_data.model_dump(exclude_unset=True)
    
    # Handle status change (especially return)
    if "status" in update_data:
        new_status = update_data["status"]
        old_status = record.status
        
        # If returning a book
        if new_status == "returned" and old_status == "borrowed":
            # Set return date if not provided
            if "return_date" not in update_data:
                update_data["return_date"] = date.today()
            
            # Increase book availability
            book = record.book
            book.available_quantity += 1
        
        # If re-issuing a returned book
        elif new_status == "borrowed" and old_status == "returned":
            # Check if book is still available
            if not record.book.is_available:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Book is no longer available"
                )
            
            # Decrease book availability
            record.book.available_quantity -= 1
            # Clear return date
            update_data["return_date"] = None
    
    for field, value in update_data.items():
        setattr(record, field, value)
    
    await db.commit()
    await db.refresh(record)
    
    # Load relationships
    query = select(LendingRecord).options(
        selectinload(LendingRecord.book),
        selectinload(LendingRecord.borrower)
    ).where(LendingRecord.id == record_id)
    
    result = await db.execute(query)
    record = result.scalar_one()
    
    record_dict = record.to_dict()
    return LendingRecordResponse.model_validate(record_dict)

@router.post("/{record_id}/return", response_model=LendingRecordResponse)
async def return_book(
    record_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Return a book"""
    
    # Get existing record
    result = await db.execute(
        select(LendingRecord).options(
            selectinload(LendingRecord.book),
            selectinload(LendingRecord.borrower)
        ).where(LendingRecord.id == record_id)
    )
    record = result.scalar_one_or_none()
    
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lending record not found"
        )
    
    if record.status == "returned":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Book has already been returned"
        )
    
    # Update record
    record.status = "returned"
    record.return_date = date.today()
    
    # Update book availability
    book = record.book
    book.available_quantity += 1
    
    await db.commit()
    await db.refresh(record)
    
    record_dict = record.to_dict()
    return LendingRecordResponse.model_validate(record_dict)

@router.get("/overdue", response_model=LendingRecordListResponse)
async def get_overdue_records(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Get all overdue lending records"""
    
    # Query for overdue records
    query = select(LendingRecord).options(
        selectinload(LendingRecord.book),
        selectinload(LendingRecord.borrower)
    ).where(and_(
        LendingRecord.status == "borrowed",
        LendingRecord.due_date < date.today()
    ))
    
    # Get total count
    count_query = select(func.count(LendingRecord.id)).where(and_(
        LendingRecord.status == "borrowed",
        LendingRecord.due_date < date.today()
    ))
    
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Apply pagination and ordering
    query = query.order_by(LendingRecord.due_date.asc()).offset(skip).limit(limit)
    
    # Execute query
    result = await db.execute(query)
    records = result.scalars().all()
    
    # Convert to response models
    record_responses = []
    for record in records:
        record_dict = record.to_dict()
        record_responses.append(LendingRecordResponse.model_validate(record_dict))
    
    return LendingRecordListResponse(
        lending_records=record_responses,
        total=total,
        page=skip // limit + 1,
        size=limit,
        pages=math.ceil(total / limit) if total > 0 else 1
    )

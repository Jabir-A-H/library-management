"""
Borrower routes for the FastAPI application
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from sqlalchemy.orm import selectinload
import math

from database_async import get_db
from models.borrower_async import Borrower
from schemas.borrower import (
    BorrowerCreate, BorrowerUpdate, BorrowerResponse, BorrowerListResponse
)
from dependencies.auth import get_current_active_user, get_current_admin_user

router = APIRouter()

@router.get("/", response_model=BorrowerListResponse)
async def get_borrowers(
    skip: int = Query(0, ge=0, description="Number of borrowers to skip"),
    limit: int = Query(10, ge=1, le=100, description="Number of borrowers to return"),
    search: Optional[str] = Query(None, description="Search in name, email, or membership number"),
    active_only: bool = Query(True, description="Show only active borrowers"),
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Get all borrowers with pagination and filtering"""
    
    # Build query
    query = select(Borrower).options(
        selectinload(Borrower.lending_records)
    )
    
    # Apply filters
    filters = []
    
    if search:
        search_filter = or_(
            Borrower.name.ilike(f"%{search}%"),
            Borrower.email.ilike(f"%{search}%"),
            Borrower.membership_number.ilike(f"%{search}%")
        )
        filters.append(search_filter)
    
    if active_only:
        filters.append(Borrower.is_active == True)
    
    if filters:
        query = query.where(and_(*filters))
    
    # Get total count
    count_query = select(func.count(Borrower.id))
    if filters:
        count_query = count_query.where(and_(*filters))
    
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Apply pagination
    query = query.offset(skip).limit(limit)
    
    # Execute query
    result = await db.execute(query)
    borrowers = result.scalars().all()
    
    # Convert to response models
    borrower_responses = []
    for borrower in borrowers:
        borrower_dict = borrower.to_dict()
        borrower_responses.append(BorrowerResponse.model_validate(borrower_dict))
    
    return BorrowerListResponse(
        borrowers=borrower_responses,
        total=total,
        page=skip // limit + 1,
        size=limit,
        pages=math.ceil(total / limit) if total > 0 else 1
    )

@router.get("/{borrower_id}", response_model=BorrowerResponse)
async def get_borrower(
    borrower_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Get a specific borrower by ID"""
    
    query = select(Borrower).options(
        selectinload(Borrower.lending_records)
    ).where(Borrower.id == borrower_id)
    
    result = await db.execute(query)
    borrower = result.scalar_one_or_none()
    
    if not borrower:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Borrower not found"
        )
    
    borrower_dict = borrower.to_dict()
    return BorrowerResponse.model_validate(borrower_dict)

@router.post("/", response_model=BorrowerResponse, status_code=status.HTTP_201_CREATED)
async def create_borrower(
    borrower_data: BorrowerCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Create a new borrower"""
    
    # Check for duplicate email if provided
    if borrower_data.email:
        existing_borrower_result = await db.execute(
            select(Borrower).where(Borrower.email == borrower_data.email)
        )
        if existing_borrower_result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Borrower with this email already exists"
            )
    
    # Check for duplicate membership number if provided
    if borrower_data.membership_number:
        existing_member_result = await db.execute(
            select(Borrower).where(Borrower.membership_number == borrower_data.membership_number)
        )
        if existing_member_result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Borrower with this membership number already exists"
            )
    
    # Generate membership number if not provided
    if not borrower_data.membership_number:
        # Generate a simple membership number based on current count
        count_result = await db.execute(select(func.count(Borrower.id)))
        count = count_result.scalar()
        borrower_data.membership_number = f"MEM{count + 1:06d}"
    
    # Create new borrower
    borrower = Borrower(**borrower_data.model_dump())
    db.add(borrower)
    await db.commit()
    await db.refresh(borrower)
    
    borrower_dict = borrower.to_dict()
    return BorrowerResponse.model_validate(borrower_dict)

@router.put("/{borrower_id}", response_model=BorrowerResponse)
async def update_borrower(
    borrower_id: int,
    borrower_data: BorrowerUpdate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Update a borrower"""
    
    # Get existing borrower
    result = await db.execute(select(Borrower).where(Borrower.id == borrower_id))
    borrower = result.scalar_one_or_none()
    
    if not borrower:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Borrower not found"
        )
    
    # Check for duplicate email if provided and different from current
    if borrower_data.email and borrower_data.email != borrower.email:
        existing_borrower_result = await db.execute(
            select(Borrower).where(and_(
                Borrower.email == borrower_data.email,
                Borrower.id != borrower_id
            ))
        )
        if existing_borrower_result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Borrower with this email already exists"
            )
    
    # Check for duplicate membership number if provided and different from current
    if borrower_data.membership_number and borrower_data.membership_number != borrower.membership_number:
        existing_member_result = await db.execute(
            select(Borrower).where(and_(
                Borrower.membership_number == borrower_data.membership_number,
                Borrower.id != borrower_id
            ))
        )
        if existing_member_result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Borrower with this membership number already exists"
            )
    
    # Update borrower fields
    update_data = borrower_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(borrower, field, value)
    
    await db.commit()
    await db.refresh(borrower)
    
    borrower_dict = borrower.to_dict()
    return BorrowerResponse.model_validate(borrower_dict)

@router.delete("/{borrower_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_borrower(
    borrower_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Delete a borrower (Admin only)"""
    
    result = await db.execute(select(Borrower).where(Borrower.id == borrower_id))
    borrower = result.scalar_one_or_none()
    
    if not borrower:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Borrower not found"
        )
    
    # Check if borrower has active loans
    from models.lending_record_async import LendingRecord
    active_loans_result = await db.execute(
        select(LendingRecord).where(and_(
            LendingRecord.borrower_id == borrower_id,
            LendingRecord.status == "borrowed"
        ))
    )
    active_loans = active_loans_result.scalars().all()
    
    if active_loans:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete borrower with active loans"
        )
    
    await db.delete(borrower)
    await db.commit()

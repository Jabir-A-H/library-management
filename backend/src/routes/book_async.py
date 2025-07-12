"""
Book routes for the FastAPI application
"""
from typing import List, Optional, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from sqlalchemy.orm import selectinload
import math

from ..database_async import get_db
from ..models.book_async import Book
from ..models.category_async import Category
from ..models.tag_async import Tag
from ..schemas.book import (
    BookCreate, BookUpdate, BookResponse, 
    BookListResponse, BookAvailabilityResponse
)
from ..dependencies.auth import get_current_admin_user
from ..schemas.user import UserResponse

router = APIRouter()

@router.get("/", response_model=BookListResponse)
async def get_books(
    skip: int = Query(0, ge=0, description="Number of books to skip"),
    limit: int = Query(10, ge=1, le=100, description="Number of books to return"),
    search: Optional[str] = Query(None, description="Search in title, author, or ISBN"),
    category_id: Optional[int] = Query(None, description="Filter by category"),
    tag_id: Optional[int] = Query(None, description="Filter by tag"),
    available_only: bool = Query(False, description="Show only available books"),
    db: AsyncSession = Depends(get_db)
):
    """Get all books with pagination and filtering"""
    
    # Build query
    query = select(Book).options(
        selectinload(Book.category),
        selectinload(Book.tags)
    )
    
    # Apply filters
    filters: List[Any] = []
    
    if search:
        search_filter = or_(
            Book.title.ilike(f"%{search}%"),
            Book.author.ilike(f"%{search}%"),
            Book.isbn.ilike(f"%{search}%")
        )
        filters.append(search_filter)
    
    if category_id:
        filters.append(Book.category_id == category_id)
    
    if available_only:
        filters.append(Book.available_quantity > 0)
    
    if filters:
        query = query.where(and_(*filters))
    
    # Handle tag filtering separately due to many-to-many relationship
    if tag_id:
        query = query.join(Book.tags).where(Tag.id == tag_id)
    
    # Get total count
    count_query = select(func.count(Book.id))
    if filters:
        count_query = count_query.where(and_(*filters))
    if tag_id:
        count_query = count_query.join(Book.tags).where(Tag.id == tag_id)
    
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0
    
    # Apply pagination
    query = query.offset(skip).limit(limit)
    
    # Execute query
    result = await db.execute(query)
    books = result.scalars().all()
    
    # Convert to response models
    book_responses: List[BookResponse] = []
    for book in books:
        book_dict = book.to_dict()
        book_responses.append(BookResponse.model_validate(book_dict))
    
    return BookListResponse(
        books=book_responses,
        total=total,
        page=skip // limit + 1,
        size=limit,
        pages=math.ceil(total / limit) if total > 0 else 1
    )

@router.get("/{book_id}", response_model=BookResponse)
async def get_book(
    book_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific book by ID"""
    
    query = select(Book).options(
        selectinload(Book.category),
        selectinload(Book.tags)
    ).where(Book.id == book_id)
    
    result = await db.execute(query)
    book = result.scalar_one_or_none()
    
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book not found"
        )
    
    book_dict = book.to_dict()
    return BookResponse.model_validate(book_dict)

@router.post("/", response_model=BookResponse, status_code=status.HTTP_201_CREATED)
async def create_book(
    book_data: BookCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UserResponse = Depends(get_current_admin_user)
):
    """Create a new book (Admin only)"""
    
    # Check if category exists if provided
    if book_data.category_id:
        category_result = await db.execute(
            select(Category).where(Category.id == book_data.category_id)
        )
        if not category_result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Category not found"
            )
    
    # Check for duplicate ISBN if provided
    if book_data.isbn:
        existing_book_result = await db.execute(
            select(Book).where(Book.isbn == book_data.isbn)
        )
        if existing_book_result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Book with this ISBN already exists"
            )
    
    # Create new book
    book = Book(**book_data.model_dump())
    db.add(book)
    await db.commit()
    await db.refresh(book)
    
    # Load relationships
    query = select(Book).options(
        selectinload(Book.category),
        selectinload(Book.tags)
    ).where(Book.id == book.id)
    
    result = await db.execute(query)
    book = result.scalar_one()
    
    book_dict = book.to_dict()
    return BookResponse.model_validate(book_dict)

@router.put("/{book_id}", response_model=BookResponse)
async def update_book(
    book_id: int,
    book_data: BookUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: UserResponse = Depends(get_current_admin_user)
):
    """Update a book (Admin only)"""
    
    # Get existing book
    result = await db.execute(select(Book).where(Book.id == book_id))
    book = result.scalar_one_or_none()
    
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book not found"
        )
    
    # Check if category exists if provided
    if book_data.category_id:
        category_result = await db.execute(
            select(Category).where(Category.id == book_data.category_id)
        )
        if not category_result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Category not found"
            )
    
    # Check for duplicate ISBN if provided and different from current
    if book_data.isbn and book_data.isbn != book.isbn:
        existing_book_result = await db.execute(
            select(Book).where(and_(Book.isbn == book_data.isbn, Book.id != book_id))
        )
        if existing_book_result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Book with this ISBN already exists"
            )
    
    # Update book fields
    update_data = book_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(book, field, value)
    
    await db.commit()
    await db.refresh(book)
    
    # Load relationships
    query = select(Book).options(
        selectinload(Book.category),
        selectinload(Book.tags)
    ).where(Book.id == book_id)
    
    result = await db.execute(query)
    book = result.scalar_one()
    
    book_dict = book.to_dict()
    return BookResponse.model_validate(book_dict)

@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_book(
    book_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserResponse = Depends(get_current_admin_user)
):
    """Delete a book (Admin only)"""
    
    result = await db.execute(select(Book).where(Book.id == book_id))
    book = result.scalar_one_or_none()
    
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book not found"
        )
    
    await db.delete(book)
    await db.commit()

@router.get("/{book_id}/availability", response_model=BookAvailabilityResponse)
async def get_book_availability(
    book_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get book availability information"""
    
    result = await db.execute(select(Book).where(Book.id == book_id))
    book = result.scalar_one_or_none()
    
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book not found"
        )
    
    return BookAvailabilityResponse(
        book_id=book.id,
        title=book.title,
        is_available=book.is_available,
        available_quantity=book.available_quantity or 0,
        total_quantity=book.quantity or 0
    )

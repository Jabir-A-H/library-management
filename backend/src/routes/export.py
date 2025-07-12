"""
Export routes for the FastAPI application
"""
import csv
import io
from typing import Optional
from fastapi import APIRouter, Depends, Query, Response
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from database_async import get_db
from models.book_async import Book
from models.borrower_async import Borrower
from models.lending_record_async import LendingRecord
from dependencies.auth import get_current_active_user

router = APIRouter()

@router.get("/books/csv")
async def export_books_csv(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Export books to CSV"""
    
    # Get all books
    result = await db.execute(
        select(Book).options(
            selectinload(Book.category),
            selectinload(Book.tags)
        )
    )
    books = result.scalars().all()
    
    # Create CSV content
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write header
    writer.writerow([
        'ID', 'Title', 'Author', 'ISBN', 'Publisher', 'Publication Year',
        'Genre', 'Language', 'Pages', 'Description', 'Location',
        'Quantity', 'Available Quantity', 'Price', 'Acquisition Date',
        'Condition', 'Category', 'Tags', 'Created At'
    ])
    
    # Write data
    for book in books:
        category_name = book.category.name if book.category else ''
        tag_names = ', '.join([tag.name for tag in book.tags]) if book.tags else ''
        
        writer.writerow([
            book.id,
            book.title,
            book.author,
            book.isbn or '',
            book.publisher or '',
            book.publication_year or '',
            book.genre or '',
            book.language or '',
            book.pages or '',
            book.description or '',
            book.location or '',
            book.quantity or '',
            book.available_quantity or '',
            book.price or '',
            book.acquisition_date.isoformat() if book.acquisition_date else '',
            book.condition or '',
            category_name,
            tag_names,
            book.created_at.isoformat() if book.created_at else ''
        ])
    
    output.seek(0)
    
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode('utf-8')),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=books_export.csv"}
    )

@router.get("/borrowers/csv")
async def export_borrowers_csv(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Export borrowers to CSV"""
    
    # Get all borrowers
    result = await db.execute(select(Borrower))
    borrowers = result.scalars().all()
    
    # Create CSV content
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write header
    writer.writerow([
        'ID', 'Name', 'Email', 'Phone', 'Address', 'Membership Number',
        'Membership Type', 'Registration Date', 'Is Active', 'Notes', 'Created At'
    ])
    
    # Write data
    for borrower in borrowers:
        writer.writerow([
            borrower.id,
            borrower.name,
            borrower.email or '',
            borrower.phone or '',
            borrower.address or '',
            borrower.membership_number or '',
            borrower.membership_type or '',
            borrower.registration_date.isoformat() if borrower.registration_date else '',
            borrower.is_active,
            borrower.notes or '',
            borrower.created_at.isoformat() if borrower.created_at else ''
        ])
    
    output.seek(0)
    
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode('utf-8')),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=borrowers_export.csv"}
    )

@router.get("/lending-records/csv")
async def export_lending_records_csv(
    status_filter: Optional[str] = Query(None, description="Filter by status"),
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Export lending records to CSV"""
    
    # Build query
    query = select(LendingRecord).options(
        selectinload(LendingRecord.book),
        selectinload(LendingRecord.borrower)
    )
    
    if status_filter:
        query = query.where(LendingRecord.status == status_filter)
    
    result = await db.execute(query)
    records = result.scalars().all()
    
    # Create CSV content
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write header
    writer.writerow([
        'ID', 'Book Title', 'Book Author', 'Borrower Name', 'Borrower Email',
        'Issue Date', 'Due Date', 'Return Date', 'Status', 'Fine Amount',
        'Fine Paid', 'Notes', 'Created At'
    ])
    
    # Write data
    for record in records:
        writer.writerow([
            record.id,
            record.book.title if record.book else '',
            record.book.author if record.book else '',
            record.borrower.name if record.borrower else '',
            record.borrower.email if record.borrower else '',
            record.issue_date.isoformat() if record.issue_date else '',
            record.due_date.isoformat() if record.due_date else '',
            record.return_date.isoformat() if record.return_date else '',
            record.status or '',
            record.fine_amount or '',
            record.fine_paid,
            record.notes or '',
            record.created_at.isoformat() if record.created_at else ''
        ])
    
    output.seek(0)
    
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode('utf-8')),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=lending_records_export.csv"}
    )

"""
Lending Record model for tracking book loans - Updated to match existing database schema
"""
from typing import Dict, Any
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database_async import Base


class LendingRecord(Base):
    __tablename__ = "lending_records"
    
    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("books.id"))
    borrower_id = Column(Integer, ForeignKey("borrowers.id"))
    checkout_date = Column(DateTime, default=func.current_timestamp())
    due_date = Column(DateTime, nullable=False)
    return_date = Column(DateTime)
    status = Column(String(20), default="borrowed")  # borrowed, returned, overdue
    notes = Column(Text)
    created_at = Column(DateTime, default=func.current_timestamp())
    updated_at = Column(DateTime, default=func.current_timestamp())
    
    # Relationships
    book = relationship("Book", back_populates="lending_records")
    borrower = relationship("Borrower", back_populates="lending_records")
    
    def __repr__(self) -> str:
        return f"<LendingRecord(id={self.id}, book_id={self.book_id}, borrower_id={self.borrower_id}, status='{self.status}')>"
    
    @property
    def is_overdue(self) -> bool:
        """Check if loan is overdue"""
        from datetime import datetime
        if str(self.status) == "returned":  # type: ignore
            return False
        return self.due_date < datetime.now()  # type: ignore
    
    @property
    def days_overdue(self) -> int:
        """Get number of days overdue"""
        if not self.is_overdue:
            return 0
        from datetime import datetime
        return (datetime.now() - self.due_date).days  # type: ignore
    
    @property
    def issue_date(self):
        """Alias for checkout_date for backward compatibility"""
        return self.checkout_date
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert lending record to dictionary"""
        return {
            "id": self.id,
            "book_id": self.book_id,
            "borrower_id": self.borrower_id,
            "checkout_date": self.checkout_date.isoformat() if self.checkout_date else None,  # type: ignore
            "issue_date": self.checkout_date.isoformat() if self.checkout_date else None,  # type: ignore
            "due_date": self.due_date.isoformat() if self.due_date else None,  # type: ignore
            "return_date": self.return_date.isoformat() if self.return_date else None,  # type: ignore
            "status": self.status,
            "notes": self.notes,
            "is_overdue": self.is_overdue,
            "days_overdue": self.days_overdue,
            "book": self.book.to_dict() if self.book else None,
            "borrower": self.borrower.to_dict() if self.borrower else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,  # type: ignore
            "updated_at": self.updated_at.isoformat() if self.updated_at else None  # type: ignore
        }

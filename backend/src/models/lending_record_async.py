"""
Lending Record model for tracking book loans
"""
from typing import Dict, Any
from sqlalchemy import Column, Integer, String, Text, Date, DateTime, Numeric, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database_async import Base

class LendingRecord(Base):
    __tablename__ = "lending_records"
    
    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
    borrower_id = Column(Integer, ForeignKey("borrowers.id"), nullable=False)
    issue_date = Column(Date, nullable=False, default=func.current_date())
    due_date = Column(Date, nullable=False)
    return_date = Column(Date)
    status = Column(String(20), default="borrowed")  # borrowed, returned, overdue
    notes = Column(Text)
    fine_amount = Column(Numeric(10, 2), default=0.00)
    fine_paid = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    book = relationship("Book", back_populates="lending_records")
    borrower = relationship("Borrower", back_populates="lending_records")
    
    def __repr__(self):
        return f"<LendingRecord(id={self.id}, book_id={self.book_id}, borrower_id={self.borrower_id}, status='{self.status}')>"
    
    @property
    def is_overdue(self) -> bool:
        """Check if loan is overdue"""
        from datetime import date
        if str(self.status) == "returned":  # type: ignore
            return False
        return self.due_date < date.today()  # type: ignore
    
    @property
    def days_overdue(self) -> int:
        """Get number of days overdue"""
        if not self.is_overdue:
            return 0
        from datetime import date
        return (date.today() - self.due_date).days  # type: ignore
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert lending record to dictionary"""
        return {
            "id": self.id,
            "book_id": self.book_id,
            "borrower_id": self.borrower_id,
            "issue_date": self.issue_date.isoformat() if self.issue_date else None,  # type: ignore
            "due_date": self.due_date.isoformat() if self.due_date else None,  # type: ignore
            "return_date": self.return_date.isoformat() if self.return_date else None,  # type: ignore
            "status": self.status,
            "notes": self.notes,
            "fine_amount": float(self.fine_amount) if self.fine_amount else 0.00,  # type: ignore
            "fine_paid": self.fine_paid,
            "is_overdue": self.is_overdue,
            "days_overdue": self.days_overdue,
            "book": self.book.to_dict() if self.book else None,
            "borrower": self.borrower.to_dict() if self.borrower else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,  # type: ignore
            "updated_at": self.updated_at.isoformat() if self.updated_at else None  # type: ignore
        }

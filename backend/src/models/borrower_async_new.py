"""
Borrower model for library members - Updated to match existing database schema
"""
from typing import Dict, Any
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database_async import Base


class Borrower(Base):
    __tablename__ = "borrowers"
    
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False, index=True)
    first_name_bn = Column(Text)
    last_name = Column(String(100), nullable=False, index=True)
    last_name_bn = Column(Text)
    email = Column(String(100), unique=True, index=True)
    phone = Column(String(20))
    address = Column(Text)
    address_bn = Column(Text)
    relationship = Column(String(100))
    current_books_count = Column(Integer, default=0)
    comments = Column(Text)
    created_at = Column(DateTime, default=func.current_timestamp())
    updated_at = Column(DateTime, default=func.current_timestamp())
    
    # Relationships
    lending_records = relationship("LendingRecord", back_populates="borrower")
    
    def __repr__(self) -> str:
        return f"<Borrower(id={self.id}, name='{self.full_name}')>"
    
    @property
    def full_name(self) -> str:
        """Get full name of borrower"""
        return f"{self.first_name} {self.last_name}".strip()
    
    @property
    def full_name_bn(self) -> str:
        """Get full Bengali name of borrower"""
        if self.first_name_bn and self.last_name_bn:
            return f"{self.first_name_bn} {self.last_name_bn}".strip()
        return ""
    
    @property
    def active_loans_count(self) -> int:
        """Get number of currently borrowed books"""
        return self.current_books_count or 0
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert borrower to dictionary"""
        return {
            "id": self.id,
            "first_name": self.first_name,
            "first_name_bn": self.first_name_bn,
            "last_name": self.last_name,
            "last_name_bn": self.last_name_bn,
            "full_name": self.full_name,
            "full_name_bn": self.full_name_bn,
            "email": self.email,
            "phone": self.phone,
            "address": self.address,
            "address_bn": self.address_bn,
            "relationship": self.relationship,
            "current_books_count": self.current_books_count,
            "active_loans_count": self.active_loans_count,
            "comments": self.comments,
            "created_at": self.created_at.isoformat() if self.created_at else None,  # type: ignore
            "updated_at": self.updated_at.isoformat() if self.updated_at else None  # type: ignore
        }

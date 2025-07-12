"""
Borrower model for library members
"""
from typing import Dict, Any
from sqlalchemy import Column, Integer, String, Text, Date, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database_async import Base

class Borrower(Base):
    __tablename__ = "borrowers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    email = Column(String(120), unique=True, index=True)
    phone = Column(String(20))
    address = Column(Text)
    membership_number = Column(String(50), unique=True)
    membership_type = Column(String(50), default="Standard")
    registration_date = Column(Date, default=func.current_date())
    is_active = Column(Boolean, default=True)
    notes = Column(Text)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    lending_records = relationship("LendingRecord", back_populates="borrower")
    
    def __repr__(self):
        return f"<Borrower(id={self.id}, name='{self.name}', email='{self.email}')>"
    
    @property
    def active_loans_count(self):
        """Get count of active loans"""
        if not self.lending_records:
            return 0
        return len([lr for lr in self.lending_records if lr.status == "borrowed"])
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert borrower to dictionary"""
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "address": self.address,
            "membership_number": self.membership_number,
            "membership_type": self.membership_type,
            "registration_date": self.registration_date.isoformat() if self.registration_date else None,  # type: ignore
            "is_active": self.is_active,
            "notes": self.notes,
            "active_loans_count": self.active_loans_count,
            "created_at": self.created_at.isoformat() if self.created_at else None,  # type: ignore
            "updated_at": self.updated_at.isoformat() if self.updated_at else None  # type: ignore
        }

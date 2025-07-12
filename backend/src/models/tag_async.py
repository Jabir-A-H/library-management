"""
Tag model for flexible book tagging - Updated to match existing database schema
"""
from typing import Dict, Any
from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database_async import Base

class Tag(Base):
    __tablename__ = "tags"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    name_bn = Column(Text)  # Bengali name
    created_at = Column(DateTime, default=func.current_timestamp())
    
    # Relationships
    books = relationship("Book", secondary="book_tags", back_populates="tags")
    
    def __repr__(self):
        return f"<Tag(id={self.id}, name='{self.name}')>"
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert tag to dictionary"""
        return {
            "id": self.id,
            "name": self.name,
            "name_bn": self.name_bn,
            "book_count": len(self.books) if self.books else 0,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

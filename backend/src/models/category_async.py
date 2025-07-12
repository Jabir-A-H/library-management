"""
Category model for book organization - Updated to match existing database schema
"""
from typing import Dict, Any
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database_async import Base


class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    description = Column(Text)
    parent_id = Column(Integer, ForeignKey("categories.id"))
    created_at = Column(DateTime, default=func.current_timestamp())
    updated_at = Column(DateTime, default=func.current_timestamp())
    
    # Relationships
    books = relationship("Book", back_populates="category")
    parent = relationship("Category", remote_side=[id], backref="children")
    
    def __repr__(self) -> str:
        return f"<Category(id={self.id}, name='{self.name}')>"
    
    @property
    def full_path(self) -> str:
        """Get full category path including parent categories"""
        if self.parent:
            return f"{self.parent.full_path} > {self.name}"
        return self.name
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert category to dictionary"""
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "parent_id": self.parent_id,
            "book_count": len(self.books) if self.books else 0,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

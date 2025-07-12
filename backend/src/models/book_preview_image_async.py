"""
Book Preview Image model for storing book cover images - Updated to match existing database schema
"""
from typing import Dict, Any
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database_async import Base

class BookPreviewImage(Base):
    __tablename__ = "book_preview_images"
    
    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
    image_path = Column(String(255), nullable=False)
    caption = Column(Text)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=func.current_timestamp())
    
    # Relationships
    book = relationship("Book", back_populates="preview_images")
    
    def __repr__(self):
        return f"<BookPreviewImage(id={self.id}, book_id={self.book_id}, image_path='{self.image_path}')>"
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert book preview image to dictionary"""
        return {
            "id": self.id,
            "book_id": self.book_id,
            "image_path": self.image_path,
            "caption": self.caption,
            "display_order": self.display_order,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

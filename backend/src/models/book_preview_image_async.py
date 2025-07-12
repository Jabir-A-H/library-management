"""
Book Preview Image model for storing book cover images
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database_async import Base

class BookPreviewImage(Base):
    __tablename__ = "book_preview_images"
    
    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
    image_path = Column(String(500), nullable=False)
    image_type = Column(String(20), default="cover")  # cover, back, inside, etc.
    is_primary = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    book = relationship("Book", back_populates="preview_images")
    
    def __repr__(self):
        return f"<BookPreviewImage(id={self.id}, book_id={self.book_id}, image_path='{self.image_path}')>"
    
    def to_dict(self):
        """Convert book preview image to dictionary"""
        return {
            "id": self.id,
            "book_id": self.book_id,
            "image_path": self.image_path,
            "image_type": self.image_type,
            "is_primary": self.is_primary,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

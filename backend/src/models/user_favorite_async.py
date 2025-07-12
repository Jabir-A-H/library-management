"""
User Favorite model for tracking user's favorite books
"""
from sqlalchemy import Column, Integer, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database_async import Base

class UserFavorite(Base):
    __tablename__ = "user_favorites"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="favorites")
    book = relationship("Book", back_populates="user_favorites")
    
    # Unique constraint to prevent duplicate favorites
    __table_args__ = (
        UniqueConstraint('user_id', 'book_id', name='uq_user_book_favorite'),
    )
    
    def __repr__(self):
        return f"<UserFavorite(id={self.id}, user_id={self.user_id}, book_id={self.book_id})>"
    
    def to_dict(self):
        """Convert user favorite to dictionary"""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "book_id": self.book_id,
            "book": self.book.to_dict() if self.book else None,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

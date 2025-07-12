"""
Book model for library catalog - Updated to match existing database schema
"""
from typing import Dict, Any, Optional, List
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, SmallInteger
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database_async import Base
from .book_tag_async import book_tags


class Book(Base):
    __tablename__ = "books"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    title_bn = Column(Text)
    author = Column(String(255), nullable=False, index=True)
    author_bn = Column(Text)
    isbn = Column(String(20), unique=True, index=True)
    genre = Column(String(100))
    publication_year = Column(Integer)
    description = Column(Text)
    description_bn = Column(Text)
    read_status = Column(String(50), default="unread")
    rating = Column(SmallInteger)
    room = Column(String(100))
    shelf = Column(String(100))
    column_location = Column(String(100))
    row_location = Column(String(100))
    location_comment = Column(Text)
    publisher = Column(String(200))
    publisher_bn = Column(Text)
    language = Column(String(50), default="English")
    page_count = Column(Integer)
    category_id = Column(Integer, ForeignKey("categories.id"))
    cover_image = Column(String(255))
    total_copies = Column(Integer, default=1)
    available_copies = Column(Integer, default=1)
    comments = Column(Text)
    created_at = Column(DateTime, default=func.current_timestamp())
    updated_at = Column(DateTime, default=func.current_timestamp())
    
    # Relationships
    category = relationship("Category", back_populates="books")
    tags = relationship("Tag", secondary=book_tags, back_populates="books")
    lending_records = relationship("LendingRecord", back_populates="book")
    preview_images = relationship("BookPreviewImage", back_populates="book", cascade="all, delete-orphan")
    user_favorites = relationship("UserFavorite", back_populates="book", cascade="all, delete-orphan")
    
    def __repr__(self) -> str:
        return f"<Book(id={self.id}, title='{self.title}', author='{self.author}')>"
    
    @property
    def is_available(self) -> bool:
        """Check if book is available for lending"""
        return (self.available_copies or 0) > 0
    
    @property
    def borrowed_count(self) -> int:
        """Get number of currently borrowed copies"""
        total = self.total_copies or 0
        available = self.available_copies or 0
        return total - available
    
    @property
    def full_location(self) -> str:
        """Get full location description"""
        location_parts = []
        if self.room:
            location_parts.append(f"Room: {self.room}")
        if self.shelf:
            location_parts.append(f"Shelf: {self.shelf}")
        if self.column_location:
            location_parts.append(f"Column: {self.column_location}")
        if self.row_location:
            location_parts.append(f"Row: {self.row_location}")
        
        location = " - ".join(location_parts)
        if self.location_comment:
            if location:
                location += f" - {self.location_comment}"
            else:
                location = self.location_comment
        
        return location or "Not specified"
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert book to dictionary"""
        return {
            "id": self.id,
            "title": self.title,
            "title_bn": self.title_bn,
            "author": self.author,
            "author_bn": self.author_bn,
            "isbn": self.isbn,
            "genre": self.genre,
            "publication_year": self.publication_year,
            "description": self.description,
            "description_bn": self.description_bn,
            "read_status": self.read_status,
            "rating": self.rating,
            "room": self.room,
            "shelf": self.shelf,
            "column_location": self.column_location,
            "row_location": self.row_location,
            "location_comment": self.location_comment,
            "full_location": self.full_location,
            "publisher": self.publisher,
            "publisher_bn": self.publisher_bn,
            "language": self.language,
            "page_count": self.page_count,
            "category_id": self.category_id,
            "cover_image": self.cover_image,
            "total_copies": self.total_copies,
            "available_copies": self.available_copies,
            "borrowed_count": self.borrowed_count,
            "comments": self.comments,
            "is_available": self.is_available,
            "category": self.category.to_dict() if self.category else None,
            "tags": [tag.to_dict() for tag in self.tags] if self.tags else [],
            "created_at": self.created_at.isoformat() if self.created_at else None,  # type: ignore
            "updated_at": self.updated_at.isoformat() if self.updated_at else None  # type: ignore
        }

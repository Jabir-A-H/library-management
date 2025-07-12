"""
User model for authentication and authorization - Updated to match existing database schema
"""
from typing import Dict, Any
from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database_async import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    hashed_password = Column(String(100), nullable=False)
    role = Column(String(20), nullable=False, default="user")
    comments = Column(Text)
    created_at = Column(DateTime, default=func.current_timestamp())
    updated_at = Column(DateTime, default=func.current_timestamp())
    
    # Relationships
    favorites = relationship("UserFavorite", back_populates="user", cascade="all, delete-orphan")
    
    def __repr__(self) -> str:
        return f"<User(id={self.id}, username='{self.username}', email='{self.email}')>"
    
    @property
    def password_hash(self) -> str:
        """Alias for hashed_password for backward compatibility"""
        return self.hashed_password
    
    @property
    def is_admin(self) -> bool:
        """Check if user is admin based on role"""
        return self.role == "admin"
    
    @property
    def is_active(self) -> bool:
        """All users are considered active in current schema"""
        return True
    
    @property
    def full_name(self) -> str:
        """Get full name of user (using username as fallback)"""
        return self.username
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert user to dictionary"""
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "role": self.role,
            "is_admin": self.is_admin,
            "is_active": self.is_active,
            "full_name": self.full_name,
            "comments": self.comments,
            "created_at": self.created_at.isoformat() if self.created_at else None,  # type: ignore
            "updated_at": self.updated_at.isoformat() if self.updated_at else None  # type: ignore
        }

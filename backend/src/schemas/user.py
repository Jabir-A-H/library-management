"""
User schemas for API requests and responses - Updated to match existing database schema
"""
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field, EmailStr, field_validator

# Base schema matching your database structure
class UserBase(BaseModel):
    username: str = Field(..., max_length=80, description="Username")
    email: EmailStr = Field(..., description="Email address")
    full_name: Optional[str] = Field(None, max_length=120, description="Full name")
    role: str = Field("user", max_length=50, description="User role")
    is_active: bool = Field(True, description="Active status")

    @field_validator('username')
    @classmethod
    def validate_username(cls, v):
        if not v.replace('_', '').replace('-', '').isalnum():
            raise ValueError('Username can only contain letters, numbers, underscores, and hyphens')
        return v

    @field_validator('role')
    @classmethod
    def validate_role(cls, v):
        allowed_roles = ['admin', 'librarian', 'user']
        if v not in allowed_roles:
            raise ValueError(f'Role must be one of: {", ".join(allowed_roles)}')
        return v

# User creation schema (includes password)
class UserCreate(UserBase):
    password: str = Field(
        ..., min_length=6, description="Password (min 6 characters)"
    )

    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters long')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        if not any(c.isalpha() for c in v):
            raise ValueError('Password must contain at least one letter')
        return v


# User update schema
class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = Field(None, max_length=120)
    role: Optional[str] = Field(None, max_length=50)
    is_active: Optional[bool] = None

    @field_validator('role')
    @classmethod
    def validate_role(cls, v):
        if v is not None:
            allowed_roles = ['admin', 'librarian', 'user']
            if v not in allowed_roles:
                msg = f'Role must be one of: {", ".join(allowed_roles)}'
                raise ValueError(msg)
        return v


# Password update schema
class UserPasswordUpdate(BaseModel):
    current_password: str = Field(..., description="Current password")
    new_password: str = Field(
        ..., min_length=6, description="New password (min 6 characters)"
    )

    @field_validator('new_password')
    @classmethod
    def validate_new_password(cls, v):
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters long')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        if not any(c.isalpha() for c in v):
            raise ValueError('Password must contain at least one letter')
        return v


# Response schema
class UserResponse(UserBase):
    id: int
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    last_login: Optional[datetime]
    
    # Computed fields
    is_admin: bool
    is_librarian: bool

    class Config:
        from_attributes = True

# User summary schema (for nested responses)
class UserSummaryResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: Optional[str]
    role: str
    is_active: bool

    class Config:
        from_attributes = True

# List response schema
class UserListResponse(BaseModel):
    users: List[UserResponse]
    total: int
    page: int
    size: int
    pages: int

# Authentication schemas
class UserLogin(BaseModel):
    username: str = Field(..., description="Username or email")
    password: str = Field(..., description="Password")

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse

class TokenData(BaseModel):
    username: Optional[str] = None
    user_id: Optional[int] = None

# User profile schema
class UserProfile(BaseModel):
    id: int
    username: str
    email: str
    full_name: Optional[str]
    role: str
    is_active: bool
    created_at: datetime
    last_login: Optional[datetime]
    
    # Statistics
    books_borrowed: int
    current_loans: int
    favorite_books: int

    class Config:
        from_attributes = True

# User statistics schema
class UserStatsResponse(BaseModel):
    total_users: int
    active_users: int
    inactive_users: int
    admin_users: int
    librarian_users: int
    regular_users: int
    users_created_today: int
    users_created_this_month: int

"""
User routes for the FastAPI application
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
import math

from ..database_async import get_db
from ..models.user_async import User
from ..schemas.user import (
    UserUpdate, UserResponse, UserListResponse
)
from ..dependencies.auth import (
    get_current_active_user, get_current_admin_user, 
    get_password_hash
)

router = APIRouter()

@router.get("/", response_model=UserListResponse)
async def get_users(
    skip: int = Query(0, ge=0, description="Number of users to skip"),
    limit: int = Query(10, ge=1, le=100, description="Number of users to return"),
    search: Optional[str] = Query(None, description="Search in username, email, or name"),
    active_only: bool = Query(True, description="Show only active users"),
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Get all users with pagination and filtering (Admin only)"""
    
    # Build query
    query = select(User)
    
    # Apply filters
    filters = []
    
    if search:
        search_filter = or_(
            User.username.ilike(f"%{search}%"),
            User.email.ilike(f"%{search}%"),
            User.first_name.ilike(f"%{search}%"),
            User.last_name.ilike(f"%{search}%")
        )
        filters.append(search_filter)
    
    if active_only:
        filters.append(User.is_active == True)
    
    if filters:
        query = query.where(and_(*filters))
    
    # Get total count
    count_query = select(func.count(User.id))
    if filters:
        count_query = count_query.where(and_(*filters))
    
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Apply pagination
    query = query.offset(skip).limit(limit)
    
    # Execute query
    result = await db.execute(query)
    users = result.scalars().all()
    
    # Convert to response models
    user_responses = []
    for user in users:
        user_dict = user.to_dict()
        user_responses.append(UserResponse.model_validate(user_dict))
    
    return UserListResponse(
        users=user_responses,
        total=total,
        page=skip // limit + 1,
        size=limit,
        pages=math.ceil(total / limit) if total > 0 else 1
    )

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Get a specific user by ID"""
    
    # Users can only view their own profile unless they're admin
    if current_user.id != user_id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user_dict = user.to_dict()
    return UserResponse.model_validate(user_dict)

@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    user_data: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Update a user"""
    
    # Users can only update their own profile unless they're admin
    if current_user.id != user_id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Get existing user
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Non-admin users cannot change admin status or active status
    if not current_user.is_admin:
        if user_data.is_admin is not None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Cannot change admin status"
            )
        if user_data.is_active is not None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Cannot change active status"
            )
    
    # Check for duplicate username if provided and different from current
    if user_data.username and user_data.username != user.username:
        existing_user_result = await db.execute(
            select(User).where(and_(
                User.username == user_data.username,
                User.id != user_id
            ))
        )
        if existing_user_result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already exists"
            )
    
    # Check for duplicate email if provided and different from current
    if user_data.email and user_data.email != user.email:
        existing_email_result = await db.execute(
            select(User).where(and_(
                User.email == user_data.email,
                User.id != user_id
            ))
        )
        if existing_email_result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already exists"
            )
    
    # Update user fields
    update_data = user_data.model_dump(exclude_unset=True)
    
    # Handle password update separately
    if "password" in update_data:
        password = update_data.pop("password")
        user.password_hash = get_password_hash(password)
    
    for field, value in update_data.items():
        setattr(user, field, value)
    
    await db.commit()
    await db.refresh(user)
    
    user_dict = user.to_dict()
    return UserResponse.model_validate(user_dict)

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Delete a user (Admin only)"""
    
    # Cannot delete yourself
    if current_user.id == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account"
        )
    
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    await db.delete(user)
    await db.commit()

@router.put("/{user_id}/activate", response_model=UserResponse)
async def activate_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Activate a user (Admin only)"""
    
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user.is_active = True
    await db.commit()
    await db.refresh(user)
    
    user_dict = user.to_dict()
    return UserResponse.model_validate(user_dict)

@router.put("/{user_id}/deactivate", response_model=UserResponse)
async def deactivate_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Deactivate a user (Admin only)"""
    
    # Cannot deactivate yourself
    if current_user.id == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot deactivate your own account"
        )
    
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user.is_active = False
    await db.commit()
    await db.refresh(user)
    
    user_dict = user.to_dict()
    return UserResponse.model_validate(user_dict)

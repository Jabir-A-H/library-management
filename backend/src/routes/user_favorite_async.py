"""
User Favorite routes for the FastAPI application

This module provides REST API endpoints for managing user favorites:
- CRUD operations for individual favorites
- Bulk operations for efficient management
- Aggregated responses for user/book statistics
- Search and filtering capabilities
- Toggle functionality for frontend convenience

All routes follow RESTful conventions and include proper error handling,
validation, and documentation for API consumers.
"""
from typing import List, Optional, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query, Path
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, desc, text
from sqlalchemy.orm import selectinload
from datetime import datetime, timedelta
import math

from ..database_async import get_db
from ..models.user_favorite_async import UserFavorite
from ..models.book_async import Book
from ..models.user_async import User
from ..schemas.user_favorite import (
    UserFavoriteCreate, UserFavoriteResponse, 
    UserFavoriteListResponse, UserFavoriteSimpleResponse,
    UserFavoriteBooksResponse, BookFavoritedByResponse,
    UserFavoriteSearchFilters, UserFavoriteStatistics,
    UserFavoriteBulkCreate, UserFavoriteBulkCreateResponse,
    UserFavoriteToggle, UserFavoriteToggleResponse
)
from ..dependencies.auth import get_current_user, get_current_admin_user
from ..schemas.user import UserResponse

router = APIRouter()

@router.get("/", response_model=UserFavoriteListResponse)
async def get_user_favorites(
    skip: int = Query(0, ge=0, description="Number of favorites to skip"),
    limit: int = Query(10, ge=1, le=100, description="Number of favorites to return"),
    user_id: Optional[int] = Query(None, description="Filter by user ID"),
    book_id: Optional[int] = Query(None, description="Filter by book ID"),
    genre: Optional[str] = Query(None, description="Filter by book genre"),
    author: Optional[str] = Query(None, description="Filter by book author"),
    created_after: Optional[datetime] = Query(None, description="Filter favorites created after this date"),
    created_before: Optional[datetime] = Query(None, description="Filter favorites created before this date"),
    db: AsyncSession = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    """Get user favorites with pagination and filtering"""
    
    # Build query with relationships
    query = select(UserFavorite).options(
        selectinload(UserFavorite.book),
        selectinload(UserFavorite.user)
    )
    
    # Apply filters
    filters: List[Any] = []
    
    # Security: Regular users can only see their own favorites
    if not current_user.is_admin:
        filters.append(UserFavorite.user_id == current_user.id)
    elif user_id:
        filters.append(UserFavorite.user_id == user_id)
    
    if book_id:
        filters.append(UserFavorite.book_id == book_id)
    
    if genre:
        query = query.join(Book)
        filters.append(Book.genre.ilike(f"%{genre}%"))
    
    if author:
        if not any(isinstance(f, type(Book.genre.ilike(f"%{genre}%"))) for f in filters):
            query = query.join(Book)
        filters.append(Book.author.ilike(f"%{author}%"))
    
    if created_after:
        filters.append(UserFavorite.created_at >= created_after)
    
    if created_before:
        filters.append(UserFavorite.created_at <= created_before)
    
    if filters:
        query = query.where(and_(*filters))
    
    # Get total count
    count_query = select(func.count(UserFavorite.id))
    if filters:
        count_query = count_query.where(and_(*filters))
    
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0
    
    # Apply pagination and ordering
    query = query.order_by(desc(UserFavorite.created_at)).offset(skip).limit(limit)
    
    result = await db.execute(query)
    favorites = result.scalars().all()
    
    # Calculate pagination info
    pages = math.ceil(total / limit) if total > 0 else 0
    
    return UserFavoriteListResponse(
        favorites=[UserFavoriteResponse.model_validate(fav) for fav in favorites],
        total=total,
        page=(skip // limit) + 1,
        size=limit,
        pages=pages
    )

@router.post("/", response_model=UserFavoriteResponse, status_code=status.HTTP_201_CREATED)
async def create_user_favorite(
    favorite_data: UserFavoriteCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    """Create a new user favorite"""
    
    # Security: Users can only create favorites for themselves (unless admin)
    if not current_user.is_admin and favorite_data.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only create favorites for yourself"
        )
    
    # Check if user exists
    user_query = select(User).where(User.id == favorite_data.user_id)
    user_result = await db.execute(user_query)
    user = user_result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {favorite_data.user_id} not found"
        )
    
    # Check if book exists
    book_query = select(Book).where(Book.id == favorite_data.book_id)
    book_result = await db.execute(book_query)
    book = book_result.scalar_one_or_none()
    
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Book with ID {favorite_data.book_id} not found"
        )
    
    # Check if favorite already exists
    existing_query = select(UserFavorite).where(
        and_(
            UserFavorite.user_id == favorite_data.user_id,
            UserFavorite.book_id == favorite_data.book_id
        )
    )
    existing_result = await db.execute(existing_query)
    existing_favorite = existing_result.scalar_one_or_none()
    
    if existing_favorite:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User has already favorited this book"
        )
    
    # Create new favorite
    db_favorite = UserFavorite(**favorite_data.model_dump())
    db.add(db_favorite)
    await db.commit()
    await db.refresh(db_favorite)
    
    # Load relationships for response
    await db.refresh(db_favorite, ["book", "user"])
    
    return UserFavoriteResponse.model_validate(db_favorite)

@router.delete("/{favorite_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_favorite(
    favorite_id: int = Path(..., description="ID of the favorite to delete"),
    db: AsyncSession = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    """Delete a user favorite"""
    
    # Get the favorite
    query = select(UserFavorite).where(UserFavorite.id == favorite_id)
    result = await db.execute(query)
    favorite = result.scalar_one_or_none()
    
    if not favorite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Favorite with ID {favorite_id} not found"
        )
    
    # Security: Users can only delete their own favorites (unless admin)
    if not current_user.is_admin and favorite.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own favorites"
        )
    
    await db.delete(favorite)
    await db.commit()

@router.delete("/user/{user_id}/book/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_favorite_by_ids(
    user_id: int = Path(..., description="ID of the user"),
    book_id: int = Path(..., description="ID of the book"),
    db: AsyncSession = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    """Delete a user favorite by user ID and book ID"""
    
    # Security: Users can only delete their own favorites (unless admin)
    if not current_user.is_admin and user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own favorites"
        )
    
    # Get the favorite
    query = select(UserFavorite).where(
        and_(
            UserFavorite.user_id == user_id,
            UserFavorite.book_id == book_id
        )
    )
    result = await db.execute(query)
    favorite = result.scalar_one_or_none()
    
    if not favorite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Favorite not found for user {user_id} and book {book_id}"
        )
    
    await db.delete(favorite)
    await db.commit()

@router.post("/toggle", response_model=UserFavoriteToggleResponse)
async def toggle_user_favorite(
    toggle_data: UserFavoriteToggle,
    db: AsyncSession = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    """Toggle favorite status (add if not exists, remove if exists)"""
    
    # Security: Users can only toggle their own favorites (unless admin)
    if not current_user.is_admin and toggle_data.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only toggle your own favorites"
        )
    
    # Check if favorite exists
    query = select(UserFavorite).options(
        selectinload(UserFavorite.book),
        selectinload(UserFavorite.user)
    ).where(
        and_(
            UserFavorite.user_id == toggle_data.user_id,
            UserFavorite.book_id == toggle_data.book_id
        )
    )
    result = await db.execute(query)
    existing_favorite = result.scalar_one_or_none()
    
    if existing_favorite:
        # Remove favorite
        await db.delete(existing_favorite)
        await db.commit()
        
        return UserFavoriteToggleResponse(
            user_id=toggle_data.user_id,
            book_id=toggle_data.book_id,
            action="removed",
            favorite=None,
            is_favorited=False
        )
    else:
        # Add favorite (reuse create logic)
        try:
            favorite_data = UserFavoriteCreate(
                user_id=toggle_data.user_id,
                book_id=toggle_data.book_id
            )
            
            # Verify user and book exist
            user_query = select(User).where(User.id == toggle_data.user_id)
            user_result = await db.execute(user_query)
            if not user_result.scalar_one_or_none():
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"User with ID {toggle_data.user_id} not found"
                )
            
            book_query = select(Book).where(Book.id == toggle_data.book_id)
            book_result = await db.execute(book_query)
            if not book_result.scalar_one_or_none():
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Book with ID {toggle_data.book_id} not found"
                )
            
            # Create favorite
            db_favorite = UserFavorite(**favorite_data.model_dump())
            db.add(db_favorite)
            await db.commit()
            await db.refresh(db_favorite)
            await db.refresh(db_favorite, ["book", "user"])
            
            return UserFavoriteToggleResponse(
                user_id=toggle_data.user_id,
                book_id=toggle_data.book_id,
                action="added",
                favorite=UserFavoriteResponse.model_validate(db_favorite),
                is_favorited=True
            )
            
        except Exception as e:
            await db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to add favorite: {str(e)}"
            )

@router.get("/user/{user_id}/books", response_model=UserFavoriteBooksResponse)
async def get_user_favorite_books(
    user_id: int = Path(..., description="ID of the user"),
    include_recent: bool = Query(True, description="Include recent favorites"),
    include_genres: bool = Query(True, description="Include favorite genres statistics"),
    db: AsyncSession = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    """Get all books favorited by a specific user with statistics"""
    
    # Security: Users can only see their own favorites (unless admin)
    if not current_user.is_admin and user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view your own favorites"
        )
    
    # Get user info
    user_query = select(User).where(User.id == user_id)
    user_result = await db.execute(user_query)
    user = user_result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found"
        )
    
    # Get all favorites with book details
    favorites_query = select(UserFavorite).options(
        selectinload(UserFavorite.book)
    ).where(UserFavorite.user_id == user_id).order_by(desc(UserFavorite.created_at))
    
    favorites_result = await db.execute(favorites_query)
    favorites = favorites_result.scalars().all()
    
    # Build response
    favorite_books = []
    for fav in favorites:
        if fav.book:
            book_data = {
                "id": fav.book.id,
                "title": fav.book.title,
                "author": fav.book.author,
                "genre": fav.book.genre,
                "publication_year": fav.book.publication_year,
                "cover_image": fav.book.cover_image,
                "favorited_at": fav.created_at.isoformat() if fav.created_at else None
            }
            favorite_books.append(book_data)
    
    response_data = {
        "user_id": user_id,
        "username": user.username,
        "favorite_books": favorite_books,
        "total_favorites": len(favorite_books)
    }
    
    # Add recent favorites (last 5)
    if include_recent and favorite_books:
        response_data["recent_favorites"] = favorite_books[:5]
    
    # Add favorite genres statistics
    if include_genres and favorite_books:
        genre_counts = {}
        for book in favorite_books:
            if book.get("genre"):
                genre_counts[book["genre"]] = genre_counts.get(book["genre"], 0) + 1
        
        favorite_genres = [
            {"genre": genre, "count": count}
            for genre, count in sorted(genre_counts.items(), key=lambda x: x[1], reverse=True)
        ]
        response_data["favorite_genres"] = favorite_genres
    
    return UserFavoriteBooksResponse(**response_data)

@router.get("/book/{book_id}/users", response_model=BookFavoritedByResponse)
async def get_book_favorited_by_users(
    book_id: int = Path(..., description="ID of the book"),
    include_recent: bool = Query(True, description="Include recent favorites"),
    include_rank: bool = Query(True, description="Include popularity ranking"),
    db: AsyncSession = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    """Get all users who favorited a specific book with statistics"""
    
    # Get book info
    book_query = select(Book).where(Book.id == book_id)
    book_result = await db.execute(book_query)
    book = book_result.scalar_one_or_none()
    
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Book with ID {book_id} not found"
        )
    
    # Get all favorites with user details
    favorites_query = select(UserFavorite).options(
        selectinload(UserFavorite.user)
    ).where(UserFavorite.book_id == book_id).order_by(desc(UserFavorite.created_at))
    
    favorites_result = await db.execute(favorites_query)
    favorites = favorites_result.scalars().all()
    
    # Build response
    favorited_by = []
    for fav in favorites:
        if fav.user:
            user_data = {
                "id": fav.user.id,
                "username": fav.user.username,
                "email": fav.user.email,
                "favorited_at": fav.created_at.isoformat() if fav.created_at else None
            }
            favorited_by.append(user_data)
    
    response_data = {
        "book_id": book_id,
        "book_title": book.title,
        "book_author": book.author,
        "favorited_by": favorited_by,
        "total_favorites": len(favorited_by)
    }
    
    # Add recent favorites (last 5)
    if include_recent and favorited_by:
        response_data["recent_favorites"] = favorited_by[:5]
    
    # Add popularity ranking
    if include_rank:
        # Get popularity rank among all books
        rank_query = text("""
            SELECT COUNT(*) + 1 as rank
            FROM (
                SELECT book_id, COUNT(*) as fav_count
                FROM user_favorites
                GROUP BY book_id
                HAVING COUNT(*) > (
                    SELECT COUNT(*) 
                    FROM user_favorites 
                    WHERE book_id = :book_id
                )
            ) as more_popular_books
        """)
        
        rank_result = await db.execute(rank_query, {"book_id": book_id})
        rank = rank_result.scalar() or 1
        response_data["popularity_rank"] = rank
    
    return BookFavoritedByResponse(**response_data)

@router.get("/statistics", response_model=UserFavoriteStatistics)
async def get_user_favorite_statistics(
    include_trends: bool = Query(True, description="Include daily trends for last 30 days"),
    db: AsyncSession = Depends(get_db),
    current_user: UserResponse = Depends(get_current_admin_user)  # Admin only
):
    """Get comprehensive statistics about user favorites (Admin only)"""
    
    # Basic statistics
    total_favorites_query = select(func.count(UserFavorite.id))
    total_favorites_result = await db.execute(total_favorites_query)
    total_favorites = total_favorites_result.scalar() or 0
    
    unique_users_query = select(func.count(func.distinct(UserFavorite.user_id)))
    unique_users_result = await db.execute(unique_users_query)
    unique_users = unique_users_result.scalar() or 0
    
    unique_books_query = select(func.count(func.distinct(UserFavorite.book_id)))
    unique_books_result = await db.execute(unique_books_query)
    unique_books = unique_books_result.scalar() or 0
    
    # Average favorites per user
    avg_favorites = total_favorites / unique_users if unique_users > 0 else 0
    
    # Most favorited books (top 10)
    most_favorited_query = text("""
        SELECT b.id, b.title, b.author, COUNT(uf.id) as favorite_count
        FROM books b
        JOIN user_favorites uf ON b.id = uf.book_id
        GROUP BY b.id, b.title, b.author
        ORDER BY favorite_count DESC
        LIMIT 10
    """)
    
    most_favorited_result = await db.execute(most_favorited_query)
    most_favorited_books = [
        {
            "book_id": row.id,
            "title": row.title,
            "author": row.author,
            "favorite_count": row.favorite_count
        }
        for row in most_favorited_result
    ]
    
    # Most active users (top 10)
    most_active_query = text("""
        SELECT u.id, u.username, COUNT(uf.id) as favorite_count
        FROM users u
        JOIN user_favorites uf ON u.id = uf.user_id
        GROUP BY u.id, u.username
        ORDER BY favorite_count DESC
        LIMIT 10
    """)
    
    most_active_result = await db.execute(most_active_query)
    most_active_users = [
        {
            "user_id": row.id,
            "username": row.username,
            "favorite_count": row.favorite_count
        }
        for row in most_active_result
    ]
    
    response_data = {
        "total_favorites": total_favorites,
        "unique_users": unique_users,
        "unique_books": unique_books,
        "average_favorites_per_user": round(avg_favorites, 2),
        "most_favorited_books": most_favorited_books,
        "most_active_users": most_active_users
    }
    
    # Daily trends for last 30 days
    if include_trends:
        trends_query = text("""
            SELECT DATE(created_at) as date, COUNT(*) as count
            FROM user_favorites
            WHERE created_at >= :start_date
            GROUP BY DATE(created_at)
            ORDER BY date DESC
        """)
        
        start_date = datetime.now() - timedelta(days=30)
        trends_result = await db.execute(trends_query, {"start_date": start_date})
        
        daily_trends = [
            {
                "date": row.date.isoformat(),
                "count": row.count
            }
            for row in trends_result
        ]
        response_data["daily_favorites_trend"] = daily_trends
    
    return UserFavoriteStatistics(**response_data)

@router.post("/bulk", response_model=UserFavoriteBulkCreateResponse)
async def create_bulk_user_favorites(
    bulk_data: UserFavoriteBulkCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    """Create multiple user favorites in bulk"""
    
    created_favorites = []
    failed_favorites = []
    
    for favorite_data in bulk_data.favorites:
        try:
            # Security check for each favorite
            if not current_user.is_admin and favorite_data.user_id != current_user.id:
                failed_favorites.append({
                    "favorite": favorite_data.model_dump(),
                    "error": "You can only create favorites for yourself"
                })
                continue
            
            # Check if favorite already exists
            existing_query = select(UserFavorite).where(
                and_(
                    UserFavorite.user_id == favorite_data.user_id,
                    UserFavorite.book_id == favorite_data.book_id
                )
            )
            existing_result = await db.execute(existing_query)
            if existing_result.scalar_one_or_none():
                failed_favorites.append({
                    "favorite": favorite_data.model_dump(),
                    "error": "Favorite already exists"
                })
                continue
            
            # Create favorite
            db_favorite = UserFavorite(**favorite_data.model_dump())
            db.add(db_favorite)
            await db.flush()  # Get ID without committing
            
            # Load relationships
            await db.refresh(db_favorite, ["book", "user"])
            created_favorites.append(UserFavoriteResponse.model_validate(db_favorite))
            
        except Exception as e:
            failed_favorites.append({
                "favorite": favorite_data.model_dump(),
                "error": str(e)
            })
    
    # Commit all successful creations
    if created_favorites:
        await db.commit()
    else:
        await db.rollback()
    
    return UserFavoriteBulkCreateResponse(
        created=created_favorites,
        failed=failed_favorites,
        total_requested=len(bulk_data.favorites),
        total_created=len(created_favorites),
        total_failed=len(failed_favorites)
    )

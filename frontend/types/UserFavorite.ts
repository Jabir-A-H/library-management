/**
 * User Favorite interface matching the backend schema structure
 * This ensures type safety between frontend and backend for user favorites functionality
 */

// Core UserFavorite interface
export interface UserFavorite {
  id: number;
  user_id: number;
  book_id: number;
  created_at?: string;
  
  // Nested relationships (optional for performance-critical operations)
  book?: {
    id: number;
    title: string;
    author: string;
    genre?: string;
    cover_image?: string;
    publication_year?: number;
  };
  user?: {
    id: number;
    username: string;
    email?: string;
  };
}

/**
 * Type for creating a new user favorite
 */
export type UserFavoriteCreate = Pick<UserFavorite, 'user_id' | 'book_id'>;

/**
 * Type for updating a user favorite (minimal operations)
 */
export type UserFavoriteUpdate = Partial<Pick<UserFavorite, 'user_id' | 'book_id'>>;

/**
 * Simplified user favorite response for performance-critical operations
 */
export interface UserFavoriteSimple {
  id: number;
  user_id: number;
  book_id: number;
  created_at?: string;
}

/**
 * Paginated response for user favorite lists
 */
export interface UserFavoriteListResponse {
  favorites: UserFavorite[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

/**
 * User's favorite books aggregated response
 */
export interface UserFavoriteBooksResponse {
  user_id: number;
  username: string;
  favorite_books: Array<{
    id: number;
    title: string;
    author: string;
    genre?: string;
    publication_year?: number;
    cover_image?: string;
    favorited_at?: string;
  }>;
  total_favorites: number;
  recent_favorites?: Array<{
    id: number;
    title: string;
    author: string;
    favorited_at?: string;
  }>;
  favorite_genres?: Array<{
    genre: string;
    count: number;
  }>;
}

/**
 * Book's favorited by users aggregated response
 */
export interface BookFavoritedByResponse {
  book_id: number;
  book_title: string;
  book_author?: string;
  favorited_by: Array<{
    id: number;
    username: string;
    email?: string;
    favorited_at?: string;
  }>;
  total_favorites: number;
  recent_favorites?: Array<{
    id: number;
    username: string;
    favorited_at?: string;
  }>;
  popularity_rank?: number;
}

/**
 * Search and filter options for user favorites
 */
export interface UserFavoriteSearchFilters {
  user_id?: number;
  book_id?: number;
  genre?: string;
  author?: string;
  created_after?: string;
  created_before?: string;
}

/**
 * Statistical information about user favorites
 */
export interface UserFavoriteStatistics {
  total_favorites: number;
  unique_users: number;
  unique_books: number;
  average_favorites_per_user: number;
  most_favorited_books: Array<{
    book_id: number;
    title: string;
    author: string;
    favorite_count: number;
  }>;
  most_active_users: Array<{
    user_id: number;
    username: string;
    favorite_count: number;
  }>;
  daily_favorites_trend?: Array<{
    date: string;
    count: number;
  }>;
}

/**
 * Bulk operations for user favorites
 */
export interface UserFavoriteBulkCreate {
  favorites: UserFavoriteCreate[];
}

export interface UserFavoriteBulkCreateResponse {
  created: UserFavorite[];
  failed: Array<{
    favorite: UserFavoriteCreate;
    error: string;
  }>;
  total_requested: number;
  total_created: number;
  total_failed: number;
}

/**
 * Toggle favorite status
 */
export interface UserFavoriteToggle {
  user_id: number;
  book_id: number;
}

export interface UserFavoriteToggleResponse {
  user_id: number;
  book_id: number;
  action: 'added' | 'removed';
  favorite?: UserFavorite;
  is_favorited: boolean;
}
/**
 * User interface matching the backend SQLAlchemy model structure
 * This ensures type safety between frontend and backend
 */
export interface User {
  // Primary fields
  id: number;
  username: string;
  email: string;
  hashed_password?: string; // Only for backend, should not be exposed to frontend
  role: 'admin' | 'user' | 'librarian';
  comments?: string;

  // Computed properties from backend
  is_admin?: boolean;
  is_active?: boolean;
  full_name?: string;
  password_hash?: string; // Legacy alias

  // Timestamps
  created_at?: string;
  updated_at?: string;
}

/**
 * Type for user registration (excludes computed and sensitive fields)
 */
export type UserCreate = {
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'user' | 'librarian';
  comments?: string;
};

/**
 * Type for user updates (excludes password and sensitive fields)
 */
export type UserUpdate = {
  username?: string;
  email?: string;
  role?: 'admin' | 'user' | 'librarian';
  comments?: string;
};

/**
 * Type for password change
 */
export type UserPasswordChange = {
  current_password: string;
  new_password: string;
};

/**
 * Type for login credentials
 */
export type UserLogin = {
  username: string;
  password: string;
};

/**
 * Type for authentication response
 */
export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

/**
 * Search filters for user queries
 */
export interface UserSearchFilters {
  search?: string;
  role?: string;
  is_active?: boolean;
}

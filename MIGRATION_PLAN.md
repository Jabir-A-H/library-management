# Migration Plan: ছোটপাতা পাঠাগার
## একটি পাঠাগার ম্যানেজমেন্ট সিস্টেম

This document outlines a step-by-step plan to migrate the Chotopata Pathagar system to a modern, industry-standard tech stack.

---

## Phase 1: Backend Stabilization (FastAPI + PostgreSQL) ✅ COMPLETED

### Step 1: Database Setup ✅ COMPLETED

✅ **PostgreSQL database has been manually created using the SQL file:**
   - Database structure created with all required tables
   - Enhanced schema includes multilingual support (Bangla fields)
   - Proper indexing and relationships established
   - Sample data inserted for testing

✅ **Database includes the following enhanced features:**
   - **Books table**: Enhanced with Bangla fields, physical location tracking, copy management
   - **Borrowers table**: Enhanced with Bangla fields, relationship tracking, book count management
   - **Categories table**: Hierarchical categorization system
   - **Tags table**: Flexible tagging with multilingual support
   - **Preview images**: Multiple images per book with captions
   - **User favorites**: User preference tracking
   - **Comprehensive indexing**: Optimized for common queries

**Database Schema Summary:**
- `users` - System users with role-based access
- `books` - Enhanced book records with location and multilingual support
- `borrowers` - Enhanced borrower records with relationship tracking
- `lending_records` - Book lending transaction history
- `categories` - Hierarchical book categorization
- `tags` - Flexible book tagging system
- `book_tags` - Many-to-many book-tag relationships
- `book_preview_images` - Multiple images per book
- `user_favorites` - User book preferences

**Updated SQLAlchemy Models:**
✅ **All models have been updated to match the PostgreSQL schema:**
   - `book_async.py` - Enhanced with Bangla fields, location tracking, inventory management
   - `borrower_async.py` - Enhanced with Bangla fields, relationship tracking
   - `user_async.py` - Updated with role-based access and comments
   - `lending_record_async.py` - Enhanced with proper field naming and status tracking
   - `category_async.py` - New hierarchical categorization model
   - `tag_async.py` - New flexible tagging model with Bangla support
   - `book_tag_async.py` - Many-to-many relationship table
   - `book_preview_image_async.py` - Multiple images per book with captions
   - `user_favorite_async.py` - User preference tracking

**Key Model Enhancements:**
- **Multilingual Support**: Bangla (_bn) fields for title, author, description, etc.
- **Physical Location**: Room, shelf, column, row tracking for books
- **Inventory Management**: total_copies and available_copies tracking
- **Relationship Tracking**: Borrower relationship field (friend, family, colleague, etc.)
- **Hierarchical Categories**: Parent-child category relationships
- **Flexible Tagging**: Many-to-many book-tag relationships
- **Image Management**: Multiple preview images with captions and display order
- **Role-based Access**: User roles (admin, librarian, user)

**Next Steps:**
1. ✅ Update SQLAlchemy models to match the new database schema
2. ✅ Test database connectivity and model synchronization
3. ✅ Update API endpoints to use the enhanced schema

### Step 2: Finalize FastAPI Models & Routes

1. **Complete models with proper relationships:**
   - Add foreign key constraints
   - Implement cascade deletes where appropriate
   - Add indexes for performance
   - Include timestamps (created_at, updated_at)

2. **Implement proper error handling:**

   ```python
   # Create custom exception handlers
   @app.exception_handler(ValueError)
   async def value_error_handler(request: Request, exc: ValueError):
       return JSONResponse(
           status_code=400,
           content={"detail": str(exc)}
       )
   
   @app.exception_handler(HTTPException)
   async def http_exception_handler(request: Request, exc: HTTPException):
       return JSONResponse(
           status_code=exc.status_code,
           content={"detail": exc.detail}
       )
   ```

3. **Add pagination to list endpoints:**

   ```python
   # Add pagination parameters
   @router.get("/books", response_model=List[BookResponse])
   async def get_books(
       skip: int = Query(0, ge=0),
       limit: int = Query(10, ge=1, le=100),
       db: AsyncSession = Depends(get_db)
   ):
       # Implement pagination logic
       pass
   ```

4. **Implement filtering and sorting:**

   ```python
   # Add filter parameters
   @router.get("/books", response_model=List[BookResponse])
   async def get_books(
       title: Optional[str] = Query(None),
       author: Optional[str] = Query(None),
       genre: Optional[str] = Query(None),
       sort_by: Optional[str] = Query("title"),
       sort_order: Optional[str] = Query("asc"),
       db: AsyncSession = Depends(get_db)
   ):
       # Implement filtering and sorting logic
       pass
   ```

### Step 3: Test Backend Functionality

1. **Start FastAPI server:**

   ```sh
   uvicorn src.main_fastapi:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Test endpoints:**
   - Visit `http://localhost:8000/docs` for Swagger UI
   - Test CRUD operations for books, borrowers, lending records
   - Verify error handling works correctly

3. **Test database connection:**

   ```sh
   # Check if tables were created
   psql -U postgres -d library -c "\dt"
   ```

4. **Test Database Connectivity ✅ READY FOR TESTING**

**Database Test Script:**
A comprehensive test script has been created to verify:
- PostgreSQL connection
- Table existence validation
- Sample data verification
- SQLAlchemy model queries

**To run the test:**
```sh
cd backend
python test_db_connection.py
```

**Expected test results:**
- ✅ Database connection successful
- ✅ All 9 tables exist and accessible
- ✅ Sample data can be read
- ✅ SQLAlchemy models work correctly

---

## Phase 2: Authentication & Authorization

### Step 1: Create User Schema with Roles

1. **Define user roles and permissions:**

   Create `backend/src/models/role.py`:

   ```python
   from enum import Enum
   from sqlalchemy import Column, String, Integer, ForeignKey, Boolean, DateTime
   from sqlalchemy.orm import relationship
   from database_async import Base
   
   class Role(str, Enum):
       ADMIN = "admin"
       USER = "user"
       LIBRARIAN = "librarian"
   
   class Permission(str, Enum):
       READ_BOOKS = "read_books"
       WRITE_BOOKS = "write_books"
       DELETE_BOOKS = "delete_books"
       MANAGE_USERS = "manage_users"
       MANAGE_LENDING = "manage_lending"
   ```

2. **Create user schemas:**

   Update `backend/src/schemas/user.py`:

   ```python
   from pydantic import BaseModel, EmailStr
   from typing import Optional
   from datetime import datetime
   from models.role import Role
   
   class UserBase(BaseModel):
       username: str
       email: EmailStr
       full_name: Optional[str] = None
       is_active: bool = True
   
   class UserCreate(UserBase):
       password: str
       role: Role = Role.USER
   
   class UserResponse(UserBase):
       id: int
       role: Role
       created_at: datetime
       updated_at: datetime
   
   class UserLogin(BaseModel):
       username: str
       password: str
   
   class Token(BaseModel):
       access_token: str
       token_type: str
       expires_in: int
   ```

### Step 2: Implement JWT Authentication

1. **Install authentication dependencies:**

   ```sh
   pip install "python-jose[cryptography]" "passlib[bcrypt]" python-multipart
   ```

2. **Create authentication utilities:**

   Create `backend/src/utils/auth.py`:

   ```python
   import os
   from datetime import datetime, timedelta
   from typing import Optional
   from jose import JWTError, jwt
   from passlib.context import CryptContext
   from fastapi import HTTPException, status
   
   # Configuration
   SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
   ALGORITHM = "HS256"
   ACCESS_TOKEN_EXPIRE_MINUTES = 30
   
   pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
   
   def verify_password(plain_password, hashed_password):
       return pwd_context.verify(plain_password, hashed_password)
   
   def get_password_hash(password):
       return pwd_context.hash(password)
   
   def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
       to_encode = data.copy()
       if expires_delta:
           expire = datetime.utcnow() + expires_delta
       else:
           expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
       to_encode.update({"exp": expire})
       encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
       return encoded_jwt
   
   def verify_token(token: str):
       try:
           payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
           username: str = payload.get("sub")
           if username is None:
               raise HTTPException(
                   status_code=status.HTTP_401_UNAUTHORIZED,
                   detail="Could not validate credentials"
               )
           return username
       except JWTError:
           raise HTTPException(
               status_code=status.HTTP_401_UNAUTHORIZED,
               detail="Could not validate credentials"
           )
   ```

3. **Create authentication dependencies:**

   Create `backend/src/dependencies/auth.py`:

   ```python
   from fastapi import Depends, HTTPException, status
   from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
   from sqlalchemy.ext.asyncio import AsyncSession
   from utils.auth import verify_token
   from database_async import get_db
   from models.user_async import User
   from models.role import Role
   from typing import List
   
   security = HTTPBearer()
   
   async def get_current_user(
       credentials: HTTPAuthorizationCredentials = Depends(security),
       db: AsyncSession = Depends(get_db)
   ):
       username = verify_token(credentials.credentials)
       user = await db.execute(
           select(User).where(User.username == username)
       )
       user = user.scalar_one_or_none()
       if user is None:
           raise HTTPException(
               status_code=status.HTTP_401_UNAUTHORIZED,
               detail="User not found"
           )
       return user
   
   def role_required(allowed_roles: List[Role]):
       def decorator(func):
           @wraps(func)
           async def wrapper(current_user: User = Depends(get_current_user), *args, **kwargs):
               if current_user.role not in allowed_roles:
                   raise HTTPException(
                       status_code=status.HTTP_403_FORBIDDEN,
                       detail="Not enough permissions"
                   )
               return await func(current_user=current_user, *args, **kwargs)
           return wrapper
       return decorator
   ```

### Step 3: Create Authentication Routes

1. **Create auth router:**

   Create `backend/src/routes/auth_async.py`:

   ```python
   from fastapi import APIRouter, Depends, HTTPException, status
   from sqlalchemy.ext.asyncio import AsyncSession
   from sqlalchemy import select
   from database_async import get_db
   from models.user_async import User
   from schemas.user import UserCreate, UserLogin, Token, UserResponse
   from utils.auth import verify_password, get_password_hash, create_access_token
   from datetime import timedelta
   
   router = APIRouter(prefix="/auth", tags=["authentication"])
   
   @router.post("/register", response_model=UserResponse)
   async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
       # Check if user already exists
       existing_user = await db.execute(
           select(User).where(User.username == user.username)
       )
       if existing_user.scalar_one_or_none():
           raise HTTPException(
               status_code=status.HTTP_400_BAD_REQUEST,
               detail="Username already registered"
           )
       
       # Create new user
       hashed_password = get_password_hash(user.password)
       db_user = User(
           username=user.username,
           email=user.email,
           hashed_password=hashed_password,
           role=user.role
       )
       db.add(db_user)
       await db.commit()
       await db.refresh(db_user)
       return db_user
   
   @router.post("/login", response_model=Token)
   async def login(user: UserLogin, db: AsyncSession = Depends(get_db)):
       # Authenticate user
       db_user = await db.execute(
           select(User).where(User.username == user.username)
       )
       db_user = db_user.scalar_one_or_none()
       
       if not db_user or not verify_password(user.password, db_user.hashed_password):
           raise HTTPException(
               status_code=status.HTTP_401_UNAUTHORIZED,
               detail="Incorrect username or password"
           )
       
       # Create access token
       access_token_expires = timedelta(minutes=30)
       access_token = create_access_token(
           data={"sub": db_user.username}, expires_delta=access_token_expires
       )
       
       return {
           "access_token": access_token,
           "token_type": "bearer",
           "expires_in": 1800
       }
   
   @router.get("/me", response_model=UserResponse)
   async def get_current_user_info(current_user: User = Depends(get_current_user)):
       return current_user
   ```

### Step 4: Protect Existing Routes

1. **Update book routes with authentication:**

   Update `backend/src/routes/book_async.py`:

   ```python
   from dependencies.auth import get_current_user, role_required
   from models.role import Role
   
   @router.post("/books", response_model=BookResponse)
   @role_required([Role.ADMIN, Role.LIBRARIAN])
   async def create_book(
       book: BookCreate,
       current_user: User = Depends(get_current_user),
       db: AsyncSession = Depends(get_db)
   ):
       # Implementation
       pass
   
   @router.get("/books", response_model=List[BookResponse])
   async def get_books(
       current_user: User = Depends(get_current_user),
       db: AsyncSession = Depends(get_db)
   ):
       # Implementation
       pass
   ```

2. **Test authentication:**

   ```sh
   # Test user registration
   curl -X POST "http://localhost:8000/api/auth/register" \
        -H "Content-Type: application/json" \
        -d '{"username": "testuser", "email": "test@example.com", "password": "testpass123"}'
   
   # Test user login
   curl -X POST "http://localhost:8000/api/auth/login" \
        -H "Content-Type: application/json" \
        -d '{"username": "testuser", "password": "testpass123"}'
   
   # Test protected route
   curl -X GET "http://localhost:8000/api/books" \
        -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```

---

## Phase 3: Complete Next.js Frontend Migration

### Step 1: Restructure Frontend for Next.js

1. **Create proper Next.js directory structure:**

   ```[]
   frontend/
     pages/
       _app.tsx              # Global app wrapper
       _document.tsx         # Custom document structure
       index.tsx             # Home page
       login.tsx             # Login page
       register.tsx          # Register page
       books/
         index.tsx           # Books list page
         [id].tsx            # Book details page
         add.tsx             # Add book page
         edit/[id].tsx       # Edit book page
       borrowers/
         index.tsx           # Borrowers list page
         [id].tsx            # Borrower details page
         add.tsx             # Add borrower page
       lending/
         index.tsx           # Lending records page
         checkout.tsx        # Checkout book page
         return.tsx          # Return book page
       admin/
         index.tsx           # Admin dashboard
         users.tsx           # User management
         settings.tsx        # System settings
     components/
       layouts/
         Layout.tsx          # Main layout component
         AdminLayout.tsx     # Admin layout
         AuthLayout.tsx      # Auth pages layout
       ui/                   # Existing UI components
       forms/                # Form components
       tables/               # Table components
     lib/
       api.tsx              # API utilities
       reactQueryHooks.ts   # React Query hooks
       auth.ts              # Authentication utilities
     types/                 # TypeScript types
     styles/               # Global styles
     middleware.ts         # Next.js middleware for auth
   ```

2. **Create Next.js configuration:**

   Update `frontend/next.config.js`:

   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     reactStrictMode: true,
     swcMinify: true,
     env: {
       API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:8000',
     },
     images: {
       domains: ['localhost'],
     },
     async rewrites() {
       return [
         {
           source: '/api/:path*',
           destination: 'http://localhost:8000/api/:path*',
         },
       ];
     },
   };
   
   module.exports = nextConfig;
   ```

3. **Update package.json with Next.js dependencies:**

   ```json
   {
     "scripts": {
       "dev": "next dev",
       "build": "next build",
       "start": "next start",
       "lint": "next lint"
     },
     "dependencies": {
       "next": "^14.0.0",
       "react": "^18.2.0",
       "react-dom": "^18.2.0",
       "next-auth": "^4.24.0",
       "@tanstack/react-query": "^5.0.0",
       "@tanstack/react-query-devtools": "^5.0.0"
     }
   }
   ```

### Step 2: Implement Server-Side Rendering (SSR)

1. **Create SSR-enabled pages:**

   Create `frontend/pages/books/index.tsx`:

   ```typescript
   import { GetServerSideProps } from 'next';
   import { QueryClient, dehydrate } from '@tanstack/react-query';
   import { BookList } from '@/components/BookList';
   import { useBooks } from '@/lib/reactQueryHooks';
   import { getBooks } from '@/lib/api';
   import Layout from '@/components/layouts/Layout';
   
   export default function BooksPage() {
     const { data: books, isLoading, error } = useBooks();
   
     if (isLoading) return <div>Loading...</div>;
     if (error) return <div>Error loading books</div>;
   
     return (
       <Layout>
         <div className="container mx-auto px-4 py-8">
           <h1 className="text-3xl font-bold mb-8">Library Books</h1>
           <BookList books={books} />
         </div>
       </Layout>
     );
   }
   
   export const getServerSideProps: GetServerSideProps = async (context) => {
     const queryClient = new QueryClient();
   
     try {
       await queryClient.prefetchQuery({
         queryKey: ['books'],
         queryFn: getBooks,
       });
   
       return {
         props: {
           dehydratedState: dehydrate(queryClient),
         },
       };
     } catch (error) {
       return {
         props: {
           dehydratedState: dehydrate(queryClient),
         },
       };
     }
   };
   ```

2. **Create dynamic routes for book details:**

   Create `frontend/pages/books/[id].tsx`:

   ```typescript
   import { GetServerSideProps } from 'next';
   import { useRouter } from 'next/router';
   import { QueryClient, dehydrate } from '@tanstack/react-query';
   import { useBook } from '@/lib/reactQueryHooks';
   import { getBook } from '@/lib/api';
   import { BookDetails } from '@/components/BookDetails';
   import Layout from '@/components/layouts/Layout';
   
   export default function BookDetailsPage() {
     const router = useRouter();
     const { id } = router.query;
     const { data: book, isLoading, error } = useBook(Number(id));
   
     if (isLoading) return <div>Loading...</div>;
     if (error) return <div>Error loading book</div>;
     if (!book) return <div>Book not found</div>;
   
     return (
       <Layout>
         <div className="container mx-auto px-4 py-8">
           <BookDetails book={book} />
         </div>
       </Layout>
     );
   }
   
   export const getServerSideProps: GetServerSideProps = async (context) => {
     const { id } = context.params!;
     const queryClient = new QueryClient();
   
     try {
       await queryClient.prefetchQuery({
         queryKey: ['book', Number(id)],
         queryFn: () => getBook(Number(id)),
       });
   
       return {
         props: {
           dehydratedState: dehydrate(queryClient),
         },
       };
     } catch (error) {
       return {
         notFound: true,
       };
     }
   };
   ```

### Step 3: Setup Authentication with NextAuth.js

1. **Install and configure NextAuth.js:**

   ```sh
   npm install next-auth
   ```

   Create `frontend/pages/api/auth/[...nextauth].ts`:

   ```typescript
   import NextAuth from 'next-auth';
   import CredentialsProvider from 'next-auth/providers/credentials';
   import { loginUser } from '@/lib/api';
   
   export default NextAuth({
     providers: [
       CredentialsProvider({
         name: 'credentials',
         credentials: {
           username: { label: 'Username', type: 'text' },
           password: { label: 'Password', type: 'password' },
         },
         async authorize(credentials) {
           try {
             const response = await loginUser({
               username: credentials?.username || '',
               password: credentials?.password || '',
             });
             
             if (response.access_token) {
               return {
                 id: response.user.id,
                 name: response.user.username,
                 email: response.user.email,
                 role: response.user.role,
                 accessToken: response.access_token,
               };
             }
             return null;
           } catch (error) {
             return null;
           }
         },
       }),
     ],
     callbacks: {
       async jwt({ token, user }) {
         if (user) {
           token.accessToken = user.accessToken;
           token.role = user.role;
         }
         return token;
       },
       async session({ session, token }) {
         session.accessToken = token.accessToken;
         session.user.role = token.role;
         return session;
       },
     },
     pages: {
       signIn: '/login',
       signOut: '/logout',
     },
     session: {
       strategy: 'jwt',
     },
   });
   ```

2. **Create authentication context:**

   Create `frontend/lib/auth.ts`:

   ```typescript
   import { useSession } from 'next-auth/react';
   import { useRouter } from 'next/router';
   import { useEffect } from 'react';
   
   export enum Role {
     ADMIN = 'admin',
     USER = 'user',
     LIBRARIAN = 'librarian',
   }
   
   export function useAuth() {
     const { data: session, status } = useSession();
     
     return {
       user: session?.user,
       isLoading: status === 'loading',
       isAuthenticated: status === 'authenticated',
       role: session?.user?.role as Role,
     };
   }
   
   export function useAuthGuard(requiredRoles?: Role[]) {
     const { user, isLoading, isAuthenticated, role } = useAuth();
     const router = useRouter();
   
     useEffect(() => {
       if (!isLoading && !isAuthenticated) {
         router.push('/login');
       } else if (requiredRoles && role && !requiredRoles.includes(role)) {
         router.push('/unauthorized');
       }
     }, [isLoading, isAuthenticated, role, requiredRoles, router]);
   
     return { user, isLoading, isAuthenticated, role };
   }
   ```

### Step 4: Create Protected Routes and Role-Based Access

1. **Create middleware for route protection:**

   Create `frontend/middleware.ts`:

   ```typescript
   import { withAuth } from 'next-auth/middleware';
   
   export default withAuth(
     function middleware(req) {
       // Additional middleware logic if needed
     },
     {
       callbacks: {
         authorized: ({ token, req }) => {
           const { pathname } = req.nextUrl;
           
           // Admin routes
           if (pathname.startsWith('/admin')) {
             return token?.role === 'admin';
           }
           
           // Protected routes
           if (pathname.startsWith('/books') || pathname.startsWith('/borrowers')) {
             return !!token;
           }
           
           return true;
         },
       },
     }
   );
   
   export const config = {
     matcher: ['/admin/:path*', '/books/:path*', '/borrowers/:path*', '/lending/:path*'],
   };
   ```

2. **Create role-based component wrapper:**

   Create `frontend/components/RoleGuard.tsx`:

   ```typescript
   import { useAuth, Role } from '@/lib/auth';
   import { ReactNode } from 'react';
   
   interface RoleGuardProps {
     children: ReactNode;
     allowedRoles: Role[];
     fallback?: ReactNode;
   }
   
   export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
     const { role, isLoading } = useAuth();
   
     if (isLoading) {
       return <div>Loading...</div>;
     }
   
     if (!role || !allowedRoles.includes(role)) {
       return fallback || <div>Access denied</div>;
     }
   
     return <>{children}</>;
   }
   ```

### Step 5: Test Frontend Migration

1. **Test SSR functionality:**

   ```sh
   npm run dev
   # Visit pages and check that they load with server-side data
   ```

2. **Test authentication flow:**

   ```sh
   # Test login, logout, and protected routes
   # Verify role-based access control
   ```

3. **Test API integration:**

   ```sh
   # Verify React Query hooks work with Next.js
   # Test CRUD operations through the UI
   ```

---

## Phase 4: Testing Infrastructure

### Step 1: Backend Testing Setup

1. **Install testing dependencies:**

   ```sh
   cd backend
   pip install pytest pytest-asyncio httpx pytest-mock pytest-cov
   ```

2. **Create test configuration:**

   Create `backend/pytest.ini`:

   ```ini
   [tool:pytest]
   testpaths = tests
   python_files = test_*.py *_test.py
   python_classes = Test*
   python_functions = test_*
   addopts = 
       --strict-markers
       --disable-warnings
       --cov=src
       --cov-report=html
       --cov-report=term-missing
   asyncio_mode = auto
   ```

3. **Create test database configuration:**

   Create `backend/tests/conftest.py`:

   ```python
   import pytest
   import asyncio
   from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
   from sqlalchemy.orm import sessionmaker
   from httpx import AsyncClient
   from src.main_fastapi import app
   from src.database_async import Base, get_db
   from src.models.user_async import User
   from src.models.book_async import Book
   from src.models.borrower_async import Borrower
   from src.utils.auth import get_password_hash
   
   # Test database URL
   TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"
   
   @pytest.fixture(scope="session")
   def event_loop():
       loop = asyncio.get_event_loop_policy().new_event_loop()
       yield loop
       loop.close()
   
   @pytest.fixture
   async def db_session():
       engine = create_async_engine(TEST_DATABASE_URL)
       async with engine.begin() as conn:
           await conn.run_sync(Base.metadata.create_all)
       
       async_session = sessionmaker(
           engine, class_=AsyncSession, expire_on_commit=False
       )
       
       async with async_session() as session:
           yield session
       
       await engine.dispose()
   
   @pytest.fixture
   async def client(db_session):
       def override_get_db():
           return db_session
       
       app.dependency_overrides[get_db] = override_get_db
       
       async with AsyncClient(app=app, base_url="http://test") as ac:
           yield ac
   
   @pytest.fixture
   async def test_user(db_session):
       user = User(
           username="testuser",
           email="test@example.com",
           hashed_password=get_password_hash("testpass123"),
           role="user"
       )
       db_session.add(user)
       await db_session.commit()
       await db_session.refresh(user)
       return user
   
   @pytest.fixture
   async def admin_user(db_session):
       user = User(
           username="admin",
           email="admin@example.com",
           hashed_password=get_password_hash("adminpass123"),
           role="admin"
       )
       db_session.add(user)
       await db_session.commit()
       await db_session.refresh(user)
       return user
   
   @pytest.fixture
   async def test_book(db_session):
       book = Book(
           title="Test Book",
           author="Test Author",
           isbn="1234567890",
           genre="Fiction",
           publication_year=2023,
           total_copies=5,
           available_copies=5
       )
       db_session.add(book)
       await db_session.commit()
       await db_session.refresh(book)
       return book
   ```

4. **Create authentication tests:**

   Create `backend/tests/test_auth.py`:

   ```python
   import pytest
   from httpx import AsyncClient
   from src.models.user_async import User
   
   @pytest.mark.asyncio
   async def test_register_user(client: AsyncClient):
       response = await client.post("/api/auth/register", json={
           "username": "newuser",
           "email": "newuser@example.com",
           "password": "password123"
       })
       assert response.status_code == 200
       data = response.json()
       assert data["username"] == "newuser"
       assert data["email"] == "newuser@example.com"
       assert "id" in data
   
   @pytest.mark.asyncio
   async def test_login_user(client: AsyncClient, test_user: User):
       response = await client.post("/api/auth/login", json={
           "username": test_user.username,
           "password": "testpass123"
       })
       assert response.status_code == 200
       data = response.json()
       assert "access_token" in data
       assert data["token_type"] == "bearer"
   
   @pytest.mark.asyncio
   async def test_get_current_user(client: AsyncClient, test_user: User):
       # Login first
       login_response = await client.post("/api/auth/login", json={
           "username": test_user.username,
           "password": "testpass123"
       })
       token = login_response.json()["access_token"]
       
       # Get user info
       response = await client.get("/api/auth/me", headers={
           "Authorization": f"Bearer {token}"
       })
       assert response.status_code == 200
       data = response.json()
       assert data["username"] == test_user.username
   ```

5. **Create CRUD tests:**

   Create `backend/tests/test_books.py`:

   ```python
   import pytest
   from httpx import AsyncClient
   from src.models.user_async import User
   from src.models.book_async import Book
   
   async def get_auth_headers(client: AsyncClient, user: User, password: str):
       login_response = await client.post("/api/auth/login", json={
           "username": user.username,
           "password": password
       })
       token = login_response.json()["access_token"]
       return {"Authorization": f"Bearer {token}"}
   
   @pytest.mark.asyncio
   async def test_create_book(client: AsyncClient, admin_user: User):
       headers = await get_auth_headers(client, admin_user, "adminpass123")
       
       response = await client.post("/api/books", json={
           "title": "New Book",
           "author": "New Author",
           "isbn": "9876543210",
           "genre": "Science Fiction",
           "publication_year": 2024,
           "total_copies": 3
       }, headers=headers)
       
       assert response.status_code == 200
       data = response.json()
       assert data["title"] == "New Book"
       assert data["author"] == "New Author"
   
   @pytest.mark.asyncio
   async def test_get_books(client: AsyncClient, test_user: User, test_book: Book):
       headers = await get_auth_headers(client, test_user, "testpass123")
       
       response = await client.get("/api/books", headers=headers)
       assert response.status_code == 200
       data = response.json()
       assert len(data) >= 1
       assert data[0]["title"] == test_book.title
   
   @pytest.mark.asyncio
   async def test_unauthorized_access(client: AsyncClient):
       response = await client.get("/api/books")
       assert response.status_code == 401
   ```

### Step 2: Frontend Testing Setup

1. **Install frontend testing dependencies:**

   ```sh
   cd frontend
   npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom msw @vitejs/plugin-react
   ```

2. **Create Vitest configuration:**

   Create `frontend/vitest.config.ts`:

   ```typescript
   import { defineConfig } from 'vitest/config';
   import react from '@vitejs/plugin-react';
   import path from 'path';
   
   export default defineConfig({
     plugins: [react()],
     test: {
       environment: 'jsdom',
       setupFiles: ['./src/test/setup.ts'],
       globals: true,
     },
     resolve: {
       alias: {
         '@': path.resolve(__dirname, './src'),
       },
     },
   });
   ```

3. **Create test setup file:**

   Create `frontend/src/test/setup.ts`:

   ```typescript
   import '@testing-library/jest-dom';
   import { server } from './mocks/server';
   
   beforeAll(() => server.listen());
   afterEach(() => server.resetHandlers());
   afterAll(() => server.close());
   ```

4. **Create API mocks:**

   Create `frontend/src/test/mocks/handlers.ts`:

   ```typescript
   import { rest } from 'msw';
   
   export const handlers = [
     rest.get('/api/books', (req, res, ctx) => {
       return res(
         ctx.json([
           {
             id: 1,
             title: 'Test Book',
             author: 'Test Author',
             isbn: '1234567890',
             genre: 'Fiction',
             publication_year: 2023,
             total_copies: 5,
             available_copies: 5,
           },
         ])
       );
     }),
   
     rest.post('/api/auth/login', (req, res, ctx) => {
       return res(
         ctx.json({
           access_token: 'test-token',
           token_type: 'bearer',
           expires_in: 1800,
         })
       );
     }),
   
     rest.get('/api/auth/me', (req, res, ctx) => {
       return res(
         ctx.json({
           id: 1,
           username: 'testuser',
           email: 'test@example.com',
           role: 'user',
         })
       );
     }),
   ];
   ```

   Create `frontend/src/test/mocks/server.ts`:

   ```typescript
   import { setupServer } from 'msw/node';
   import { handlers } from './handlers';
   
   export const server = setupServer(...handlers);
   ```

5. **Create component tests:**

   Create `frontend/src/components/__tests__/BookList.test.tsx`:

   ```typescript
   import { render, screen } from '@testing-library/react';
   import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
   import { BookList } from '../BookList';
   
   const createTestQueryClient = () => {
     return new QueryClient({
       defaultOptions: {
         queries: { retry: false },
         mutations: { retry: false },
       },
     });
   };
   
   const renderWithQueryClient = (component: React.ReactElement) => {
     const queryClient = createTestQueryClient();
     return render(
       <QueryClientProvider client={queryClient}>
         {component}
       </QueryClientProvider>
     );
   };
   
   describe('BookList', () => {
     const mockBooks = [
       {
         id: 1,
         title: 'Test Book',
         author: 'Test Author',
         isbn: '1234567890',
         genre: 'Fiction',
         publication_year: 2023,
         total_copies: 5,
         available_copies: 5,
       },
     ];
   
     it('renders books correctly', () => {
       renderWithQueryClient(<BookList books={mockBooks} />);
       
       expect(screen.getByText('Test Book')).toBeInTheDocument();
       expect(screen.getByText('Test Author')).toBeInTheDocument();
       expect(screen.getByText('Fiction')).toBeInTheDocument();
     });
   
     it('displays empty state when no books', () => {
       renderWithQueryClient(<BookList books={[]} />);
       
       expect(screen.getByText('No books found')).toBeInTheDocument();
     });
   });
   ```

### Step 3: Integration Testing

1. **Create end-to-end test setup:**

   ```sh
   npm install --save-dev @playwright/test
   npx playwright install
   ```

2. **Create Playwright configuration:**

   Create `frontend/playwright.config.ts`:

   ```typescript
   import { defineConfig, devices } from '@playwright/test';
   
   export default defineConfig({
     testDir: './e2e',
     fullyParallel: true,
     forbidOnly: !!process.env.CI,
     retries: process.env.CI ? 2 : 0,
     workers: process.env.CI ? 1 : undefined,
     reporter: 'html',
     use: {
       baseURL: 'http://localhost:3000',
       trace: 'on-first-retry',
     },
     projects: [
       {
         name: 'chromium',
         use: { ...devices['Desktop Chrome'] },
       },
     ],
     webServer: {
       command: 'npm run dev',
       url: 'http://localhost:3000',
       reuseExistingServer: !process.env.CI,
     },
   });
   ```

3. **Create integration tests:**

   Create `frontend/e2e/auth.spec.ts`:

   ```typescript
   import { test, expect } from '@playwright/test';
   
   test.describe('Authentication', () => {
     test('should login successfully', async ({ page }) => {
       await page.goto('/login');
       
       await page.fill('input[name="username"]', 'testuser');
       await page.fill('input[name="password"]', 'testpass123');
       await page.click('button[type="submit"]');
       
       await expect(page).toHaveURL('/');
       await expect(page.getByText('Welcome, testuser')).toBeVisible();
     });
   
     test('should show error for invalid credentials', async ({ page }) => {
       await page.goto('/login');
       
       await page.fill('input[name="username"]', 'wronguser');
       await page.fill('input[name="password"]', 'wrongpass');
       await page.click('button[type="submit"]');
       
       await expect(page.getByText('Invalid credentials')).toBeVisible();
     });
   });
   ```

### Step 4: Test Execution and Coverage

1. **Run backend tests:**

   ```sh
   cd backend
   pytest --cov=src --cov-report=html
   ```

2. **Run frontend tests:**

   ```sh
   cd frontend
   npm run test
   npm run test:coverage
   ```

3. **Run integration tests:**

   ```sh
   cd frontend
   npx playwright test
   ```

4. **Set up continuous testing:**

   Create `frontend/package.json` scripts:

   ```json
   {
     "scripts": {
       "test": "vitest run",
       "test:watch": "vitest",
       "test:coverage": "vitest run --coverage",
       "test:e2e": "playwright test",
       "test:e2e:ui": "playwright test --ui"
     }
   }
   ```

---

## Phase 5: Developer Experience & Documentation

### Step 1: Setup Development Tools

1. **Install and configure pre-commit hooks:**

   ```sh
   cd backend
   pip install pre-commit black isort flake8 mypy
   ```

   Create `backend/.pre-commit-config.yaml`:

   ```yaml
   repos:
     - repo: https://github.com/psf/black
       rev: 23.3.0
       hooks:
         - id: black
           language_version: python3.11
   
     - repo: https://github.com/pycqa/isort
       rev: 5.12.0
       hooks:
         - id: isort
           args: ["--profile", "black"]
   
     - repo: https://github.com/pycqa/flake8
       rev: 6.0.0
       hooks:
         - id: flake8
           args: [--max-line-length=88, --extend-ignore=E203]
   
     - repo: https://github.com/pre-commit/mirrors-mypy
       rev: v1.3.0
       hooks:
         - id: mypy
           additional_dependencies: [types-all]
   ```

   Install pre-commit:

   ```sh
   pre-commit install
   ```

2. **Configure ESLint and Prettier for frontend:**

   ```sh
   cd frontend
   npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-config-prettier eslint-plugin-prettier
   ```

   Create `frontend/.eslintrc.json`:

   ```json
   {
     "extends": [
       "next/core-web-vitals",
       "@typescript-eslint/recommended",
       "prettier"
     ],
     "parser": "@typescript-eslint/parser",
     "plugins": ["@typescript-eslint"],
     "rules": {
       "prefer-const": "error",
       "no-unused-vars": "off",
       "@typescript-eslint/no-unused-vars": "error",
       "@typescript-eslint/no-explicit-any": "warn"
     }
   }
   ```

   Create `frontend/.prettierrc`:

   ```json
   {
     "semi": true,
     "trailingComma": "es5",
     "singleQuote": true,
     "tabWidth": 2,
     "printWidth": 80
   }
   ```

### Step 2: Create Comprehensive Documentation

1. **Update main README.md:**

   Create `README.md`:

   ```markdown   # ছোটপাতা পাঠাগার

   A modern, full-stack library management system built with Next.js, FastAPI, and PostgreSQL.
   
   ## 🚀 Features
   
   - **Book Management**: Add, edit, delete, and search books
   - **Borrower Management**: Manage library users and their information
   - **Lending System**: Track book checkouts and returns
   - **Role-based Access**: Admin, Librarian, and User roles
   - **Modern UI**: Responsive design with dark/light themes
   - **RESTful API**: FastAPI backend with OpenAPI documentation
   - **Real-time Updates**: React Query for efficient data fetching
   - **Type Safety**: Full TypeScript coverage
   
   ## 🛠️ Tech Stack
   
   ### Frontend
   - **Next.js 14** - React framework with SSR/SSG
   - **TypeScript** - Type-safe JavaScript
   - **Tailwind CSS** - Utility-first CSS framework
   - **React Query** - Data fetching and caching
   - **NextAuth.js** - Authentication
   - **Radix UI** - Accessible UI components
   
   ### Backend
   - **FastAPI** - Modern Python web framework
   - **PostgreSQL** - Production-grade database
   - **SQLAlchemy** - Database ORM
   - **Alembic** - Database migrations
   - **JWT** - Secure authentication
   - **Pydantic** - Data validation
   
   ### DevOps
   - **Docker** - Containerization
   - **pytest** - Backend testing
   - **Vitest** - Frontend testing
   - **Playwright** - E2E testing
   
   ## 📋 Prerequisites
   
   - Node.js 18+ and npm/pnpm
   - Python 3.11+
   - PostgreSQL 14+
   - Docker (optional)
   
   ## 🏗️ Installation
   
   ### Using Docker (Recommended)
   
   1. Clone the repository:
        ```sh
        git clone <repository-url>
        cd library-management
        ```

   2. Start with Docker Compose:

        ```sh
        docker-compose up -d
        ```

   3. Access the application:
      - Frontend: <http://localhost:3000>
      - Backend API: <http://localhost:8000>
      - API Documentation: <http://localhost:8000/docs>

   ### Manual Installation

   1. **Database Setup:**

        ```sh
        # Install PostgreSQL and create database
        createdb -U postgres library
        ```

   2. **Backend Setup:**

        ```sh
        cd backend
        python -m venv venv
        source venv/bin/activate  # On Windows: venv\Scripts\activate
        pip install -r requirements.txt
    
        # Set environment variables
        cp .env.example .env
        # Edit .env with your database credentials

        # Run migrations
        alembic upgrade head

        # Start the server
        uvicorn src.main_fastapi:app --reload
        ```

   3. **Frontend Setup:**

      ```sh
      cd frontend
      npm install
      
      # Set environment variables
      cp .env.local.example .env.local
      # Edit .env.local with your API URL
      
      # Start the development server
      npm run dev
      ```

   ## 🧪 Testing

   ### Backend Tests

   ```sh
   cd backend
   pytest --cov=src --cov-report=html
   ```

   ### Frontend Tests

   ```sh
   cd frontend
   npm run test
   npm run test:coverage
   ```

   ### E2E Tests

   ```sh
   cd frontend
   npx playwright test
   ```

   ## 📚 API Documentation

   Once the backend is running, visit:
   - **Swagger UI**: <http://localhost:8000/docs>
   - **ReDoc**: <http://localhost:8000/redoc>

   ## 🔧 Development

   ### Project Structure

   ```[]
   library-management/
   ├── frontend/          # Next.js frontend
   │   ├── pages/         # Next.js pages
   │   ├── components/    # React components
   │   ├── lib/          # Utilities and API
   │   └── types/        # TypeScript types
   ├── backend/          # FastAPI backend
   │   ├── src/          # Source code
   │   ├── alembic/      # Database migrations
   │   └── tests/        # Test files
   └── docker-compose.yml # Docker configuration
   ```

   ### Environment Variables

   **Backend (.env):**

   ```[]
   DATABASE_URL=postgresql+asyncpg://user:password@localhost/library
   SECRET_KEY=your-secret-key-here
   ```

   **Frontend (.env.local):**

   ```[]
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret
   ```

   ## 🚀 Deployment

   ### Docker Deployment

   ```sh
   docker-compose -f docker-compose.prod.yml up -d
   ```

   ### Manual Deployment

   See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

   ## 🤝 Contributing

   1. Fork the repository
   2. Create a feature branch
   3. Make your changes
   4. Run tests
   5. Submit a pull request

   ## 📄 License

   This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

   ## 🆘 Support

   If you encounter any issues or have questions, please [create an issue](https://github.com/yourusername/library-management/issues).

   ```[]

2. **Create API documentation:**

   Create `backend/docs/API.md`:

   ```markdown
   # API Documentation
   
   ## Authentication
   
   All protected endpoints require a Bearer token in the Authorization header:
   ```

   Authorization: Bearer [your-jwt-token]

   ```[]
   
   ## Endpoints
   
   ### Authentication
   - `POST /api/auth/register` - Register new user
   - `POST /api/auth/login` - Login user
   - `GET /api/auth/me` - Get current user info
   
   ### Books
   - `GET /api/books` - List all books
   - `POST /api/books` - Create new book (Admin/Librarian only)
   - `GET /api/books/{id}` - Get book by ID
   - `PUT /api/books/{id}` - Update book (Admin/Librarian only)
   - `DELETE /api/books/{id}` - Delete book (Admin only)
   
   ### Borrowers
   - `GET /api/borrowers` - List all borrowers
   - `POST /api/borrowers` - Create new borrower
   - `GET /api/borrowers/{id}` - Get borrower by ID
   - `PUT /api/borrowers/{id}` - Update borrower
   - `DELETE /api/borrowers/{id}` - Delete borrower (Admin only)
   
   ### Lending
   - `GET /api/lending` - List lending records
   - `POST /api/lending/checkout` - Checkout book
   - `POST /api/lending/return` - Return book
   - `GET /api/lending/overdue` - Get overdue books
   
   For detailed request/response schemas, visit the Swagger UI at `/docs`.
   ```

3. **Create deployment guide:**

   Create `DEPLOYMENT.md`:

   ```markdown
   # Deployment Guide
   
   ## Production Deployment
   
   ### Option 1: Docker Compose (Recommended)
   
   1. Create production environment file:
        ```sh
        cp .env.example .env.production
        # Edit with production values
        ```

   2. Build and deploy:

      ```sh
      docker-compose -f docker-compose.prod.yml up -d
      ```

   ### Option 2: Manual Deployment

   #### Backend Deployment

   1. **Setup production server:**

      ```sh
      # Install dependencies
      sudo apt update
      sudo apt install python3.11 python3-pip postgresql nginx
      
      # Create application user
      sudo useradd -m -s /bin/bash library-app
      sudo su library-app
      ```

   2. **Setup application:**

      ```sh
      git clone <repository>
      cd library-management/backend
      python -m venv venv
      source venv/bin/activate
      pip install -r requirements.txt
      
      # Set production environment
      export DATABASE_URL="postgresql+asyncpg://user:pass@localhost/library"
      export SECRET_KEY="your-production-secret-key"
      
      # Run migrations
      alembic upgrade head
      
      # Start the server
      uvicorn src.main_fastapi:app --host 0.0.0.0 --port 8000
      ```

   3. **Setup systemd service:**

      ```sh
      # Create /etc/systemd/system/library-api.service
      [Unit]
      Description=ছোটপাতা পাঠাগার API
      After=network.target
      
      [Service]
      User=library-app
      Group=library-app
      WorkingDirectory=/home/library-app/library-management/backend
      ExecStart=/home/library-app/library-management/backend/venv/bin/uvicorn src.main_fastapi:app --host 0.0.0.0 --port 8000
      Restart=always
      
      [Install]
      WantedBy=multi-user.target
      ```

   4. **Configure Nginx:**

      ```nginx
      # /etc/nginx/sites-available/library-api
      server {
          listen 80;
          server_name your-domain.com;
          
          location / {
              proxy_pass http://localhost:8000;
              proxy_set_header Host $host;
              proxy_set_header X-Real-IP $remote_addr;
          }
      }
      ```

   #### Frontend Deployment

   1. **Build for production:**

      ```sh
      cd frontend
      npm run build
      ```

   2. **Deploy to static hosting:**
      - **Vercel**: Connect your GitHub repository
      - **Netlify**: Deploy the `frontend/out` directory
      - **AWS S3**: Upload build files to S3 bucket

   ## Environment Variables Deployment

   ### Production Backend

   ```[]
   DATABASE_URL=postgresql+asyncpg://user:pass@localhost/library
   SECRET_KEY=your-very-secure-secret-key
   CORS_ORIGINS=["https://your-frontend-domain.com"]
   ```

   ### Production Frontend

   ```[]
   NEXT_PUBLIC_API_URL=https://your-api-domain.com
1. **Create development scripts:**

   Create `backend/scripts/dev.py`:

   ```python
   #!/usr/bin/env python3
   """Development utility scripts."""
   
   import asyncio
   import sys
   from sqlalchemy.ext.asyncio import AsyncSession
   from src.database_async import get_db, engine
   from src.models.user_async import User
   from src.utils.auth import get_password_hash
   
   async def create_admin_user():
       """Create an admin user for development."""
       async with AsyncSession(engine) as db:
           admin = User(
               username="admin",
               email="admin@example.com",
               hashed_password=get_password_hash("admin123"),
               role="admin"
           )
           db.add(admin)
           await db.commit()
           print("Admin user created: admin/admin123")
   
   async def reset_database():
       """Reset database for development."""
       from src.database_async import Base
       async with engine.begin() as conn:
           await conn.run_sync(Base.metadata.drop_all)
           await conn.run_sync(Base.metadata.create_all)
       print("Database reset complete")
   
   if __name__ == "__main__":
       if len(sys.argv) > 1:
           command = sys.argv[1]
           if command == "create-admin":
               asyncio.run(create_admin_user())
           elif command == "reset-db":
               asyncio.run(reset_database())
           else:
               print("Available commands: create-admin, reset-db")
       else:
           print("Usage: python scripts/dev.py <command>")
   ```

2. **Add VS Code configuration:**

   Create `.vscode/settings.json`:

   ```json
   {
     "python.defaultInterpreterPath": "./backend/venv/bin/python",
     "python.testing.pytestArgs": ["backend/tests"],
     "python.testing.unittestEnabled": false,
     "python.testing.pytestEnabled": true,
     "python.formatting.provider": "black",
     "python.linting.enabled": true,
     "python.linting.pylintEnabled": false,
     "python.linting.flake8Enabled": true,
     "editor.formatOnSave": true,
     "typescript.preferences.importModuleSpecifier": "relative",
     "eslint.workingDirectories": ["frontend"]
   }
   ```

3. **Create Docker development environment:**

   Create `docker-compose.dev.yml`:

   ```yaml
   version: '3.8'
   services:
     postgres:
       image: postgres:15
       environment:
         POSTGRES_USER: postgres
         POSTGRES_PASSWORD: postgres
         POSTGRES_DB: library
       ports:
         - "5432:5432"
       volumes:
         - postgres_data:/var/lib/postgresql/data
   
     redis:
       image: redis:7-alpine
       ports:
         - "6379:6379"
   
     backend:
       build: ./backend
       volumes:
         - ./backend:/app
       ports:
         - "8000:8000"
       depends_on:
         - postgres
         - redis
       environment:
         - DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres/library
         - REDIS_URL=redis://redis:6379
       command: uvicorn src.main_fastapi:app --reload --host 0.0.0.0 --port 8000
   
     frontend:
       build: ./frontend
       volumes:
         - ./frontend:/app
         - /app/node_modules
       ports:
         - "3000:3000"
       depends_on:
         - backend
       environment:
         - NEXT_PUBLIC_API_URL=http://localhost:8000
   
   volumes:
     postgres_data:
   ```

### Step 4: Quality Assurance

1. **Create code quality checks:**

   Create `backend/pyproject.toml`:

   ```toml
   [tool.black]
   line-length = 88
   target-version = ['py311']
   
   [tool.isort]
   profile = "black"
   
   [tool.mypy]
   python_version = "3.11"
   warn_return_any = true
   warn_unused_configs = true
   disallow_untyped_defs = true
   
   [tool.pytest.ini_options]
   testpaths = ["tests"]
   python_files = ["test_*.py", "*_test.py"]
   addopts = "--cov=src --cov-report=html --cov-report=term-missing"
   ```

2. **Add GitHub Actions workflow:**

   Create `.github/workflows/ci.yml`:

   ```yaml
   name: CI/CD Pipeline
   
   on:
     push:
       branches: [ main, develop ]
     pull_request:
       branches: [ main ]
   
   jobs:
     backend-tests:
       runs-on: ubuntu-latest
       services:
         postgres:
           image: postgres:15
           env:
             POSTGRES_PASSWORD: postgres
             POSTGRES_DB: library
           options: >-
             --health-cmd pg_isready
             --health-interval 10s
             --health-timeout 5s
             --health-retries 5
   
       steps:
       - uses: actions/checkout@v3
       - name: Set up Python
         uses: actions/setup-python@v4
         with:
           python-version: '3.11'
       - name: Install dependencies
         run: |
           cd backend
           pip install -r requirements.txt
       - name: Run tests
         run: |
           cd backend
           pytest --cov=src --cov-report=xml
       - name: Upload coverage
         uses: codecov/codecov-action@v3
   
     frontend-tests:
       runs-on: ubuntu-latest
       steps:
       - uses: actions/checkout@v3
       - name: Set up Node.js
         uses: actions/setup-node@v3
         with:
           node-version: '18'
       - name: Install dependencies
         run: |
           cd frontend
           npm ci
       - name: Run tests
         run: |
           cd frontend
           npm run test:coverage
       - name: Build
         run: |
           cd frontend
           npm run build
   ```

---

## Phase 6: Deployment Preparation

### Step 1: Create Docker Configuration

1. **Create backend Dockerfile:**

   Create `backend/Dockerfile`:

   ```dockerfile
   FROM python:3.11-slim
   
   WORKDIR /app
   
   # Install system dependencies
   RUN apt-get update && apt-get install -y \
       build-essential \
       libpq-dev \
       && rm -rf /var/lib/apt/lists/*
   
   # Install Python dependencies
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt
   
   # Copy application code
   COPY . .
   
   # Create non-root user
   RUN groupadd -r appuser && useradd -r -g appuser appuser
   RUN chown -R appuser:appuser /app
   USER appuser
   
   # Expose port
   EXPOSE 8000
   
   # Health check
   HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
     CMD curl -f http://localhost:8000/health || exit 1
   
   # Run application
   CMD ["uvicorn", "src.main_fastapi:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

2. **Create frontend Dockerfile:**

   Create `frontend/Dockerfile`:

   ```dockerfile
   # Build stage
   FROM node:18-alpine AS builder
   
   WORKDIR /app
   
   # Install dependencies
   COPY package*.json ./
   RUN npm ci --only=production
   
   # Copy source code
   COPY . .
   
   # Build application
   RUN npm run build
   
   # Production stage
   FROM node:18-alpine AS runner
   
   WORKDIR /app
   
   # Create non-root user
   RUN addgroup -g 1001 -S nodejs
   RUN adduser -S nextjs -u 1001
   
   # Copy built application
   COPY --from=builder /app/public ./public
   COPY --from=builder /app/.next/standalone ./
   COPY --from=builder /app/.next/static ./.next/static
   
   # Set ownership
   RUN chown -R nextjs:nodejs /app
   USER nextjs
   
   # Expose port
   EXPOSE 3000
   
   # Health check
   HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
     CMD curl -f http://localhost:3000/api/health || exit 1
   
   # Run application
   CMD ["node", "server.js"]
   ```

3. **Create production Docker Compose:**

   Create `docker-compose.prod.yml`:

   ```yaml
   version: '3.8'
   
   services:
     postgres:
       image: postgres:15
       environment:
         POSTGRES_USER: ${POSTGRES_USER}
         POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
         POSTGRES_DB: ${POSTGRES_DB}
       volumes:
         - postgres_data:/var/lib/postgresql/data
         - ./backend/backups:/backups
       ports:
         - "5432:5432"
       restart: unless-stopped
       healthcheck:
         test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
         interval: 30s
         timeout: 10s
         retries: 3
   
     redis:
       image: redis:7-alpine
       command: redis-server --appendonly yes
       volumes:
         - redis_data:/data
       ports:
         - "6379:6379"
       restart: unless-stopped
       healthcheck:
         test: ["CMD", "redis-cli", "ping"]
         interval: 30s
         timeout: 10s
         retries: 3
   
     backend:
       build: ./backend
       environment:
         DATABASE_URL: postgresql+asyncpg://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
         REDIS_URL: redis://redis:6379
         SECRET_KEY: ${SECRET_KEY}
         CORS_ORIGINS: ${CORS_ORIGINS}
       ports:
         - "8000:8000"
       depends_on:
         postgres:
           condition: service_healthy
         redis:
           condition: service_healthy
       restart: unless-stopped
       healthcheck:
         test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
         interval: 30s
         timeout: 10s
         retries: 3
       volumes:
         - ./backend/uploads:/app/uploads
         - ./backend/logs:/app/logs
   
     frontend:
       build: ./frontend
       environment:
         NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
         NEXTAUTH_URL: ${NEXTAUTH_URL}
         NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
       ports:
         - "3000:3000"
       depends_on:
         backend:
           condition: service_healthy
       restart: unless-stopped
       healthcheck:
         test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
         interval: 30s
         timeout: 10s
         retries: 3
   
     nginx:
       image: nginx:alpine
       ports:
         - "80:80"
         - "443:443"
       volumes:
         - ./nginx/nginx.conf:/etc/nginx/nginx.conf
         - ./nginx/ssl:/etc/nginx/ssl
       depends_on:
         - frontend
         - backend
       restart: unless-stopped
   
   volumes:
     postgres_data:
     redis_data:
   ```

### Step 2: Environment Configuration

1. **Create environment templates:**

   Create `backend/.env.example`:

   ```env
   # Database Configuration
   DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/library
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_DB=library
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   
   # Redis Configuration
   REDIS_URL=redis://localhost:6379
   
   # Security
   SECRET_KEY=your-secret-key-here-change-in-production
   CORS_ORIGINS=["http://localhost:3000"]
   
   # JWT Configuration
   JWT_SECRET_KEY=your-jwt-secret-key-here
   JWT_ALGORITHM=HS256
   JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
   
   # Email Configuration (optional)
   SMTP_SERVER=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   
   # File Storage
   UPLOAD_DIR=uploads
   MAX_FILE_SIZE=10485760  # 10MB
   
   # Logging
   LOG_LEVEL=INFO
   LOG_FILE=logs/app.log
   
   # Development
   DEBUG=False
   ```

   Create `frontend/.env.local.example`:

   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:8000
   
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-here
   
   # Database URL for NextAuth (optional)
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/library
   
   # Third-party Services (optional)
   NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
   ```

2. **Create production environment:**

   Create `.env.production`:

   ```env
   # Database Configuration
   POSTGRES_USER=library_user
   POSTGRES_PASSWORD=secure_production_password
   POSTGRES_DB=library_production
   
   # Security
   SECRET_KEY=very-secure-secret-key-for-production
   CORS_ORIGINS=["https://your-domain.com"]
   
   # Frontend URLs
   NEXT_PUBLIC_API_URL=https://api.your-domain.com
   NEXTAUTH_URL=https://your-domain.com
   NEXTAUTH_SECRET=secure-nextauth-secret
   
   # SSL/TLS
   SSL_CERT_PATH=/etc/nginx/ssl/cert.pem
   SSL_KEY_PATH=/etc/nginx/ssl/key.pem
   ```

### Step 3: Database Backup and Recovery

1. **Create backup scripts:**

   Create `backend/scripts/backup.sh`:

   ```bash
   #!/bin/bash
   
   # Database backup script
   set -e
   
   # Configuration
   DB_NAME=${POSTGRES_DB:-library}
   DB_USER=${POSTGRES_USER:-postgres}
   BACKUP_DIR=${BACKUP_DIR:-./backups}
   DATE=$(date +%Y%m%d_%H%M%S)
   
   # Create backup directory
   mkdir -p $BACKUP_DIR
   
   # Create backup
   echo "Creating database backup..."
   pg_dump -U $DB_USER -h localhost $DB_NAME > $BACKUP_DIR/backup_$DATE.sql
   
   # Compress backup
   gzip $BACKUP_DIR/backup_$DATE.sql
   
   # Remove old backups (keep last 7 days)
   find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete
   
   echo "Backup completed: $BACKUP_DIR/backup_$DATE.sql.gz"
   ```

   Create `backend/scripts/restore.sh`:

   ```bash
   #!/bin/bash
   
   # Database restore script
   set -e
   
   if [ -z "$1" ]; then
       echo "Usage: $0 <backup_file>"
       exit 1
   fi
   
   BACKUP_FILE=$1
   DB_NAME=${POSTGRES_DB:-library}
   DB_USER=${POSTGRES_USER:-postgres}
   
   echo "Restoring database from $BACKUP_FILE..."
   
   # Drop existing database
   dropdb -U $DB_USER $DB_NAME --if-exists
   
   # Create new database
   createdb -U $DB_USER $DB_NAME
   
   # Restore from backup
   if [[ $BACKUP_FILE == *.gz ]]; then
       gunzip -c $BACKUP_FILE | psql -U $DB_USER $DB_NAME
   else
       psql -U $DB_USER $DB_NAME < $BACKUP_FILE
   fi
   
   echo "Database restored successfully"
   ```

2. **Setup automated backups:**

   Create `backend/scripts/setup_cron.sh`:

   ```bash
   #!/bin/bash
   
   # Setup automated backups
   
   # Add to crontab
   (crontab -l 2>/dev/null; echo "0 2 * * * /path/to/backup.sh") | crontab -
   
   echo "Automated backup scheduled for 2 AM daily"
   ```

### Step 4: Monitoring and Logging

1. **Add structured logging:**

   Create `backend/src/utils/logger.py`:

   ```python
   import logging
   import sys
   from typing import Optional
   import json
   from datetime import datetime
   
   class JSONFormatter(logging.Formatter):
       def format(self, record):
           log_entry = {
               'timestamp': datetime.utcnow().isoformat(),
               'level': record.levelname,
               'message': record.getMessage(),
               'module': record.module,
               'function': record.funcName,
               'line': record.lineno,
           }
           
           if record.exc_info:
               log_entry['exception'] = self.formatException(record.exc_info)
           
           return json.dumps(log_entry)
   
   def setup_logging(
       level: str = "INFO",
       log_file: Optional[str] = None,
       json_format: bool = True
   ):
       """Setup application logging."""
       
       # Create logger
       logger = logging.getLogger()
       logger.setLevel(getattr(logging, level.upper()))
       
       # Create formatter
       if json_format:
           formatter = JSONFormatter()
       else:
           formatter = logging.Formatter(
               '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
           )
       
       # Console handler
       console_handler = logging.StreamHandler(sys.stdout)
       console_handler.setFormatter(formatter)
       logger.addHandler(console_handler)
       
       # File handler
       if log_file:
           file_handler = logging.FileHandler(log_file)
           file_handler.setFormatter(formatter)
           logger.addHandler(file_handler)
       
       return logger
   ```

2. **Create health check endpoints:**

   Create `backend/src/routes/health.py`:

   ```python
   from fastapi import APIRouter, Depends
   from sqlalchemy.ext.asyncio import AsyncSession
   from sqlalchemy import text
   from database_async import get_db
   from datetime import datetime
   import redis
   import os
   
   router = APIRouter(prefix="/health", tags=["health"])
   
   @router.get("/")
   async def health_check():
       """Basic health check."""
       return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}
   
   @router.get("/db")
   async def database_health(db: AsyncSession = Depends(get_db)):
       """Database health check."""
       try:
           result = await db.execute(text("SELECT 1"))
           return {"status": "healthy", "database": "connected"}
       except Exception as e:
           return {"status": "unhealthy", "database": "error", "error": str(e)}
   
   @router.get("/redis")
   async def redis_health():
       """Redis health check."""
       try:
           r = redis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379"))
           r.ping()
           return {"status": "healthy", "redis": "connected"}
       except Exception as e:
           return {"status": "unhealthy", "redis": "error", "error": str(e)}
   ```

### Step 5: SSL/TLS and Security

1. **Create Nginx configuration:**

   Create `nginx/nginx.conf`:

   ```nginx
   events {
       worker_connections 1024;
   }
   
   http {
       upstream backend {
           server backend:8000;
       }
       
       upstream frontend {
           server frontend:3000;
       }
       
       # Rate limiting
       limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
       limit_req_zone $binary_remote_addr zone=app:10m rate=5r/s;
       
       # SSL configuration
       ssl_certificate /etc/nginx/ssl/cert.pem;
       ssl_certificate_key /etc/nginx/ssl/key.pem;
       ssl_protocols TLSv1.2 TLSv1.3;
       ssl_ciphers HIGH:!aNULL:!MD5;
       
       # Security headers
       add_header X-Frame-Options DENY;
       add_header X-Content-Type-Options nosniff;
       add_header X-XSS-Protection "1; mode=block";
       add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
       
       # API server (backend)
       server {
           listen 80;
           server_name api.your-domain.com;
           return 301 https://$server_name$request_uri;
       }
       
       server {
           listen 443 ssl;
           server_name api.your-domain.com;
           
           location / {
               limit_req zone=api burst=20 nodelay;
               proxy_pass http://backend;
               proxy_set_header Host $host;
               proxy_set_header X-Real-IP $remote_addr;
               proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
               proxy_set_header X-Forwarded-Proto $scheme;
           }
       }
       
       # Frontend application
       server {
           listen 80;
           server_name your-domain.com;
           return 301 https://$server_name$request_uri;
       }
       
       server {
           listen 443 ssl;
           server_name your-domain.com;
           
           location / {
               limit_req zone=app burst=10 nodelay;
               proxy_pass http://frontend;
               proxy_set_header Host $host;
               proxy_set_header X-Real-IP $remote_addr;
               proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
               proxy_set_header X-Forwarded-Proto $scheme;
           }
       }
   }
   ```

2. **Create SSL certificate generation script:**

   Create `scripts/generate_ssl.sh`:

   ```bash
   #!/bin/bash
   
   # Generate self-signed SSL certificate for development
   
   mkdir -p nginx/ssl
   
   openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
       -keyout nginx/ssl/key.pem \
       -out nginx/ssl/cert.pem \
       -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
   
   echo "SSL certificate generated in nginx/ssl/"
   ```

### Step 6: Production Deployment Script

1. **Create deployment script:**

   Create `deploy.sh`:

   ```bash
   #!/bin/bash
   
   # Production deployment script
   set -e
   
   echo "Starting production deployment..."
   
   # Load environment variables
   source .env.production
   
   # Pull latest code
   git pull origin main
   
   # Stop existing containers
   docker-compose -f docker-compose.prod.yml down
   
   # Build new images
   docker-compose -f docker-compose.prod.yml build --no-cache
   
   # Start services
   docker-compose -f docker-compose.prod.yml up -d
   
   # Wait for services to be ready
   echo "Waiting for services to start..."
   sleep 30
   
   # Run database migrations
   docker-compose -f docker-compose.prod.yml exec backend alembic upgrade head
   
   # Health check
   if curl -f http://localhost/health; then
       echo "Deployment successful!"
   else
       echo "Deployment failed - health check failed"
       exit 1
   fi
   
   # Cleanup old images
   docker image prune -f
   
   echo "Deployment completed successfully!"
   ```

2. **Create rollback script:**

   Create `rollback.sh`:

   ```bash
   #!/bin/bash
   
   # Rollback to previous version
   set -e
   
   if [ -z "$1" ]; then
       echo "Usage: $0 <git_commit_hash>"
       exit 1
   fi
   
   COMMIT_HASH=$1
   
   echo "Rolling back to commit: $COMMIT_HASH"
   
   # Checkout previous version
   git checkout $COMMIT_HASH
   
   # Stop current containers
   docker-compose -f docker-compose.prod.yml down
   
   # Rebuild and restart
   docker-compose -f docker-compose.prod.yml build --no-cache
   docker-compose -f docker-compose.prod.yml up -d
   
   echo "Rollback completed"
   ```

---

## Validation Steps

After each phase, perform the following validation steps:

### Phase 1 Validation (Backend Stabilization)

```sh
# 1. Test database connection
psql -U postgres -d library -c "SELECT version();"

# 2. Verify Alembic migrations
alembic current
alembic history

# 3. Test FastAPI endpoints
curl -X GET "http://localhost:8000/health"
curl -X GET "http://localhost:8000/docs"

# 4. Run backend tests
pytest --cov=src --cov-report=html

# 5. Check error handling
curl -X GET "http://localhost:8000/api/books/999"  # Should return 404
```

### Phase 2 Validation (Authentication & Authorization)

```sh
# 1. Test user registration
curl -X POST "http://localhost:8000/api/auth/register" \
     -H "Content-Type: application/json" \
     -d '{"username": "testuser", "email": "test@example.com", "password": "testpass123"}'

# 2. Test user login
curl -X POST "http://localhost:8000/api/auth/login" \
     -H "Content-Type: application/json" \
     -d '{"username": "testuser", "password": "testpass123"}'

# 3. Test protected endpoints
TOKEN="your-jwt-token-here"
curl -X GET "http://localhost:8000/api/books" \
     -H "Authorization: Bearer $TOKEN"

# 4. Test role-based access
curl -X POST "http://localhost:8000/api/books" \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"title": "Test Book", "author": "Test Author"}'

# 5. Test authentication middleware
curl -X GET "http://localhost:8000/api/books"  # Should return 401
```

### Phase 3 Validation (Frontend Migration)

```sh
# 1. Test Next.js development server
npm run dev
# Visit http://localhost:3000

# 2. Test server-side rendering
curl -I "http://localhost:3000/books"  # Should return 200 with HTML

# 3. Test API integration
# Login through UI and verify API calls in browser dev tools

# 4. Test authentication flow
# Register, login, logout through UI

# 5. Test protected routes
# Try accessing admin routes as regular user

# 6. Build for production
npm run build
npm run start
```

### Phase 4 Validation (Testing Infrastructure)

```sh
# 1. Run all backend tests
cd backend
pytest --cov=src --cov-report=html
pytest --cov=src --cov-report=term-missing

# 2. Run frontend unit tests
cd frontend
npm run test
npm run test:coverage

# 3. Run integration tests
npm run test:e2e

# 4. Check test coverage
# Backend: Open backend/htmlcov/index.html
# Frontend: Open frontend/coverage/index.html

# 5. Test error scenarios
# Test invalid inputs, network failures, etc.
```

### Phase 5 Validation (Documentation & Development)

```sh
# 1. Verify pre-commit hooks
git add .
git commit -m "Test commit"  # Should run linting and formatting

# 2. Check code quality
cd backend
black --check src/
isort --check-only src/
flake8 src/
mypy src/

# 3. Test development scripts
python scripts/dev.py create-admin
python scripts/dev.py reset-db

# 4. Verify documentation
# Check that README.md has all setup instructions
# Verify API documentation at /docs

# 5. Test Docker development environment
docker-compose -f docker-compose.dev.yml up
```

### Phase 6 Validation (Deployment)

```sh
# 1. Test Docker builds
docker-compose -f docker-compose.prod.yml build

# 2. Test production deployment
docker-compose -f docker-compose.prod.yml up -d

# 3. Verify services are running
docker-compose -f docker-compose.prod.yml ps

# 4. Test health checks
curl -f http://localhost/health
curl -f http://localhost:8000/health

# 5. Test SSL/TLS (if configured)
curl -k https://localhost/health

# 6. Test backup and restore
./backend/scripts/backup.sh
./backend/scripts/restore.sh backup_file.sql.gz

# 7. Test monitoring endpoints
curl http://localhost:8000/health/db
curl http://localhost:8000/health/redis
```

### End-to-End Validation

```sh
# 1. Complete user journey test
# - Register new user
# - Login
# - Add a book
# - Add a borrower
# - Checkout book
# - Return book
# - Logout

# 2. Admin functionality test
# - Login as admin
# - Create librarian user
# - Manage system settings
# - View all lending records

# 3. Performance testing
# - Load test API endpoints
# - Check response times
# - Monitor resource usage

# 4. Security testing
# - Test authentication bypass attempts
# - Test SQL injection prevention
# - Test XSS prevention
# - Test rate limiting
```

### Checklist for Production Readiness

- [ ] Database migrations work correctly
- [ ] All tests pass (backend, frontend, e2e)
- [ ] Authentication and authorization work
- [ ] All CRUD operations functional
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Health checks implemented
- [ ] SSL/TLS configured
- [ ] Backup system working
- [ ] Monitoring in place
- [ ] Documentation complete
- [ ] Security measures implemented
- [ ] Performance optimized
- [ ] Load testing completed

---

## Final Notes

This migration plan transforms your library management system into a production-ready application using modern industry standards. The plan balances your current needs (family library usage) with future commercial potential by implementing:

- **Scalable Architecture**: FastAPI + PostgreSQL + Next.js can handle growth
- **Type Safety**: Full TypeScript coverage prevents runtime errors
- **Security**: JWT authentication, role-based access, input validation
- **Developer Experience**: Testing, documentation, automated workflows
- **Deployment Ready**: Docker, monitoring, backup systems
- **Maintainability**: Clean code, proper error handling, logging

Each phase builds upon the previous one, allowing you to validate progress and catch issues early. The comprehensive testing and documentation ensure the system is reliable and maintainable for future enhancements.

**Remember**: This is a living document. Adjust the plan based on your specific requirements, timeline, and any issues encountered during implementation.

# ছোটপাতা পাঠাগার (Chotopata Pathagar) - Complete Project Documentation

> **Last Updated:** July 17, 2025  
> **Status:** Backend Complete & Production Ready | Frontend ~60% Complete with Known Issues  
> **Next Phase:** Frontend TypeScript Error Resolution & Integration Testing

---

## 🎯 Executive Summary

This is a modern, full-stack Bengali library management system built with **Next.js 14** (TypeScript) frontend and **FastAPI** (Python) backend, using **PostgreSQL** as the database. The system is designed for small to medium libraries with features for book management, borrower tracking, lending operations, and user authentication.

### Current Status
- **Backend (100% Complete):** Production-ready FastAPI server with full CRUD operations, JWT authentication, async database operations, and comprehensive error handling
- **Frontend (60% Complete):** Functional Next.js application with major TypeScript errors requiring systematic fixes
- **Database:** PostgreSQL with proper relationships and migrations
- **Documentation:** Comprehensive setup guides, migration plans, and API documentation

---

## 🏗️ Architecture Overview

```
library-management/
├── backend/                    # FastAPI Backend (✅ Complete)
│   ├── src/
│   │   ├── main_fastapi.py    # Main application entry point
│   │   ├── database_async.py  # Database configuration & connection
│   │   ├── models/            # SQLAlchemy models (8 entities)
│   │   ├── routes/            # API endpoints (7 route modules)
│   │   ├── schemas/           # Pydantic schemas for validation
│   │   ├── dependencies/      # FastAPI dependencies (auth, db)
│   │   └── utils/             # Utility functions
│   ├── alembic/               # Database migrations
│   ├── requirements.txt       # Python dependencies
│   └── testing/               # Test files and database verification
├── frontend/                  # Next.js Frontend (⚠️ Needs Fixes)
│   ├── components/            # React components
│   ├── pages/                 # Next.js pages (file-based routing)
│   ├── lib/                   # API client & React Query hooks
│   ├── types/                 # TypeScript type definitions
│   ├── styles/                # Global styles & Tailwind config
│   └── hooks/                 # Custom React hooks
├── docs/                      # Project documentation
└── extras/                    # Additional resources & backups
```

---

## 🛠️ Technology Stack

### Backend (Production Ready)
- **Framework:** FastAPI 0.116.0 with uvicorn
- **Database:** PostgreSQL 16+ with asyncpg driver
- **ORM:** SQLAlchemy 2.0 (async)
- **Authentication:** JWT with passlib/bcrypt
- **Validation:** Pydantic 2.11.7
- **Migrations:** Alembic 1.16.3
- **Testing:** pytest with coverage

### Frontend (Requires Fixes)
- **Framework:** Next.js 14+ with TypeScript 5+
- **Styling:** Tailwind CSS with shadcn/ui components
- **State Management:** React Query v5 for server state
- **Form Handling:** React Hook Form with validation
- **Icons:** Lucide React
- **Testing:** Vitest & Playwright (setup present)

### Development Tools
- **Code Quality:** ESLint, Prettier, Black formatter
- **Type Checking:** TypeScript, mypy
- **Containerization:** Docker & docker-compose
- **Version Control:** Git with pre-commit hooks planned

---

## 📊 Database Schema

### Core Entities
1. **Users** - Authentication & user management
2. **Categories** - Book categorization system
3. **Books** - Complete book information with metadata
4. **Tags** - Flexible book tagging (many-to-many)
5. **Borrowers** - Library member profiles
6. **Lending Records** - Book loan tracking with due dates
7. **Book Preview Images** - Cover image management
8. **User Favorites** - Personal book collections

### Key Features
- **Async Operations:** All database operations are async for better performance
- **Relationships:** Proper foreign keys and cascading deletes
- **Indexing:** Optimized queries with database indexes
- **Migrations:** Alembic for version-controlled schema changes
- **Validation:** Pydantic schemas ensure data integrity

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python 3.11+** with pip
- **Node.js 18+** with npm/pnpm
- **PostgreSQL 16+** (or Docker)
- **Git** for version control

### 1. Clone & Environment Setup
```bash
git clone https://github.com/yourusername/library-management.git
cd library-management
```

### 2. Backend Setup (5 minutes)
```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Setup database (PostgreSQL required)
# Create database named 'library_db'
# Update connection string in .env file

# Run migrations
alembic upgrade head

# Start development server
python start_server.py
```

**Backend URLs:**
- API Server: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- Alternative Docs: http://localhost:8000/redoc

### 3. Frontend Setup (3 minutes)
```bash
cd frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.local.example .env.local
# Edit .env.local with your API endpoints

# Start development server
npm run dev
```

**Frontend URL:** http://localhost:3000

### 4. Verify Installation
- Backend health check: http://localhost:8000/health
- Frontend should load without critical errors
- Database connection should show as "connected"

---

## 🔥 Known Issues & Next Steps

### Critical Issues Requiring Immediate Attention

#### 1. Frontend TypeScript Errors (Priority: HIGH)
- **Count:** ~481 errors across 47 files
- **Root Cause:** Database schema cleanup removed frontend-referenced fields
- **Impact:** Compilation errors prevent production build

**Specific Problems:**
- Components using non-existent fields (`isFavorite`, `publicationYear`, `numPages`, `status`)
- Must be replaced with actual database fields (`publication_year`, `page_count`, `cover_image`, `read_status`)
- shadcn/ui components missing proper TypeScript interfaces
- API integration issues with incorrect method signatures

**Files Requiring Immediate Fix:**
```
Priority 1 (Critical):
- frontend/types/*.ts - Database schema alignment
- frontend/lib/api.ts - API method corrections
- frontend/lib/reactQueryHooks.ts - React Query hooks

Priority 2 (High):
- frontend/components/books/BookCard.tsx - Book display component
- frontend/components/books/BookForm.tsx - Book editing forms
- frontend/components/borrowers/BorrowerForm.tsx - Borrower management
- frontend/pages/borrowers/[id].tsx - Detail pages
- frontend/pages/books/index.tsx - Listing pages
```

#### 2. API Integration Issues (Priority: MEDIUM)
- Some React Query mutations may not match backend endpoints
- Error handling needs standardization
- Loading states and optimistic updates need implementation

#### 3. UI/UX Improvements (Priority: LOW)
- Mobile responsiveness needs testing
- Error boundary implementations
- Accessibility improvements
- Performance optimizations

### Systematic Fixing Approach

#### Phase 1: Type Definitions & API Layer (1-2 days)
1. **Fix Type Definitions** - Align frontend types with backend models
2. **Fix API Layer** - Correct all API method signatures
3. **Fix React Query Hooks** - Ensure proper caching and error handling

#### Phase 2: Component Repairs (2-3 days)
1. **Core Components** - BookCard, BookForm, BorrowerForm
2. **Page Components** - Detail pages, listing pages
3. **UI Components** - Error handling, loading states

#### Phase 3: Integration & Testing (1-2 days)
1. **Integration Testing** - End-to-end user flows
2. **Performance Testing** - Load times, query optimization
3. **Browser Testing** - Cross-browser compatibility

#### Phase 4: Production Preparation (1 day)
1. **Build Optimization** - Bundle size, code splitting
2. **Security Review** - Authentication flows, input validation
3. **Documentation Updates** - API changes, deployment guides

---

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/token` - Token refresh
- `GET /api/auth/me` - Current user profile

### Books Management
- `GET /api/books/` - List books (pagination, filtering, search)
- `POST /api/books/` - Create book (Admin only)
- `GET /api/books/{id}` - Get book details
- `PUT /api/books/{id}` - Update book (Admin only)
- `DELETE /api/books/{id}` - Delete book (Admin only)
- `GET /api/books/{id}/availability` - Check availability

### Borrowers Management
- `GET /api/borrowers/` - List borrowers
- `POST /api/borrowers/` - Create borrower
- `GET /api/borrowers/{id}` - Get borrower details
- `PUT /api/borrowers/{id}` - Update borrower
- `DELETE /api/borrowers/{id}` - Delete borrower

### Lending Operations
- `GET /api/lending/` - List lending records
- `POST /api/lending/` - Create lending record
- `PUT /api/lending/{id}/return` - Return book
- `GET /api/lending/overdue` - Get overdue books

### User Features
- `GET /api/favorites/` - User's favorite books
- `POST /api/favorites/` - Add to favorites
- `DELETE /api/favorites/{id}` - Remove from favorites

### Data Export
- `GET /api/export/books` - Export books to CSV
- `GET /api/export/borrowers` - Export borrowers to CSV
- `GET /api/export/lending` - Export lending records to CSV

---

## 🧪 Testing Strategy

### Backend Testing (Complete)
```bash
cd backend
pytest --cov=src --cov-report=html
```

- **Unit Tests:** Model validation, utility functions
- **Integration Tests:** API endpoints, database operations
- **Coverage:** >80% code coverage target

### Frontend Testing (Setup Present, Needs Implementation)
```bash
cd frontend
npm run test              # Unit tests with Vitest
npm run test:coverage     # Coverage report
npx playwright test       # End-to-end tests
```

### Database Testing
```bash
cd backend
python testing/verify_backend.py    # Database health check
python testing/simple_db_test.py    # Basic connection test
```

---

## 🚀 Deployment Guide

### Development Environment
- **Backend:** `python start_server.py`
- **Frontend:** `npm run dev`
- **Database:** PostgreSQL local instance

### Production Deployment

#### Backend (Production Ready)
```bash
# Using Gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker src.main_fastapi:app --bind 0.0.0.0:8000

# Using Docker
docker build -t library-backend .
docker run -p 8000:8000 library-backend
```

#### Frontend (After Fixes)
```bash
# Build for production
npm run build

# Start production server
npm start

# Or deploy to Vercel/Netlify
```

### Environment Variables
**Backend (.env):**
```
DATABASE_URL=postgresql://user:pass@localhost/library_db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🔧 Development Workflow

### Daily Development Process
1. **Start Services:**
   ```bash
   # Terminal 1: Backend
   cd backend && venv\Scripts\activate && python start_server.py
   
   # Terminal 2: Frontend
   cd frontend && npm run dev
   ```

2. **Check System Health:**
   - Backend: http://localhost:8000/health
   - Frontend: http://localhost:3000
   - Database: Check connection in health endpoint

3. **Development Tasks:**
   - Fix TypeScript errors: `npm run type-check`
   - Run tests: `npm test` (frontend) or `pytest` (backend)
   - Format code: `npm run format` or `black .`

### Git Workflow
```bash
# Create feature branch
git checkout -b fix/frontend-type-errors

# Make changes and commit
git add .
git commit -m "fix: resolve TypeScript errors in book components"

# Push and create PR
git push origin fix/frontend-type-errors
```

---

## 📋 Troubleshooting Guide

### Common Issues & Solutions

#### Backend Issues
1. **Database Connection Failed**
   - Check PostgreSQL service is running
   - Verify connection string in .env file
   - Run `python testing/simple_db_test.py` for diagnosis

2. **Import Errors**
   - Ensure virtual environment is activated
   - Run `pip install -r requirements.txt`
   - Check Python version (3.11+ required)

3. **Migration Errors**
   - Reset database: `alembic downgrade base && alembic upgrade head`
   - Check for schema conflicts in models

#### Frontend Issues
1. **TypeScript Compilation Errors**
   - Run `npm run type-check` to see all errors
   - Follow systematic fixing approach in this document
   - Check types match backend schema

2. **API Connection Issues**
   - Verify backend is running on port 8000
   - Check CORS settings in main_fastapi.py
   - Validate API endpoints in browser network tab

3. **Build Failures**
   - Resolve all TypeScript errors first
   - Check for missing dependencies: `npm install`
   - Clear cache: `rm -rf .next && npm run build`

#### Database Issues
1. **Performance Problems**
   - Check query execution plans
   - Ensure proper indexing on frequently queried fields
   - Monitor connection pool usage

2. **Schema Inconsistencies**
   - Run `alembic check` to verify migrations
   - Compare models with actual database schema
   - Use `python testing/verify_backend.py` for validation

---

## 🎯 Future Enhancements

### Short-term (1-2 months)
- **Complete frontend TypeScript fixes**
- **Implement comprehensive error boundaries**
- **Add real-time notifications for overdue books**
- **Enhance mobile responsiveness**

### Medium-term (3-6 months)
- **Multi-language support (Bengali/English toggle)**
- **Advanced search with filters**
- **Book recommendation system**
- **Analytics dashboard for library statistics**

### Long-term (6+ months)
- **Multi-library support**
- **Mobile app development**
- **Barcode scanning integration**
- **Cloud deployment with CI/CD**

---

## 💡 Learning Resources

### For Working on This Project
- **FastAPI Documentation:** https://fastapi.tiangolo.com/
- **Next.js Documentation:** https://nextjs.org/docs
- **SQLAlchemy Async:** https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html
- **React Query:** https://tanstack.com/query/latest
- **shadcn/ui:** https://ui.shadcn.com/

### For TypeScript Error Resolution
- **TypeScript Handbook:** https://www.typescriptlang.org/docs/
- **React TypeScript Cheatsheet:** https://github.com/typescript-cheatsheets/react
- **Next.js TypeScript:** https://nextjs.org/docs/basic-features/typescript

---

## 🤝 Contributing Guidelines

### Before Making Changes
1. **Read this documentation completely**
2. **Set up development environment**
3. **Run existing tests to ensure baseline**
4. **Create feature branch for changes**

### Code Standards
- **Python:** Follow PEP 8, use Black formatter
- **TypeScript:** Follow ESLint rules, use Prettier
- **Commits:** Use conventional commit format
- **Documentation:** Update relevant docs with changes

### Testing Requirements
- **Backend:** Maintain >80% test coverage
- **Frontend:** Add tests for new components
- **Integration:** Test API endpoints with frontend

---

## 📞 Support & Maintenance

### When You Return to This Project
1. **Check this documentation first**
2. **Review `current status.md` for latest updates**
3. **Run health checks on all services**
4. **Follow the systematic fixing approach for frontend issues**

### Emergency Procedures
- **Backend down:** Check database connection, restart services
- **Frontend crashes:** Look for TypeScript errors, check console
- **Database issues:** Use backup/restore scripts in `extras/database_backups/`

### Backup Strategy
- **Code:** Git repository with regular commits
- **Database:** Daily automated backups in `extras/database_backups/`
- **Configuration:** Environment files documented in this guide

---

## 📄 License & Credits

**License:** MIT License  
**Author:** Chotopata Pathagar Development Team  
**Last Updated:** July 17, 2025

---

**Built with ❤️ for book lovers and library enthusiasts**

> This documentation will help you return to the project with full context and clear next steps. Focus on the frontend TypeScript fixes first, then move to integration testing and production deployment.

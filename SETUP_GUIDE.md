# ছোটপাতা পাঠাগার - Complete Setup Guide

## 📋 Prerequisites Check

Before starting, ensure you have these installed:

- **Python 3.13+** (for backend) - Check with `python --version`
- **Node.js 18+** (for frontend) - Check with `node --version`
- **PostgreSQL 14+** (database) - Check with `psql --version`
- **Git** (version control) - Check with `git --version`

## 🗃️ Current Project Status

Based on analysis of your directory:

- ✅ Backend virtual environment: **EXISTS**
- ✅ Backend dependencies: **INSTALLED**
- ✅ Database configuration: **CONFIGURED** (PostgreSQL)
- ✅ Alembic migrations: **READY**
- ❌ Frontend dependencies: **NOT INSTALLED**
- ❌ Frontend environment: **NEEDS SETUP**

## 🚀 Step-by-Step Setup Instructions

### Step 1: Setup PostgreSQL Database

```cmd
:: Start PostgreSQL service (if not running)
net start postgresql-x64-16

:: Connect to PostgreSQL and create database
psql -U postgres -h localhost
CREATE DATABASE chotopata_pathagar;
\q
```

### Step 2: Backend Setup (FastAPI)

```cmd
:: Navigate to backend directory
cd f:\WebDev\library-management\backend

:: Activate virtual environment (already exists)
venv\Scripts\activate

:: Verify dependencies are installed
pip list

:: Run database migrations
alembic upgrade head

:: Start backend server
python start_server.py
```

**Backend should now be running at:** <http://localhost:8000>

### Step 3: Frontend Setup (Next.js)

Open a **NEW** command prompt window:

```cmd
:: Navigate to frontend directory
cd f:\WebDev\library-management\frontend

:: Install dependencies
npm install

:: Create environment file
copy .env.local.example .env.local
:: (Edit .env.local if needed)

:: Start frontend development server
npm run dev
```

**Frontend should now be running at:** <http://localhost:3000>

```cmd
:: On Windows CMD
venv\Scripts\activate

:: You should see (venv) in your command prompt
```

### 4. Install Python Dependencies

```cmd
pip install -r requirements.txt
```

### 5. Setup Environment Variables

```cmd
:: Copy the example environment file
copy .env.example .env

:: Edit .env file with your database credentials
notepad .env
```

**Edit the `.env` file with your database settings:**

```env
# PostgreSQL Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password_here
POSTGRES_DB=library_db
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
DATABASE_URL=postgresql+asyncpg://postgres:your_password_here@localhost:5432/library_db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### 6. Setup PostgreSQL Database

```cmd
:: Install PostgreSQL if not already installed
:: Download from: https://www.postgresql.org/download/windows/

:: After installation, create database using pgAdmin or command line:
:: Open cmd as administrator and run:
psql -U postgres -c "CREATE DATABASE library_db;"
```

### 7. Run Database Migrations

```cmd
:: Initialize Alembic (if not already done)
alembic upgrade head

:: If you need to create new migrations later:
alembic revision --autogenerate -m "Your migration message"
```

### 8. Start Backend Server

```cmd
:: Development server
uvicorn src.main_fastapi:app --reload --host 0.0.0.0 --port 8000

:: Or using the manage.py script
python manage.py
```

### 9. Verify Backend Setup

- Open browser to `http://localhost:8000`
- Check API docs at `http://localhost:8000/docs`

---

## Frontend Setup (Next.js Migration)

**You've chosen Next.js! Let's complete the migration properly.**

### **Step 1: Clean Previous Setup**

```cmd
cd f:\WebDev\library-management\frontend

:: Remove old Vite files
del vite.config.tsx
del index.html
rmdir /s /q dist
rmdir /s /q node_modules
del package-lock.json
```

### **Step 2: Create Proper Next.js Structure**

Use the migration script above, or run these commands:

```cmd
:: Create Next.js directories
mkdir components\layout
mkdir components\books
mkdir components\borrowers
mkdir components\lending
mkdir components\common
mkdir styles
mkdir pages\books
mkdir pages\borrowers
mkdir pages\api

:: Move CSS file
move src\index.css styles\globals.css

:: Move components to organized structure
:: (Use the migration script above for complete file moves)
```

### **Step 3: Install Dependencies**

```cmd
:: Install pnpm if not already installed
npm install -g pnpm

:: Install dependencies
pnpm install
```

### **Step 4: Update Configuration Files**

The migration script will create the proper Next.js configuration files:

- `next.config.js` - Next.js configuration
- `tsconfig.json` - Updated for Next.js
- `tailwind.config.js` - Updated for Next.js paths

### **Step 5: Start Next.js Development Server**

```cmd
pnpm dev
```

### **Step 6: Verify Next.js Setup**

- Open browser to `http://localhost:3000` (Next.js default port)
- The React app should load with Next.js routing
- Check that all components are properly imported

---

---

## Quick Fresh Setup Script

Create a batch file `fresh-setup.bat`:

```batch
@echo off
echo Starting fresh setup...

:: Clean previous setup
echo Cleaning previous setup...
cd /d f:\WebDev\library-management
if exist backend\venv rmdir /s /q backend\venv
if exist frontend\node_modules rmdir /s /q frontend\node_modules
if exist frontend\package-lock.json del frontend\package-lock.json
if exist frontend\pnpm-lock.yaml del frontend\pnpm-lock.yaml
if exist backend\instance\library.db del backend\instance\library.db
if exist backend\src\database\app.db del backend\src\database\app.db
if exist backend\.env del backend\.env

:: Backend Setup
echo Setting up Backend...
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
if not exist .env copy .env.example .env
echo Please edit backend\.env with your database credentials

:: Frontend Setup
echo Setting up Frontend...
cd ..\frontend
pnpm install

echo Setup complete!
echo 1. Edit backend\.env with your database credentials
echo 2. Create PostgreSQL database: library_db
echo 3. Run: cd backend ^&^& venv\Scripts\activate ^&^& alembic upgrade head
echo 4. Start backend: uvicorn src.main_fastapi:app --reload
echo 5. Start frontend: pnpm dev
pause
```

---

## Development Workflow

### Backend Development

```cmd
:: Navigate to backend
cd backend

:: Activate virtual environment
venv\Scripts\activate

:: Start development server
uvicorn src.main_fastapi:app --reload
```

### Frontend Development

```cmd
:: Navigate to frontend
cd frontend

:: Start development server (Vite)
pnpm dev

:: OR Start development server (Next.js)
pnpm dev

:: Build for production
pnpm build

:: Preview production build
pnpm preview
```

### Database Migrations

```cmd
:: Make sure you're in backend directory with venv activated
cd backend
venv\Scripts\activate

:: Create new migration
alembic revision --autogenerate -m "Description of changes"

:: Apply migrations
alembic upgrade head

:: Check migration status
alembic current
```

---

## Common Issues & Solutions

### Backend Issues

1. **Virtual Environment Activation Error**

   ```cmd
   :: If you get execution policy error, try:
   venv\Scripts\activate.bat
   ```

2. **Database Connection Error**

   - Check PostgreSQL is running (Windows Services)
   - Verify credentials in `.env` file
   - Ensure database `library_db` exists
   - Test connection: `psql -U postgres -d library_db`

3. **Import Errors**

   - Make sure virtual environment is activated
   - Check if all dependencies are installed: `pip list`
   - Reinstall if needed: `pip install -r requirements.txt`

### Frontend Issues

1. **pnpm Command Not Found**

   ```cmd
   npm install -g pnpm
   ```

2. **Port Already in Use**

   ```cmd
   :: Find process using port 5173
   netstat -ano | findstr :5173
   :: Kill process by PID
   taskkill /F /PID <PID_NUMBER>
   ```

3. **Build Errors**

   - Check TypeScript errors
   - Verify all dependencies are installed
   - Clear cache: `pnpm store prune`

### Fresh Start Issues

1. **Permission Errors**

   ```cmd
   :: Run CMD as Administrator
   :: Or use PowerShell with elevated permissions
   ```

2. **Database Exists Error**

   ```cmd
   :: Drop existing database
   psql -U postgres -c "DROP DATABASE IF EXISTS library_db;"
   psql -U postgres -c "CREATE DATABASE library_db;"
   ```

---

## Project Structure

```text
library-management/
├── backend/                 # FastAPI backend
│   ├── src/                # Source code
│   │   ├── models/         # SQLAlchemy models
│   │   ├── routes/         # API routes
│   │   ├── schemas/        # Pydantic schemas
│   │   └── main_fastapi.py # FastAPI app
│   ├── alembic/            # Database migrations
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment variables template
├── frontend/               # React frontend (Vite/Next.js)
│   ├── src/                # Source code
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Utilities
│   │   └── types/          # TypeScript types
│   ├── pages/              # Next.js pages (if migrated)
│   ├── package.json        # Node.js dependencies
│   └── vite.config.tsx     # Vite config (current)
└── README.md               # Project documentation
```

---

## Next Steps

1. **Choose your frontend approach:**
   - **Option A:** Continue with current Vite setup
   - **Option B:** Complete Next.js migration

2. **Run the fresh setup** to start with a clean slate

3. **Setup both backend and frontend** following this guide

4. **Test the setup** by running both servers

5. **Use the comprehensive code review prompt** on each file to fix issues

6. **Start with core files** like main application files, models, and components

7. **Work through the project systematically** to ensure everything is working properly

The comprehensive code review prompt you created will help identify and fix issues in each file as you work through the project.

---

## Quick Decision Guide

**Stick with Vite if:**

- You want to get running quickly
- You're comfortable with the current setup
- You don't need SSR/SSG features

**Migrate to Next.js if:**

- You want server-side rendering
- You need better SEO
- You want to follow your migration plan
- You're planning for production deployment

Both are valid choices - pick what works best for your current needs!

---

## **Proper Next.js Folder Structure**

### **Target Structure for Next.js Migration**

```text
library-management/
├── backend/                          # FastAPI backend
│   ├── src/                         # Source code
│   │   ├── models/                  # SQLAlchemy models
│   │   ├── routes/                  # API routes
│   │   ├── schemas/                 # Pydantic schemas
│   │   └── main_fastapi.py          # FastAPI app
│   ├── alembic/                     # Database migrations
│   ├── requirements.txt             # Python dependencies
│   └── .env.example                 # Environment variables template
├── frontend/                        # Next.js frontend
│   ├── pages/                       # Next.js pages (file-based routing)
│   │   ├── _app.tsx                 # App wrapper
│   │   ├── _document.tsx            # Document wrapper
│   │   ├── index.tsx                # Home page
│   │   ├── books/                   # Book pages
│   │   │   ├── index.tsx            # Books list page
│   │   │   ├── [id].tsx             # Book detail page
│   │   │   └── new.tsx              # New book page
│   │   ├── borrowers/               # Borrower pages
│   │   │   ├── index.tsx            # Borrowers list page
│   │   │   ├── [id].tsx             # Borrower detail page
│   │   │   └── new.tsx              # New borrower page
│   │   └── api/                     # API routes (optional)
│   │       └── hello.ts             # Example API route
│   ├── components/                  # React components
│   │   ├── layout/                  # Layout components
│   │   │   ├── Header.tsx           # Header component
│   │   │   ├── Footer.tsx           # Footer component
│   │   │   └── Layout.tsx           # Main layout wrapper
│   │   ├── books/                   # Book-related components
│   │   │   ├── BookCard.tsx         # Book card component
│   │   │   ├── BookList.tsx         # Book list component
│   │   │   ├── BookForm.tsx         # Book form component
│   │   │   └── BookDetails.tsx      # Book details component
│   │   ├── borrowers/               # Borrower components
│   │   │   ├── BorrowerList.tsx     # Borrower list component
│   │   │   └── BorrowerForm.tsx     # Borrower form component
│   │   ├── lending/                 # Lending components
│   │   │   └── LendingForm.tsx      # Lending form component
│   │   ├── ui/                      # UI components (shadcn/ui)
│   │   │   ├── button.tsx           # Button component
│   │   │   ├── input.tsx            # Input component
│   │   │   └── ...                  # Other UI components
│   │   └── common/                  # Common components
│   │       ├── SearchAndFilter.tsx  # Search and filter
│   │       ├── ExportDropdown.tsx   # Export dropdown
│   │       └── Documentation.tsx    # Documentation
│   ├── hooks/                       # Custom React hooks
│   │   ├── use-mobile.tsx           # Mobile hook
│   │   └── ...                      # Other hooks
│   ├── lib/                         # Utility functions
│   │   ├── api.tsx                  # API utilities
│   │   ├── exportUtils.tsx          # Export utilities
│   │   ├── imageUtils.tsx           # Image utilities
│   │   └── utils.ts                 # General utilities
│   ├── types/                       # TypeScript types
│   │   ├── index.ts                 # Main types
│   │   └── ...                      # Other type definitions
│   ├── styles/                      # Global styles
│   │   ├── globals.css              # Global CSS
│   │   └── ...                      # Other styles
│   ├── public/                      # Static assets
│   │   ├── favicon.ico              # Favicon
│   │   └── images/                  # Images
│   ├── next.config.js               # Next.js configuration
│   ├── tailwind.config.js           # Tailwind configuration
│   ├── tsconfig.json                # TypeScript configuration
│   ├── package.json                 # Dependencies
│   ├── next-env.d.ts                # Next.js types
│   └── .gitignore                   # Git ignore
└── README.md                        # Project documentation
```

### **Files to Remove (Old Vite Setup)**

```cmd
:: Navigate to frontend directory
cd f:\WebDev\library-management\frontend

:: Remove Vite-specific files
del vite.config.tsx
del index.html

:: Remove old build artifacts
rmdir /s /q dist
rmdir /s /q build

:: Remove conflicting package files
del package-lock.json
```

### **Files to Create/Move for Next.js**

```cmd
:: Create necessary directories
mkdir components\layout
mkdir components\books
mkdir components\borrowers
mkdir components\lending
mkdir components\common
mkdir styles
mkdir pages\books
mkdir pages\borrowers

:: Create _document.tsx for Next.js
echo. > pages\_document.tsx
```

### **Step-by-Step Migration Commands**

#### **1. Clean Old Vite Files**

```cmd
:: Navigate to frontend
cd f:\WebDev\library-management\frontend

:: Remove Vite files
del vite.config.tsx
del index.html
rmdir /s /q dist

:: Remove old CSS location (we'll move it)
:: The CSS will be moved to styles/globals.css
```

#### **2. Create Next.js Directory Structure**

```cmd
:: Create component directories
mkdir components\layout
mkdir components\books
mkdir components\borrowers
mkdir components\lending
mkdir components\common

:: Create styles directory
mkdir styles

:: Create additional pages directories
mkdir pages\books
mkdir pages\borrowers
mkdir pages\api
```

#### **3. Move Files to Proper Locations**

```cmd
:: Move CSS to proper location
move src\index.css styles\globals.css

:: Move components to organized folders
move src\components\BookCard.tsx components\books\
move src\components\BookList.tsx components\books\
move src\components\BookForm.tsx components\books\
move src\components\BookDetails.tsx components\books\

move src\components\BorrowerList.tsx components\borrowers\
move src\components\BorrowerForm.tsx components\borrowers\

move src\components\LendingForm.tsx components\lending\

move src\components\Header.tsx components\layout\
move src\components\SearchAndFilter.tsx components\common\
move src\components\ExportDropdown.tsx components\common\
move src\components\ExportMenu.tsx components\common\
move src\components\Documentation.tsx components\common\

:: Move UI components (keep ui folder structure)
move src\components\ui components\
```

#### **4. Update Import Paths**

After moving files, you'll need to update import paths in your components. For example:

```typescript
// Old import (Vite)
import { BookCard } from '../components/BookCard';

// New import (Next.js)
import { BookCard } from '../components/books/BookCard';
```

#### **5. Create _document.tsx for Next.js**

```typescript
// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

#### **6. Update _app.tsx CSS Import**

```typescript
// pages/_app.tsx
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import '../styles/globals.css'; // Updated path

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

export default MyApp;
```

### **Complete Migration Script**

Create a batch file `migrate-to-nextjs.bat`:

```batch
@echo off
echo Migrating to Next.js structure...

:: Navigate to frontend
cd /d f:\WebDev\library-management\frontend

:: Remove old Vite files
echo Removing Vite files...
if exist vite.config.tsx del vite.config.tsx
if exist index.html del index.html
if exist dist rmdir /s /q dist

:: Create Next.js directory structure
echo Creating Next.js directories...
if not exist components\layout mkdir components\layout
if not exist components\books mkdir components\books
if not exist components\borrowers mkdir components\borrowers
if not exist components\lending mkdir components\lending
if not exist components\common mkdir components\common
if not exist styles mkdir styles
if not exist pages\books mkdir pages\books
if not exist pages\borrowers mkdir pages\borrowers
if not exist pages\api mkdir pages\api

:: Move CSS file
echo Moving CSS file...
if exist src\index.css move src\index.css styles\globals.css

:: Move components (only if they exist)
echo Moving components...
if exist src\components\BookCard.tsx move src\components\BookCard.tsx components\books\
if exist src\components\BookList.tsx move src\components\BookList.tsx components\books\
if exist src\components\BookForm.tsx move src\components\BookForm.tsx components\books\
if exist src\components\BookDetails.tsx move src\components\BookDetails.tsx components\books\

if exist src\components\BorrowerList.tsx move src\components\BorrowerList.tsx components\borrowers\
if exist src\components\BorrowerForm.tsx move src\components\BorrowerForm.tsx components\borrowers\

if exist src\components\LendingForm.tsx move src\components\LendingForm.tsx components\lending\

if exist src\components\Header.tsx move src\components\Header.tsx components\layout\
if exist src\components\SearchAndFilter.tsx move src\components\SearchAndFilter.tsx components\common\
if exist src\components\ExportDropdown.tsx move src\components\ExportDropdown.tsx components\common\
if exist src\components\ExportMenu.tsx move src\components\ExportMenu.tsx components\common\
if exist src\components\Documentation.tsx move src\components\Documentation.tsx components\common\

:: Move UI components
if exist src\components\ui move src\components\ui components\

:: Move other directories
if exist src\hooks move src\hooks .
if exist src\lib move src\lib .
if exist src\types move src\types .

:: Clean up empty src directory
if exist src rmdir /s /q src

echo Migration complete!
echo Next steps:
echo 1. Update import paths in your components
echo 2. Create pages/_document.tsx
echo 3. Update _app.tsx CSS import path
echo 4. Test the application with: pnpm dev
pause
```

---

## 🔧 Detailed Setup Instructions

### Backend Setup Details

Your backend is already configured! Here's what's set up:

- **Virtual Environment**: ✅ Created at `backend/venv/`
- **Dependencies**: ✅ Installed from `requirements.txt`
- **Database Config**: ✅ PostgreSQL connection configured
- **Environment Variables**: ✅ Set in `backend/.env`

#### Backend Environment Variables (Already Configured)

```properties
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgressadmin
POSTGRES_DB=library_db
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
DATABASE_URL=postgresql+asyncpg://postgres:postgressadmin@localhost:5432/library_db
SECRET_KEY=WE^%R&^*GUftd5er68TG&HUB
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### Frontend Environment Setup

Create `frontend/.env.local` with:

```properties
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=ছোটপাতা পাঠাগার
```

## 🧪 Testing Your Setup

### 1. Test Backend API

Once backend is running, test these endpoints:

```cmd
:: Test health check
curl http://localhost:8000/

:: Test API documentation
start http://localhost:8000/docs
```

### 2. Test Database Connection

```cmd
cd f:\WebDev\library-management\backend
venv\Scripts\activate
python -c "from src.database_async import engine; print('Database connection successful!')"
```

### 3. Test Frontend

Once frontend is running:

```cmd
:: Open in browser
start http://localhost:3000
```

## 🚨 Troubleshooting

### Common Issues & Solutions

#### Backend Issues

**Issue: PostgreSQL connection failed**
```cmd
:: Check PostgreSQL service
net start postgresql-x64-16

:: Verify database exists
psql -U postgres -h localhost -c "SELECT datname FROM pg_database WHERE datname='library_db';"
```

**Issue: Import errors in Python**
```cmd
cd f:\WebDev\library-management\backend
venv\Scripts\activate
pip install -r requirements.txt --upgrade
```

**Issue: Alembic migration errors**
```cmd
cd f:\WebDev\library-management\backend
venv\Scripts\activate
alembic current
alembic upgrade head
```

#### Frontend Issues

**Issue: npm install fails**
```cmd
cd f:\WebDev\library-management\frontend
npm cache clean --force
npm install
```

**Issue: Module not found errors**
```cmd
cd f:\WebDev\library-management\frontend
rm -rf node_modules package-lock.json
npm install
```

## 🎯 Quick Start Commands

### Start Both Services (Two Terminal Windows)

**Terminal 1 - Backend:**
```cmd
cd f:\WebDev\library-management\backend
venv\Scripts\activate
python start_server.py
```

**Terminal 2 - Frontend:**
```cmd
cd f:\WebDev\library-management\frontend
npm run dev
```

### Stop Services

- **Backend**: Press `Ctrl+C` in backend terminal
- **Frontend**: Press `Ctrl+C` in frontend terminal

## 📱 Application URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend App | <http://localhost:3000> | Main application interface |
| Backend API | <http://localhost:8000> | REST API endpoints |
| API Docs | <http://localhost:8000/docs> | Interactive API documentation |
| ReDoc | <http://localhost:8000/redoc> | Alternative API documentation |

## 🔐 Default Access

After setup, you can:

1. **Register** a new user account through the frontend
2. **Login** with your credentials
3. **Admin access**: Create admin users through the database or API

## 🏗️ Project Structure Overview

```
f:\WebDev\library-management\
├── backend/                 # FastAPI Backend
│   ├── venv/               # ✅ Virtual environment (ready)
│   ├── src/                # Application source code
│   ├── alembic/            # Database migrations
│   ├── requirements.txt    # ✅ Python dependencies (installed)
│   ├── .env               # ✅ Environment variables (configured)
│   └── start_server.py    # Server startup script
├── frontend/               # Next.js Frontend
│   ├── components/         # React components
│   ├── pages/             # Next.js pages
│   ├── lib/               # Utilities
│   ├── package.json       # Node.js dependencies
│   └── .env.local         # ❌ Frontend environment (needs creation)
└── README.md              # Project documentation
```

## 🎉 Success Indicators

You'll know everything is working when:

- ✅ Backend terminal shows: `INFO: Uvicorn running on http://0.0.0.0:8000`
- ✅ Frontend terminal shows: `ready - started server on 0.0.0.0:3000`
- ✅ Browser opens <http://localhost:3000> successfully
- ✅ <http://localhost:8000/docs> shows API documentation

## 🆘 Need Help?

If you encounter issues:

1. Check the **Troubleshooting** section above
2. Verify all **Prerequisites** are installed
3. Ensure **PostgreSQL** service is running
4. Check terminal output for specific error messages
5. Verify environment variables in `.env` files

---

*Last updated: July 11, 2025*

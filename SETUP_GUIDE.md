# ছোটপাতা পাঠাগার - Complete Setup Guide

## 📋 Prerequisites Check
- **Node.js 18+** (for frontend) - Check with `node --version`
- **PostgreSQL 16+** (database) - Check with `psql --version`
- **Git** (version control) - Check with `git --version`

## 🗃️ Project Structure Overview

```text
library-management/
├── backend/                 # FastAPI Backend
│   ├── venv/               # Python virtual environment
│   ├── src/                # Application source code
│   │   ├── models/         # SQLAlchemy models
│   │   ├── routes/         # API endpoints
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── dependencies/   # FastAPI dependencies
│   │   ├── utils/          # Utility functions
│   │   ├── database_async.py # Database configuration
│   │   └── main_fastapi.py # Main application entry
│   ├── alembic/            # Database migrations
│   └── requirements.txt    # Python dependencies
└── frontend/               # Next.js Frontend
    ├── components/         # React components
    │   ├── books/          # Book-related components
    │   ├── borrowers/      # Borrower-related components
    │   ├── lending/        # Lending-related components
    │   ├── layout/         # Layout components
    │   └── ui/             # UI components (shadcn/ui)
    ├── pages/              # Next.js pages (file-based routing)
    │   ├── books/          # Book pages
    │   ├── borrowers/      # Borrower pages
    │   └── lending/        # Lending pages
    ├── lib/                # Utility libraries
    ├── types/              # TypeScript type definitions
    └── styles/             # Global styles
```

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
cd backend

:: Create virtual environment
python -m venv venv

:: Activate virtual environment
venv\Scripts\activate

:: Install dependencies
pip install -r requirements.txt


:: Run database migrations
python start_server.py
```
**Backend should now be running at:** <http://localhost:8000>
### Step 3: Frontend Setup (Next.js)

Open a **NEW** command prompt window:
```cmd
:: Navigate to frontend directory
cd frontend

:: Install dependencies
npm install

:: Create environment file
copy .env.local.example .env.local
:: Edit .env.local if needed

:: Start frontend development server
npm run dev
```

**Frontend should now be running at:** <http://localhost:3000>

## ⚙️ Environment Configuration

### Backend (.env)

```properties
# Database
DATABASE_URL=postgresql+asyncpg://postgres:yourpassword@localhost:5432/chotopata_pathagar
POSTGRES_USER=postgres
POSTGRES_PASSWORD=yourpassword
POSTGRES_DB=chotopata_pathagar
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### Frontend (.env.local)

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
cd backend
venv\Scripts\activate
python -c "from src.database_async import engine; print('Database connection successful!')"
```

### 3. Test Frontend

Once frontend is running:

```cmd
:: Open in browser
start http://localhost:3000
```

## 📱 Application URLs

| Service      | URL                           | Description                   |
| ------------ | ----------------------------- | ----------------------------- |
| Frontend App | <http://localhost:3000>       | Main application interface    |
| Backend API  | <http://localhost:8000>       | REST API endpoints            |
| API Docs     | <http://localhost:8000/docs>  | Interactive API documentation |
| ReDoc        | <http://localhost:8000/redoc> | Alternative API documentation |

## 🔐 Default Access

After setup, you can:

1. **Register** a new user account through the frontend
2. **Login** with your credentials
3. **Admin access**: Create admin users through the database or API

## 🚨 Troubleshooting

### Common Issues & Solutions

#### Backend Issues

1. **Virtual Environment Activation Error**

   ```cmd
   :: If you get execution policy error, try:
   venv\Scripts\activate.bat
   ```

2. **Database Connection Error**

   - Check PostgreSQL is running (Windows Services)
   - Verify credentials in `.env` file
   - Ensure database `chotopata_pathagar` exists
   - Test connection: `psql -U postgres -d chotopata_pathagar`

3. **Import Errors**

   - Make sure virtual environment is activated
   - Check if all dependencies are installed: `pip list`
   - Reinstall if needed: `pip install -r requirements.txt`

#### Frontend Issues

1. **npm Command Not Found**

   ```cmd
   :: Install Node.js from https://nodejs.org/
   ```

2. **Port Already in Use**

   ```cmd
   :: Find process using port 3000
   netstat -ano | findstr :3000
   :: Kill process by PID
   taskkill /F /PID <PID_NUMBER>
   ```

3. **Build Errors**

   - Check TypeScript errors
   - Verify all dependencies are installed
   - Clear cache: `npm cache clean --force`

## 🎯 Success Indicators

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

Last updated: July 12, 2025

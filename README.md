# ছোটপাতা পাঠাগার
## একটি পাঠাগার ম্যানেজমেন্ট সিস্টেম

> A modern, full-stack system with FastAPI backend and Next.js frontend, featuring JWT authentication, async operations, and comprehensive book tracking.

![Python](https://img.shields.io/badge/Python-3.13-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.116.0-green)
![Next.js](https://img.shields.io/badge/Next.js-14+-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-blue)

## 🚀 Features

### 📚 **Book Management**

- **CRUD Operations**: Add, edit, delete, and view books
- **Rich Metadata**: Title, author, ISBN, genre, description, publication year
- **Inventory Tracking**: Total and available copies management
- **Category & Tag System**: Organize books with hierarchical categories and flexible tags
- **Preview Images**: Upload and manage book cover images
- **Advanced Search**: Multi-field search with filters and sorting

### 👥 **User & Authentication**

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Admin and user roles with different permissions
- **User Profiles**: Manage user information and preferences

### 🔄 **Lending System**

- **Borrower Management**: Track library members and their information
- **Loan Tracking**: Monitor active loans, due dates, and return status
- **Lending History**: Complete audit trail of all lending activities
- **Overdue Management**: Automatic status updates for overdue items

### 🛠️ **Technical Features**

- **Async Operations**: Full async/await support for better performance
- **Type Safety**: Comprehensive type annotations and validation
- **API Documentation**: Auto-generated OpenAPI/Swagger documentation
- **Database Migrations**: Alembic-powered schema versioning
- **Error Handling**: Comprehensive error responses with proper HTTP status codes

## 🏗️ Architecture

```[]
library-management/
├── backend/                    # FastAPI Backend
│   ├── src/
│   │   ├── main_fastapi.py    # Main application entry point
│   │   ├── database_async.py  # Database configuration
│   │   ├── models/            # SQLAlchemy models
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── routes/            # API route handlers
│   │   ├── utils/             # Utility functions
│   │   └── dependencies/      # FastAPI dependencies
│   ├── alembic/               # Database migrations
│   ├── requirements.txt       # Python dependencies
│   └── start_server.py        # Production startup script
├── frontend/                  # Next.js Frontend
│   ├── components/            # React components
│   ├── pages/                 # Next.js pages
│   ├── lib/                   # Utilities and API client
│   ├── types/                 # TypeScript type definitions
│   └── styles/                # CSS and styling
└── docs/                      # Documentation
```

## 🛠️ Tech Stack

### **Backend**

- **Framework**: FastAPI 0.116.0
- **Database**: PostgreSQL with asyncpg driver
- **ORM**: SQLAlchemy 2.0.41 (async)
- **Authentication**: JWT with passlib/bcrypt
- **Validation**: Pydantic 2.11.7
- **Migrations**: Alembic 1.16.3
- **Server**: Uvicorn 0.35.0

### **Frontend**

- **Framework**: Next.js 14+
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Query
- **Forms**: React Hook Form

### **Development**

- **Package Management**: pip (Python), npm/yarn (Node.js)
- **Code Quality**: ESLint, Prettier
- **Type Checking**: mypy (Python), TypeScript (Frontend)

## ⚡ Quick Start

### **Prerequisites**

- Python 3.13+
- Node.js 18+
- PostgreSQL 14+
- Git

### **1. Clone Repository**

```bash
git clone https://github.com/Jabir-A-H/library-management.git
cd library-management
```

### **2. Backend Setup**

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
alembic upgrade head

# Start development server
python start_server.py
```

### **3. Frontend Setup**

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

### **4. Access Application**

- **Frontend**: <http://localhost:3000>
- **Backend API**: <http://localhost:8000>
- **API Documentation**: <http://localhost:8000/docs>

## 📚 API Documentation

The API provides comprehensive endpoints for all library operations:

### **Authentication**

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### **Books**

- `GET /api/books` - List books with pagination and filters
- `POST /api/books` - Create new book (admin)
- `GET /api/books/{id}` - Get specific book
- `PUT /api/books/{id}` - Update book (admin)
- `DELETE /api/books/{id}` - Delete book (admin)

### **Borrowers**

- `GET /api/borrowers` - List borrowers
- `POST /api/borrowers` - Create borrower (admin)
- `GET /api/borrowers/{id}` - Get specific borrower
- `PUT /api/borrowers/{id}` - Update borrower (admin)

For complete API documentation, visit `/docs` when the server is running.

## 🗄️ Database Schema

### **Core Entities**

- **Users**: Authentication and authorization
- **Books**: Complete book information and inventory
- **Categories**: Hierarchical book categorization
- **Tags**: Flexible book tagging system
- **Borrowers**: Library member information
- **LendingRecords**: Loan tracking and history

### **Relationships**

- Books ↔ Categories (Many-to-One)
- Books ↔ Tags (Many-to-Many)
- Books ↔ LendingRecords (One-to-Many)
- Borrowers ↔ LendingRecords (One-to-Many)

## 🔧 Configuration

### **Environment Variables**

#### Backend (.env)

```env
# Database
DATABASE_URL=postgresql+asyncpg://username:password@localhost/library_db

# JWT
JWT_SECRET_KEY=your-super-secret-jwt-key-here
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60

# Application
DEBUG=False
HOST=0.0.0.0
PORT=8000
```

#### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=ছোটপাতা পাঠাগার
```

## 🚀 Deployment

### **Backend Deployment**

```bash
# Production server
python start_server.py

# Or with Gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker src.main_fastapi:app
```

### **Frontend Deployment**

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🧪 Testing

### **Backend Tests**

```bash
cd backend
pytest
```

### **Frontend Tests**

```bash
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**

- Follow PEP 8 for Python code
- Use TypeScript for all new frontend code
- Add tests for new features
- Update documentation for API changes

## 📋 Roadmap

- [ ] **Multi-library Support**: Support for multiple library branches
- [ ] **Advanced Reporting**: Analytics and usage reports
- [ ] **Email Notifications**: Automated overdue notifications
- [ ] **Mobile App**: React Native mobile application
- [ ] **Barcode Scanning**: ISBN barcode support
- [ ] **Digital Assets**: Support for e-books and digital media

## 🔍 Troubleshooting

### **Common Issues**

**Database Connection Issues**

```bash
# Check PostgreSQL is running
pg_ctl status

# Verify database exists
psql -l | grep library_db
```

**Import Errors**

```bash
# Run from backend directory
cd backend/src
python -c "from main_fastapi import app; print('Success')"
```

**Frontend Build Issues**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Jabir A. H.**

- GitHub: [@Jabir-A-H](https://github.com/Jabir-A-H)

## 🙏 Acknowledgments

- FastAPI team for the excellent framework
- SQLAlchemy team for powerful ORM capabilities
- Next.js team for the frontend framework
- All contributors and testers

---

**Built with ❤️ for book lovers and library enthusiasts**
│   │   └── App.jsx              # Main app
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── library-catalog-backend/     # Backend Flask API
│   ├── src/
│   │   ├── models/              # Database models
│   │   ├── routes/              # API endpoints
│   │   ├── database.py          # SQLAlchemy setup
│   │   └── main.py              # Flask entry point
│   ├── requirements.txt         # Python dependencies
│   └── database/                # SQLite DB file (app.db)
│
└── FINAL_README.md              # This file

```

---

## Setup & Installation

### Prerequisites
- **Python 3.8+** ([Download](https://www.python.org/downloads/))
- **Node.js 16+** ([Download](https://nodejs.org/))
- **Git** (optional, for version control)

### Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```sh
   cd library-catalog-backend
   ```

2. (Recommended) Create and activate a Python virtual environment:
   - **Windows:**

     ```sh
     python -m venv venv
     venv\Scripts\activate
     ```

   - **macOS/Linux:**

     ```sh
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install Python dependencies:

   ```sh
   pip install -r requirements.txt
   ```

4. Start the backend server:

   ```sh
   python src/main.py
   ```

   The API will be available at [http://localhost:5000](http://localhost:5000)

### Frontend Setup

1. Open a new terminal and navigate to the frontend folder:

   ```sh
   cd library-catalog
   ```

2. Install Node.js dependencies:

   ```sh
   npm install
   ```

3. Start the React development server:

   ```sh
   npm run dev
   ```

   The app will open at [http://localhost:5173](http://localhost:5173) or the port shown in your terminal.

#### Production Build

- To build the frontend for production:

  ```sh
  npm run build
  ```

- Copy the contents of `library-catalog/dist/` to `library-catalog-backend/src/static/` to serve via Flask.

---

## Usage Guide

### Adding & Managing Books

- Click **Add Book** to open the form.
- Fill in details: Title (required), Author (required), Genre, Year, Description, Tags, etc.
- Optionally upload a cover image and preview images (see below).
- Click **Add Book** to save.
- Edit, view, or delete books from the main list.

### Uploading Images

- In the book form, use the image upload fields to select cover and preview images.
- Images are converted to base64 and stored directly in the database (no separate file storage needed).
- Large images may increase database size; use reasonable image sizes for best performance.

### Lending & Borrower Management

- Add borrowers (family, friends, etc.) via the **Borrowers** section.
- Lend books by selecting a book and assigning it to a borrower with a due date.
- Track current lendings, history, and overdue books.
- Mark books as returned or lost as needed.

### Exporting & Importing Data

- Use the **Export** menu to download your library in JSON, CSV, TXT, Excel, PDF, or as a complete backup ZIP.
- For Excel export, ensure `pandas` and `openpyxl` are installed.
- For PDF export, ensure `reportlab` is installed.
- Use the **Import** function to restore from a JSON backup.

---

## Development & Contribution

### Local Development

- Follow the setup instructions above for both frontend and backend.
- The backend runs on port 5000 by default; the frontend on 5173 (or as configured in `vite.config.js`).
- For API development, see `library-catalog-backend/src/routes/` for endpoints.
- For UI development, see `library-catalog/src/components/`.

### Contributing

1. Fork this repository and create a new branch for your feature or fix.
2. Make your changes with clear, descriptive commit messages.
3. Test your changes locally (both frontend and backend if needed).
4. Submit a pull request with a description of your changes.

---

## Troubleshooting

- **Module not found**: Ensure your Python virtual environment is activated and all dependencies are installed.
- **Port already in use**: Change the port in `src/main.py` (backend) or `vite.config.js` (frontend).
- **Database errors**: The database file is created automatically. If issues persist, delete `src/database/app.db` to start fresh (note: this will erase your data).
- **Export issues**: For Excel/PDF export, ensure the required Python packages are installed.

---

## License

This project is free for personal and educational use. For commercial use, please contact the author for licensing information.

---

Enjoy managing your personal library!

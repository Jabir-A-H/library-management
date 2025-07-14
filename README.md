# ছোটপাতা পাঠাগার (Chotopata Pathagar)

> A modern, full-stack library management application with FastAPI backend and Next.js frontend, featuring JWT authentication, async operations, and comprehensive book tracking.

![Python](https://img.shields.io/badge/Python-3.13-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.116.0-green)
![Next.js](https://img.shields.io/badge/Next.js-14+-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-blue)

## 🚀 Features

### 📚 **Book Management**
- **Complete CRUD Operations**: Add, edit, delete, and view books
- **Rich Metadata**: Title, author, ISBN, genre, description, publication year
- **Inventory Tracking**: Total and available copies management
- **Category & Tag System**: Organize books with hierarchical categories and tags
- **Preview Images**: Upload and manage book cover images
- **Advanced Search**: Multi-field search with filters and sorting

### 👥 **Borrower Management**
- **Borrower Profiles**: Manage library members with contact information
- **Activity History**: Track borrowing patterns and preferences
- **Multilingual Support**: Store names in both English and Bengali
- **Relationship Tracking**: Categorize borrowers by relationship type

### 🔄 **Lending System**
- **Checkout Process**: Simple book lending workflow
- **Due Date Management**: Set and track return deadlines
- **Lending History**: Complete audit trail of all lending activities
- **Overdue Management**: Automatic tracking of late returns

### 🔐 **Authentication & Security**
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Admin and user roles with different permissions
- **Protected Routes**: Secure endpoints for sensitive operations

### 🛠️ **Technical Features**
- **Async Operations**: Full async/await support for better performance
- **Type Safety**: Comprehensive TypeScript type definitions
- **API Documentation**: Auto-generated OpenAPI/Swagger documentation
- **Database Migrations**: Alembic-powered schema versioning
- **Error Handling**: Comprehensive error responses

## 🏗️ Architecture

```
library-management/
├── backend/                     # FastAPI Backend
│   ├── src/
│   │   ├── main_fastapi.py     # Main application entry point
│   │   ├── database_async.py   # Database configuration
│   │   ├── models/             # SQLAlchemy models
│   │   ├── schemas/            # Pydantic schemas
│   │   ├── routes/             # API route handlers
│   │   └── dependencies/       # FastAPI dependencies
│   ├── alembic/                # Database migrations
│   └── requirements.txt        # Python dependencies
├── frontend/                   # Next.js Frontend
│   ├── components/             # React components
│   ├── pages/                  # Next.js pages
│   ├── lib/                    # Utilities and API client
│   ├── types/                  # TypeScript type definitions
│   └── styles/                 # CSS and styling
└── docs/                       # Documentation
```

## 🛠️ Tech Stack

### **Backend**
- **Framework**: FastAPI 0.116.0
- **Database**: PostgreSQL with asyncpg driver
- **ORM**: SQLAlchemy 2.0 (async)
- **Authentication**: JWT with passlib/bcrypt
- **Validation**: Pydantic 2.11.7
- **Migrations**: Alembic 1.16.3

### **Frontend**
- **Framework**: Next.js 14+
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Query v5
- **Form Handling**: React Hook Form

## ⚡ Quick Start

See our detailed [Setup Guide](./FINAL_SETUP_GUIDE.md) for comprehensive installation instructions.

### **Prerequisites**
- Python 3.13+
- Node.js 18+
- PostgreSQL 16+
- Git

### **Clone & Setup**

```bash
# Clone repository
git clone https://github.com/yourusername/library-management.git
cd library-management

# Set up backend (detailed steps in FINAL_SETUP_GUIDE.md)
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python start_server.py

# Set up frontend (in a new terminal)
cd frontend
npm install
npm run dev
```

### **Access Application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 📚 Documentation

- [Setup Guide](./FINAL_SETUP_GUIDE.md) - Detailed installation instructions
- [Migration Plan](./FINAL_MIGRATION_PLAN.md) - Strategy for system improvements
- [Project Analysis Prompts](./PROJECT_ANALYSIS_PROMPTS.md) - Tools for codebase improvement
- API Documentation - Available at `/docs` when server is running

## 🔧 Development

See the Setup Guide for development workflow details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Jabir A. H.**
- GitHub: [@Jabir-A-H](https://github.com/Jabir-A-H)

---

**Built with ❤️ for book lovers and library enthusiasts**

# Personal Library Catalog

A modern, full-stack application to manage and track your personal book collection, including lending, borrower management, and physical location tracking. Built with a React frontend and a Flask backend using a SQLite database. Easily export, import, and back up your data in multiple formats.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Usage Guide](#usage-guide)
  - [Adding & Managing Books](#adding--managing-books)
  - [Uploading Images](#uploading-images)
  - [Lending & Borrower Management](#lending--borrower-management)
  - [Exporting & Importing Data](#exporting--importing-data)
- [Development & Contribution](#development--contribution)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Features
- **Book Management**: Add, edit, delete, and view books with details like title, author, genre, year, tags, description, and images.
- **Physical Location Tracking**: Record room, shelf, and row for each book.
- **Lending & Borrower Management**: Track who borrowed which book, due dates, and lending history.
- **Search, Filter & Sort**: Powerful search and filtering by title, author, genre, tags, and more.
- **Favorites & Status**: Mark books as favorites and track their status (available, lent, missing, etc.).
- **Data Export/Import**: Export your library in JSON, CSV, TXT, Excel, PDF, or as a complete backup ZIP. Import from JSON backups.
- **Modern UI**: Responsive React interface with dark/light mode, mobile support, and in-app documentation.

---

## Tech Stack
- **Frontend**: React, Tailwind CSS, shadcn/ui, Vite
- **Backend**: Flask, Flask-SQLAlchemy, Flask-CORS
- **Database**: SQLite (file-based, no cloud dependency)
- **Export/Import**: pandas, openpyxl (Excel), reportlab (PDF), Pillow (images)

---

## Project Structure
```
. (root)
├── library-catalog/             # Frontend React Application
│   ├── src/
│   │   ├── components/          # UI components
│   │   ├── lib/                 # API service, utilities
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

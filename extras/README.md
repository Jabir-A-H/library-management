## Using the Application

### Adding Books
1. Click "Add Your First Book" or "Add Book"
2. Fill in the book details:
   - **Title** (required)
   - **Author** (required)
   - **Genre** (optional)
   - **Publication Year** (optional)
   - **Description** (optional)
   - **Tags** (optional)
   - **Cover Image** (optional)
   - **Preview Images** (optional)
	category
	read status
	physical location
		room
		shelf
		column
		row
		comment

3. Click "Add Book" to save

### Managing Books
- **View**: Click "View" to see full book details
- **Edit**: Click "Edit" to modify book information
- **Delete**: Click "Delete" to remove a book
- **Favorite**: Click the heart icon to mark as favorite

### Searching and Filtering
- **Search**: Use the search bar to find books by title, author, description, or tags
- **Filter**: Use the filter dropdown to filter by genre or tags
- **Sort**: Use the sort dropdown to order books by title, author, year, or newest/oldest

### Exporting Data
1. Look for the "Export" button in the interface
2. Choose from available formats:
   - **JSON**: Raw data format
   - **CSV**: Spreadsheet format
   - **TXT**: Plain text format
   - **Excel**: Native Excel format (if pandas is installed)
   - **PDF**: Professional document format (if reportlab is installed)
   - **Complete Backup**: ZIP file with all data


# Personal Library Catalog (Full-Stack)

This is a full-stack personal library catalog application designed to help you manage and track your book collection, including lending and physical location. It features a React frontend and a Flask backend with a SQLite database.

## Features

### Book Management
- Add, edit, and delete book entries.
- Include details.
- Upload a thumbnail cover photo and additional preview images.
- Mark books as favorites.
- Track book status (available, lent, missing).

### Physical Location Tracking
- Record the `room`, `shelf`, and `row` for each book to easily find them in your physical library.

### Lending & Borrower Management
- Add, edit, and delete borrowers (family, friends, etc.).
- Lend books to borrowers with due dates.
- Track current lendings and lending history.
- Mark books as returned or lost.
- View overdue books.

### Search, Filter & Sort
- Powerful search by title, author, genre, tags, or description.
- Filter by genre, status (available, lent, missing), or favorites.
- Sort by title, author, publication year, or creation date.

### Adding New Features
1. **New Book Fields**: Update Book model and frontend forms
2. **Additional Export Formats**: Add new routes in export.py
3. **User Management**: Extend user.py model and routes
4. **Advanced Search**: Implement full-text search in SQLite
5. **Book Categories**: Add category management system



## License

This project is free for personal and educational use. For commercial use, please contact the author for licensing information.
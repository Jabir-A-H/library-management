/**
 * ExportService - Client-side export/import utilities for local storage data.
 *
 * Supports exporting books as JSON, CSV, TXT, HTML, and complete backup, and importing from JSON backup.
 *
 * Usage:
 *   const service = new ExportService();
 *   service.exportAsJSON();
 *   service.importFromJSON(file);
 */
export class ExportService {
  private storageKey: string;

  /**
   * @constructor
   * @property {string} storageKey - The localStorage key for books
   */
  constructor() {
    this.storageKey = 'library-books';
  }

  /**
   * Get all books from localStorage.
   * @returns {Array} Array of book objects
   */
  getAllBooks(): any[] {
    try {
      const books = localStorage.getItem(this.storageKey);
      return books ? JSON.parse(books) : [];
    } catch (error) {
      console.error('Error reading books from localStorage:', error);
      return [];
    }
  }

  /**
   * Export all books as JSON file.
   */
  exportAsJSON() {
    const books = this.getAllBooks();
    const data = {
      exportDate: new Date().toISOString(),
      totalBooks: books.length,
      books: books,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    this.downloadFile(blob, `library-export-${this.getDateString()}.json`);
  }

  /**
   * Export all books as CSV file.
   */
  exportAsCSV() {
    const books = this.getAllBooks();
    if (books.length === 0) {
      window.alert('No books to export');
      return;
    }
    // CSV headers
    const headers = [
      'Title',
      'Author',
      'Genre',
      'Publication Year',
      'Description',
      'Tags',
      'Is Favorite',
      'Created At',
    ];
    // Convert books to CSV rows
    const csvRows = [
      headers.join(','),
      ...books.map((book: any) =>
        [
          this.escapeCsvValue(book.title || ''),
          this.escapeCsvValue(book.author || ''),
          this.escapeCsvValue(book.genre || ''),
          book.publication_year || '',
          this.escapeCsvValue(book.description || ''),
          this.escapeCsvValue((book.tags || []).join('; ')),
          book.isFavorite || false ? 'Yes' : 'No',
          book.created_at || '',
        ].join(',')
      ),
    ];
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    this.downloadFile(blob, `library-export-${this.getDateString()}.csv`);
  }

  /**
   * Export all books as plain text file.
   */
  exportAsText() {
    const books = this.getAllBooks();
    if (books.length === 0) {
      window.alert('No books to export');
      return;
    }
    let textContent = `ছোটপাতা পাঠাগার Export\n`;
    textContent += `Export Date: ${new Date().toLocaleString()}\n`;
    textContent += `Total Books: ${books.length}\n`;
    textContent += `${'='.repeat(50)}\n\n`;
    books.forEach((book: any, index: number) => {
      textContent += `${index + 1}. ${book.title}\n`;
      textContent += `   Author: ${book.author || 'Unknown'}\n`;
      if (book.genre) textContent += `   Genre: ${book.genre}\n`;
      if (book.publication_year)
        textContent += `   Year: ${book.publication_year}\n`;
      if (book.description)
        textContent += `   Description: ${book.description}\n`;
      if (book.tags && book.tags.length > 0)
        textContent += `   Tags: ${book.tags.join(', ')}\n`;
      if (book.isFavorite || false) textContent += `   ⭐ Favorite\n`;
      textContent += `\n`;
    });
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
    this.downloadFile(blob, `library-export-${this.getDateString()}.txt`);
  }

  /**
   * Export all books as HTML file.
   */
  exportAsHTML() {
    const books = this.getAllBooks();
    if (books.length === 0) {
      window.alert('No books to export');
      return;
    }
    let htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ছোটপাতা পাঠাগার</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
        .book { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; }
        .book-title { font-size: 1.2em; font-weight: bold; color: #333; }
        .book-author { color: #666; font-style: italic; }
        .book-meta { margin: 5px 0; color: #555; }
        .tags { background: #f0f0f0; padding: 2px 6px; border-radius: 3px; margin: 2px; display: inline-block; }
        .favorite { color: #ff6b6b; }
        .stats { background: #f9f9f9; padding: 10px; border-radius: 5px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📚 ছোটপাতা পাঠাগার</h1>
        <div class="stats">
            <strong>Export Date:</strong> ${new Date().toLocaleString()}<br>
            <strong>Total Books:</strong> ${books.length}<br>
            <strong>Favorites:</strong> ${
              books.filter((b: any) => b.isFavorite || false).length
            }
        </div>
    </div>
`;
    books.forEach((book: any) => {
      htmlContent += `
    <div class="book">
        <div class="book-title">${this.escapeHtml(book.title || 'Untitled')} ${
        book.isFavorite || false ? '<span class="favorite">⭐</span>' : ''
      }</div>
        <div class="book-author">by ${this.escapeHtml(
          book.author || 'Unknown Author'
        )}</div>
        ${
          book.genre
            ? `<div class="book-meta"><strong>Genre:</strong> ${this.escapeHtml(
                book.genre
              )}</div>`
            : ''
        }
        ${
          book.publication_year
            ? `<div class="book-meta"><strong>Year:</strong> ${book.publication_year}</div>`
            : ''
        }
        ${
          book.description
            ? `<div class="book-meta"><strong>Description:</strong> ${this.escapeHtml(
                book.description
              )}</div>`
            : ''
        }
        ${
          book.tags && book.tags.length > 0
            ? `<div class="book-meta"><strong>Tags:</strong> ${book.tags
                .map(
                  (tag: any) =>
                    `<span class="tags">${this.escapeHtml(tag)}</span>`
                )
                .join(' ')}</div>`
            : ''
        }
    </div>`;
    });
    htmlContent += `
</body>
</html>`;
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    this.downloadFile(blob, `library-export-${this.getDateString()}.html`);
  }

  /**
   * Export a complete backup (all books, metadata) as JSON file.
   */
  exportCompleteBackup() {
    const books = this.getAllBooks();
    const backupData = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      totalBooks: books.length,
      books: books,
      metadata: {
        exportType: 'complete-backup',
        application: 'ছোটপাতা পাঠাগার',
        instructions:
          'To restore this backup, use the import function in the application.',
      },
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    this.downloadFile(
      blob,
      `library-complete-backup-${this.getDateString()}.json`
    );
  }

  /**
   * Import books from a JSON backup file.
   * @param {File} file
   * @returns {Promise<number>} Resolves to number of books imported
   */
  importFromJSON(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse((e.target as FileReader)?.result as string);
          // Validate the data structure
          if (!data.books || !Array.isArray(data.books)) {
            throw new Error('Invalid backup file format');
          }
          // Store the imported books
          localStorage.setItem(this.storageKey, JSON.stringify(data.books));
          resolve(data.books.length);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  /**
   * Escape a value for CSV output.
   * @param {string} value
   * @returns {string}
   */
  escapeCsvValue(value: any): string {
    if (typeof value !== 'string') return value;
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  /**
   * Escape HTML special characters in a string.
   * @param {string} text
   * @returns {string}
   */
  escapeHtml(text: any): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Get current date as YYYY-MM-DD string.
   * @returns {string}
   */
  getDateString() {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Download a file from a Blob with the given filename.
   * @param {Blob} blob
   * @param {string} filename
   */
  downloadFile(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export default ExportService;

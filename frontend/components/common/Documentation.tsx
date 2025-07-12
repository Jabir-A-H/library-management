import { useState } from 'react';
import { 
  BookOpen, 
  Download, 
  Upload, 
  Search, 
  Filter, 
  Heart, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Moon, 
  Sun, 
  AlertTriangle, 
  Info, 
  CheckCircle,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';


interface DocumentationProps {
  isOpen: boolean;
  onClose: () => void;
}

function Documentation({ isOpen, onClose }: DocumentationProps) {
  const [activeSection, setActiveSection] = useState<string>('overview');

  if (!isOpen) return null;

  const sections = [
    { id: 'overview', title: 'Overview', icon: Info },
    { id: 'getting-started', title: 'Getting Started', icon: BookOpen },
    { id: 'features', title: 'Features', icon: CheckCircle },
    { id: 'data-storage', title: 'Data Storage', icon: AlertTriangle },
    { id: 'export-import', title: 'Export & Import', icon: Download },
    { id: 'tips', title: 'Tips & Best Practices', icon: Heart },
  ];

  // Render the content for the selected section
  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Welcome to ছোটপাতা পাঠাগার</h2>
              <p className="text-muted-foreground mb-4">
                A modern, responsive web application designed to help you organize and manage your personal book collection. 
                This application runs entirely in your browser and stores all data locally on your device.
              </p>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Important: Local Data Storage</h3>
                    <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                      All your book data is stored locally in your browser. This means your data is private and secure, 
                      but it's also tied to this specific browser and device. Make sure to export your data regularly for backup!
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Key Benefits</h3>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>No account registration required</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Complete privacy - data never leaves your device</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Works offline after initial load</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Responsive design for desktop and mobile</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Multiple export formats for data portability</span>
                </li>
              </ul>
            </div>
          </div>
        );
      case 'getting-started':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
              <p className="text-muted-foreground mb-6">
                Follow these simple steps to start building your digital library catalog.
              </p>
            </div>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                    <span>Add Your First Book</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-3">Click the "Add Book" button in the header to open the book form.</p>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <p className="text-sm"><strong>Required fields:</strong> Title and Author</p>
                    <p className="text-sm"><strong>Optional fields:</strong> Genre, Publication Year, Description, Tags, Cover Image, Preview Images</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                    <span>Upload Images</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-3">Add visual appeal to your library by uploading book covers and preview images.</p>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Cover Image:</strong> Main book cover (displayed on cards)</li>
                    <li>• <strong>Preview Images:</strong> Additional photos like spine, sample pages, or highlights</li>
                    <li>• <strong>Supported formats:</strong> JPEG, PNG, GIF, WebP</li>
                    <li>• <strong>Size limit:</strong> 5MB per image</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                    <span>Organize with Tags</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-3">Use tags to categorize your books beyond genres.</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary">Classic</Badge>
                    <Badge variant="secondary">Must-Read</Badge>
                    <Badge variant="secondary">Sci-Fi</Badge>
                    <Badge variant="secondary">Award Winner</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Tags help you find books quickly and create custom collections.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'features':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Features Overview</h2>
              <p className="text-muted-foreground mb-6">
                Explore all the features available in your personal library catalog.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Search className="h-5 w-5 text-blue-500" />
                    <span>Smart Search</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Search across titles, authors, descriptions, and tags. The search is instant and case-insensitive.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Filter className="h-5 w-5 text-green-500" />
                    <span>Advanced Filtering</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Filter by genre, tags, or favorites. Combine with search for precise results.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    <span>Favorites System</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Mark books as favorites with a simple click. View all favorites with the filter option.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="h-5 w-5 text-purple-500" />
                    <span>Detailed View</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Click "View" on any book to see full details, description, and browse preview images.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Edit className="h-5 w-5 text-orange-500" />
                    <span>Easy Editing</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Update book information, add new images, or modify tags anytime with the edit function.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Sun className="h-5 w-5 text-yellow-500" />
                    <span>Dark/Light Mode</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Toggle between light and dark themes. Your preference is saved automatically.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'data-storage':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Understanding Data Storage</h2>
              <p className="text-muted-foreground mb-6">
                Learn how your data is stored and what this means for your library catalog.
              </p>
            </div>
            <Card className="border-orange-200 dark:border-orange-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-orange-700 dark:text-orange-300">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Local Browser Storage</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Your book data is stored using your browser's local storage technology. This means:</p>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span><strong>Privacy:</strong> Your data never leaves your device or gets sent to any server</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span><strong>Speed:</strong> Instant loading and searching since everything is local</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                    <span><strong>Browser-specific:</strong> Data is tied to this specific browser and device</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                    <span><strong>Clearing data:</strong> Data will be lost if you clear browser data or use incognito mode</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Data Persistence</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">✅ Your data WILL persist when you:</h4>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• Close and reopen the browser</li>
                    <li>• Navigate away and come back to the site</li>
                    <li>• Restart your computer</li>
                    <li>• Update the browser (usually)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-700 dark:text-red-300 mb-2">❌ Your data WILL be lost when you:</h4>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• Clear browser data/cookies</li>
                    <li>• Use incognito/private browsing mode</li>
                    <li>• Use a different browser or device</li>
                    <li>• Uninstall and reinstall the browser</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200">Recommendation</h3>
                  <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                    Export your library data regularly as a backup. Use the export feature to download your data 
                    in various formats, and keep these files safe. You can always import them back if needed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'export-import':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Export & Import Guide</h2>
              <p className="text-muted-foreground mb-6">
                Learn how to backup and restore your library data using the export and import features.
              </p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="h-5 w-5 text-blue-500" />
                  <span>Export Options</span>
                </CardTitle>
                <CardDescription>
                  Click the "Export" button in the header to access these formats:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="border rounded-lg p-3">
                    <h4 className="font-semibold">JSON</h4>
                    <p className="text-sm text-muted-foreground">Raw data format, perfect for backup and import</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <h4 className="font-semibold">CSV</h4>
                    <p className="text-sm text-muted-foreground">Spreadsheet format for Excel or Google Sheets</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <h4 className="font-semibold">Text</h4>
                    <p className="text-sm text-muted-foreground">Human-readable plain text format</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <h4 className="font-semibold">HTML</h4>
                    <p className="text-sm text-muted-foreground">Web page format with styled tables</p>
                  </div>
                  <div className="border rounded-lg p-3 md:col-span-2">
                    <h4 className="font-semibold">Complete Backup</h4>
                    <p className="text-sm text-muted-foreground">Full backup with metadata, recommended for restoration</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5 text-green-500" />
                  <span>Import Process</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                    <div>
                      <p className="font-medium">Access Import</p>
                      <p className="text-sm text-muted-foreground">Click "Export" button, then select "Import" from the dropdown</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                    <div>
                      <p className="font-medium">Select File</p>
                      <p className="text-sm text-muted-foreground">Choose a JSON backup file from your device</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                    <div>
                      <p className="font-medium">Confirm Import</p>
                      <p className="text-sm text-muted-foreground">The page will refresh and show your imported books</p>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    <strong>Note:</strong> Import will add books to your existing collection. 
                    If you want to replace your entire library, export first as backup, then clear your browser data before importing.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Best Practices</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Export your data weekly or after adding several books</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Use "Complete Backup" format for full restoration capability</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Store backup files in cloud storage (Google Drive, Dropbox, etc.)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Use CSV format if you want to analyze your data in spreadsheet software</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        );
      case 'tips':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Tips & Best Practices</h2>
              <p className="text-muted-foreground mb-6">
                Make the most of your personal library catalog with these helpful tips.
              </p>
            </div>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                    <span>Organizing Your Library</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold mb-2">Consistent Data Entry</h4>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• Use consistent author name formats (e.g., "Last, First" or "First Last")</li>
                      <li>• Standardize genre names (e.g., "Science Fiction" vs "Sci-Fi")</li>
                      <li>• Include publication year when known for better sorting</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Effective Tagging</h4>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• Create tags for reading status: "To Read", "Currently Reading", "Completed"</li>
                      <li>• Use rating tags: "5 Stars", "Must Read", "Disappointing"</li>
                      <li>• Add context tags: "Book Club", "Gift", "Borrowed"</li>
                      <li>• Include format tags: "Hardcover", "Paperback", "E-book", "Audiobook"</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Search className="h-5 w-5 text-green-500" />
                    <span>Search & Discovery</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="text-sm space-y-2">
                    <li>• Use partial words in search (e.g., "Tolkien" will find "J.R.R. Tolkien")</li>
                    <li>• Search descriptions to find books by theme or topic</li>
                    <li>• Combine search with filters for precise results</li>
                    <li>• Use the favorites filter to quickly access your top books</li>
                    <li>• Sort by publication year to see your collection chronologically</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Download className="h-5 w-5 text-purple-500" />
                    <span>Data Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="text-sm space-y-2">
                    <li>• Set a reminder to export your data monthly</li>
                    <li>• Name your export files with dates (e.g., "library-backup-2024-01-15.json")</li>
                    <li>• Keep multiple backup versions in case you need to restore to an earlier state</li>
                    <li>• Test your backups occasionally by importing them in a different browser</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    <span>Making the Most of Features</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="text-sm space-y-2">
                    <li>• Add cover images to make browsing more visual and enjoyable</li>
                    <li>• Use preview images for special editions, signed copies, or damage documentation</li>
                    <li>• Write detailed descriptions to remember why you wanted to read each book</li>
                    <li>• Mark favorites liberally - it's a great way to create a "best of" collection</li>
                    <li>• Use the dark mode for comfortable evening browsing</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex">
        {/* Sidebar */}
        <div className="w-64 border-r bg-muted/30 p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-lg font-bold">Documentation</h1>
            <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close documentation" title="Close documentation">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <nav className="space-y-2">
            {sections.map((section) => {
              const IconComponent = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2 ${
                    activeSection === section.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                  aria-current={activeSection === section.id ? 'page' : undefined}
                  aria-label={section.title}
                  title={section.title}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{section.title}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default Documentation;


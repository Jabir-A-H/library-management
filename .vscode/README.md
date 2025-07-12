# Chotopata Pathagar (ছোটপাতা পাঠাগার) VS Code Configuration

This folder contains VS Code workspace configuration for the **ছোটপাতা পাঠাগার** library management system.

## Quick Start

### **One-Click Development:**
- **Ctrl+Shift+S** → Start full system (backend + frontend)
- **Ctrl+Shift+B** → Start backend only  
- **Ctrl+Shift+F** → Start frontend only
- **F5** → Debug backend with breakpoints

### **Terminal Shortcuts:**
- **Ctrl+Shift+`** → Backend terminal (auto-activates venv)
- **Ctrl+Alt+`** → Frontend terminal
- **Ctrl+`** → Default terminal

## Configuration Files

### **`settings.json`** - Workspace Settings
- **Python environment** - Auto-activates backend venv
- **Code formatting** - Black for Python, Prettier for JS/TS
- **Database connection** - Direct PostgreSQL access via SQLTools
- **File nesting** - Clean explorer view
- **Terminal profiles** - Pre-configured development environments

### **`tasks.json`** - Build & Run Tasks
- **Start Backend Server** - FastAPI server with hot-reload
- **Start Frontend Server** - Next.js development server
- **Start Full System** - Both servers simultaneously
- **Run Backend Tests** - Execute pytest with detailed output
- **Install Dependencies** - Setup all packages
- **Database Operations** - Connection testing and migrations

### **`launch.json`** - Debug Configurations
- **Debug Backend Server** - FastAPI with breakpoint support
- **Debug Backend Tests** - Step through test execution
- **Debug Database Operations** - Database operation debugging
- **Debug Current Python File** - Debug any Python file

### **`extensions.json`** - Recommended Extensions
- **Core Extensions** - Python, PostgreSQL, React development
- **AI Tools** - GitHub Copilot for code assistance
- **Quality Tools** - ESLint, Prettier, Black formatter
- **Productivity** - Thunder Client (API testing), GitLens

### **`keybindings.json`** - Custom Shortcuts
- **Development workflows** - Quick access to common tasks
- **Terminal management** - Fast environment switching
- **Debug controls** - Standard F5 debugging

## Features

### **AI-Powered Development:**
- **GitHub Copilot** - Code suggestions and completion
- **Copilot Chat** - Ask questions about your code
- **Context-aware** - Understands your library management domain

### **Database Integration:**
- **Visual database explorer** - Browse tables and data
- **Query runner** - Execute SQL directly in VS Code
- **Connection management** - Pre-configured for library_db

### **Testing & Quality:**
- **Automated testing** - One-click pytest execution
- **Code formatting** - Auto-format on save
- **Linting** - Real-time error detection
- **API testing** - Thunder Client for endpoint testing

### **Development Workflow:**
- **Hot-reload** - Changes reflected immediately
- **Debugging** - Set breakpoints in FastAPI code
- **Multi-terminal** - Backend and frontend environments
- **File organization** - Smart file nesting and associations

## Usage Examples

### **Starting Development:**
1. **Open VS Code** in project root
2. **Press Ctrl+Shift+S** (starts both servers)
3. **Visit http://localhost:8000/docs** (API documentation)
4. **Visit http://localhost:3000** (frontend application)

### **Debugging Backend:**
1. **Set breakpoints** in Python files
2. **Press F5** (starts debug session)
3. **Make API calls** to trigger breakpoints
4. **Inspect variables** and step through code

### **Testing APIs:**
1. **Open Thunder Client** (lightning icon in sidebar)
2. **Create new request** → GET http://localhost:8000/api/books
3. **Test endpoints** without leaving VS Code
4. **Save collections** for different scenarios

### **Database Queries:**
1. **Open SQLTools** (database icon in sidebar)
2. **Connect to "Chotopata Pathagar Database"**
3. **Write SQL queries** in editor
4. **Execute and view results** in formatted tables

## Project Structure Integration

```
ছোটপাতা পাঠাগার/
├── .vscode/                    # This configuration folder
│   ├── settings.json          # Workspace settings
│   ├── tasks.json             # Build/run tasks  
│   ├── launch.json            # Debug configs
│   ├── extensions.json        # Recommended extensions
│   └── keybindings.json       # Custom shortcuts
├── backend/                   # FastAPI backend
│   ├── src/                   # Application code
│   ├── venv/                  # Python virtual environment
│   └── requirements.txt       # Python dependencies
├── frontend/                  # Next.js frontend
│   ├── pages/                 # React pages
│   ├── components/            # React components
│   └── package.json           # Node.js dependencies
└── README.md                  # Project documentation
```

## Branding

- **Display Name:** ছোটপাতা পাঠাগার (Bengali - for user-facing elements)
- **Internal Name:** Chotopata Pathagar (English - for technical elements)
- **System Name:** library_db (Database and technical references)

## Customization

### **Adding New Tasks:**
Edit `tasks.json` to add custom build or test commands.

### **Changing Shortcuts:**
Modify `keybindings.json` to customize keyboard shortcuts.

### **Database Connection:**
Update database credentials in `settings.json` → `sqltools.connections`.

### **Python Environment:**
Change virtual environment path in `settings.json` → `python.defaultInterpreterPath`.

---

**This configuration provides a complete development environment for the ছোটপাতা পাঠাগার library management system, optimized for solo full-stack development with AI assistance and modern tooling.**

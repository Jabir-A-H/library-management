#!/usr/bin/env python3
"""
Server startup script for ছোটপাতা পাঠাগার Library Management System

This script provides the proper way to start the FastAPI server, handling
both development and production environments with correct module resolution.

Usage:
    python server.py                    # Start development server
    python server.py --production       # Start production server
    python server.py --host 0.0.0.0 --port 8080  # Custom host/port
"""
import sys
import os
import argparse
from pathlib import Path

def setup_python_path():
    """
    Setup Python path for proper module resolution.
    
    This ensures that relative imports work correctly by adding the
    backend directory to the Python path as a package root.
    """
    # Get the backend directory (parent of src)
    current_dir = Path(__file__).parent.absolute()
    backend_dir = current_dir.parent
    src_dir = current_dir
    
    # Add directories to Python path
    for path in [str(backend_dir), str(src_dir)]:
        if path not in sys.path:
            sys.path.insert(0, path)
    
    # Set the PYTHONPATH environment variable as well
    python_path = os.environ.get('PYTHONPATH', '')
    additional_paths = [str(backend_dir), str(src_dir)]
    
    if python_path:
        # Add our paths to existing PYTHONPATH
        paths = python_path.split(os.pathsep)
        for path in additional_paths:
            if path not in paths:
                paths.insert(0, path)
        os.environ['PYTHONPATH'] = os.pathsep.join(paths)
    else:
        # Set PYTHONPATH with our paths
        os.environ['PYTHONPATH'] = os.pathsep.join(additional_paths)
    
    print(f"✅ Python path configured:")
    print(f"   Backend directory: {backend_dir}")
    print(f"   Source directory: {src_dir}")
    print(f"   PYTHONPATH: {os.environ.get('PYTHONPATH', 'Not set')}")

def main():
    """Main entry point for the server."""
    parser = argparse.ArgumentParser(
        description="ছোটপাতা পাঠাগার Library Management API Server"
    )
    parser.add_argument(
        "--host", 
        default=os.getenv("API_HOST", "127.0.0.1"),
        help="Host to bind the server to (default: 127.0.0.1)"
    )
    parser.add_argument(
        "--port", 
        type=int,
        default=int(os.getenv("API_PORT", 8000)),
        help="Port to bind the server to (default: 8000)"
    )
    parser.add_argument(
        "--production", 
        action="store_true",
        help="Run in production mode (no auto-reload, less logging)"
    )
    parser.add_argument(
        "--workers",
        type=int,
        default=1,
        help="Number of worker processes (production only)"
    )
    
    args = parser.parse_args()
    
    # Setup Python path before importing anything
    setup_python_path()
    
    # Now we can safely import our application
    try:
        from main_fastapi import app
        print("✅ Application imported successfully")
    except ImportError as e:
        print(f"❌ Failed to import application: {e}")
        sys.exit(1)
    
    # Import uvicorn for serving
    try:
        import uvicorn
    except ImportError:
        print("❌ uvicorn not found. Please install it: pip install uvicorn")
        sys.exit(1)
    
    # Configure server settings
    if args.production:
        print("🚀 Starting production server...")
        log_level = "warning"
        reload = False
        access_log = False
    else:
        print("🛠️ Starting development server...")
        log_level = "info"
        reload = True
        access_log = True
    
    print(f"🔧 Server configuration:")
    print(f"   Host: {args.host}")
    print(f"   Port: {args.port}")
    print(f"   Production mode: {args.production}")
    print(f"   Log level: {log_level}")
    print(f"   Auto-reload: {reload}")
    
    # Start the server
    try:
        uvicorn.run(
            "main_fastapi:app",
            host=args.host,
            port=args.port,
            log_level=log_level,
            reload=reload,
            access_log=access_log,
            use_colors=True,
            loop="auto",
            workers=args.workers if args.production else 1
        )
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"❌ Server error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

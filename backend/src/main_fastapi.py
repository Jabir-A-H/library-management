"""
Main FastAPI application for ছোটপাতা পাঠাগার (Chotopata Pathagar) Library Management System

This module sets up the FastAPI application with:
- CORS middleware for frontend integration
- Route configuration for all API endpoints
- Exception handlers for proper error responses
- Database connection management
- Health check endpoints
- Comprehensive logging setup

The application follows RESTful API design principles and includes proper
error handling, validation, and documentation for all endpoints.
"""
from contextlib import asynccontextmanager
from typing import Dict, Any
from fastapi import FastAPI, Request, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import logging
import os
import sys
import time
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def setup_imports():
    """
    Setup proper import paths for the application.
    
    This function ensures that imports work correctly whether the app is
    run directly or imported as a module.
    """
    current_dir = os.path.dirname(os.path.abspath(__file__))
    parent_dir = os.path.dirname(current_dir)
    
    # Add paths to sys.path if not already present
    for path in [current_dir, parent_dir]:
        if path not in sys.path:
            sys.path.insert(0, path)


# Setup imports before any other imports
setup_imports()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for FastAPI application.
    
    Handles application startup and shutdown processes:
    - Database initialization
    - Connection pool setup
    - Graceful shutdown of resources
    """
    # Startup
    logger.info("🚀 Starting ছোটপাতা পাঠাগার API Server...")
    
    try:
        # Initialize database
        try:
            from .database_async import init_db
        except ImportError:
            try:
                from database_async import init_db
            except ImportError:
                # Try importing from src.database_async for package mode
                import sys
                import os
                sys.path.insert(0, os.path.dirname(__file__))
                from database_async import init_db
        await init_db()
        logger.info("✅ Database initialized successfully")
    except Exception as e:
        logger.error(f"❌ Failed to initialize database: {e}")
        raise
    
    logger.info("🎉 API Server started successfully")
    
    yield
    
    # Shutdown
    logger.info("⏳ Shutting down ছোটপাতা পাঠাগার API Server...")
    
    try:
        from .database_async import close_db
    except ImportError:
        from database_async import close_db
    try:
        await close_db()
        logger.info("✅ Database connections closed successfully")
    except Exception as e:
        logger.error(f"❌ Error closing database connections: {e}")
    
    logger.info("👋 API Server shutdown complete")


def create_app() -> FastAPI:
    """
    Create and configure the FastAPI application.
    
    Returns:
        FastAPI: Configured FastAPI application instance
    """
    
    # Create FastAPI app instance
    app = FastAPI(
        title="ছোটপাতা পাঠাগার API",
        description="""
        A comprehensive library management system with multilingual support.
        
        ## Features
        
            * **Books Management** - Full CRUD operations for books with multilingual 
              support
            * **Borrowers Management** - Manage library members and their 
              information
            * **Lending System** - Track book lending and returns with due dates
            * **User Favorites** - Allow users to favorite and organize their 
              preferred books
            * **Export Functions** - Export data in various formats (CSV, PDF, etc.)
            * **Authentication** - Secure user authentication and authorization
        
        ## API Documentation
        
        This API follows RESTful design principles and provides comprehensive
        documentation for all endpoints. Use the interactive documentation
        below to explore and test the API.
        """,
        version="2.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
        contact={
            "name": "ছোটপাতা পাঠাগার",
            "url": "https://github.com/Jabir-A-H/library-management",
        },
        license_info={
            "name": "MIT License",
            "url": "https://opensource.org/licenses/MIT",
        },
    )
    
    # Configure middleware
    setup_middleware(app)
    
    # Setup routes
    setup_routes(app)
    
    # Setup exception handlers
    setup_exception_handlers(app)
    
    return app


def setup_middleware(app: FastAPI) -> None:
    """
    Configure middleware for the FastAPI application.
    
    Args:
        app: FastAPI application instance
    """
    
    # Trusted host middleware (security)
    trusted_hosts_env = os.getenv("TRUSTED_HOSTS", "localhost,127.0.0.1")
    trusted_hosts = trusted_hosts_env.split(",")
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=trusted_hosts)
    
    # CORS middleware for frontend integration
    origins_env = os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000"
    )
    allowed_origins = origins_env.split(",")
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allow_headers=["*"],
        expose_headers=["*"],
    )
    
    # Request logging middleware
    @app.middleware("http")
    async def log_requests(request: Request, call_next):
        """Log all HTTP requests for debugging and monitoring"""
        start_time = time.time()
        
        # Log request
        logger.info(f"📥 {request.method} {request.url}")
        
        # Process request
        response = await call_next(request)
        
        # Calculate processing time
        process_time = time.time() - start_time
        
        # Log response
        status_code = response.status_code
        time_str = f"{process_time:.3f}s"
        log_msg = f"📤 {request.method} {request.url} - {status_code} ({time_str})"
        logger.info(log_msg)
        
        # Add processing time header
        response.headers["X-Process-Time"] = str(process_time)
        
        return response


def setup_routes(app: FastAPI) -> None:
    """
    Setup all API routes for the application.
    
    Args:
            log_msg = (
                f"📤 {request.method} {request.url} - {status_code} "
                f"({time_str})"
            )
    """
    
    # Health check endpoints
    @app.get("/", tags=["Health"], summary="Root endpoint")
    async def root() -> Dict[str, Any]:
        """
        Root endpoint providing basic API information.
        
        Returns:
            Dict containing API status and basic information
        """
        return {
            "message": "ছোটপাতা পাঠাগার API",
            "message_en": "Chotopata Pathagar API",
            "status": "running",
            "version": "2.0.0",
            "docs": "/docs",
            "redoc": "/redoc"
        }
    
    @app.get("/health", tags=["Health"], summary="Health check endpoint")
    async def health_check() -> Dict[str, Any]:
        """
        Comprehensive health check endpoint.
        
        Returns:
            Dict containing detailed health status information
        """
        try:
            # Test database connection
            try:
                from .database_async import get_db
            except ImportError:
                from database_async import get_db
            from sqlalchemy import text
            async for db in get_db():
                await db.execute(text("SELECT 1"))
                db_status = "connected"
                break
        except Exception as e:
            logger.error(f"Database health check failed: {e}")
            db_status = "disconnected"
        
        return {
            "status": "healthy" if db_status == "connected" else "unhealthy",
            "service": "library-catalog-api",
            "version": "2.0.0",
            "database": db_status,
            "timestamp": time.time()
        }
    
    # Import and register API routers
    # Note: This simplified approach handles both package and direct execution modes
    import sys
    import os
    
    # Add current directory to Python path for imports
    current_dir = os.path.dirname(__file__)
    parent_dir = os.path.dirname(current_dir)
    
    for path in [current_dir, parent_dir]:
        if path not in sys.path:
            sys.path.insert(0, path)
    
    # Routes configuration with error handling
    routes_info = [
        {"module": "book_async", "prefix": "/api/books", "tags": ["Books"]},
        {"module": "borrower_async", "prefix": "/api/borrowers", "tags": ["Borrowers"]},
        {"module": "auth_async", "prefix": "/api/auth", "tags": ["Authentication"]},
        {"module": "lending_async", "prefix": "/api/lending", "tags": ["Lending"]},
        {"module": "user_async", "prefix": "/api/users", "tags": ["Users"]},
        {"module": "export", "prefix": "/api/export", "tags": ["Export"]},
        {"module": "user_favorite_async", "prefix": "/api/favorites", "tags": ["User Favorites"]},
    ]
    
    for route_info in routes_info:
        module_name = route_info["module"]
        router = None
        # Strategy 1: Try relative import (when run as package)
        try:
            module = __import__(f"routes.{module_name}", fromlist=["router"])
            router = getattr(module, "router", None)
            if router:
                logger.debug(f"✅ Imported {module_name} using relative import")
        except (ImportError, ModuleNotFoundError):
            pass
        # Strategy 2: Try absolute import from routes directory
        if not router:
            try:
                import importlib.util
                routes_dir = os.path.join(current_dir, "routes")
                module_path = os.path.join(routes_dir, f"{module_name}.py")
                if os.path.exists(module_path):
                    spec = importlib.util.spec_from_file_location(
                        f"routes_{module_name}", 
                        module_path
                    )
                    if spec and spec.loader:
                        module = importlib.util.module_from_spec(spec)
                        sys.modules[f"routes_{module_name}"] = module
                        spec.loader.exec_module(module)
                        router = getattr(module, "router", None)
                        if router:
                            logger.debug(f"✅ Imported {module_name} using file import")
            except Exception as e:
                logger.debug(f"File import failed for {module_name}: {e}")
        # Register the router if successfully imported
        if router:
            app.include_router(
                router,
                prefix=route_info["prefix"],
                tags=route_info["tags"]
            )
            logger.info(f"✅ {route_info['tags'][0]} routes registered successfully")
        else:
            logger.warning(f"⚠️ Failed to import {module_name} router - feature unavailable")
    
    logger.info("🎯 Route setup completed")



def setup_exception_handlers(app: FastAPI) -> None:
    """
    Setup custom exception handlers for the application.
    
    Args:
        app: FastAPI application instance
    """
    
    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
        """
        Handle HTTP exceptions with detailed error information.
        
        Args:
            request: The HTTP request that caused the exception
            exc: The HTTP exception that was raised
            
        Returns:
            JSONResponse with error details
        """
        logger.warning(f"HTTP Exception: {exc.status_code} - {exc.detail} - {request.url}")
        
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": True,
                "status_code": exc.status_code,
                "detail": exc.detail,
                "path": str(request.url),
                "method": request.method,
                "timestamp": time.time()
            }
        )
    
    @app.exception_handler(404)
    async def not_found_handler(request: Request, exc: HTTPException) -> JSONResponse:
        """
        Handle 404 Not Found errors with helpful information.
        
        Args:
            request: The HTTP request that caused the exception
            exc: The HTTP exception that was raised
            
        Returns:
            JSONResponse with 404 error details
        """
        logger.info(f"404 Not Found: {request.url}")
        
        return JSONResponse(
            status_code=404,
            content={
                "error": True,
                "status_code": 404,
                "detail": "The requested resource was not found",
                "path": str(request.url),
                "method": request.method,
                "timestamp": time.time(),
                "suggestion": "Check the API documentation at /docs for available endpoints"
            }
        )
    
    @app.exception_handler(500)
    async def internal_error_handler(request: Request, exc: Exception) -> JSONResponse:
        """
        Handle internal server errors with logging and safe error responses.
        
        Args:
            request: The HTTP request that caused the exception
            exc: The exception that was raised
            
        Returns:
            JSONResponse with 500 error details
        """
        logger.error(f"Internal Server Error: {exc} - {request.url}", exc_info=True)
        
        # In production, don't expose internal error details
        is_production = os.getenv("ENVIRONMENT", "development").lower() == "production"
        
        error_detail = "Internal server error occurred" if is_production else str(exc)
        
        return JSONResponse(
            status_code=500,
            content={
                "error": True,
                "status_code": 500,
                "detail": error_detail,
                "path": str(request.url),
                "method": request.method,
                "timestamp": time.time()
            }
        )
    
    @app.exception_handler(Exception)
    async def validation_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        """
        Handle Pydantic validation errors with detailed field information.
        
        Args:
            request: The HTTP request that caused the exception
            exc: The validation exception that was raised
            
        Returns:
            JSONResponse with validation error details
        """
        # Check if it's a Pydantic ValidationError
        try:
            from pydantic import ValidationError
            if isinstance(exc, ValidationError):
                logger.warning(f"Validation Error: {exc} - {request.url}")
                
                return JSONResponse(
                    status_code=422,
                    content={
                        "error": True,
                        "status_code": 422,
                        "detail": "Validation error",
                        "validation_errors": exc.errors(),
                        "path": str(request.url),
                        "method": request.method,
                        "timestamp": time.time()
                    }
                )
        except ImportError:
            pass
        
        # For other exceptions, use the internal error handler
        return await internal_error_handler(request, exc)


# Create the application instance
app = create_app()


if __name__ == "__main__":
    """
    Development server entry point.
    
    This section is only executed when running the script directly,
    not when importing as a module (e.g., with Gunicorn or Uvicorn).
    """
    import uvicorn
    
    # Get configuration from environment variables
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", 8000))
    debug = os.getenv("DEBUG", "False").lower() == "true"
    environment = os.getenv("ENVIRONMENT", "development")
    
    # Log server configuration
    logger.info(f"🔧 Server Configuration:")
    logger.info(f"   Host: {host}")
    logger.info(f"   Port: {port}")
    logger.info(f"   Debug: {debug}")
    logger.info(f"   Environment: {environment}")
    
    # Run the development server
    uvicorn.run(
        "main_fastapi:app",
        host=host,
        port=port,
        reload=debug,
        log_level="info" if debug else "warning",
        access_log=debug,
        use_colors=True,
        loop="auto"
    )
